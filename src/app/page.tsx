'use client';

import { ContractBuilderProvider } from "../context/ContractBuilder";
import { BuilderView } from "../components/BuilderView";

export default function Home() {
  return (
    <ContractBuilderProvider>
      <BuilderPage />
    </ContractBuilderProvider>
  );
}

export const BuilderPage = () => {
  return (
    <div
      className="min-h-screen relative flex flex-col"
    >
      <BuilderView />
    </div>
  );
}
