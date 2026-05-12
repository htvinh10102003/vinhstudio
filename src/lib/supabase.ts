import { createBrowserClient } from '@supabase/ssr'

function getSupabaseBrowserClient() {
  // Nếu đang chạy trên Server (đề phòng)
  if (typeof window === 'undefined') {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  
  // Nếu chạy trên Browser: Kiểm tra xem đã có client nào được tạo chưa
  let client = (window as any).supabaseClient
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    // Lưu lại vào window để các lần nạp lại sau không bị tạo mới
    ;(window as any).supabaseClient = client
  }
  
  return client
}

// Bất kỳ file nào import 'supabase' đều sẽ dùng chung 1 phiên bản này
export const supabase = getSupabaseBrowserClient()