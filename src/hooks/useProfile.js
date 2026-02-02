import { toast } from 'react-toastify';

export const getProfile= async ()=> {

      const res = await fetch("/api/auth/profile", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch order");
      }
    
      return data.user;
}


export const editProfile = async ({ email, phone, name, avatar }) => {
  try {
    const response = await fetch(`/api/auth/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, name, avatar }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'خطا در به‌روزرسانی پروفایل');
    }

    return result.user;  // برگشت اطلاعات کاربر ویرایش‌شده
  } catch (error) {
    toast.error(error.message || 'خطا در به‌روزرسانی پروفایل');
    return null;  // در صورت خطا هیچ‌چیز برگشت نمی‌دهیم
  }
};
