import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ContractStorageItem } from '../types/contract';
import { useContractBuilder } from '../context/ContractBuilder';
import { getTypeColor } from '../utils/contract';
import { BuilderNodeViewProps } from './BuilderNodeView';

export const StorageReadNodeView: React.FC<BuilderNodeViewProps> = (props) => {
  const { storage } = useContractBuilder();
  const [storageItem, setStorageItem] = useState<ContractStorageItem | null>(null);
  useEffect(() => {
    setStorageItem(storage[props.node.componentId] || null);
  }, [props.node.componentId, storage]);

  return (
    <div className="flex flex-col bg-[#30f7f760] rounded-sm p-1 w-48">
      <div className="flex flex-row items-center">
        <Image
          src="/icons/variable.png"
          alt="Storage Icon"
          width={16}
          height={16}
          className="inline mr-1"
        />
        <h2 className="font-semibold text-lg">Get {storageItem?.name}</h2>
      </div>
      <p className="text-xs text-gray-300">{storageItem?.description}</p>
      <div className="mt-1">
        <div className="flex flex-row items-center justify-end">
          <span className="italic text-sm truncate">{storageItem?.type.name}</span>
          <div className="w-4 h-4 rounded-full ml-1 border-2 border-[#ffffff60]"
            style={{ backgroundColor: getTypeColor(storageItem?.type.name || "") }}
            onClick={() => props.createNewVarConnector({
              nodeId: props.node.id,
              connectorId: 0
            })}
          />
        </div>
      </div>
    </div>
  );
}
