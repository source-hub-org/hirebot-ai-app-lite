# Lý thuyết API Routes trong Next.js trong HireBot AI App Lite

## Tổng quan về API Routes

API Routes là một tính năng của Next.js cho phép bạn tạo các endpoint API mà không cần tạo các thành phần React. Mỗi file trong thư mục `pages/api` hoặc `app/api` sẽ tự động trở thành một endpoint API.

### Ví dụ về API Route trong dự án

File `src/pages/api/proxy/[...path].ts` là một ví dụ về API Route:

```ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios(req.method === 'GET' ? `http://localhost:8000/api/${req.query.path}` : `http://localhost:8000/api/${req.query.path}`, req.body)
    res.status(response.status).json(response.data)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
```

## Các thành phần chính

1. **Request handler**: Xử lý yêu cầu HTTP (GET, POST, PUT, DELETE, v.v.)
2. **Request parameters**: Nhận các tham số từ URL hoặc body
3. **Response**: Trả về dữ liệu cho client

## Cách thức hoạt động

1. Khi client gửi request đến `/api/proxy/[...path]`, Next.js sẽ tự động xử lý request này
2. Code trong file API Route sẽ xử lý request và trả về response
3. API Routes có thể sử dụng server-side rendering và xử lý dữ liệu

## Điểm cần chú ý

1. **Security**: Luôn validate và sanitize input để tránh lỗ hổng bảo mật
2. **Performance**: Tối ưu hiệu suất bằng cách cache response khi cần thiết
3. **Error handling**: Xử lý lỗi một cách nhất quán

## Bài tập thực hành

1. Tạo API Route để lấy danh sách ứng viên
2. Tạo API Route để thêm ứng viên mới
3. Tạo API Route để cập nhật thông tin ứng viên

Hãy tiếp tục với các chủ đề còn lại trong kế hoạch học tập để nắm vững API Routes trong Next.js của HireBot AI App Lite.
