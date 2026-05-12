import { supabase } from './supabase';

export const uploadFile = async (file: File, bucket: 'apps' | 'blog') => {
  // Tạo tên file duy nhất để không bị trùng (vd: 1683901234-icon.png)
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  // Lấy URL công khai để lưu vào Database
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};