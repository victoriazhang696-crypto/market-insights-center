import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { Plus, Edit, Trash2, MoreVertical, UserCheck, UserX, RefreshCw } from 'lucide-react'
import MemberActions from './MemberActions'

export default async function MembersManagePage() {
  await requireAdmin()
  
  const supabase = await createClient()
  
  const { data: members } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'member')
    .order('created_at', { ascending: false })

  const activeCount = members?.filter(m => m.status === 'active').length || 0
  const expiredCount = members?.filter(m => m.status === 'expired' || new Date(m.expire_date) < new Date()).length || 0

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              会员管理
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              管理会员账号、权限和有效期
            </p>
          </div>
          <Link
            href="/admin/members/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus size={18} />
            添加会员
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {members?.length || 0}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">总会员数</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">活跃会员</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-amber-600">{expiredCount}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">已到期</div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    会员信息
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    联系方式
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    状态
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    到期时间
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {members && members.length > 0 ? (
                  members.map((member) => {
                    const isExpired = new Date(member.expire_date) < new Date()
                    
                    return (
                      <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {member.full_name || member.username}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              @{member.username}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="text-slate-700 dark:text-slate-300">{member.email}</div>
                            {member.phone && (
                              <div className="text-slate-500 dark:text-slate-400">{member.phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            member.status === 'active' && !isExpired
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : member.status === 'disabled'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                            {member.status === 'disabled' ? '已禁用' : isExpired ? '已到期' : '活跃'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                          {new Date(member.expire_date).toLocaleDateString('zh-CN')}
                        </td>
                        <td className="py-4 px-6">
                          <MemberActions member={member} />
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      暂无会员，点击右上角按钮添加第一位会员
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
