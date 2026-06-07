import { requireAuth, getDaysUntilExpiry } from '@/lib/auth'
import Link from 'next/link'
import { FileText, Clock, Bell, TrendingUp, Calendar } from 'lucide-react'
import MemberLayout from '@/components/member/MemberLayout'

export default async function HomePage() {
  const user = await requireAuth()
  const daysLeft = getDaysUntilExpiry(user.expire_date)

  return (
    <MemberLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            欢迎回来，{user.full_name || user.username}
          </h1>
          <p className="text-blue-100">
            您的会员有效期至 {new Date(user.expire_date).toLocaleDateString('zh-CN')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 dark:text-slate-400 text-sm">剩余天数</span>
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {daysLeft}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">天</div>
          </div>
        </div>

        {/* Main Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Insights */}
          <Link
            href="/insights/today"
            className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <TrendingUp className="text-slate-300 dark:text-slate-600 group-hover:text-blue-400 transition" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              今日市场洞察
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              查看最新的市场分析与投资机会
            </p>
          </Link>

          {/* History Insights */}
          <Link
            href="/insights/history"
            className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Clock className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              历史洞察
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              浏览过往的市场分析报告
            </p>
          </Link>
        </div>

        {/* Expiry Warning */}
        {daysLeft <= 7 && daysLeft > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Bell className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  会员即将到期
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  您的会员将在 {daysLeft} 天后到期，请联系顾问续期以继续享受服务。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  )
}
