import { useCallback } from 'react'
import { logActivity } from '@/lib/activityLogger'
import { useAuth } from '@/context/AuthContext'

/**
 * Hook to easily log activities from components
 * Usage:
 *   const { logAction } = useActivityLog()
 *   logAction({ action: 'update', category: 'collection', targetId: '123', targetName: 'Watch Name' })
 */
export function useActivityLog() {
  const { user } = useAuth()

  const logAction = useCallback(async ({
    action,
    category,
    targetId = null,
    targetName = null,
    changes = null,
    details = null
  }) => {
    if (!user?.email) {
      console.warn('User not authenticated, activity not logged')
      return false
    }

    return await logActivity({
      action,
      category,
      userEmail: user.email,
      targetId,
      targetName,
      changes,
      details
    })
  }, [user])

  return { logAction }
}
