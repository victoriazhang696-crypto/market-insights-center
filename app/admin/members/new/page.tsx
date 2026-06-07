import { requireAdmin } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'
import NewMemberForm from './NewMemberForm'

export default async function NewMemberPage() {
  await requireAdmin()
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            添加会员
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            创建新的会员账号
          </p>
        </div>

        <NewMemberForm />
      </div>
    </AdminLayout>
  )
}
