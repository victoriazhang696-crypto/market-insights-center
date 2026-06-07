'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export default function NewMemberForm() {
  const [formData, setFormData] = useState({
    account: '',
    password: '',
    full_name: '',
    expire_days: '30',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证账号格式（8位数字）
    if (!/^\d{8}$/.test(formData.account)) {
      toast.error('账号必须是8位数字')
      return
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error('密码至少6位')
      return
    }

    setLoading(true)

    // 构造邮箱
    const email = `${formData.account}@insight.local`

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: formData.password,
      options: {
        data: {
          username: formData.account,
          full_name: formData.full_name,
          role: 'member',
          expire_date: new Date(Date.now() + parseInt(formData.expire_days) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        emailRedirectTo: undefined,
      },
    })

    if (authError) {
      toast.error('创建失败：' + authError.message)
      setLoading(false)
      return
    }

    // Update user profile
    if (authData.user) {
      const expireDate = new Date(Date.now() + parseInt(formData.expire_days) * 24 * 60 * 60 * 1000)
      
      await supabase
        .from('users')
        .update({
          expire_date: expireDate.toISOString().split('T')[0],
        })
        .eq('id', authData.user.id)
    }

    toast.success('会员创建成功！')
    router.push('/admin/members')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            会员账号 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.account}
            onChange={(e) => setFormData({ ...formData, account: e.target.value.replace(/\D/g, '').slice(0, 8) })}
            required
            maxLength={8}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest"
            placeholder="请输入8位数字"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-center">
            {formData.account.length}/8 位
          </p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            登录密码 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入密码（至少6位）"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            姓名
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="客户姓名（可选）"
          />
        </div>

        {/* Expire Days */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            有效期
          </label>
          <div className="flex gap-2 flex-wrap">
            {[30, 90, 180, 365].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setFormData({ ...formData, expire_days: days.toString() })}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  formData.expire_days === days.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {days}天
              </button>
            ))}
          </div>
          <input
            type="number"
            value={formData.expire_days}
            onChange={(e) => setFormData({ ...formData, expire_days: e.target.value })}
            min="1"
            className="mt-2 w-32 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="自定义天数"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition font-medium flex items-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          创建会员
        </button>
      </div>
    </form>
  )
}
