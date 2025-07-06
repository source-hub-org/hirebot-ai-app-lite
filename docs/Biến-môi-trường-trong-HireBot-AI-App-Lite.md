# Biến môi trường trong HireBot AI App Lite

## Tổng quan về biến môi trường

Biến môi trường là một cách để truyền cấu hình vào ứng dụng mà không cần thay đổi mã nguồn. Chúng thường được sử dụng cho các giá trị như API_URL, CHAVE_API, và các thiết lập môi trường khác.

### Cách thức hoạt động

1. Tạo biến môi trường trong file `.env`
2. Sử dụng biến trong mã nguồn với `process.env.VARIABLE_NAME`
3. Cấu hình Next.js để đọc biến môi trường

### Ví dụ trong HireBot AI App Lite

File `src/pages/api/proxy/[...path].ts` sử dụng biến môi trường:

```ts
const NEXT_PUBLIC_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
).replace(/\/$/, '')
```

### Các loại biến môi trường

1. **Biến công khai (Public)**: Có thể đặt trong client-side, ví dụ `NEXT_PUBLIC_API_BASE_URL`
2. **Biến riêng tư (Private)**: Chỉ có thể truy cập trên server-side

### Các bước cấu hình

1. Tạo file `.env.local` trong thư mục gốc của dự án
2. Thêm các biến môi trường:
   - `NEXT_PUBLIC_API_BASE_URL=https://api.example.com`
   - `API_KEY=your-api-key-here`
3. Chạy ứng dụng với `bun dev`

### Điểm cần chú ý

- Biến công khai nên được đặt trong thư mục `.env.local` và không commit vào repository
- Sử dụng biến môi trường để bảo mật thông tin nhạy
- Kiểm tra biến môi trường trong quá trình build

Hãy tiếp tục với các chủ đề còn lại trong kế hoạch học tập để nắm vững cách sử dụng biến môi trường trong HireBot AI App Lite.
