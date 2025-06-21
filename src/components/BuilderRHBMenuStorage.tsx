import React, { useState } from 'react';
import { ContractStorageItem } from '../types/contract';
import { useContractBuilder } from '../context/ContractBuilder';

export const BuilderRHBMenuStorage = (props: {
  onSelect: (operation: 'Read' | 'Write', item: ContractStorageItem) => void;
}) => {
  const { storage } = useContractBuilder();
  const subTabs = [
    { name: 'Read' },
    { name: 'Write' },
  ];
  const [selectedSubTab, setSelectedSubTab] = useState<'Read' | 'Write' | null>(null);
  const [selectedStorageItem, setSelectedStorageItem] = useState<ContractStorageItem | null>(null);
  return (
    <div className="flex flex-col">
      {selectedStorageItem === null && storage.map((item, index) => (
        <button
          key={index}
          className="flex flex-row items-center gap-1 px-1 py-1 hover:bg-[#ffffff30] rounded-md"
          onClick={() => {
            setSelectedStorageItem(item);
          }}
        >
          <span className="text-sm">{item.name}</span>
          <span className="text-xs text-gray-400 truncate ml-1">{item.description || ''}</span>
        </button>
      ))}
      {selectedStorageItem !== null && (
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between px-1">
            {subTabs.map((tab, index) => (
              <button
                key={index}
                className={`px-2 py-1 rounded-md ${selectedSubTab === tab.name ? 'bg-[#ffffff30]' : 'hover:bg-[#ffffff50]'}`}
                onClick={() => props.onSelect(tab.name as 'Read' | 'Write', selectedStorageItem)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
