import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import MemberLayout from '@/components/member/MemberLayout'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth()
  const { id } = await params
  
  const supabase = await createClient()
  
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .not('published_at', 'is', null)
    .single()

  if (error || !article) {
    notFound()
  }

  // Log the view
  await supabase
    .from('article_views')
    .insert({
      user_id: user.id,
      article_id: article.id,
      device: 'web',
    })

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/insights/history"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft size={18} />
          返回历史洞察
        </Link>

        {/* Article */}
        <article className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Cover Image */}
          {article.cover_image && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              {article.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(article.published_at).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
              {article.reading_time && (
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {article.reading_time} 分钟阅读
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {article.summary && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {article.summary}
                </p>
              </div>
            )}

            <div 
              className="article-content prose prose-slate dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {/* Risk Warning */}
        <div className="mt-8 risk-warning">
          <h3 className="risk-warning-title">⚠️ 风险提示</h3>
          <p className="risk-warning-content">
            本报告仅供参考，不构成投资建议。市场有风险，投资需谨慎。过往业绩不代表未来表现。
            投资者应根据自身情况独立判断，并承担相应风险。
          </p>
        </div>
      </div>
    </MemberLayout>
  )
}
