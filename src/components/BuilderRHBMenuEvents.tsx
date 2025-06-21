import React, { useState } from 'react';
import { ContractEventItem } from '../types/contract';
import { useContractBuilder } from '../context/ContractBuilder';

export const BuilderRHBMenuEvents = (props: {
  onSelect: (operation: 'Emit' | 'Listen', item: ContractEventItem) => void;
}) => {
  const { events } = useContractBuilder();
  const subTabs = [
    { name: 'Emit' },
    { name: 'Listen' },
  ];
  const [selectedSubTab, setSelectedSubTab] = useState<'Emit' | 'Listen' | null>(null);
  const [selectedEventItem, setSelectedEventItem] = useState<ContractEventItem | null>(null);
  return (
    <div className="flex flex-col">
      {selectedEventItem === null && events.map((event, index) => (
        <button
          key={index}
          className="flex flex-row items-center gap-1 px-1 py-1 hover:bg-[#ffffff30] rounded-md"
          onClick={() => {
            setSelectedEventItem(event);
          }}
        >
          <span className="text-sm">{event.name}</span>
          <span className="text-xs text-gray-400 truncate ml-1">{event.description || ''}</span>
        </button>
      ))}
      {selectedEventItem !== null && (
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between px-1">
            {subTabs.map((tab, index) => (
              <button
                key={index}
                className={`px-2 py-1 rounded-md ${selectedSubTab === tab.name ? 'bg-[#ffffff30]' : 'hover:bg-[#ffffff50]'}`}
                onClick={() => props.onSelect(tab.name as any, selectedEventItem)}
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
