import React, { useEffect, useState } from "react";

import { ContractStorageItem } from "../types/contract";
import { useContractBuilder } from "../context/ContractBuilder";

export interface ContractStorageDetailsProps {
  componentId: number,
}

export const ContractStorageDetailsView: React.FC<ContractStorageDetailsProps> = (props) => {
  const { storage, editStorage } = useContractBuilder();
  const [storageItem, setStorageItem] = useState<ContractStorageItem | null>(null);
  useEffect(() => {
    if (props.componentId !== null && storage[props.componentId]) {
      setStorageItem(storage[props.componentId]);
    }
  }, [props.componentId, storage]);

  if (!storageItem) {
    return <div className="text-gray-400">No storage selected</div>;
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h3 className="text-lg font-semibold">{storageItem.name}</h3>
      <p className="text-sm text-gray-400">{storageItem.description}</p>
      <div className="mt-2">
        <span className="font-semibold">Type:</span>
        <span className="ml-1">{storageItem.type.name}</span>
      </div>
    </div>
  );
}
