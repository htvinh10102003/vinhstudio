'use client';

import { useState, useEffect, use } from 'react'; 
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { uploadFile } from '@/src/lib/upload';
// Thêm bộ icon cho đồng bộ với bản Create
import { ArrowLeft, Save, LayoutGrid, Link as LinkIcon, Image as ImageIcon, FileText, Smartphone, Globe, Code, Video, Loader2 } from 'lucide-react';

export default function EditApp({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadingApk, setUploadingApk] = useState(false);
  
  // 1. Khởi tạo State đầy đủ các trường mới
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    project_type: 'Android App',
    version: '1.0.0',
    testing_status: 'testing',
    short_description: '',
    full_description: '',
    icon_url: '',
    video_url: '',
    screenshots: '', // Sẽ lưu dạng string (mỗi link 1 dòng) để dễ edit
    play_store_url: '',
    app_store_url: '',
    website_url: '',
    apk_download_url: '',
    repository_url: '',
    is_active: true
  });

  useEffect(() => {
    const fetchAppDetail = async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .eq('id', id) 
        .single();

      if (data) {
        // CHÚ Ý: Chuyển mảng screenshots từ DB thành chuỗi xuống dòng để hiện lên textarea
        const screenshotsString = data.screenshots ? data.screenshots.join('\n') : '';
        setFormData({ ...data, screenshots: screenshotsString });
      }
      if (error) {
        alert('Không tìm thấy ứng dụng!');
        router.push('/admin/apps');
      }
      setFetching(false);
    };

    fetchAppDetail();
  }, [id, router]);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setUploadingIcon(true);
      const url = await uploadFile(e.target.files[0], 'apps');
      setFormData({ ...formData, icon_url: url });
      alert('Cập nhật icon thành công!');
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleApkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setUploadingApk(true);
      const url = await uploadFile(e.target.files[0], 'apps');
      setFormData({ ...formData, apk_download_url: url });
      alert('Cập nhật APK thành công!');
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    } finally {
      setUploadingApk(false);
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Xử lý biến chuỗi screenshots quay lại thành mảng
    const screenshotsArray = formData.screenshots
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');
    
    const { error } = await supabase
      .from('apps')
      .update({
        name: formData.name,
        slug: formData.slug,
        project_type: formData.project_type,
        version: formData.version,
        testing_status: formData.testing_status,
        short_description: formData.short_description,
        full_description: formData.full_description,
        icon_url: formData.icon_url,
        video_url: formData.video_url,
        screenshots: screenshotsArray,
        play_store_url: formData.play_store_url,
        app_store_url: formData.app_store_url,
        website_url: formData.website_url,
        apk_download_url: formData.apk_download_url,
        repository_url: formData.repository_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      alert('Lỗi khi cập nhật: ' + error.message);
      setLoading(false);
    } else {
      router.push('/admin/apps'); 
      router.refresh();
    }
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-slate-500 font-bold italic">Đang truy xuất dữ liệu dự án...</p>
    </div>
  );

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto bg-[#F8FAFC] min-h-screen pb-24">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <Link href="/admin/apps" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft size={16} /> Quay lại danh sách
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 italic uppercase">Cập nhật <span className="text-blue-600">Dự án</span></h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 disabled:bg-slate-300"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Lưu thay đổi
        </button>
      </div>

      <form className="space-y-8">
        
        {/* --- KHỐI 1: CƠ BẢN --- */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900 mb-6 border-b pb-4">
            <LayoutGrid size={20} className="text-blue-500" /> Thông tin danh tính
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Tên dự án *</label>
              <input 
                required value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
                className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Slug (URL)</label>
              <input 
                readOnly value={formData.slug} 
                className="w-full border-2 border-slate-50 bg-slate-100 p-4 rounded-2xl outline-none text-slate-400 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Loại dự án</label>
              <select 
                name="project_type" value={formData.project_type} 
                onChange={(e) => setFormData({...formData, project_type: e.target.value})}
                className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold appearance-none"
              >
                <option value="Android App">Android App</option>
                <option value="iOS App">iOS App</option>
                <option value="Game">Game (Trò chơi)</option>
                <option value="Web Service">Web Service</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Phiên bản</label>
              <input 
                value={formData.version} 
                onChange={(e) => setFormData({...formData, version: e.target.value})}
                className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold"
              />
            </div>
          </div>
        </div>

        {/* --- KHỐI 2: MÔ TẢ --- */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900 mb-6 border-b pb-4">
            <FileText size={20} className="text-emerald-500" /> Nội dung mô tả
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Mô tả ngắn</label>
              <textarea 
                rows={2} value={formData.short_description || ''}
                onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Mô tả đầy đủ (Popup)</label>
              <textarea 
                rows={6} value={formData.full_description || ''}
                onChange={(e) => setFormData({...formData, full_description: e.target.value})}
                className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl font-medium"
              />
            </div>
          </div>
        </div>

        {/* --- KHỐI 3: UPLOAD & MEDIA --- */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2 border-b pb-4">
             <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900">
                <ImageIcon size={20} className="text-purple-500" /> Media & Screenshots
             </h2>
          </div>
          
          <div className="space-y-4">
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Thay đổi Icon</label>
            <input type="file" accept="image/*" onChange={handleIconUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white" />
            {uploadingIcon && <Loader2 className="animate-spin text-blue-600" size={16} />}
            {formData.icon_url && <img src={formData.icon_url} className="h-20 w-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" />}
          </div>

          <div className="space-y-4">
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Cập nhật APK</label>
            <input type="file" accept=".apk" onChange={handleApkUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-600 file:text-white" />
            {uploadingApk && <Loader2 className="animate-spin text-emerald-600" size={16} />}
            {formData.apk_download_url && <p className="text-[10px] text-emerald-600 font-bold truncate">{formData.apk_download_url}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Video Demo (Youtube Embed)</label>
            <input 
              value={formData.video_url || ''}
              onChange={(e) => setFormData({...formData, video_url: e.target.value})}
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none"
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Screenshots (Mỗi link một dòng)</label>
            <textarea 
              rows={4} value={formData.screenshots}
              onChange={(e) => setFormData({...formData, screenshots: e.target.value})}
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl font-mono text-xs"
              placeholder="https://image-link-1.jpg"
            />
          </div>
        </div>

        {/* --- KHỐI 4: LINKS --- */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900 mb-6 border-b pb-4">
                <LinkIcon size={20} className="text-amber-500" /> Hệ thống liên kết
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input placeholder="Play Store Link" value={formData.play_store_url || ''} onChange={(e) => setFormData({...formData, play_store_url: e.target.value})} className="border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl font-medium" />
            <input placeholder="App Store Link" value={formData.app_store_url || ''} onChange={(e) => setFormData({...formData, app_store_url: e.target.value})} className="border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl font-medium" />
            <input placeholder="Website URL" value={formData.website_url || ''} onChange={(e) => setFormData({...formData, website_url: e.target.value})} className="border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl font-medium" />
            <input placeholder="Github Repository" value={formData.repository_url || ''} onChange={(e) => setFormData({...formData, repository_url: e.target.value})} className="border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl font-medium" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Trạng thái phát hành</label>
          <select 
            value={formData.testing_status}
            onChange={(e) => setFormData({...formData, testing_status: e.target.value})}
            className="w-full border-2 border-slate-100 bg-white p-4 rounded-2xl font-bold"
          >
            <option value="testing">Bản thử nghiệm (Testing)</option>
            <option value="production">Đã phát hành (Live)</option>
          </select>
        </div>
      </form>
    </div>
  );
}