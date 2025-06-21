import React, { useState } from 'react';
import Image from 'next/image';

import { useContractBuilder } from '../context/ContractBuilder';
import { ContractFunctionItem, ContractStorageItem, ContractEventItem } from '../types/contract';
import { BuilderRHBMenuFunctions } from './BuilderRHBMenuFunctions';
import { BuilderRHBMenuStorage } from './BuilderRHBMenuStorage';
import { BuilderRHBMenuEvents } from './BuilderRHBMenuEvents';
import { BuilderRHBMenuStarknet } from './BuilderRHBMenuStarknet';
import { BuilderRHBMenuUtilities } from './BuilderRHBMenuUtilities';

export interface BuilderRHBMenuProps {
  position: { x: number; y: number };
  closeMenu: () => void;
}

export const BuilderRHBMenu: React.FC<BuilderRHBMenuProps> = (props) => {
   const { functions, storage, events, addNode } = useContractBuilder();
   const tabTree = [
     { name: 'Functions', icon: '/icons/function.png' },
     { name: 'Storage', icon: '/icons/variable.png' },
     { name: 'Events', icon: '/icons/notify.png' },
     { name: 'Starknet', icon: '/icons/transaction.png' },
     { name: 'Utilities', icon: '/icons/utilities.png' },
   ];
   const [selectedTab, setSelectedTab] = useState<'Functions' | 'Storage' | 'Events' | 'Starknet' | 'Utilities' | null>(null);
   return (
    <div
      className="absolute bg-[#ffffff20] border-2 border-[#ffffff30] rounded-md w-40
                 flex flex-col p-1 gap-1
      "
      style={{ left: props.position.x, top: props.position.y }}
      onClick={(e) => e.stopPropagation()} // Prevent closing the menu when clicking inside
    >
      <input
        className="w-full bg-[#ffffff30] border-2 border-[#ffffff60] rounded-md text-md
                  focus:outline-none focus:border-[#ffffff90] px-1
        "
        type="text"
        placeholder="Search..."
      />
      {selectedTab === null && tabTree.map((tab, index) => (
        <button
          key={index}
          className="w-full text-left text-md flex items-center gap-1 px-1 hover:bg-[#ffffff30] rounded-md"
          onClick={() => {
            setSelectedTab(tab.name as any);
          }}
        >
          <Image
            src={tab.icon}
            alt={`${tab.name} Icon`}
            width={12}
            height={12}
          />
          {tab.name}
        </button>
      ))}
      {selectedTab !== null && (
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between px-1">
            <div className="flex flex-row items-center gap-1">
              <Image
                src={tabTree.find(tab => tab.name === selectedTab)?.icon || '/icons/default.png'}
                alt={`${selectedTab} Icon`}
                width={12}
                height={12}
              />
              <h3 className="text-md">{selectedTab}</h3>
            </div>
            <button
              className="text-sm text-gray-400 hover:text-white"
              onClick={() => setSelectedTab(null)}
            >
              X
            </button>
          </div>
          {selectedTab === 'Functions' && (
            <BuilderRHBMenuFunctions onSelect={(func: ContractFunctionItem) => {
              // Handle function selection
              setSelectedTab(null);
              addNode({
                id: Date.now(), // Unique ID based on timestamp
                position: props.position,
                type: 'function',
                componentId: functions.indexOf(func), // Use index as component ID
              });
              props.closeMenu();
            }} />
          )}
          {selectedTab === 'Storage' && (
            <BuilderRHBMenuStorage
              onSelect={(operation: string, item: ContractStorageItem) => {
                // Handle storage selection
                setSelectedTab(null);
                addNode({
                  id: Date.now(), // Unique ID based on timestamp
                  position: props.position,
                  type: 'storage',
                  componentId: storage.indexOf(item), // Use index as component ID
                  metadata: { operation },
                });
                props.closeMenu();
            }} />
          )}
          {selectedTab === 'Events' && (
            <BuilderRHBMenuEvents
              onSelect={(operation: string, event: ContractEventItem) => {
                // Handle event selection
                setSelectedTab(null);
                addNode({
                  id: Date.now(), // Unique ID based on timestamp
                  position: props.position,
                  type: 'event',
                  componentId: events.indexOf(event), // Use index as component ID
                  metadata: { operation },
                });
                props.closeMenu();
            }} />
          )}
          {selectedTab === 'Starknet' && (
            <BuilderRHBMenuStarknet
              onSelect={(operation: string, nodeComponent: any) => {
                // Handle Starknet selection
                setSelectedTab(null);
                addNode({
                  id: Date.now(), // Unique ID based on timestamp
                  position: props.position,
                  type: 'starknet',
                  componentId: 0, // Placeholder for Starknet node
                  metadata: { operation, nodeComponent },
                });
                props.closeMenu();
            }} />
          )}
          {selectedTab === 'Utilities' && (
            <BuilderRHBMenuUtilities
              onSelect={(operation: string) => {
                // Handle Utilities selection
                setSelectedTab(null);
                addNode({
                  id: Date.now(), // Unique ID based on timestamp
                  position: props.position,
                  type: 'utility',
                  componentId: 0, // Placeholder for Utility node
                  metadata: { operation },
                });
                props.closeMenu();
            }} />
          )}
        </div>
      )}
    </div>
  )
};
