'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

interface DeleteArticleButtonProps {
  articleId: string
  articleTitle: string
}

export default function DeleteArticleButton({ articleId, articleTitle }: DeleteArticleButtonProps) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`确定要删除文章「${articleTitle}」吗？此操作不可撤销。`)) {
      return
    }

    setDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId)

    if (error) {
      toast.error('删除失败')
      setDeleting(false)
      return
    }

    toast.success('删除成功')
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition disabled:opacity-50"
      title="删除"
    >
      <Trash2 size={18} />
    </button>
  )
}
