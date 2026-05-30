import { SectionPlaceholder } from '@/components/layout/section-placeholder';

type ProductDetailPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;

  return (
    <div className="space-y-6 pb-8">
      <SectionPlaceholder
        title={`Product: ${productId}`}
        description="A dedicated product overview with roadmap, tasks, docs, and launch context lives here."
      />
    </div>
  );
}