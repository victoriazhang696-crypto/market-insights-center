import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import DeleteArticleButton from './DeleteArticleButton'

export default async function ArticlesManagePage() {
  await requireAdmin()
  
  const supabase = await createClient()
  
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              文章管理
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              创建、编辑和发布市场洞察文章
            </p>
          </div>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus size={18} />
            发布文章
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    标题
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    状态
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    发布时间
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {articles && articles.length > 0 ? (
                  articles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {article.cover_image && (
                            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={article.cover_image} 
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {article.title}
                            </div>
                            {article.summary && (
                              <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">
                                {article.summary}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {article.published_at ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                            <Eye size={12} />
                            已发布
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs font-medium">
                            草稿
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                        {article.published_at 
                          ? new Date(article.published_at).toLocaleDateString('zh-CN')
                          : '-'
                        }
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
                            title="编辑"
                          >
                            <Edit size={18} />
                          </Link>
                          <DeleteArticleButton articleId={article.id} articleTitle={article.title} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      暂无文章，点击右上角按钮发布第一篇文章
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
