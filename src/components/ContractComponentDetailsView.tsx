import React from 'react';

import { ContractFunctionDetailsView } from "./ContractFunctionDetailsView";
import { ContractStorageDetailsView } from "./ContractStorageDetailsView";
import { ContractEventDetailsView } from "./ContractEventDetailsView";
import { useContractBuilder } from "../context/ContractBuilder";

export const ContractComponentDetailsView: React.FC = () => {
  const { selectedComponent } = useContractBuilder();

  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-auto">
      <h2 className="text-lg w-full font-bold mb-2">Component Details</h2>
      {selectedComponent ? (
        selectedComponent?.type === 'function' ? (
          <ContractFunctionDetailsView componentId={selectedComponent.componentId!} />
        ) : selectedComponent?.type === 'storage' ? (
          <ContractStorageDetailsView componentId={selectedComponent.componentId!} />
        ) : (
          <ContractEventDetailsView componentId={selectedComponent.componentId!} />
        )
      ) : (
        <p className="text-sm text-gray-400 py-4">Select a component to see details</p>
      )}
    </div>
  );
};
