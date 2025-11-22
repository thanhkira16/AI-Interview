# 🚀 Deploy Backend Proxy Server - Hướng Dẫn

## 📋 Tại sao cần Deploy?

Bạn có hai lựa chọn:

1. **Chạy Local (localhost:3000)** - Cho development
   - Chỉ hoạt động khi cùng máy
   - Frontend phải ở `localhost:5173`

2. **Deploy Public** - Cho production
   - Frontend ở bất kỳ đâu vẫn gọi được
   - Interview có thể dùng bình thường

## 🎯 Cách hoạt động hiện tại

File `ChatInterview.jsx` đã được cấu hình **auto-detect**:

```javascript
const backendUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/call-n8n'  // Local development
    : 'https://interview-backend-proxy.onrender.com/call-n8n'; // Production
```

## 📚 Hướng dẫn Deploy

### **Lựa chọn 1: Deploy lên Render (Khuyến nghị - Miễn phí)**

#### Bước 1: Tạo tài khoản Render
- Truy cập: https://render.com
- Đăng ký bằng GitHub

#### Bước 2: Chuẩn bị repository
```bash
cd d:\Mirabo\HireTab\wawa-lipsync

# Tạo .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore

# Commit files
git add server.js package-server.json BACKEND_SETUP.md
git commit -m "Add backend proxy server"
git push origin main
```

#### Bước 3: Deploy trên Render
1. Truy cập https://dashboard.render.com
2. Click "New" → "Web Service"
3. Kết nối GitHub repo: `thanhkira16/wawa-lipsync`
4. Điền thông tin:
   - **Name**: `interview-backend-proxy`
   - **Runtime**: `Node`
   - **Build Command**: `npm install` (hoặc để trống)
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=3000
     ```

5. Click "Create Web Service"
6. Chờ deploy xong (3-5 phút)

#### Bước 4: Lấy Public URL
- Sau khi deploy xong, bạn sẽ có URL như:
  ```
  https://interview-backend-proxy.onrender.com
  ```

#### Bước 5: Update ChatInterview.jsx
```javascript
const backendUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/call-n8n'
    : 'https://interview-backend-proxy.onrender.com/call-n8n'; // ← URL của bạn
```

---

### **Lựa chọn 2: Deploy lên Railway (Miễn phí)**

#### Bước 1: Cài đặt Railway CLI
```bash
npm install -g railway
```

#### Bước 2: Login Railway
```bash
railway login
```

#### Bước 3: Deploy
```bash
cd d:\Mirabo\HireTab\wawa-lipsync
railway init
railway up
```

#### Bước 4: Lấy URL
```bash
railway open
```

---

### **Lựa chọn 3: Deploy lên Heroku (Đã đóng miễn phí, cần thẻ credit)**

Skip - Không khuyến nghị vì Heroku đã ngừng free tier.

---

### **Lựa chọn 4: Deploy lên VPS của riêng bạn**

Nếu bạn có VPS (AWS, DigitalOcean, v.v.):

```bash
# SSH vào VPS
ssh user@your-server-ip

# Clone repo
git clone https://github.com/thanhkira16/wawa-lipsync.git
cd wawa-lipsync

# Cài Node.js (nếu chưa có)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài dependencies
npm install express cors node-fetch

# Chạy server với PM2 (auto-restart)
npm install -g pm2
pm2 start server.js --name "interview-api"
pm2 startup
pm2 save
```

---

## ✅ Test Deploy

### Test Backend
```bash
curl -X POST https://your-backend-url.com/call-n8n \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "test"}'
```

### Test Health Check
```bash
curl https://your-backend-url.com/health
```

---

## 📝 Update Checklist

- [ ] Deploy server lên public URL
- [ ] Test backend URL hoạt động
- [ ] Update `ChatInterview.jsx` với URL public
- [ ] Build & test frontend
- [ ] Interview có thể gửi tin nhắn mà không cần local backend

---

## 🚨 Troubleshoot

| Vấn đề | Giải pháp |
|--------|----------|
| `CORS error` | Kiểm tra backend đã enable CORS |
| `500 error` | Kiểm tra N8N webhook URL có đúng không |
| `Backend timeout` | N8N webhook có respond không? Check logs |
| `Frontend không kết nối` | Kiểm tra URL backend trong ChatInterview.jsx |

---

## 📌 Ghi chú

- Render free tier sẽ spin down nếu không có request sau 15 phút
- Railway free tier cho ~$5/tháng
- Nếu muốn 24/7 uptime, cần chọn paid plan hoặc VPS

Sau khi deploy xong, **bạn chỉ cần chạy frontend** - không cần chạy backend riêng!
