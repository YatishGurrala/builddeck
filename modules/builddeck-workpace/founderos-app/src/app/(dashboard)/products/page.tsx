import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionPlaceholder } from '@/components/layout/section-placeholder';

const products = [
  { id: 'alpha', name: 'Product Alpha', status: 'building', owner: 'Ava Chen' },
  { id: 'beta', name: 'Beta Launch', status: 'validating', owner: 'Noah Kim' },
  { id: 'gamma', name: 'Growth OS', status: 'idea', owner: 'Mia Patel' },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6 pb-8">
      <SectionPlaceholder
        title="Products"
        description="Create and track products with founders, owners, and status signals in one place."
        action={<Button size="sm">Create product</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardDescription>{product.status}</CardDescription>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Owner: {product.owner}</p>
              <Button asChild variant="outline" size="sm">
                <Link href={`/products/${product.id}`}>Open product</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}