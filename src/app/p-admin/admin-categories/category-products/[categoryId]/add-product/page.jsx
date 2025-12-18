import AddProductToCategory from '@/components/admin/AddProductToCategory';

export default async function Page({ params }) {
  const { categoryId } = await params;

  return (
      <AddProductToCategory categoryId={categoryId} />
  );
}
