# Hooks trong React trong HireBot AI App Lite

## Tổng quan về Hooks

Hooks là một tính năng của React 16.8 cho phép sử dụng state và lifecycle không cần class components. Một số hooks phổ biến:

- useState: Quản lý trạng thái trong component
- useEffect: Xử lý side effects và lifecycle
- useContext: Truy cập context
- useReducer: Quản lý state phức tạp
- useMemo và useCallback: Tối ưu performance

## useState - Quản lý trạng thái

### Ví dụ trong useAuth

File `src/hooks/useAuth.ts` sử dụng `useState` để quản lý trạng thái đăng nhập:

```ts
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // ... các hàm login, logout ...

  return {
    isLoggedIn,
    login,
    logout,
  }
}
```

Ở đây:
- `isLoggedIn` là state boolean
- `setIsLoggedIn` là hàm setter để cập nhật state
- State được khởi tạo với giá trị mặc định là false

### Cách thức hoạt động
1. Khi component sử dụng hook này, nó nhận được đối tượng `auth` với thuộc tính `isLoggedIn`
2. Khi người dùng đăng nhập, `setIsLoggedIn(true)` được gọi
3. React sẽ tự động re-render component khi state thay đổi

## useEffect - Xử lý side effects

### Ví dụ trong MainLayout

File `src/components/layout/MainLayout.tsx` sử dụng `useEffect` để xử lý loading:

```tsx
import { useRouter, usePathname } from 'next/navigation'
import { getPageConfig } from '@/config/pageConfig'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/'
  const { title, description } = getPageConfig(pathname)

  // State for loading
  const [isLoading, setIsLoading] = useState(true)

  // Handle loading
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Clean up timer on unmount
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {isLoading && <LoadingComponent />}
      <Header pageTitle={title} pageDescription={description} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

### Điểm cần chú ý
- `useEffect` nhận một hàm và một mảng dependencies
- Hàm trong `useEffect` sẽ được gọi sau mỗi lần render
- Cleanup function (nếu có) sẽ được gọi khi component unmount hoặc dependencies thay đổi

## Custom Hooks

### Ví dụ trong useAuth

`src/hooks/useAuth.ts` là một custom hook tự tạo:

```ts
export function useAuth() {
  const router = useRouter()
  const auth = useAuthContext()

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const login = async (credentials: LoginCredentials, redirectPath = '/dashboard') => {
    try {
      await auth.login(credentials.email, credentials.password)
      setIsLoggedIn(true)
      router.replace(redirectPath)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = (redirectPath = '/login') => {
    auth.logout()
    setIsLoggedIn(false)
    router.replace(redirectPath)
  }

  return {
    isLoggedIn,
    login,
    logout,
  }
}
```

### Lợi ích của custom hooks
- Tái sử dụng logic giữa các components
- Dễ dàng kiểm thử
- Tăng tính bảo mật và modular

## Bài tập thực hành

1. Tạo custom hook `useLocalStorage` để lưu trữ state trong localStorage
2. Xây dựng hook `useFetch` để fetch dữ liệu và xử lý loading/error
3. Tạo hook `useDebounce` để debounce input search

Hãy tiếp tục với các chủ đề còn lại trong kế hoạch học tập để nắm vững React Hooks trong HireBot AI App Lite.
