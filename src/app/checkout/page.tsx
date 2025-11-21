export const dynamic = "force-dynamic";

import { Suspense } from "react";
import SearchParamsClient from "./SearchParamsClient";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <SearchParamsClient />
    </Suspense>
  );
}
