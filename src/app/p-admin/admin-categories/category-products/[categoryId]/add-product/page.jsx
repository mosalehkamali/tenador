import AddProductToCategory from '@/components/admin/AddProductToCategory';

export default async function Page({ params }) {
  const { categoryId } = await params;

  return (
    <div className='flex justify-center'>
      <AddProductToCategory categoryId={categoryId} />
    </div>
  );
}
