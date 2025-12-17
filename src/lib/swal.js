import Swal from 'sweetalert2';

export const confirmDelete = async (title = 'آیا مطمئن هستید؟', text = 'این عمل قابل بازگشت نیست') => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'بله، حذف کن',
    cancelButtonText: 'انصراف',
    reverseButtons: true,
  });
  return result.isConfirmed;
};

export const showSuccess = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#2563eb',
    confirmButtonText: 'باشه',
  });
};

export const showError = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'باشه',
  });
};




