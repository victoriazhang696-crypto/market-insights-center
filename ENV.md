# 环境变量说明

## 必需变量

### NEXT_PUBLIC_SUPABASE_URL
- **说明：** Supabase 项目 URL
- **获取位置：** Supabase Dashboard → Settings → API → Project URL
- **示例：** `https://abcdefghijklmnop.supabase.co`

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **说明：** Supabase 匿名密钥（客户端使用）
- **获取位置：** Supabase Dashboard → Settings → API → Project API keys → anon public
- **示例：** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### SUPABASE_SERVICE_ROLE_KEY
- **说明：** Supabase 服务角色密钥（服务端使用，**不要泄露**）
- **获取位置：** Supabase Dashboard → Settings → API → Project API keys → service_role
- **示例：** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **警告：** 此密钥具有完全权限，不要提交到代码仓库或暴露给客户端

### NEXT_PUBLIC_APP_URL
- **说明：** 应用访问地址
- **开发环境：** `http://localhost:3000`
- **生产环境：** `https://insight.yourdomain.com`

## 可选变量

### NEXT_PUBLIC_APP_NAME
- **说明：** 应用名称（默认：Market Insights）
- **用途：** 自定义品牌显示

---

## 配置文件

### 本地开发
创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel 部署
在 Vercel 项目设置 → Environment Variables 中添加所有变量。

### 安全提示
- `.env.local` 文件已添加到 `.gitignore`
- 永远不要将 `.env.local` 提交到代码仓库
- `SUPABASE_SERVICE_ROLE_KEY` 只能在服务端使用
