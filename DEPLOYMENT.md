# 部署检查清单

## Supabase 配置

### 1. 创建项目
- [ ] 访问 https://supabase.com
- [ ] 创建新项目
- [ ] 记录项目 URL
- [ ] 记录 anon key 和 service_role key

### 2. 数据库初始化
- [ ] 打开 SQL Editor
- [ ] 运行 `lib/database/schema.sql` 完整脚本
- [ ] 确认创建了 4 张表：users, articles, article_views, login_logs
- [ ] 确认启用了 RLS 策略

### 3. 创建管理员账号
- [ ] Authentication → Users → Add user
- [ ] 填写邮箱和密码
- [ ] 运行 SQL 更新角色：
  ```sql
  UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
  ```

### 4. 配置邮件模板（可选）
- [ ] Authentication → Email Templates
- [ ] 自定义确认邮件、重置密码邮件

---

## 本地开发

### 1. 环境配置
- [ ] 复制 `.env.local.example` 为 `.env.local`
- [ ] 填写 Supabase 环境变量
- [ ] 运行 `npm install`
- [ ] 运行 `npm run dev`
- [ ] 访问 http://localhost:3000

### 2. 测试功能
- [ ] 管理员登录
- [ ] 发布测试文章
- [ ] 创建测试会员
- [ ] 会员登录测试
- [ ] 测试权限过期

---

## Vercel 部署

### 1. 准备代码
- [ ] 代码推送到 GitHub
- [ ] 确认 `.env.local` 未提交（在 .gitignore 中）

### 2. Vercel 配置
- [ ] 登录 Vercel
- [ ] Import Project from GitHub
- [ ] Framework Preset: Next.js
- [ ] Root Directory: market-insights-center

### 3. 环境变量
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` (你的域名)

### 4. 部署
- [ ] 点击 Deploy
- [ ] 等待构建完成
- [ ] 访问测试

### 5. 自定义域名（可选）
- [ ] Settings → Domains
- [ ] 添加 `insight.yourdomain.com`
- [ ] 配置 DNS CNAME 记录

---

## 生产检查

### 安全
- [ ] 确认 RLS 策略生效
- [ ] 确认 service_role_key 仅用于服务端
- [ ] 确认管理员账号强密码

### 功能
- [ ] 管理员登录正常
- [ ] 文章发布成功
- [ ] 会员创建成功
- [ ] 会员登录正常
- [ ] 权限控制正常
- [ ] 阅读统计正常

### 性能
- [ ] 页面加载速度正常
- [ ] 图片压缩优化
- [ ] 开启 Vercel Analytics（可选）

---

## 日常维护

### 添加新会员
1. 后台 → 会员管理 → 添加会员
2. 通过 WhatsApp/Email 发送登录信息

### 发布文章
1. 后台 → 文章管理 → 发布文章
2. 粘贴内容 → AI 生成摘要 → 发布
3. 复制链接发送给会员

### 会员续期
1. 后台 → 会员管理
2. 点击操作 → 续期 → 输入天数

### 查看统计
1. 后台 → 数据统计
2. 查看阅读量、登录记录、热门文章
