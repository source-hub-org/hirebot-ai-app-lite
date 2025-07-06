# SSR và SSG trong Next.js trong HireBot AI App Lite

## Tổng quan về SSR và SSG

Trong Next.js, có hai cách chính để渲柟 (render) trang:

1. **SSR (Server-Side Rendering)**: Trang được渲柟 trên máy chủ trước khi gửi đến client
2. **SSG (Static Site Generation)**: Trang được tạo tĩnh trong quá trình build

### Sự khác biệt chính

| Tiêu chí | SSR | SSG |
|---------|-----|-----|
| Thời điểm渲柟 | Server-side (trên máy chủ) | Build-time (trong quá trình build) |
| Tính năng | Hỗ trợ dữ liệu động | Dữ liệu tĩnh |
| Tốc độ tải | Nhanh hơn khi có cache | Rất nhanh, không cần JS |
| Tối ưu SEO | Tốt (gửi HTML đến trình duyệt) | Rất tốt (trình duyệt thấy HTML) |
| Tính năng tương tác | Hoàn hảo | Cần JS client-side |

## Ví dụ trong HireBot AI App Lite

### File `src/app/page.tsx` - SSG

Trang home sử dụng SSG:

```tsx
export default function HomePage() {
  // Dữ liệu được lấy trong getStaticProps
  const { candidates } = props

  return (
    <div>
      <h1>Danh sách ứng viên</h1>
      <ul>
        {candidates.map(candidate => (
          <li key={candidate.id}>{candidate.name}</li>
        ))}
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  // Lấy dữ liệu từ API hoặc cơ sở dữ liệu
  const candidates = await fetch('http://localhost:8000/api/candidates')
    .then(res => res.json())

  return {
    props: { candidates }
  }
}
```

### File `src/app/dashboard/page.tsx` - SSR

Trang dashboard có thể sử dụng SSR để lấy dữ liệu thời gian thực:

```tsx
export default function DashboardPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // Lấy dữ liệu từ API
    fetch('http://localhost:8000/api/dashboard')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  if (!data) return <p>Loading...</p>

  return (
    <div>
      <h1>Bảng điều khiển</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

## Cách chọn giữa SSR và SSG

1. **Dữ liệu tĩnh**: Sử dụng SSG khi dữ liệu không thay đổi thường xuyên
2. **Dữ liệu động**: Sử dụng SSR hoặc getServerSideProps khi dữ liệu thay đổi thường xuyên
3. **SEO**: Cả hai đều tốt cho SEO, nhưng SSG nhanh hơn
4. **Tốc độ**: SSG tải nhanh hơn vì không cần JS
5. **Tính năng tương tác**: SSR cho phép nhiều tương tác hơn

## Điểm cần chú ý

1. **Caching**: SSG có thể được cached, giúp cải thiện hiệu suất
2. **Last modified**: Với SSG, thời gian cập nhật dữ liệu có thể bị chậm
3. **API**: Kết hợp SSR/SGS với API Routes để lấy dữ liệu

## Bài tập thực hành

1. Chuyển đổi trang home sang SSG
2. Tạo trang blog sử dụng SSG
3. Tạo trang danh sách sản phẩm sử dụng SSR

Hãy tiếp tục với các chủ đề còn lại trong kế hoạch học tập để nắm vững Next.js của HireBot AI App Lite.
