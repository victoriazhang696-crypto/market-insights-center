import { requireAdmin } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'
import ArticleEditor from './ArticleEditor'

export default async function NewArticlePage() {
  await requireAdmin()
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            发布新文章
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            创建并发布市场洞察文章
          </p>
        </div>

        <ArticleEditor />
      </div>
    </AdminLayout>
  )
}
