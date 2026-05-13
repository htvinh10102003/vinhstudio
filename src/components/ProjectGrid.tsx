'use client';

import { useState, useEffect } from 'react';
import { X, Download, Globe, Code, Smartphone, PlayCircle, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProjectGrid({ apps }: { apps: any[] }) {
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  
  // State cho Slider vô tận
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset slider mỗi khi mở một App mới
  useEffect(() => {
    if (selectedApp) {
      setCurrentIndex(1);
      setIsTransitioning(false);
    }
  }, [selectedApp]);

  // Tạo mảng ảo thuật (Clone ảnh cuối lên đầu, ảnh đầu xuống cuối)
  const slides = selectedApp?.screenshots?.length > 0 
    ? [
        selectedApp.screenshots[selectedApp.screenshots.length - 1], // Clone Last
        ...selectedApp.screenshots,                                  // Original
        selectedApp.screenshots[0]                                   // Clone First
      ]
    : [];

  const isSingleImage = selectedApp?.screenshots?.length === 1;

  const nextSlide = () => {
    if (isTransitioning || isSingleImage) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning || isSingleImage) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Lắng nghe sự kiện để "Dịch chuyển tức thời" khi chạm mốc hai đầu
  useEffect(() => {
    if (isTransitioning) {
      let timeoutId: NodeJS.Timeout;

      if (currentIndex === slides.length - 1) {
        // Nếu chạm cái ảnh Clone ở cuối cùng -> Đợi animation xong (300ms) rồi nhảy bụp về ảnh thật ở số 1
        timeoutId = setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(1);
        }, 300);
      } else if (currentIndex === 0) {
        // Nếu chạm cái ảnh Clone ở đầu tiên -> Nhảy bụp về ảnh thật ở cuối cùng
        timeoutId = setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(slides.length - 2);
        }, 300);
      } else {
        // Đang ở giữa thì chỉ cần mở khóa transition sau 300ms
        timeoutId = setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }

      return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, isTransitioning, slides.length]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {apps.map((app) => (
          <div 
            key={app.id} 
            onClick={() => setSelectedApp(app)}
            className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer hover:-translate-y-2 flex flex-col"
          >
            <div className="flex items-start gap-4 mb-4">
              <img src={app.icon_url || 'https://via.placeholder.com/150'} alt={app.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 shadow-sm group-hover:scale-105 transition-transform" />
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{app.name}</h3>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{app.project_type}</span>
              </div>
            </div>
            <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">{app.short_description || 'Chưa có mô tả ngắn cho dự án này.'}</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
               <div className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${app.testing_status === 'testing' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                 {app.testing_status === 'testing' ? 'Bản thử nghiệm' : 'Đã phát hành'}
               </div>
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ChevronRight size={16} />
               </div>
            </div>
          </div>
        ))}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setSelectedApp(null)}></div>

          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedApp(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors z-[120] shadow-sm">
              <X size={20} />
            </button>

            <div className="overflow-y-auto p-8 md:p-12 custom-scrollbar">
              
              <div className="flex items-center gap-6 mb-8">
                <img src={selectedApp.icon_url || 'https://via.placeholder.com/150'} alt={selectedApp.name} className="w-24 h-24 rounded-3xl object-cover shadow-xl border-4 border-slate-50" />
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{selectedApp.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm font-bold text-slate-500">
                    <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-700">{selectedApp.project_type}</span>
                    <span>v{selectedApp.version}</span>
                    {selectedApp.privacy_policies?.[0]?.slug && (
                      <Link href={`/admin/privacy/${selectedApp.privacy_policies[0].slug}`} target="_blank" className="flex items-center gap-1 text-blue-600 hover:underline"><ShieldCheck size={14} /> Privacy</Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                {selectedApp.play_store_url && <a href={selectedApp.play_store_url} target="_blank" className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-2xl font-bold hover:bg-emerald-100 transition-colors text-sm"><PlayCircle size={18} /> Google Play</a>}
                {selectedApp.app_store_url && <a href={selectedApp.app_store_url} target="_blank" className="flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-3 rounded-2xl font-bold hover:bg-blue-100 transition-colors text-sm"><Smartphone size={18} /> App Store</a>}
                {selectedApp.apk_download_url && <a href={selectedApp.apk_download_url} target="_blank" className="flex items-center gap-2 bg-amber-50 text-amber-700 px-5 py-3 rounded-2xl font-bold hover:bg-amber-100 transition-colors text-sm"><Download size={18} /> Tải APK</a>}
                {selectedApp.website_url && <a href={selectedApp.website_url} target="_blank" className="flex items-center gap-2 bg-purple-50 text-purple-700 px-5 py-3 rounded-2xl font-bold hover:bg-purple-100 transition-colors text-sm"><Globe size={18} /> Web</a>}
                {selectedApp.repository_url && <a href={selectedApp.repository_url} target="_blank" className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-colors text-sm"><Code size={18} /> Github</a>}
              </div>

              {selectedApp.full_description && (
                <div className="mb-12">
                  <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4">Chi tiết dự án</h3>
                  <div className="prose prose-slate prose-p:font-medium prose-p:text-slate-600 max-w-none" dangerouslySetInnerHTML={{ __html: selectedApp.full_description.replace(/\n/g, '<br/>') }} />
                </div>
              )}

              {/* --- SLIDER CHẠY VÒNG TRÒN VÔ TẬN --- */}
              {slides.length > 0 && (
                <div className="mt-12 border-t border-slate-100 pt-8">
                  <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">Giao diện người dùng</h3>
                  
                  <div className="relative group/slider w-full max-w-4xl mx-auto rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                    
                    {/* Nút lùi */}
                    {!isSingleImage && (
                      <button 
                        onClick={prevSlide} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] bg-white/80 backdrop-blur-sm text-slate-900 w-12 h-12 flex items-center justify-center rounded-full shadow-lg border border-slate-200 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100"
                      >
                        <ChevronLeft size={24} />
                      </button>
                    )}

                    {/* Vùng chứa ảnh: Dùng Transform để tạo hiệu ứng lướt */}
                    <div 
                      className="flex w-full will-change-transform"
                      style={{ 
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 300ms ease-in-out' : 'none'
                      }}
                    >
                      {slides.map((imgUrl: string, idx: number) => (
                        <div key={idx} className="w-full shrink-0 flex items-center justify-center p-6 md:p-10">
                          {/* object-contain giúp ảnh không bao giờ bị cắt */}
                          <img 
                            src={imgUrl} 
                            alt={`Screenshot ${idx}`} 
                            className="h-[350px] md:h-[500px] w-auto object-contain rounded-xl shadow-xl border border-slate-200/50 bg-white"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Nút tiến */}
                    {!isSingleImage && (
                      <button 
                        onClick={nextSlide} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] bg-white/80 backdrop-blur-sm text-slate-900 w-12 h-12 flex items-center justify-center rounded-full shadow-lg border border-slate-200 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100"
                      >
                        <ChevronRight size={24} />
                      </button>
                    )}
                    
                    {/* Bộ đếm chấm tròn (Chỉ hiện khi có nhiều hơn 1 ảnh) */}
                    {!isSingleImage && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-[110] bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-200">
                        {selectedApp.screenshots.map((_: any, idx: number) => (
                          <div 
                            key={idx} 
                            // Logic để sáng đúng cái chấm (Bỏ qua 2 cái clone ở 2 đầu)
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              (currentIndex === idx + 1) || 
                              (currentIndex === 0 && idx === selectedApp.screenshots.length - 1) || 
                              (currentIndex === slides.length - 1 && idx === 0)
                                ? 'bg-blue-600 w-4' 
                                : 'bg-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Làm mượt thanh cuộn của Popup */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
      `}} />
    </>
  );
}