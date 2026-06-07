'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'

interface HistoryClientProps {
  months: string[]
  currentMonth?: string
  currentSearch?: string
}

export default function HistoryClient({ months, currentMonth, currentSearch }: HistoryClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(currentSearch || '')

  const handleMonthChange = (month: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (month) {
      params.set('month', month)
    } else {
      params.delete('month')
    }
    router.push(`/insights/history?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchValue) {
      params.set('search', searchValue)
    } else {
      params.delete('search')
    }
    router.push(`/insights/history?${params.toString()}`)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Month Filter */}
        <div className="relative">
          <select
            value={currentMonth || ''}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2.5 pr-10 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-48"
          >
            <option value="">全部时间</option>
            {months.map((month) => {
              const [year, m] = month.split('-')
              return (
                <option key={month} value={month}>
                  {year}年{m}月
                </option>
              )
            })}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜索标题或内容..."
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  )
}
