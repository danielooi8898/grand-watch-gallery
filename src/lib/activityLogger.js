import { supabase } from './supabase'

/**
 * Log an activity to the database
 * @param {string} action - Type of action (login, create, update, delete, view, etc)
 * @param {string} category - Category of action (auth, collection, blog, enquiries, leads, settings, etc)
 * @param {string} userEmail - Email of the user performing the action
 * @param {object} changes - Object describing what was changed (optional)
 * @param {string} targetId - ID of the item being acted upon (optional)
 * @param {string} targetName - Name/title of the item being acted upon (optional)
 */
export async function logActivity({
  action,
  category,
  userEmail,
  changes = null,
  targetId = null,
  targetName = null,
  details = null
}) {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        action,
        category,
        user_email: userEmail,
        changes: changes ? JSON.stringify(changes) : null,
        target_id: targetId,
        target_name: targetName,
        details: details ? JSON.stringify(details) : null,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Activity logging error:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to log activity:', err)
    return false
  }
}

/**
 * Get activity logs with optional filtering
 * @param {object} options - Filter options
 * @param {string} options.userEmail - Filter by user email
 * @param {string} options.category - Filter by category
 * @param {string} options.action - Filter by action type
 * @param {number} options.limit - Number of records to return (default: 100)
 * @param {number} options.offset - Pagination offset (default: 0)
 */
export async function getActivityLogs({
  userEmail = null,
  category = null,
  action = null,
  limit = 100,
  offset = 0
} = {}) {
  try {
    let query = supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (userEmail) {
      query = query.eq('user_email', userEmail)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (action) {
      query = query.eq('action', action)
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching activity logs:', error)
      return { data: [], count: 0, error }
    }

    return { data, count, error: null }
  } catch (err) {
    console.error('Failed to fetch activity logs:', err)
    return { data: [], count: 0, error: err }
  }
}

/**
 * Get activity summary for dashboard
 */
export async function getActivitySummary() {
  try {
    // Get total activities today
    const today = new Date().toISOString().split('T')[0]
    const { count: todayCount } = await supabase
      .from('activity_logs')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00Z`)

    // Get unique users today
    const { data: todayLogs } = await supabase
      .from('activity_logs')
      .select('user_email')
      .gte('created_at', `${today}T00:00:00Z`)

    const uniqueUsers = new Set(todayLogs?.map(log => log.user_email) || [])

    // Get recent activities (last 10)
    const { data: recentLogs } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    return {
      todayCount: todayCount || 0,
      uniqueUsersCount: uniqueUsers.size,
      recentActivities: recentLogs || []
    }
  } catch (err) {
    console.error('Failed to get activity summary:', err)
    return { todayCount: 0, uniqueUsersCount: 0, recentActivities: [] }
  }
}

/**
 * Delete old activity logs (older than X days)
 * Useful for maintenance/cleanup
 */
export async function cleanupOldActivities(daysOld = 90) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const { error } = await supabase
      .from('activity_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString())

    if (error) {
      console.error('Error cleaning up old activities:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to cleanup old activities:', err)
    return false
  }
}
