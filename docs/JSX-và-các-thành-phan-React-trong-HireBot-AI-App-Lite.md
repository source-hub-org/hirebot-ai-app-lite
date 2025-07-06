# JSX và các thành phần React trong HireBot AI App Lite

## Giới thiệu về JSX

JSX là một cú pháp viết HTML trong JavaScript. Nó cho phép chúng ta định nghĩa giao diện người dùng bằng cách kết hợp HTML và JavaScript trong cùng một file. JSX được sử dụng rộng rãi trong React và các framework React như Next.js.

## Cú pháp cơ bản

Trong React, chúng ta viết JSX tương tự như HTML, nhưng có một số điểm khác biệt:
- Tất cả thẻ đều phải được đóng (có thể đóng bằng dấu </>)
- Thuộc tính trong JSX được viết bằng camelCase (không dùng underscores)
- Các thành phần (components) là những hàm hoặc đối tượng trả về phần tử JSX

## Ví dụ đơn giản

```jsx
function Welcome() {
  return <h1>Xin chào, thế giới React!</h1>
}
```

## Thành phần Layout trong HireBot AI App Lite

File MainLayout.tsx minh họa cách xây dựng thành phần layout cơ bản:

```tsx
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header pageTitle={title} pageDescription={description} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

## Điểm cần chú ý

1. Props: Các thuộc tính được truyền vào thành phần, ví dụ pageTitle và pageDescription trong thẻ Header.

2. Children: Nội dung con được truyền vào thành phần, được khai báo bằng tham số children.

3. Conditional rendering: Chúng ta có thể kiểm soát việc hiển thị phần tử dựa trên điều kiện.

Ví dụ:
```jsx
{isLoggedIn ? <AdminPanel /> : <LoginForm />}
```

## Lợi ích của JSX

- Giúp code dễ đọc hơn so với cách viết bằng hàm callback
- Cho phép tái sử dụng UI components
- Dễ dàng thêm logic và xử lý sự kiện

## Bài tập thực hành

1. Tạo một thành phần Button với các props: text, onClick và className
2. Sử dụng thành phần Button trong một form đăng nhập
3. Thêm conditional rendering để hiển thị thông báo thành công

Hãy tiếp tục với các thành phần trong HireBot AI App Lite để hiểu cách chúng được kết hợp và sử dụng trong dự án.
