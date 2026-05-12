'use client';

import { useState, useEffect, use } from 'react'; 
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { uploadFile } from '@/src/lib/upload';

// Định nghĩa params là một Promise
export default function EditApp({ params }: { params: Promise<{ id: string }> }) {
  // "Giải nén" params để lấy id (Cho Next.js 15)
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // State cho quá trình upload
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadingApk, setUploadingApk] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    icon_url: '',
    play_store_url: '',
    apk_download_url: '',
    repository_url: '',
    testing_status: 'development',
    is_active: true
  });

  // Fetch dữ liệu cũ
  useEffect(() => {
    const fetchAppDetail = async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .eq('id', id) 
        .single();

      if (data) {
        setFormData(data);
      }
      if (error) {
        alert('Không tìm thấy ứng dụng!');
        router.push('/admin/apps');
      }
      setFetching(false);
    };

    fetchAppDetail();
  }, [id, router]);

  // Các hàm xử lý Upload
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setUploadingIcon(true);
      const url = await uploadFile(e.target.files[0], 'apps');
      setFormData({ ...formData, icon_url: url });
      alert('Upload icon thành công!');
    } catch (error: any) {
      alert('Lỗi upload: ' + error.message);
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
      alert('Upload APK thành công!');
    } catch (error: any) {
      alert('Lỗi upload: ' + error.message);
    } finally {
      setUploadingApk(false);
    }
  };

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/^-+|-+$/g, ''); 
  };

  // Hàm Submit lưu thay đổi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('apps')
      .update({
        name: formData.name,
        slug: formData.slug,
        short_description: formData.short_description,
        icon_url: formData.icon_url,
        play_store_url: formData.play_store_url,
        apk_download_url: formData.apk_download_url,
        repository_url: formData.repository_url,
        testing_status: formData.testing_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      alert('Lỗi khi cập nhật: ' + error.message);
      setLoading(false);
    } else {
      router.push('/admin/apps'); 
    }
  };

  if (fetching) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu ứng dụng...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <Link href="/admin/apps" className="text-gray-500 hover:text-blue-600 mb-6 inline-block">&larr; Quay lại</Link>
      <h1 className="text-3xl font-bold mb-8 text-blue-600">Sửa Ứng Dụng</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-6">
        
        {/* Hàng 1: Tên, Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold mb-2 text-gray-700">Tên ứng dụng *</label>
            <input 
              type="text" required value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-bold mb-2 text-gray-700">Đường dẫn (Slug) *</label>
            <input 
              type="text" required value={formData.slug} 
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full border p-3 rounded-lg bg-gray-50 outline-none text-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2 text-gray-700">Mô tả ngắn</label>
          <textarea 
            rows={2} value={formData.short_description || ''}
            onChange={(e) => setFormData({...formData, short_description: e.target.value})}
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* --- GIAO DIỆN UPLOAD FILE --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
          <div>
            <label className="block font-bold mb-2 text-blue-800">Cập nhật Icon App</label>
            <input 
              type="file" accept="image/*" 
              onChange={handleIconUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            {uploadingIcon && <p className="text-xs text-blue-600 mt-2 italic animate-pulse">Đang tải ảnh lên...</p>}
            
            {/* Hiển thị ảnh Icon hiện tại */}
            {formData.icon_url && (
              <div className="mt-4 flex items-center gap-4 bg-white p-3 rounded-lg border shadow-sm w-max">
                <img src={formData.icon_url} className="h-16 w-16 rounded-xl object-cover" alt="Icon Preview" />
                <div className="text-xs text-gray-500 flex flex-col">
                  <span className="font-semibold text-gray-700 mb-1">Ảnh hiện tại</span>
                  <a href={formData.icon_url} target="_blank" className="text-blue-500 hover:underline max-w-[150px] truncate">
                    {formData.icon_url}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold mb-2 text-green-800">Cập nhật file APK</label>
            <input 
              type="file" accept=".apk" 
              onChange={handleApkUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
            />
            {uploadingApk && <p className="text-xs text-green-600 mt-2 italic animate-pulse">Đang tải file APK (vui lòng chờ)...</p>}
            
            {/* Hiển thị trạng thái APK hiện tại */}
            {formData.apk_download_url && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-xs font-semibold text-green-800 block mb-1">File APK hiện tại:</span>
                <a href={formData.apk_download_url} target="_blank" className="text-xs text-green-600 hover:underline break-all">
                  {formData.apk_download_url}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Cụm Link Tải về */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Liên kết & Nguồn (Thủ công)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-600">Link Google Play</label>
              <input 
                type="url" value={formData.play_store_url || ''}
                onChange={(e) => setFormData({...formData, play_store_url: e.target.value})}
                className="w-full border p-2 rounded outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-gray-600">Link Github (Mã nguồn)</label>
              <input 
                type="url" value={formData.repository_url || ''}
                onChange={(e) => setFormData({...formData, repository_url: e.target.value})}
                className="w-full border p-2 rounded outline-none focus:border-gray-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2 text-gray-700">Trạng thái phát triển</label>
          <select 
            value={formData.testing_status}
            onChange={(e) => setFormData({...formData, testing_status: e.target.value})}
            className="w-full border p-3 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="development">Đang phát triển (Development)</option>
            <option value="internal_testing">Đang Test Kín (Closed Testing)</option>
            <option value="production">Đã phát hành (Production)</option>
          </select>
        </div>

        <button 
          type="submit" disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật thay đổi'}
        </button>
      </form>
    </div>
  );
}