import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Check if account is expired or disabled
  if (user.role === 'member') {
    const now = new Date()
    const expireDate = new Date(user.expire_date)
    
    if (user.status === 'disabled' || now > expireDate) {
      redirect('/login?error=expired')
    }
  }
  
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  
  if (user.role !== 'admin') {
    redirect('/')
  }
  
  return user
}

export function isExpired(expireDate: string): boolean {
  return new Date() > new Date(expireDate)
}

export function getDaysUntilExpiry(expireDate: string): number {
  const now = new Date()
  const expiry = new Date(expireDate)
  const diffTime = expiry.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
