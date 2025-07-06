# Props và trạng thái trong React trong HireBot AI App Lite

## Giới thiệu về Props và State

Trong React, **props** (properties) và **state** (trạng thái) là hai khái niệm cơ bản dùng để truyền dữ liệu và quản lý thay đổi trong ứng dụng.

### Props (Thuộc tính)

- Là dữ liệu được truyền vào một thành phần React từ thành phần cha.
- Props là **không thay đổi** (immutable) trong phạm vi của thành phần nhận props.
- Chúng ta sử dụng props để truyền cấu hình, dữ liệu, sự kiện callback, v.v.

### State (Trạng thái)

- Là dữ liệu được lưu trữ bên trong thành phần React.
- State có thể thay đổi theo thời gian và kích thích việc cập nhật lại giao diện.
- Chúng ta sử dụng state để quản lý dữ liệu cục bộ của thành phần.

## Ví dụ về Props trong MainLayout

File MainLayout.tsx sử dụng props để truyền thông tin về trang:

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

Ở đây:
- `children` là props truyền nội dung chính của trang.
- `title` và `description` là props truyền vào thành phần Header.

## Ví dụ về State trong useAuth

Hook useAuth quản lý trạng thái đăng nhập:

```ts
export function useAuth() {
  // State for authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Function to handle login
  const login = async (credentials: LoginCredentials, redirectPath = '/dashboard') => {
    try {
      await auth.login(credentials.email, credentials.password)
      setIsLoggedIn(true) // Update state after successful login
      router.replace(redirectPath)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Function to handle logout
  const logout = (redirectPath = '/login') => {
    auth.logout()
    setIsLoggedIn(false) // Update state after logout
    router.replace(redirectPath)
  }

  return {
    isLoggedIn,
    login,
    logout,
  }
}
```

## Cách thức hoạt động

1. **Props**:
   - Truyền dữ liệu từ thành phần cha sang thành phần con
   - Đọc props trong thành phần con nhưng không thay đổi chúng

2. **State**:
   - Quản lý dữ liệu cục bộ trong thành phần
   - Kích hoạt việc re-render khi giá trị thay đổi
   - Cập nhật state bằng hàm setter (setIsLoggedIn)

## Điểm cần chú ý

- Props và state đều là cơ sở của React
- Props dùng để truyền dữ liệu vào, state dùng để quản lý dữ liệu nội bộ
- State cần được cập nhật bằng cách gọi setter function (useState, useReducer, v.v.)
- Tránh việc lạm dụng state để truyền dữ liệu giữa các thành phần

## Bài tập thực hành

1. Tạo một thành phần UserProfile nhận props: name, avatar, email
2. Thêm state để theo dõi số lượng sản phẩm trong giỏ hàng
3. Xây dựng một form nhập liệu sử dụng state để quản lý giá trị

Hãy tiếp tục tìm hiểu các thành phần khác trong HireBot AI App Lite để hiểu cách props và state được kết hợp trong thực tế.
