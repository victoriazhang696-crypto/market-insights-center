import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import MemberLayout from '@/components/member/MemberLayout'
import Link from 'next/link'
import { Clock, Eye } from 'lucide-react'

export default async function TodayInsightsPage() {
  await requireAuth()
  
  const supabase = await createClient()
  
  // Get today's articles
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .gte('published_at', today.toISOString())
    .order('published_at', { ascending: false })

  return (
    <MemberLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            今日市场洞察
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>

        {!articles || articles.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400 mb-4">
              <Clock size={48} className="mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              今日暂无更新
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              请稍后再来查看，或浏览历史洞察
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/insights/${article.id}`}
                className="block bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                        {article.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      {article.published_at && (
                        <span>
                          {new Date(article.published_at).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                      {article.reading_time && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {article.reading_time} 分钟
                        </span>
                      )}
                    </div>
                  </div>
                  {article.cover_image && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img 
                        src={article.cover_image} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MemberLayout>
  )
}
