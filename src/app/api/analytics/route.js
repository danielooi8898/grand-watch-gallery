import { BetaAnalyticsDataClient } from '@google-analytics/data'

const GA_PROPERTY_ID = '14308288240'

export async function GET() {
  try {
    const credentials = process.env.GA_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.GA_SERVICE_ACCOUNT_KEY)
      : null

    if (!credentials) {
      return Response.json({ error: 'GA_SERVICE_ACCOUNT_KEY not set', data: getMockData() })
    }

    // Validate credentials have required fields
    if (!credentials.client_email || !credentials.private_key) {
      return Response.json({ error: 'Invalid credentials format', data: getMockData() })
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({ credentials })

    const today = new Date().toISOString().split('T')[0]
    const sevenDaysAgo = new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0]

    // Run multiple reports in parallel
    const [
      realtimeRes,
      overviewRes,
      pagesRes,
      sourcesRes,
      dailyRes,
    ] = await Promise.all([
      // Realtime active users
      analyticsDataClient.runRealtimeReport({
        property: `properties/${GA_PROPERTY_ID}`,
        metrics: [{ name: 'activeUsers' }],
      }),
      // 7-day overview
      analyticsDataClient.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate: sevenDaysAgo, endDate: today }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'newUsers' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
      }),
      // Top pages
      analyticsDataClient.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate: sevenDaysAgo, endDate: today }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 8,
      }),
      // Traffic sources
      analyticsDataClient.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate: sevenDaysAgo, endDate: today }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 6,
      }),
      // Daily page views for sparkline
      analyticsDataClient.runReport({
        property: `properties/${GA_PROPERTY_ID}`,
        dateRanges: [{ startDate: sevenDaysAgo, endDate: today }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
    ])

    // Parse realtime
    const activeUsers = realtimeRes[0]?.rows?.[0]?.metricValues?.[0]?.value ?? '0'

    // Parse overview
    const ov = overviewRes[0]?.rows?.[0]?.metricValues
    const pageViews = ov?.[0]?.value ? Number(ov[0].value).toLocaleString() : '0'
    const sessions  = ov?.[1]?.value ? Number(ov[1].value).toLocaleString() : '0'
    const newUsers  = ov?.[2]?.value ? Number(ov[2].value).toLocaleString() : '0'
    const bounceRate = ov?.[3]?.value ? `${(parseFloat(ov[3].value)*100).toFixed(1)}%` : '0%'
    const avgSec    = ov?.[4]?.value ? parseFloat(ov[4].value) : 0
    const avgSessionDuration = `${Math.floor(avgSec/60)}m ${Math.round(avgSec%60)}s`

    // Parse top pages
    const topPages = (pagesRes[0]?.rows || []).map(r => ({
      page: r.dimensionValues?.[0]?.value || '/',
      views: Number(r.metricValues?.[0]?.value || 0).toLocaleString(),
      avgTime: (() => { const s = parseFloat(r.metricValues?.[1]?.value || 0); return `${Math.floor(s/60)}m ${Math.round(s%60)}s` })(),
    }))

    // Parse traffic sources
    const totalSessions = (sourcesRes[0]?.rows || []).reduce((a, r) => a + Number(r.metricValues?.[0]?.value || 0), 0)
    const trafficSources = (sourcesRes[0]?.rows || []).map(r => ({
      source: r.dimensionValues?.[0]?.value || 'Unknown',
      sessions: Number(r.metricValues?.[0]?.value || 0).toLocaleString(),
      pct: totalSessions ? Math.round(Number(r.metricValues?.[0]?.value || 0)/totalSessions*100) : 0,
    }))

    // Parse daily sparklines
    const dailyRows = dailyRes[0]?.rows || []
    const pageViewsChart = dailyRows.map(r => ({ label: r.dimensionValues?.[0]?.value, value: Number(r.metricValues?.[0]?.value || 0) }))
    const sessionsChart  = dailyRows.map(r => ({ label: r.dimensionValues?.[0]?.value, value: Number(r.metricValues?.[1]?.value || 0) }))

    return Response.json({
      data: { activeUsers, pageViews, sessions, newUsers, bounceRate, avgSessionDuration, topPages, trafficSources, pageViewsChart, sessionsChart }
    })

  } catch (err) {
    console.error('GA4 API error:', err)
    return Response.json({ data: getMockData(), error: err.message, stack: err.stack?.split('\n')[0] })
  }
}

function getMockData() {
  return {
    activeUsers: '—',
    pageViews: '—',
    sessions: '—',
    newUsers: '—',
    bounceRate: '—',
    avgSessionDuration: '—',
    topPages: [],
    trafficSources: [],
    pageViewsChart: [],
    sessionsChart: [],
    _note: 'Configure GA_SERVICE_ACCOUNT_KEY env variable to see real data',
  }
}
