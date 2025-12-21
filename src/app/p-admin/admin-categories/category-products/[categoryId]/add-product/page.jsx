import ProductCreateFlow from "@/components/admin/ProductCreateFlow";

export default async function Page({ params }) {
  const { categoryId } =await params;

  return (
    <div className="flex justify-center">
      <ProductCreateFlow categoryId={categoryId} />
    </div>
  );
}