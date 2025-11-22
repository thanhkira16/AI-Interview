# 🔧 Hướng dẫn Fix N8N Workflow

## 🚨 Vấn đề

```
Unused Respond to Webhook node found in the workflow
```

Lỗi này có nghĩa là n8n workflow của bạn không được cấu hình đúng.

---

## ✅ Giải pháp

### **Cách 1: Test với Mock Server (Khuyến nghị - Không cần chỉnh n8n)**

Hiện tại, backend đã có `/call-n8n-mock` endpoint. Chỉ cần:

1. Giữ `useMockWebhook = true` trong `ChatInterview.jsx`
2. Chạy interview bình thường
3. Backend sẽ trả mock response

**Ưu điểm:**
- ✅ Không cần chỉnh n8n
- ✅ Test nhanh
- ✅ Response đơn giản nhưng đủ để test

---

### **Cách 2: Fix N8N Workflow (Nếu muốn dùng n8n)**

#### Bước 1: Mở N8N Editor
- Truy cập: `https://carreer-path.app.n8n.cloud`
- Mở workflow có tên `/webhook-test/send`

#### Bước 2: Kiểm tra Workflow Structure
Workflow cần có:
```
Webhook (Trigger)
    ↓
Processing Nodes (ví dụ: AI, logic, v.v.)
    ↓
Respond to Webhook (Response)
```

#### Bước 3: Thêm "Respond to Webhook" Node
1. Click "+" để add node
2. Search: "Respond to Webhook"
3. Kết nối từ node cuối cùng tới "Respond to Webhook"

#### Bước 4: Cấu hình Response
Trong "Respond to Webhook" node:

```json
{
  "response": "{{ $node.YourNode.json.message }}",
  "message": "AI response",
  "text": "Your AI generated text"
}
```

Hoặc đơn giản:
```json
{
  "response": "Cảm ơn bạn đã chia sẻ! Đó là thông tin rất hữu ích."
}
```

#### Bước 5: Activate Workflow
- Click "Activate" (nút màu xanh)
- Workflow sẽ live

---

## 🔄 Chuyển đổi giữa Mock và N8N

### Dùng Mock (Testing):
```javascript
const useMockWebhook = true; // ← Dùng mock
```

### Dùng N8N (Production):
```javascript
const useMockWebhook = false; // ← Dùng n8n thực
```

---

## 📝 N8N Workflow Example

Ví dụ workflow hoàn chỉnh:

```
1. Webhook Trigger
   ├─ Receives: userMessage, candidateName, etc.

2. AI Node (Optional - ví dụ OpenAI)
   ├─ Receives: userMessage
   ├─ Calls: OpenAI API
   └─ Returns: AI response

3. Respond to Webhook
   ├─ Status: 200
   └─ Body: {
       "response": "{{ $node.OpenAI.json.choices[0].message.content }}",
       "success": true
     }
```

---

## ✅ Test Workflow

### Test Mock Endpoint:
```bash
curl -X POST http://localhost:3000/call-n8n-mock \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "test",
    "candidateName": "John"
  }'
```

**Response mong đợi:**
```json
{
  "success": true,
  "response": "Cảm ơn bạn đã chia sẻ! ...",
  "timestamp": "2025-11-22T...",
  "candidateName": "John"
}
```

### Test N8N Endpoint (sau khi fix):
```bash
curl -X POST https://carreer-path.app.n8n.cloud/webhook-test/send \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "test",
    "candidateName": "John"
  }'
```

---

## 🆘 Troubleshoot

| Vấn đề | Giải pháp |
|--------|----------|
| Mock hoạt động nhưng N8N không | Kiểm tra "Respond to Webhook" node có kết nối không |
| N8N trả 500 error | Kiểm tra message path trong node |
| Response trống | Kiểm tra variable names trong "Respond to Webhook" |

---

## 📌 Tóm tắt

1. **Hiện tại**: Đang dùng Mock ✅
2. **Tiếp theo**: Fix N8N workflow nếu cần
3. **Cuối cùng**: Chuyển sang N8N production (set `useMockWebhook = false`)
