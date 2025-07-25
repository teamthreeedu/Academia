import { getLastPurchases } from "@/actions/getLastPurchases";

export default async function Payments() {
  const lastPurchases = await getLastPurchases();
  console.log(lastPurchases);

  return <div>Payments</div>;
}