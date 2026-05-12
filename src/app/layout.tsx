import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// 1. Khởi tạo font Plus Jakarta Sans hỗ trợ tiếng Việt tuyệt đối
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ['400', '500', '600', '700', '800'], // Lấy các độ dày chuẩn
});

// 2. Cấu hình SEO
export const metadata: Metadata = {
  title: {
    template: '%s | Vinh Studio',
    default: 'Vinh Studio | Freelance Mobile Developer', 
  },
  description: 'Trang cá nhân và Nhật ký lập trình của Hồ Tá Vinh. Chuyên gia phát triển ứng dụng di động.',
  // ... các config SEO khác giữ nguyên
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className="scroll-smooth h-full"> 
      {/* Thay vì dùng variable, ta ốp thẳng class của font vào body */}
      <body
        className={`${jakarta.className} antialiased min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-200 selection:text-blue-900`}
      >
        {children}
      </body>
    </html>
  );
}