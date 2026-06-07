'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Clock, Bell, LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface UserProfile {
  full_name: string | null
  email: string
  expire_date: string
  role: string
}

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('full_name, email, expire_date, role')
        .eq('id', user.id)
        .single()
      
      setProfile(data)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const daysUntilExpiry = profile 
    ? Math.ceil((new Date(profile.expire_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  const navItems = [
    { href: '/', icon: LayoutDashboard, label: '首页' },
    { href: '/insights/today', icon: FileText, label: '今日洞察' },
    { href: '/insights/history', icon: Clock, label: '历史洞察' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MI</span>
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white hidden sm:block">
                Market Insights
              </span>
            </div>

            <div className="flex items-center gap-4">
              {profile && (
                <div className="hidden sm:flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {profile.full_name || profile.email}
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    daysUntilExpiry <= 7 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {daysUntilExpiry > 0 
                      ? `剩余 ${daysUntilExpiry} 天`
                      : '已到期'
                    }
                  </div>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
                title="退出登录"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    isActive
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
