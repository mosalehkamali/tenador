import CategoryProductsClient from '@/components/admin/CategoryProductsClient';

export default async function Page({ params }) {
    const {categoryId} = await params
    
  if (!categoryId) {
    return null; 
  }

  return (
    <CategoryProductsClient categoryId={categoryId} />
  );
}
