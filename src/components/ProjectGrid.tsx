'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProjectGrid({ apps }: { apps: any[] }) {
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  // Hàm render nhãn loại dự án
  const getTypeColor = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'game': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'web service': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'ios app': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200'; // Android/Default
    }
  };

  return (
    <>
      {/* --- LƯỚI DỰ ÁN --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {apps.map((app) => (
          <div 
            key={app.id} 
            onClick={() => setSelectedApp(app)}
            className="group bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-center gap-6 mb-6">
              {app.icon_url ? (
                <img src={app.icon_url} alt={app.name} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-sm ring-1 ring-slate-900/5 group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-slate-300 ring-1 ring-slate-900/5">
                  {app.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{app.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-widest ${getTypeColor(app.project_type)}`}>
                    {app.project_type || 'Android App'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-500 font-medium leading-relaxed flex-grow mb-6 line-clamp-2">
              {app.short_description}
            </p>

            <div className="pt-4 border-t border-slate-100 text-sm font-bold text-blue-600 flex items-center gap-2">
              Xem chi tiết <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* --- POPUP CHI TIẾT DỰ ÁN (STYLE GOOGLE PLAY) --- */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Lớp nền mờ */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedApp(null)}
          ></div>
          
          {/* Khung Popup */}
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Nút Đóng */}
            <button 
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold z-10 transition-colors"
            >
              ✕
            </button>

            {/* Khu vực có thể cuộn */}
            <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-hide">
              
              {/* Header: Icon & Tên */}
              <div className="p-8 md:p-12 pb-6 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                <img 
                  src={selectedApp.icon_url || 'https://via.placeholder.com/150'} 
                  alt={selectedApp.name} 
                  className="w-32 h-32 rounded-[2rem] object-cover shadow-md border border-slate-100" 
                />
                <div>
                  <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">{selectedApp.name}</h2>
                  <p className="text-lg text-slate-500 font-medium mb-4">Vinh Studio</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-slate-400">Đánh giá</span>
                      <span>4.9 ★</span>
                    </div>
                    <div className="w-px bg-slate-200"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-slate-400">Phiên bản</span>
                      <span>{selectedApp.version || '1.0.0'}</span>
                    </div>
                    <div className="w-px bg-slate-200"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-slate-400">Cập nhật</span>
                      <span>{selectedApp.last_updated ? new Date(selectedApp.last_updated).toLocaleDateString('vi-VN') : 'Mới nhất'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Khu vực Nút Tải / Link */}
              <div className="px-8 md:px-12 flex flex-wrap gap-3 mb-10">
                {selectedApp.play_store_url && (
                  <a href={selectedApp.play_store_url} target="_blank" className="bg-[#00875F] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#006B4A] transition-colors flex items-center gap-2">
                    Tải trên Google Play
                  </a>
                )}
                {selectedApp.app_store_url && (
                  <a href={selectedApp.app_store_url} target="_blank" className="bg-[#0A84FF] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#0066CC] transition-colors flex items-center gap-2">
                    Tải trên App Store
                  </a>
                )}
                {selectedApp.website_url && (
                  <a href={selectedApp.website_url} target="_blank" className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-600 transition-colors flex items-center gap-2">
                    Mở Trang Web ↗
                  </a>
                )}
                {selectedApp.apk_download_url && (
                  <a href={selectedApp.apk_download_url} target="_blank" className="bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-bold hover:bg-slate-100 transition-colors">
                    Tải file APK
                  </a>
                )}
              </div>

              {/* Slider Ảnh chụp màn hình / Video */}
              {(selectedApp.video_url || (selectedApp.screenshots && selectedApp.screenshots.length > 0)) && (
                <div className="px-8 md:px-12 mb-10">
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
                    {/* Nếu có video */}
                    {selectedApp.video_url && (
                      <div className="snap-center shrink-0">
                        <iframe 
                          className="w-[280px] md:w-[500px] h-[500px] md:h-[281px] rounded-[1.5rem] bg-black" 
                          src={selectedApp.video_url} 
                          title="Promo Video" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                    {/* Render ảnh */}
                    {selectedApp.screenshots?.map((img: string, idx: number) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt={`Screenshot ${idx}`} 
                        className="snap-center shrink-0 h-[500px] rounded-[1.5rem] border border-slate-100 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Về dự án này (Mô tả chi tiết) */}
              <div className="px-8 md:px-12 pb-12">
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">Về dự án này</h3>
                <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
                  {selectedApp.full_description ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedApp.full_description }} />
                  ) : (
                    <p>{selectedApp.short_description}</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}