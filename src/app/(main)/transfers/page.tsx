
import { PageHeader } from "@/components/page-header";
import { getProducts, getDepartments } from "@/lib/api";
import { TransferForm } from "./transfer-form";

export default async function TransfersPage() {
  const products = await getProducts();
  const departments = await getDepartments();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Transferência de Estoque"
        description="Mova produtos entre diferentes setores."
      />
      <div className="max-w-2xl">
         <TransferForm products={products} departments={departments} />
      </div>
    </div>
  );
}
