"use client";

import { useSearchParams } from "next/navigation";

export default function SearchParamsClient() {
  const params = useSearchParams();
  const id = params.get("id");

  return <div>ID: {id}</div>;
}
