import SerieCreateFlow from "@/components/admin/SerieCreateFlow";

export default async function Page({ params }) {
    const { brandId } = await params

    return (
        <div className="flex justify-center">
            <SerieCreateFlow brandId={brandId} />
        </div>
    );
}