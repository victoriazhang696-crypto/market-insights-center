# Market Insights Center

市场洞察会员中心 - 专业的市场洞察发布与管理平台

## 功能特性

**会员端：**
- 登录系统（账号密码）
- 今日市场洞察
- 历史洞察浏览
- 权限到期提醒

**管理端：**
- 仪表盘概览
- 文章发布与管理
- AI 辅助发布（自动生成摘要）
- 会员管理（添加、续期、禁用）
- 阅读统计
- 登录日志

## 技术栈

- **前端：** Next.js 15 + TypeScript + Tailwind CSS
- **后端：** Supabase (PostgreSQL + Auth)
- **部署：** Vercel

## 快速开始

### 1. 安装依赖

```bash
cd market-insights-center
npm install
```

### 2. 配置 Supabase

1. 访问 [supabase.com](https://supabase.com) 创建项目
2. 在 SQL Editor 中运行 `lib/database/schema.sql` 创建数据表
3. 获取项目 URL 和 API Key

### 3. 设置环境变量

复制 `.env.local.example` 为 `.env.local`：

```bash
cp .env.local.example .env.local
```

填写以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 创建管理员账号

在 Supabase Dashboard → Authentication → Users 中创建第一个管理员账号，然后在 SQL Editor 中更新：

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 许可证

MIT License
