import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import AdminLayout from '@/components/admin/AdminLayout'
import { Eye, Users, TrendingUp, Calendar } from 'lucide-react'
import StatsClient from './StatsClient'

export default async function StatsPage() {
  await requireAdmin()
  
  const supabase = await createClient()
  
  // Get various stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  const monthAgo = new Date(today)
  monthAgo.setMonth(monthAgo.getMonth() - 1)

  // Today's stats
  const { count: todayViews } = await supabase
    .from('article_views')
    .select('*', { count: 'exact', head: true })
    .gte('view_time', today.toISOString())

  const { count: todayLogins } = await supabase
    .from('login_logs')
    .select('*', { count: 'exact', head: true })
    .gte('login_time', today.toISOString())

  // Week stats
  const { count: weekViews } = await supabase
    .from('article_views')
    .select('*', { count: 'exact', head: true })
    .gte('view_time', weekAgo.toISOString())

  // Month stats
  const { count: monthViews } = await supabase
    .from('article_views')
    .select('*', { count: 'exact', head: true })
    .gte('view_time', monthAgo.toISOString())

  // Popular articles
  const { data: popularArticles } = await supabase
    .from('article_views')
    .select('article_id, articles(title)')
    .order('created_at', { ascending: false })
    .limit(100)

  // Process popular articles
  const articleViewCounts: Record<string, { title: string; count: number }> = {}
  popularArticles?.forEach((view) => {
    if (view.article_id && view.articles) {
      if (!articleViewCounts[view.article_id]) {
        articleViewCounts[view.article_id] = {
          title: (view.articles as any).title,
          count: 0,
        }
      }
      articleViewCounts[view.article_id].count++
    }
  })

  const topArticles = Object.entries(articleViewCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  // Recent logins
  const { data: recentLogins } = await supabase
    .from('login_logs')
    .select(`
      login_time,
      users ( full_name, email )
    `)
    .order('login_time', { ascending: false })
    .limit(10)

  const stats = [
    {
      label: '今日阅读',
      value: todayViews || 0,
      icon: Eye,
      color: 'text-blue-600',
    },
    {
      label: '今日登录',
      value: todayLogins || 0,
      icon: Users,
      color: 'text-green-600',
    },
    {
      label: '本周阅读',
      value: weekViews || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      label: '本月阅读',
      value: monthViews || 0,
      icon: Calendar,
      color: 'text-amber-600',
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            数据统计
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            查看平台使用数据和阅读统计
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={24} className={stat.color} />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Articles */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} />
                热门文章
              </h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {topArticles.length > 0 ? (
                topArticles.map(([id, data], index) => (
                  <div key={id} className="p-4 flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-400">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {data.title}
                      </h3>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {data.count} 次阅读
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  暂无阅读数据
                </div>
              )}
            </div>
          </div>

          {/* Recent Logins */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={20} />
                最近登录
              </h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentLogins && recentLogins.length > 0 ? (
                recentLogins.map((log, index) => (
                  <div key={index} className="p-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                      {log.users?.full_name || log.users?.email}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {log.login_time && new Date(log.login_time).toLocaleString('zh-CN')}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  暂无登录记录
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
