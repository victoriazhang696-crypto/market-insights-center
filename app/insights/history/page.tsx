import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import MemberLayout from '@/components/member/MemberLayout'
import Link from 'next/link'
import { Clock, Search } from 'lucide-react'
import HistoryClient from './HistoryClient'

export default async function HistoryInsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; search?: string }>
}) {
  await requireAuth()
  
  const supabase = await createClient()
  const params = await searchParams
  
  let query = supabase
    .from('articles')
    .select('*')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  // Filter by month if provided
  if (params.month) {
    const [year, month] = params.month.split('-').map(Number)
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)
    
    query = query
      .gte('published_at', startDate.toISOString())
      .lte('published_at', endDate.toISOString())
  }

  // Search filter
  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,content.ilike.%${params.search}%`)
  }

  const { data: articles } = await query

  // Get all available months
  const { data: allArticles } = await supabase
    .from('articles')
    .select('published_at')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  const months = Array.from(new Set(
    allArticles?.map(a => {
      const date = new Date(a.published_at!)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }) || []
  )).slice(0, 12) // Last 12 months

  return (
    <MemberLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            历史洞察
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            浏览过往的市场分析报告
          </p>
        </div>

        <HistoryClient months={months} currentMonth={params.month} currentSearch={params.search} />

        {!articles || articles.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              未找到相关文章
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              请尝试其他搜索条件
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
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {article.published_at && new Date(article.published_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                  </div>
                  {article.cover_image && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden hidden sm:block">
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
