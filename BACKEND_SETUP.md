# 🚀 Hướng Dẫn Cài Đặt Backend Proxy Server

## 📋 Giải Pháp CORS

Backend proxy server chạy trên `localhost:3000` sẽ nhận request từ frontend (`localhost:5173`) và forward tới n8n Cloud webhook. Vì request là server-to-server, CORS không áp dụng.

```
Frontend (localhost:5173)
    ↓ (fetch to localhost:3000 - NO CORS issue)
Backend Proxy (localhost:3000)
    ↓ (server-to-server request - NO CORS check)
N8N Cloud (carreer-path.app.n8n.cloud)
```

## 🔧 Cài Đặt

### Bước 1: Cài đặt dependencies cho server

```bash
# Di chuyển vào thư mục project
cd d:\Mirabo\HireTab\wawa-lipsync

# Copy package-server.json thành package.json cho server
copy package-server.json package-server-install.json

# Cài đặt dependencies
npm install express cors node-fetch
```

### Bước 2: Chạy Backend Server

```bash
# Chạy server (development mode)
node server.js

# HOẶC chạy với watch mode
node --watch server.js
```

**Output khi server chạy:**
```
╔════════════════════════════════════════╗
║  Interview Assistant Backend Server    ║
║  Running on: http://localhost:3000      ║
║  Health check: http://localhost:3000/health  ║
║  N8N Proxy: http://localhost:3000/call-n8n  ║
╚════════════════════════════════════════╝
```

### Bước 3: Kiểm tra Health Check

Mở browser hoặc terminal:
```bash
# Test health check
curl http://localhost:3000/health

# Kết quả mong đợi:
# {"status":"OK","timestamp":"2025-11-22T..."}
```

### Bước 4: Chạy Frontend

Ở terminal khác:
```bash
cd d:\Mirabo\HireTab\wawa-lipsync\examples\lipsync-demo

# Chạy dev server
npm run dev
```

Frontend sẽ chạy trên `http://localhost:5173`

## ✅ Kiểm Tra Hoạt Động

1. **Frontend chạy:** http://localhost:5173
2. **Backend chạy:** http://localhost:3000
3. **Nhập tin nhắn** trong chat
4. **Kiểm tra console:**
   - **Frontend console:** Sẽ thấy log `📤 Gửi yêu cầu đến backend:`
   - **Backend console:** Sẽ thấy log `📤 Received request from frontend:` và `✅ N8N Response received:`

## 📱 Luồng Hoạt Động

```
1. User nhập tin nhắn → Click "📤"
   ↓
2. Frontend gửi POST tới http://localhost:3000/call-n8n
   ↓
3. Backend nhận request, log payload
   ↓
4. Backend forward tới N8N Cloud
   ↓
5. N8N Cloud xử lý và trả về response
   ↓
6. Backend trả response về Frontend
   ↓
7. Frontend extract AI response và đọc lên
```

## 🔍 Debug Tips

### Kiểm tra Backend đang chạy:
```bash
netstat -ano | find "3000"  # Windows
lsof -i :3000               # Mac/Linux
```

### Kiểm tra request payload:
Backend console sẽ in ra payload nhận được từ frontend

### Kiểm tra N8N response:
Backend console sẽ in ra response từ N8N Cloud

## 📝 File Cấu Hình

- **server.js** - Backend proxy server
- **ChatInterview.jsx** - Frontend component (đã update để gọi localhost:3000)
- **package-server.json** - Dependencies cho server

## 🚫 Ghi Chú

- **Đừng quên chạy server** trước khi chạy frontend
- **Port 3000** phải available (không chạy service khác)
- **Frontend phải gọi `http://localhost:3000`** (NOT https)
- **Backend sẽ proxy tới N8N Cloud** (HTTPS URL)

## 🆘 Troubleshoot

| Lỗi | Giải pháp |
|-----|----------|
| `Cannot GET /call-n8n` | Backend chưa chạy hoặc sai URL |
| `ECONNREFUSED localhost:3000` | Port 3000 chưa mở hoặc bị chiếm |
| `CORS error` | Kiểm tra `cors()` middleware trong server.js |
| `Failed to fetch` | Kiểm tra backend console log |

