import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import AdminLayout from '@/components/admin/AdminLayout'
import { Users, FileText, Eye, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
  await requireAdmin()
  
  const supabase = await createClient()
  
  // Get stats
  const { count: totalMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'member')

  const { count: activeMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'member')
    .eq('status', 'active')

  const { count: totalArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .not('published_at', 'is', null)

  const { count: todayViews } = await supabase
    .from('article_views')
    .select('*', { count: 'exact', head: true })
    .gte('view_time', new Date().toISOString().split('T')[0])

  // Get recent login logs
  const { data: recentLogins } = await supabase
    .from('login_logs')
    .select(`
      login_time,
      users ( full_name, email )
    `)
    .order('login_time', { ascending: false })
    .limit(5)

  // Get recent articles
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('id, title, published_at')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      label: '总会员数',
      value: totalMembers || 0,
      icon: Users,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: '活跃会员',
      value: activeMembers || 0,
      icon: Users,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    },
    {
      label: '已发布文章',
      value: totalArticles || 0,
      icon: FileText,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    },
    {
      label: '今日阅读',
      value: todayViews || 0,
      icon: Eye,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            仪表盘
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            系统概览与数据统计
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
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
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
          {/* Recent Articles */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText size={20} />
                最近文章
              </h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentArticles && recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <div key={article.id} className="p-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {article.published_at && new Date(article.published_at).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  暂无文章
                </div>
              )}
            </div>
          </div>

          {/* Recent Logins */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} />
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
