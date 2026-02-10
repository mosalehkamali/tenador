import BrandAdminPage from "@/components/admin/BrandAdminPage";

export default async function Page({ params }) {
    const { brandId } = await params

    return (
        <div className="flex justify-center">
            <BrandAdminPage brandId={brandId} />
        </div>
    );
}