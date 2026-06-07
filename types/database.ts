export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'admin' | 'member'
          expire_date: string
          status: 'active' | 'expired' | 'disabled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'member'
          expire_date: string
          status?: 'active' | 'expired' | 'disabled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'member'
          expire_date?: string
          status?: 'active' | 'expired' | 'disabled'
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          content: string
          summary: string | null
          cover_image: string | null
          reading_time: number | null
          published_at: string | null
          created_at: string
          updated_at: string
          author_id: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          summary?: string | null
          cover_image?: string | null
          reading_time?: number | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          author_id: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          summary?: string | null
          cover_image?: string | null
          reading_time?: number | null
          published_at?: string | null
          updated_at?: string
        }
      }
      article_views: {
        Row: {
          id: string
          user_id: string
          article_id: string
          view_time: string
          duration: number | null
          device: string | null
          ip: string | null
        }
        Insert: {
          id?: string
          user_id: string
          article_id: string
          view_time?: string
          duration?: number | null
          device?: string | null
          ip?: string | null
        }
        Update: {
          duration?: number | null
        }
      }
      login_logs: {
        Row: {
          id: string
          user_id: string
          login_time: string
          ip: string | null
          device: string | null
        }
        Insert: {
          id?: string
          user_id: string
          login_time?: string
          ip?: string | null
          device?: string | null
        }
        Update: {}
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
