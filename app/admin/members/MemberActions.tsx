'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreVertical, Edit, Trash2, RefreshCw, UserCheck, UserX } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface Member {
  id: string
  username: string
  email: string
  full_name: string | null
  phone: string | null
  status: string
  expire_date: string
}

interface MemberActionsProps {
  member: Member
}

export default function MemberActions({ member }: MemberActionsProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (newStatus: 'active' | 'disabled') => {
    setLoading(true)
    
    const { error } = await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('id', member.id)

    if (error) {
      toast.error('操作失败')
    } else {
      toast.success(newStatus === 'active' ? '已启用' : '已禁用')
      router.refresh()
    }
    
    setLoading(false)
    setShowMenu(false)
  }

  const handleRenew = async () => {
    const days = prompt('续期天数：', '30')
    if (!days) return

    const newExpireDate = new Date(member.expire_date)
    newExpireDate.setDate(newExpireDate.getDate() + parseInt(days))

    setLoading(true)
    
    const { error } = await supabase
      .from('users')
      .update({ 
        expire_date: newExpireDate.toISOString().split('T')[0],
        status: 'active'
      })
      .eq('id', member.id)

    if (error) {
      toast.error('续期失败')
    } else {
      toast.success(`已续期 ${days} 天`)
      router.refresh()
    }
    
    setLoading(false)
    setShowMenu(false)
  }

  const handleDelete = async () => {
    if (!confirm(`确定要删除会员「${member.full_name || member.username}」吗？`)) {
      return
    }

    setLoading(true)
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', member.id)

    if (error) {
      toast.error('删除失败')
    } else {
      toast.success('已删除')
      router.refresh()
    }
    
    setLoading(false)
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading}
        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition"
      >
        <MoreVertical size={18} />
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 py-1 z-20">
            <button
              onClick={handleRenew}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
            >
              <RefreshCw size={16} />
              续期
            </button>
            {member.status === 'disabled' ? (
              <button
                onClick={() => handleStatusChange('active')}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
              >
                <UserCheck size={16} />
                启用
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange('disabled')}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
              >
                <UserX size={16} />
                禁用
              </button>
            )}
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-600"
            >
              <Trash2 size={16} />
              删除
            </button>
          </div>
        </>
      )}
    </div>
  )
}
