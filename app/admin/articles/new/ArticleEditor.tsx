'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Sparkles, Loader2 } from 'lucide-react'

export default function ArticleEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [readingTime, setReadingTime] = useState(5)
  const [publishing, setPublishing] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  
  const router = useRouter()

  const calculateReadingTime = (text: string) => {
    const words = text.length
    const minutes = Math.ceil(words / 500) // ~500 chars per minute for Chinese
    return Math.max(1, minutes)
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    setReadingTime(calculateReadingTime(value))
  }

  const handleAIGenerate = async () => {
    if (!title || !content) {
      toast.error('请先填写标题和内容')
      return
    }

    setAiGenerating(true)
    
    // Simulate AI generation (replace with actual AI API call)
    // In production, you would call your AI service here
    setTimeout(() => {
      // Generate summary from content
      const generatedSummary = content.substring(0, 150) + '...'
      setSummary(generatedSummary)
      setAiGenerating(false)
      toast.success('AI 生成完成')
    }, 2000)
  }

  const handlePublish = async (asDraft: boolean = false) => {
    if (!title || !content) {
      toast.error('请填写标题和内容')
      return
    }

    setPublishing(true)
    const supabase = createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('请先登录')
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('articles')
      .insert({
        title,
        content,
        summary: summary || null,
        cover_image: coverImage || null,
        reading_time: readingTime,
        published_at: asDraft ? null : new Date().toISOString(),
        author_id: user.id,
      } as any)

    if (error) {
      toast.error('发布失败：' + error.message)
      setPublishing(false)
      return
    }

    toast.success(asDraft ? '草稿已保存' : '文章已发布')
    router.push('/admin/articles')
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            文章标题
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入文章标题..."
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            文章内容
          </label>
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="粘贴或输入文章内容...支持 Markdown 格式"
            rows={20}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            预计阅读时间：{readingTime} 分钟
          </div>
        </div>

        {/* AI Assist */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex-1">
            <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-purple-600" />
              AI 辅助发布
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              自动生成摘要、优化排版
            </p>
          </div>
          <button
            type="button"
            onClick={handleAIGenerate}
            disabled={aiGenerating || !content}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition font-medium flex items-center gap-2"
          >
            {aiGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                一键生成
              </>
            )}
          </button>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            文章摘要
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="自动生成或手动输入摘要..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            封面图片 URL
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => handlePublish(true)}
            disabled={publishing}
            className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium disabled:opacity-50"
          >
            保存草稿
          </button>
          <button
            type="button"
            onClick={() => handlePublish(false)}
            disabled={publishing}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition font-medium flex items-center gap-2"
          >
            {publishing && <Loader2 size={16} className="animate-spin" />}
            发布文章
          </button>
        </div>
      </div>
    </div>
  )
}
