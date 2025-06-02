'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type BuilderNode = {
  id: number;
  position: { x: number; y: number };
  type: 'function' | 'storage' | 'event' | 'starknet' | 'utility';
  //component: ContractFunctionItem | ContractStorageItem | ContractEventItem;
  componentId: number;
  metadata?: any; // Additional metadata for the node
};

export default function Home() {
  const [functions, setFunctions] = useState<ContractFunctionItem[]>([]);
  const [storage, setStorage] = useState<ContractStorageItem[]>([]);
  const [events, setEvents] = useState<ContractEventItem[]>([]);
  const [nodes, setNodes] = useState<BuilderNode[]>([]);
  const addNode = (node: BuilderNode) => {
    setNodes([...nodes, node]);
  }
  useEffect(() => {
    // TODO: Load initial contract configuration from a server or local storage
    const newFunctions: ContractFunctionItem[] = [];
    // Example initial data
    newFunctions.push({
      entrypoint: 'constructor',
      description: 'Contract constructor',
      parameters: [],
      returns: []
    });
    setFunctions(newFunctions);
    setStorage([
      { name: 'owner', type: { name: 'address' }, description: 'Owner of the contract' },
    ]);
    setEvents([
      {
        name: 'ContractCreated',
        description: 'Event emitted when the contract is created',
        keys: [],
        data: [{ name: 'owner', type: { name: 'address' } }],
      },
    ]);
    setNodes([
      { id: 1, position: { x: 100, y: 100 }, type: 'function', componentId: 0 },
    ]);
  }, []);

  const [selectedType, setSelectedType] = useState<'function' | 'storage' | 'event' | null>(null);
  const [selectedComponent, setSelectedItem] = useState<ContractFunctionItem | ContractStorageItem | ContractEventItem | null>(null);
  const selectComponent = (type: 'function' | 'storage' | 'event', item: ContractFunctionItem | ContractStorageItem | ContractEventItem) => {
    setSelectedType(type);
    setSelectedItem(item);
  };

  const addFunctionParameter = (param: { name: string; type: ContractType }) => {
    if (selectedType === 'function' && selectedComponent) {
      const updatedFunctions = functions.map(func => {
        if (func.entrypoint === (selectedComponent as ContractFunctionItem).entrypoint) {
          return {
            ...func,
            parameters: [...func.parameters, param],
          };
        }
        return func;
      });
      setFunctions(updatedFunctions);
      setSelectedItem({
        ...selectedComponent,
        parameters: [...(selectedComponent as ContractFunctionItem).parameters, param],
      });
    }
  };
  const addFunctionReturn = (ret: { name: string; type: ContractType }) => {
    if (selectedType === 'function' && selectedComponent) {
      const updatedFunctions = functions.map(func => {
        if (func.entrypoint === (selectedComponent as ContractFunctionItem).entrypoint) {
          return {
            ...func,
            returns: [...func.returns, ret],
          };
        }
        return func;
      });
      setFunctions(updatedFunctions);
      setSelectedItem({
        ...selectedComponent,
        returns: [...(selectedComponent as ContractFunctionItem).returns, ret],
      });
    }
  }
  const [creatorMenuOpen, setCreatorMenuOpen] = useState(false);
  const [creatorMenuPosition, setCreatorMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCreatorMenuPosition({ x: e.clientX, y: e.clientY });
    setCreatorMenuOpen(true);
  };
  return (
    <div
      className="flex flex-col items-center min-h-screen relative"
      style={{
        backgroundImage: 'url(/background/chalk-grid.png)',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
      }}
      onContextMenu={handleRightClick}
      onClick={() => {
        if (creatorMenuOpen) {
          setCreatorMenuOpen(false);
        }
      }}
    >
      <BuilderView functions={functions} storage={storage} events={events} nodes={nodes} />
      {creatorMenuOpen && (
        <BuilderRHBMenu position={creatorMenuPosition} functions={functions} storage={storage} events={events} addNode={addNode}
          closeMenu={() => setCreatorMenuOpen(false)} />
      )}
      <div className="absolute right-0 top-0 z-10 m-2 h-full w-100 flex flex-col items-center gap-2">
        <div className="h-[calc(50%-var(--spacing)*3)] w-full p-1 overflow-scroll rounded-md border-2 border-[#ffffff30] bg-[#ffffff20]">
          <ContractBuilder selectComponent={selectComponent} selectedComponent={selectedComponent} selectedType={selectedType}
            functions={functions}
            storage={storage}
            events={events}
            setFunctions={setFunctions}
            setStorage={setStorage}
            setEvents={setEvents}
          />
        </div>
        <div className="h-[calc(50%-var(--spacing)*3)] w-full p-1 overflow-scroll rounded-md border-2 border-[#ffffff30] bg-[#ffffff20]">
          <ContractBuilderDetails type={selectedType} selectedComponent={selectedComponent} addFunctionParameter={addFunctionParameter}
            addFunctionReturn={addFunctionReturn} />
        </div>
      </div>
    </div>
  );
}

export const BuilderRHBMenu = (props: {
  position: { x: number; y: number };
  functions: ContractFunctionItem[];
  storage: ContractStorageItem[];
  events: ContractEventItem[];
  addNode: (node: BuilderNode) => void;
  closeMenu: () => void;
}) => {
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
            <RHBMenuFunctions functions={props.functions} onSelect={(func) => {
              // Handle function selection
              setSelectedTab(null);
              props.addNode({
                id: Date.now(), // Unique ID based on timestamp
                position: props.position,
                type: 'function',
                componentId: props.functions.indexOf(func), // Use index as component ID
              });
              props.closeMenu();
            }} />
          )}
          {selectedTab === 'Storage' && (
            <RHBMenuStorage
              storage={props.storage}
              onSelect={(operation, item) => {
                // Handle storage selection
                setSelectedTab(null);
                props.addNode({
                  id: Date.now(), // Unique ID based on timestamp
                  position: props.position,
                  type: 'storage',
                  componentId: props.storage.indexOf(item), // Use index as component ID
                  metadata: { operation },
                });
                props.closeMenu();
            }} />
          )}
          {selectedTab === 'Events' && (
            <RHBMenuEvents
              events={props.events}
              onSelect={(operation, event) => {
                // Handle event selection
                setSelectedTab(null);
                props.addNode({
                  id: Date.now(), // Unique ID based on timestamp
                  position: props.position,
                  type: 'event',
                  componentId: props.events.indexOf(event), // Use index as component ID
                  metadata: { operation },
                });
                props.closeMenu();
            }} />
          )}
          {selectedTab === 'Starknet' && (
            <RHBMenuStarknet
              onSelect={(operation, nodeComponent) => {
                // Handle Starknet selection
                setSelectedTab(null);
                props.addNode({
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
            <RHBMenuUtilities
              onSelect={(operation) => {
                // Handle Utilities selection
                setSelectedTab(null);
                props.addNode({
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
}

export const RHBMenuFunctions = (props: {
  functions: ContractFunctionItem[];
  onSelect: (func: ContractFunctionItem) => void;
}) => {
  return (
    <div className="flex flex-col">
      {props.functions.map((func, index) => (
        <button
          key={index}
          className="flex flex-row items-center gap-1 px-1 py-1 hover:bg-[#ffffff30] rounded-md"
          onClick={() => props.onSelect(func)}
        >
          <span className="text-sm">{func.entrypoint}</span>
          <span className="text-xs text-gray-400 truncate ml-1">{func.description || ''}</span>
        </button>
      ))}
    </div>
  );
}

export const RHBMenuStorage = (props: {
  storage: ContractStorageItem[];
  onSelect: (operation: 'Read' | 'Write', item: ContractStorageItem) => void;
}) => {
  const subTabs = [
    { name: 'Read' },
    { name: 'Write' },
  ];
  const [selectedSubTab, setSelectedSubTab] = useState<'Read' | 'Write' | null>(null);
  const [selectedStorageItem, setSelectedStorageItem] = useState<ContractStorageItem | null>(null);
  return (
    <div className="flex flex-col">
      {selectedStorageItem === null && props.storage.map((item, index) => (
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

export const RHBMenuEvents = (props: {
  events: ContractEventItem[];
  onSelect: (operation: 'Emit' | 'Listen', item: ContractEventItem) => void;
}) => {
  const subTabs = [
    { name: 'Emit' },
    { name: 'Listen' },
  ];
  const [selectedSubTab, setSelectedSubTab] = useState<'Emit' | 'Listen' | null>(null);
  const [selectedEventItem, setSelectedEventItem] = useState<ContractEventItem | null>(null);
  return (
    <div className="flex flex-col">
      {selectedEventItem === null && props.events.map((event, index) => (
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

export const RHBMenuStarknet = (props: {
  onSelect: (operation: 'Caller' | 'Sender' | 'Block Number' | 'Block Hash' | 'Timestamp',
             nodeComponent: { name: string; description: string }) => void;
}) => {
  const starknetNodes = [
    { name: "Caller", description: "Contract caller address", type: "address" },
    { name: "Sender", description: "Transaction sender address", type: "address" },
    { name: "Block Number", description: "Current block number", type: "uint256" },
    { name: "Block Hash", description: "Current block hash", type: "felt" },
    { name: "Timestamp", description: "Current block timestamp", type: "uint256" },
  ];
  return (
    <div className="flex flex-col">
      {starknetNodes.map((node, index) => (
        <button
          key={index}
          className="flex flex-row items-center gap-1 px-1 py-1 hover:bg-[#ffffff30] rounded-md"
          onClick={() => props.onSelect(node.name as any, { name: node.name, description: node.description || '' })}
        >
          <span className="text-sm">{node.name}</span>
          <span className="text-xs text-gray-400 truncate ml-1">{node.description || ''}</span>
        </button>
      ))}
    </div>
  );
}

// TODO: subtabs for Assert, Math, String, Array, Date, ...
// These are the things I imagine we will have:
//   Constant: true, false, null, 0, type, ...
//   Assert: assertEqual, assertNotEqual, assertTrue, assertFalse
//   Math: add, subtract, multiply, divide, mod, div rem, sqrt, pow, distance, ...
//   String: concat, split, substring, length, toUpperCase/Lower, trim, replace, filter, ...
//   Array: push, pop, shift, unshift, slice, splice, map, filter, reduce, find, includes, ...
//   Date: now, today, xDays, xWeeks, x<...>, formattedDate, ...
export const RHBMenuUtilities = (props: {
  onSelect: (operation: 'Assert' | 'Math' | 'String' | 'Array' | 'Date') => void;
}) => {
  const utilityNodes = [
    { name: "Constant", description: "Constant values" },
    { name: "Assert", description: "Assertions for failures" },
    { name: "Math", description: "Mathematical operations" },
    { name: "String", description: "String manipulation" },
    { name: "Array", description: "Array operations" },
    { name: "Date", description: "Date and time operations" },
  ];
  return (
    <div className="flex flex-col">
      {utilityNodes.map((node, index) => (
        <button
          key={index}
          className="flex flex-row items-center gap-1 px-1 py-1 hover:bg-[#ffffff30] rounded-md"
          onClick={() => props.onSelect(node.name as any)}
        >
          <span className="text-sm">{node.name}</span>
          <span className="text-xs text-gray-400 truncate ml-1">{node.description || ''}</span>
        </button>
      ))}
    </div>
  );
}

export type ContractType = {
  name: string;
}

export const getTypeColor = (typeName: string): string => {
  switch (typeName) {
    case 'address':
      return '#ffcc00';
    case 'uint256':
      return '#00ccff';
    case 'bool':
      return '#ff00cc';
    case 'string':
      return '#ccff00';
    default:
      return '#ffffff30'; // Default color for unknown types
  }
}

export type ContractParameter = {
  name: string;
  type: ContractType;
  description?: string;
}

export type ContractFunctionItem = {
  entrypoint: string;
  description?: string;
  parameters: ContractParameter[];
  returns: ContractParameter[];
  // TODO: Defaults
}

export type ContractStorageItem = {
  name: string;
  type: ContractType;
  description?: string;
  // TODO: Defaults
}

export type ContractEventItem = {
  name: string;
  description?: string;
  keys: { name: string; type: ContractType }[];
  data: { name: string; type: ContractType }[];
}

export type ContractBuilderConfig = {
  functions: ContractFunctionItem[];
  storage: ContractStorageItem[];
  events: ContractEventItem[];
}

export const ContractBuilder = (props: {
  selectComponent: (type: 'function' | 'storage' | 'event', item: ContractFunctionItem | ContractStorageItem | ContractEventItem) => void;
  selectedComponent: ContractFunctionItem | ContractStorageItem | ContractEventItem | null;
  selectedType: 'function' | 'storage' | 'event' | null;
  functions: ContractFunctionItem[];
  storage: ContractStorageItem[];
  events: ContractEventItem[];
  setFunctions: (functions: ContractFunctionItem[]) => void;
  setStorage: (storage: ContractStorageItem[]) => void;
  setEvents: (events: ContractEventItem[]) => void;
}) => {
  const [functionsOpen, setFunctionsOpen] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h2 className="text-lg w-full font-bold">Contract Builder</h2>
      <div className="flex flex-row items-center justify-between w-full bg-[#ffffff20] rounded-md">
        <div className="flex flex-row items-center">
          <button
            className="mx-2"
            onClick={() => setFunctionsOpen(!functionsOpen)}
          >
            <Image
              src={`/icons/${functionsOpen ? "down-arrow" : "right-arrow"}.png`}
              alt="Functions Expand"
              width={12}
              height={12}
            />
          </button>
          <h3 className="text-lg font-semibold">Functions</h3>
        </div>
        <button
          className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md m-1"
          onClick={() => {
            let newEntrypoint = `newFunction${props.functions.length + 1}`;
            // Ensure the new entrypoint is unique
            while (props.functions.some(func => func.entrypoint === newEntrypoint)) {
              newEntrypoint = `${newEntrypoint}_${props.functions.length + 1}`;
            }
            props.setFunctions([...props.functions, {
              entrypoint: newEntrypoint,
              description: `${newEntrypoint} description`,
              parameters: [],
              returns: [],
            }]);
            setFunctionsOpen(true);
          }}
        >
          <Image
            src="/icons/add.png"
            alt="Add Function"
            width={12}
            height={12}
          />
        </button>
      </div>
      <div className="w-full">
        {functionsOpen && props.functions.map((func, index) => (
          <div
            key={index}
            className="flex flex-row px-2 py-1 justify-between rounded-md"
            style={{
              backgroundColor:
                props.selectedType === 'function' &&
                (props.selectedComponent as ContractFunctionItem)?.entrypoint === func.entrypoint
              ? '#ffffff30' : 'transparent'
            }}
          >
            <div className="flex flex-row items-center" onClick={() => props.selectComponent('function', func)}>
              <Image
                src="/icons/function.png"
                alt="Function Icon"
                width={14}
                height={14}
                className="mr-1"
              />
              <h4 className="font-semibold">{func.entrypoint}</h4>
            </div>
            <p className="text-sm text-gray-400 w-1/2 truncate text-right">{func.description}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center justify-between w-full bg-[#ffffff20] rounded-md mt-2">
        <div className="flex flex-row items-center">
          <button
            className="mx-2"
            onClick={() => setStorageOpen(!storageOpen)}
          >
            <Image
              src={`/icons/${storageOpen ? "down-arrow" : "right-arrow"}.png`}
              alt="Storage Expand"
              width={12}
              height={12}
            />
          </button>
          <h3 className="text-lg font-semibold">Storage</h3>
        </div>
        <button
          className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md m-1"
          onClick={() => {
            let newStorageName = `newStorage${props.storage.length + 1}`;
            // Ensure the new storage name is unique
            while (props.storage.some(item => item.name === newStorageName)) {
              newStorageName = `${newStorageName}_${props.storage.length + 1}`;
            }
            props.setStorage([...props.storage, {
              name: newStorageName,
              type: { name: 'uint256' },
              description: `${newStorageName} description`,
            }]);
            setStorageOpen(true);
          }}
        >
          <Image
            src="/icons/add.png"
            alt="Add Storage"
            width={12}
            height={12}
          />
        </button>
      </div>
      <div className="w-full">
        {storageOpen && props.storage.map((item, index) => (
          <div
            key={index}
            className="flex flex-row px-2 py-1 justify-between rounded-md"
            style={{
              backgroundColor:
                props.selectedType === 'storage' &&
                (props.selectedComponent as ContractStorageItem)?.name === item.name
              ? '#ffffff30' : 'transparent'
            }}
          >
            <div className="flex flex-row items-center" onClick={() => props.selectComponent('storage', item)}>
              <Image
                src="/icons/variable.png"
                alt="Storage Icon"
                width={14}
                height={14}
                className="mr-1"
              />
              <h4 className="font-semibold">{item.name}</h4>
              <div
                className="w-4 h-2 rounded-md ml-2 border-1 border-[#ffffff30]"
                style={{ backgroundColor: getTypeColor(item.type.name) }}
              />
              <p className="text-xs ml-1 truncate">{item.type.name}</p>
            </div>
            <p className="text-sm text-gray-400 w-1/2 truncate text-right">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center justify-between w-full bg-[#ffffff20] rounded-md mt-2">
        <div className="flex flex-row items-center">
          <button
            className="mx-2"
            onClick={() => setEventsOpen(!eventsOpen)}
          >
            <Image
              src={`/icons/${eventsOpen ? "down-arrow" : "right-arrow"}.png`}
              alt="Events Expand"
              width={12}
              height={12}
            />
          </button>
          <h3 className="text-lg font-semibold">Events</h3>
        </div>
        <button
          className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md m-1"
          onClick={() => {
            let newEventName = `newEvent${props.events.length + 1}`;
            // Ensure the new event name is unique
            while (props.events.some(event => event.name === newEventName)) {
              newEventName = `${newEventName}_${props.events.length + 1}`;
            }
            props.setEvents([...props.events, {
              name: newEventName,
              description: `${newEventName} description`,
              keys: [],
              data: [],
            }]);
            setEventsOpen(true);
          }}
        >
          <Image
            src="/icons/add.png"
            alt="Add Event"
            width={12}
            height={12}
          />
        </button>
      </div>
      <div className="w-full">
        {eventsOpen && props.events.map((event, index) => (
          <div
            key={index}
            className="flex flex-row px-2 py-1 justify-between rounded-md"
            style={{
              backgroundColor:
                props.selectedType === 'event' &&
                (props.selectedComponent as ContractEventItem)?.name === event.name
              ? '#ffffff30' : 'transparent'
            }}
          >
            <div className="flex flex-row items-center" onClick={() => props.selectComponent('event', event)}>
              <Image
                src="/icons/notify.png"
                alt="Event Icon"
                width={14}
                height={14}
                className="mr-1"
              />
              <h4 className="font-semibold">{event.name}</h4>
            </div>
            <p className="text-sm text-gray-400 w-1/2 truncate text-right">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export type ContractBuilderDetailsProps = {
  type: 'function' | 'storage' | 'event' | null;
  selectedComponent: ContractFunctionItem | ContractStorageItem | ContractEventItem | null;
  addFunctionParameter: (param: { name: string; type: ContractType }) => void;
  addFunctionReturn: (ret: { name: string; type: ContractType }) => void;
}

export const ContractBuilderDetails = (props: ContractBuilderDetailsProps) => {
  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-auto">
      <h2 className="text-lg w-full font-bold mb-2">Component Details</h2>
      {props.selectedComponent ? (
        props.type === 'function' ? (
          <ContractFunctionDetails functionItem={props.selectedComponent as ContractFunctionItem}
            addFunctionParameter={props.addFunctionParameter}
            addFunctionReturn={props.addFunctionReturn}
          />
        ) : props.type === 'storage' ? (
          <ContractStorageDetails storageItem={props.selectedComponent as ContractStorageItem} />
        ) : (
          <ContractEventDetails eventItem={props.selectedComponent as ContractEventItem} />
        )
      ) : (
        <p className="text-sm text-gray-400 py-4">Select a component to see details</p>
      )}
    </div>
  );
};

export const ContractFunctionDetails = (props: { functionItem: ContractFunctionItem, addFunctionParameter: (param: { name: string; type: ContractType }) => void,
  addFunctionReturn: (ret: { name: string; type: ContractType }) => void }) => {
  // TODO: No outputs on constructor
  const [parametersOpen, setParametersOpen] = useState(false);
  const [returnsOpen, setReturnsOpen] = useState(false);
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row items-center">
        <Image
          src="/icons/function.png"
          alt="Function Icon"
          width={24}
          height={24}
          className="mr-1"
        />
        <h3 className="text-xl font-semibold">{props.functionItem.entrypoint}</h3>
      </div>
      <p className="text-sm text-gray-400">{props.functionItem.description}</p>
      <div className="w-full mt-2">
        <div className="flex flex-row items-center justify-between bg-[#ffffff20] rounded-md p-2">
          <div className="flex flex-row items-center">
            <button
              className="flex flex-row items-center"
              onClick={() => setParametersOpen(!parametersOpen)}
            >
              <Image
                src={`/icons/${parametersOpen ? "down-arrow" : "right-arrow"}.png`}
                alt="Parameters Expand"
                width={12}
                height={12}
                className="mr-1"
              />
            </button>
            <h4 className="font-semibold">Inputs</h4>
          </div>
          <button
            className="p-1 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md"
            onClick={() => {
              let newParamName = `param${props.functionItem.parameters.length + 1}`;
              // Ensure the new parameter name is unique
              while (props.functionItem.parameters.some(param => param.name === newParamName)) {
                newParamName = `${newParamName}_${props.functionItem.parameters.length + 1}`;
              }
              props.addFunctionParameter({
                name: newParamName,
                type: { name: 'uint256' }, // Default type, can be changed later
              });
              setParametersOpen(true);
            }}
          >
            <Image
              src="/icons/add.png"
              alt="Add Parameter"
              width={12}
              height={12}
            />
          </button>
        </div>
        {parametersOpen && (
          <div className="mt-2 px-2">
            {props.functionItem.parameters.length > 0 ? (
              props.functionItem.parameters.map((param, index) => (
                <div key={index} className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center">
                    <Image
                      src="/icons/variable.png"
                      alt="Parameter Icon"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    <span className="font-semibold">{param.name}</span>
                    <div className="w-4 h-2 rounded-md ml-1 border-1 border-[#ffffff30]"
                      style={{ backgroundColor: getTypeColor(param.type.name) }}
                    />
                    <span className="ml-1 text-sm text-gray-400">{param.type.name}</span>
                  </div>
                  <p className="text-sm text-gray-400 w-1/2 truncate text-right">{param.description || 'No description'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No parameters defined</p>
            )}
          </div>
        )}
        <div className="flex flex-row items-center justify-between bg-[#ffffff20] rounded-md p-2 mt-2">
          <div className="flex flex-row items-center">
            <button
              className="flex flex-row items-center"
              onClick={() => setReturnsOpen(!returnsOpen)}
            >
              <Image
                src={`/icons/${returnsOpen ? "down-arrow" : "right-arrow"}.png`}
                alt="Returns Expand"
                width={12}
                height={12}
                className="mr-1"
              />
            </button>
            <h4 className="font-semibold">Outputs</h4>
          </div>
          <button
            className="p-1 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md"
            onClick={() => {
              let newReturnName = `return${props.functionItem.returns.length + 1}`;
              // Ensure the new return name is unique
              while (props.functionItem.returns.some(ret => ret.name === newReturnName)) {
                newReturnName = `${newReturnName}_${props.functionItem.returns.length + 1}`;
              }
              props.addFunctionReturn({
                name: newReturnName,
                type: { name: 'uint256' }, // Default type, can be changed later
              });
              setReturnsOpen(true);
            }}
          >
            <Image
              src="/icons/add.png"
              alt="Add Return"
              width={12}
              height={12}
            />
          </button>
        </div>
        {returnsOpen && (
          <div className="mt-2 px-2">
            {props.functionItem.returns.length > 0 ? (
              props.functionItem.returns.map((ret, index) => (
                <div key={index} className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center">
                    <Image
                      src="/icons/variable.png"
                      alt="Return Icon"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    <span className="font-semibold">{ret.name}</span>
                    <div className="w-4 h-2 rounded-md ml-1 border-1 border-[#ffffff30]"
                      style={{ backgroundColor: getTypeColor(ret.type.name) }}
                    />
                    <span className="ml-1 text-sm text-gray-400">{ret.type.name}</span>
                  </div>
                  <p className="text-sm text-gray-400 w-1/2 truncate text-right">{ret.description || 'No description'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No outputs defined</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const ContractStorageDetails = (props: { storageItem: ContractStorageItem }) => {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <h3 className="text-lg font-semibold">{props.storageItem.name}</h3>
      <p className="text-sm text-gray-400">{props.storageItem.description}</p>
      <div className="mt-2">
        <span className="font-semibold">Type:</span>
        <span className="ml-1">{props.storageItem.type.name}</span>
      </div>
    </div>
  );
}

export const ContractEventDetails = (props: { eventItem: ContractEventItem }) => {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <h3 className="text-lg font-semibold">{props.eventItem.name}</h3>
      <p className="text-sm text-gray-400">{props.eventItem.description}</p>
      <div className="mt-2">
        <h4 className="font-semibold">Keys:</h4>
        {props.eventItem.keys.map((key, index) => (
          <div key={index} className="flex flex-row items-center">
            <span className="font-semibold">{key.name}:</span>
            <span className="ml-1">{key.type.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <h4 className="font-semibold">Data:</h4>
        {props.eventItem.data.map((data, index) => (
          <div key={index} className="flex flex-row items-center">
            <span className="font-semibold">{data.name}:</span>
            <span className="ml-1">{data.type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const BuilderView = (props: {
  functions: ContractFunctionItem[];
  storage: ContractStorageItem[];
  events: ContractEventItem[];
  nodes: BuilderNode[];
}) => {
  const [nodeCreationModeConfig, setNodeCreationModeConfig] = useState({
    enabled: false,
    position: { x: 0, y: 0 },
  });

  return (
    <div
      className="relative w-full h-full"
      onContextMenu={(e) => {
        e.preventDefault();
        setNodeCreationModeConfig({
          enabled: true,
          position: { x: e.clientX, y: e.clientY },
        });
      }}
      onClick={() => {
        if (nodeCreationModeConfig.enabled) {
          setNodeCreationModeConfig({ ...nodeCreationModeConfig, enabled: false });
        }
      }}
    >
      {props.nodes.map((node, index) => (
        <BuilderNodeView key={index} node={node} nodeComponent={
          node.type === 'function' ? props.functions[node.componentId] :
          node.type === 'storage' ? props.storage[node.componentId] :
          props.events[node.componentId]
        } />
      ))}
      {nodeCreationModeConfig.enabled && (
        <div
          className="absolute"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing the creation view
          style={{
            left: nodeCreationModeConfig.position.x,
            top: nodeCreationModeConfig.position.y,
          }}
        >
          <NodeCreationView />
        </div>
      )}
    </div>
  );
}

export const NodeCreationView = () => {
  const [nodeCreationType, setNodeCreationType] = useState<'start' | 'action' | 'decision' | null>(null);
  return (
    <div className="flex flex-col bg-[#ffffff20] border-2 border-[#ffffff30] rounded-md">
      <h2 className="text-center p-2">Create Node</h2>
      {nodeCreationType === null ? (
        <div className="flex flex-col items-center p-4 space-y-2">
          <button
            className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md"
            onClick={() => setNodeCreationType('start')}
          >
            Start Node
          </button>
          <button
            className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md"
            onClick={() => setNodeCreationType('action')}
          >
            Action Node
          </button>
          <button
            className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md"
            onClick={() => setNodeCreationType('decision')}
          >
            Decision Node
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center p-4">
          <h3 className="mb-2">Creating {nodeCreationType} node...</h3>
          <button
            className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md"
            onClick={() => setNodeCreationType(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export const BuilderNodeView = (props: { node: BuilderNode, nodeComponent: ContractFunctionItem | ContractStorageItem | ContractEventItem }) => {
  const [dragging, setDragging] = useState(false);
  const [viewNode, setViewNode] = useState<BuilderNode | null>(null);
  useEffect(() => {
    if (props.node) {
      setViewNode(props.node);
    }
  }, [props.node]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(false);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && viewNode) {
      setViewNode({
        ...viewNode,
        position: {
          x: e.clientX - 8,
          y: e.clientY - 8, // Adjust for the icon size
        },
      });
    }
  };
  // Issue: If i move the mouse too fast, handleMouseMove is no longer called
  const throttledHandleMouseMove = (e: React.MouseEvent) => {
    if (dragging && viewNode) {
      requestAnimationFrame(() => {
        setViewNode({
          ...viewNode,
          position: {
            x: e.clientX - 10,
            y: e.clientY - 10, // Adjust for the icon size
          },
        });
      });
    }
  }
  // Handle case where mouse outside the node while dragging
  useEffect(() => {
    const handleMouseUpOutside = () => {
      if (dragging) {
        setDragging(false);
      }
    };
    const handleMouseMoveOutside = (e: MouseEvent) => {
      const nodeWidth = nodeRef.current?.offsetWidth || 0;
      if (dragging && viewNode) {
        setViewNode({
          ...viewNode,
          position: {
            x: e.clientX - nodeWidth + 10, // Center the node on the cursor
            y: e.clientY - 10, // Adjust for the icon size
          },
        });
      }
    };
    document.addEventListener('mouseup', handleMouseUpOutside);
    document.addEventListener('mousemove', handleMouseMoveOutside);
    return () => {
      document.removeEventListener('mouseup', handleMouseUpOutside);
      document.removeEventListener('mousemove', handleMouseMoveOutside);
    };
  }, [dragging]);
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={nodeRef}
      className="flex flex-col bg-[#ffffff20] border-2 border-[#ffffff30] rounded-md absolute"
      style={{ left: viewNode?.position.x, top: viewNode?.position.y }}
    >
      {viewNode?.type === 'function' && <FunctionNodeView func={props.nodeComponent as ContractFunctionItem} />}
      {viewNode?.type === 'storage' && viewNode?.metadata?.operation === 'Read' &&

        <StorageReadNodeView storage={props.nodeComponent as ContractStorageItem} />
      }
      {viewNode?.type === 'storage' && viewNode?.metadata?.operation === 'Write' && <StorageWriteNodeView storage={props.nodeComponent as ContractStorageItem} />}
      {viewNode?.type === 'event' && viewNode?.metadata?.operation === 'Emit' && (
        <EventEmitNodeView event={props.nodeComponent as ContractEventItem} />
      )}
      {viewNode?.type === 'event' && viewNode?.metadata?.operation === 'Listen' && (
        <EventListenNodeView event={props.nodeComponent as ContractEventItem} />
      )}
      {viewNode?.type === 'starknet' && (
        <StarknetNodeView node={viewNode} />
      )}

      <div className="absolute top-0 right-0 p-[1px]">
        <div
          className="cursor-grab"
          onMouseDown={handleMouseDown}
        >
          <Image
            src="/icons/move.png"
            alt="Edit Node"
            width={20}
            height={20}
            className="pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}

export const FunctionNodeView = (props: { func: ContractFunctionItem }) => {
  return (
    <div className="flex flex-col bg-[#30f73060] rounded-sm p-1 w-48">
      <div className="flex flex-row items-center">
        <Image
          src="/icons/function.png"
          alt="Function Icon"
          width={16}
          height={16}
          className="inline mr-1"
        />
        <h2 className="font-semibold text-lg">{props.func?.entrypoint}</h2>
      </div>
      <p className="text-xs text-gray-300">{props.func?.description}</p>
      <div className="mt-2 flex flex-row">
        <div className="flex flex-col w-1/2">
          {props.func?.entrypoint !== 'constructor' ? (
            <div className="">
              <Image
                src="/icons/play.png"
                alt="Execute Icon"
                width={16}
                height={16}
                className="mb-1"
              />
            </div>
          ) : (
            <div className="flex flex-row items-center justify-start">
              <Image
                src="/icons/constructor.png"
                alt="Constructor Icon"
                width={16}
                height={16}
                className="mb-1"
              />
            </div>
          )}
          {props.func?.parameters.length > 0 && (
            <>
            <h3 className="font-semibold text-sm">Inputs</h3>
            {props.func?.parameters.map((param, index) => (
              <div key={index} className="flex flex-row items-center justify-start mt-1">
                <div className="w-4 h-4 rounded-full ml-1 border-2 border-[#ffffff60]"
                  style={{ backgroundColor: getTypeColor(param.type.name) }}
                />
                <span className="italic text-sm truncate ml-1">{param.name}</span>
              </div>
            ))}
            </>
          )}
        </div>
        <div className="flex flex-col w-1/2">
          <div className="flex flex-row items-center justify-end">
            <Image
              src="/icons/play.png"
              alt="Return Icon"
              width={16}
              height={16}
              className="mb-1"
            />
          </div>
          {props.func?.returns.length > 0 && (
            <>
            <h3 className="font-semibold text-sm text-right">Outputs</h3>
            {props.func?.returns.map((ret, index) => (
              <div key={index} className="flex flex-row justify-end items-center mt-1">
                <span className="italic text-sm truncate">{ret.name}</span>
                <div className="w-4 h-4 rounded-full ml-1 border-2 border-[#ffffff60]"
                  style={{ backgroundColor: getTypeColor(ret.type.name) }}
                />
              </div>
            ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const StorageReadNodeView = (props: { storage: ContractStorageItem }) => {
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
        <h2 className="font-semibold text-lg">Get {props.storage?.name}</h2>
      </div>
      <p className="text-xs text-gray-300">{props.storage?.description}</p>
      <div className="mt-1">
        <div className="flex flex-row items-center justify-end">
          <span className="italic text-sm truncate">{props.storage.type.name}</span>
          <div className="w-4 h-4 rounded-full ml-1 border-2 border-[#ffffff60]"
            style={{ backgroundColor: getTypeColor(props.storage.type.name) }}
          />
        </div>
      </div>
    </div>
  );
}

export const StorageWriteNodeView = (props: { storage: ContractStorageItem }) => {
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
        <h2 className="font-semibold text-lg">Set {props.storage?.name}</h2>
      </div>
      <p className="text-xs text-gray-300">{props.storage?.description}</p>
      <div className="mt-2">
        <div className="flex flex-row items-center justify-between">
          <Image
            src="/icons/play.png"
            alt="Execute Icon"
            width={16}
            height={16}
            className="mb-1"
          />
          <Image
            src="/icons/play.png"
            alt="Execute Icon"
            width={16}
            height={16}
            className="mb-1"
          />
        </div>
        <div className="flex flex-row items-center mt-1">
          <div className="w-4 h-4 rounded-full mr-1 border-2 border-[#ffffff60]"
            style={{ backgroundColor: getTypeColor(props.storage.type.name) }}
          />
          <span className="italic text-sm truncate">{props.storage.type.name}</span>
        </div>
      </div>
    </div>
  );
}

export const EventEmitNodeView = (props: { event: ContractEventItem }) => {
  return (
    <div className="flex flex-col bg-[#f730f760] rounded-sm p-1 w-60">
      <div className="flex flex-row items-center">
        <Image
          src="/icons/notify.png"
          alt="Event Icon"
          width={16}
          height={16}
          className="inline mr-1"
        />
        <h2 className="font-semibold text-md">Emit {props.event?.name}</h2>
      </div>
      <p className="text-xs text-gray-300">{props.event?.description}</p>
      <div className="mt-2">
        <div className="flex flex-row items-center justify-between">
          <Image
            src="/icons/play.png"
            alt="Execute Icon"
            width={16}
            height={16}
            className="mb-1"
          />
          <Image
            src="/icons/play.png"
            alt="Execute Icon"
            width={16}
            height={16}
            className="mb-1"
          />
        </div>
        {props.event?.keys.map((key, index) => (
          <div key={index} className="flex flex-row items-center mt-1">
            <div className="w-4 h-4 rounded-full mr-1 border-2 border-[#ffffff60]"
              style={{ backgroundColor: getTypeColor(key.type.name) }}
            />
            <span className="italic text-sm truncate">{key.name}</span>
          </div>
        ))}
        {props.event?.data.map((data, index) => (
          <div key={index} className="flex flex-row items-center mt-1">
            <div className="w-4 h-4 rounded-full mr-1 border-2 border-[#ffffff60]"
              style={{ backgroundColor: getTypeColor(data.type.name) }}
            />
            <span className="italic text-sm truncate">{data.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const EventListenNodeView = (props: { event: ContractEventItem }) => {
  return (
    <div className="flex flex-col bg-[#f730f760] rounded-sm p-1 w-60">
      <div className="flex flex-row items-center">
        <Image
          src="/icons/notify.png"
          alt="Event Icon"
          width={16}
          height={16}
          className="inline mr-1"
        />
        <h2 className="font-semibold text-md">On {props.event?.name}</h2>
      </div>
      <p className="text-xs text-gray-300">{props.event?.description}</p>
      <div className="mt-2">
        <div className="flex flex-row items-center justify-end">
          <Image
            src="/icons/play.png"
            alt="Execute Icon"
            width={16}
            height={16}
            className="mb-1"
          />
        </div>
        {props.event?.keys.map((key, index) => (
          <div key={index} className="flex flex-row items-center mt-1 justify-end w-full">
            <span className="italic text-sm truncate">{key.name}</span>
            <div className="w-4 h-4 rounded-full ml-1 border-2 border-[#ffffff60]"
              style={{ backgroundColor: getTypeColor(key.type.name) }}
            />
          </div>
        ))}
        {props.event?.data.map((data, index) => (
          <div key={index} className="flex flex-row items-center mt-1 justify-end w-full">
            <span className="italic text-sm truncate">{data.name}</span>
            <div className="w-4 h-4 rounded-full ml-1 border-2 border-[#ffffff60]"
              style={{ backgroundColor: getTypeColor(data.type.name) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const StarknetNodeView = (props: { node: BuilderNode }) => {
  return (
    <div className="flex flex-col bg-[#f7f73060] rounded-sm p-1 w-48">
      <div className="flex flex-row items-center">
        <Image
          src="/icons/variable.png"
          alt="Starknet Icon"
          width={16}
          height={16}
          className="inline mr-1"
        />
        <h2 className="font-semibold text-lg">{props.node.metadata?.operation || 'Starknet Node'}</h2>
      </div>
      <p className="text-xs text-gray-300">{props.node.metadata?.nodeComponent.description || 'No description'}</p>
      <div className="mt-2">
        <div className="flex flex-row items-center mt-1 justify-end w-full">
          <span className="italic text-sm truncate">{props.node.metadata?.nodeComponent.name || 'Unnamed Node'}</span>
          <div className="w-4 h-4 rounded-full ml-1 border-2 border-[#ffffff60]"
            style={{ backgroundColor: getTypeColor(props.node.metadata?.nodeComponent.type || 'unknown') }}
          />
        </div>
      </div>
    </div>
  );
}

export const BuilderWindowHeader = () => {
  return (
    <div className="flex flex-row items-center justify-between p-2 w-full">
      <div className="flex items-center space-x-2">
        <button className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md">
          <Image
            src="/icons/blueprint.png"
            alt="Blueprint"
            width={36}
            height={36}
          />
        </button>
        <button className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md">
          <Image
            src="/icons/save.png"
            alt="Save"
            width={36}
            height={36}
          />
        </button>
        <button className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md">
          <Image
            src="/icons/build.png"
            alt="Build"
            width={36}
            height={36}
          />
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md">
          <Image
            src="/icons/play.png"
            alt="Play"
            width={52}
            height={52}
          />
        </button>
      </div>
    </div>
  );
}
