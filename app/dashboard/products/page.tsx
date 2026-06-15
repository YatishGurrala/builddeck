import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, Plus, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductImageField } from "@/components/dashboard/product-image-field";
import {
  addFounderProduct,
  moveFounderProduct,
  removeFounderProduct,
  saveFounderCurrentProject,
  saveFounderProduct,
} from "@/actions/founder-profile";
import { getCurrentUser } from "@/lib/auth/utils";
import { getFounderProfileForUser } from "@/lib/founder-profile/store";
import { FounderDashboardNav } from "../_components/founder-dashboard-nav";

export const metadata = { title: "Products · Dashboard · Builddeck" };

export default async function DashboardProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getFounderProfileForUser(user);
  const products = [...profile.products].sort((a, b) => a.position - b.position);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--on-surface)]">Products</h1>
          <p className="mt-1 text-[color:var(--on-surface-variant)]">
            Projects featured in the &quot;Currently Building&quot; section of your profile.
          </p>
        </div>
        <form action={addFounderProduct} className="grid w-full max-w-3xl gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Input name="name" placeholder="Product name" required />
          <Input name="url" placeholder="https://..." />
          <ProductImageField name="imageUrl" placeholder="Image URL" />
          <Button className="gap-2" type="submit">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </form>
      </div>

      <FounderDashboardNav active="products" />

      <Card className="mt-8">
        <CardHeader className="pb-2">
          <CardTitle>Current Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveFounderCurrentProject} className="space-y-3">
            <Textarea
              name="currentlyBuilding"
              defaultValue={profile.currentlyBuilding || ""}
              rows={2}
              placeholder="What are you currently building?"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" className="gap-2">
                <Save className="h-3.5 w-3.5" /> Save current project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {products.map((product, index) => (
          <Card key={`${product.id}-${index}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base">{product.name}</CardTitle>
                <Badge
                  variant={
                    product.status === "launched"
                      ? "launched"
                      : product.status === "building"
                      ? "building"
                      : "paused"
                  }
                >
                  {product.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form action={saveFounderProduct} className="space-y-3">
                <input type="hidden" name="productId" value={product.id} />
                <Input name="name" defaultValue={product.name} required />
                <Textarea name="description" defaultValue={product.description} rows={3} required />
                <Input name="url" defaultValue={product.url || ""} placeholder="https://..." />
                <ProductImageField
                  name="imageUrl"
                  defaultValue={product.imageUrl || ""}
                  placeholder="Image URL (or upload logo/image)"
                />
                <select
                  name="status"
                  defaultValue={product.status}
                  className="h-10 w-full rounded-md border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] px-3 text-sm text-[color:var(--on-surface)]"
                >
                  <option value="building">Building</option>
                  <option value="launched">Launched</option>
                  <option value="paused">Paused</option>
                </select>
                <div className="pt-1">
                  <Button type="submit" size="sm" className="gap-2">
                    <Save className="h-3.5 w-3.5" /> Save
                  </Button>
                </div>
              </form>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <form action={moveFounderProduct}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="direction" value="up" />
                    <Button type="submit" size="sm" variant="outline" disabled={index === 0}>
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                  <form action={moveFounderProduct}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="direction" value="down" />
                    <Button type="submit" size="sm" variant="outline" disabled={index === products.length - 1}>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
                <form action={removeFounderProduct}>
                  <input type="hidden" name="productId" value={product.id} />
                  <Button type="submit" size="sm" variant="outline" className="gap-2 text-red-300 hover:text-red-200">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
