import React, { useState } from 'react';
import Image from 'next/image';

import { useContractBuilder } from '../context/ContractBuilder';
import { ContractFunctionItem, ContractStorageItem, ContractEventItem } from '../types/contract';
import { getTypeColor } from '../utils/contract';

export const ContractComponentsView: React.FC = () => {
  const {
    functions, storage, events,
    addFunction, addStorage, addEvent,
    selectedComponent, selectComponent
  } = useContractBuilder();

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
            let newEntrypoint = `newFunction${functions.length + 1}`;
            // Ensure the new entrypoint is unique
            while (functions.some(func => func.entrypoint === newEntrypoint)) {
              newEntrypoint = `${newEntrypoint}_${functions.length + 1}`;
            }
            addFunction({
              entrypoint: newEntrypoint,
              description: `${newEntrypoint} description`,
              public: true,
              readonly: true,
              parameters: [],
              returns: [],
            });
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
        {functionsOpen && functions.map((func, index) => (
          <div
            key={index}
            className="flex flex-row px-2 py-1 justify-between rounded-md"
            style={{
              backgroundColor:
                selectedComponent?.type === 'function' &&
                selectedComponent.componentId === index
              ? '#ffffff30' : 'transparent'
            }}
          >
            <div className="flex flex-row items-center" onClick={() => selectComponent('function', index)}>
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
            let newStorageName = `newStorage${storage.length + 1}`;
            // Ensure the new storage name is unique
            while (storage.some(item => item.name === newStorageName)) {
              newStorageName = `${newStorageName}_${storage.length + 1}`;
            }
            addStorage({
              name: newStorageName,
              type: { name: 'uint256' }, // Default type, can be changed later
              description: `${newStorageName} description`,
            });
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
        {storageOpen && storage.map((item, index) => (
          <div
            key={index}
            className="flex flex-row px-2 py-1 justify-between rounded-md"
            style={{
              backgroundColor:
                selectedComponent?.type === 'storage' &&
                selectedComponent.componentId === index
              ? '#ffffff30' : 'transparent'
            }}
          >
            <div className="flex flex-row items-center" onClick={() => selectComponent('storage', index)}>
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
            let newEventName = `newEvent${events.length + 1}`;
            // Ensure the new event name is unique
            while (events.some(event => event.name === newEventName)) {
              newEventName = `${newEventName}_${events.length + 1}`;
            }
            addEvent({
              name: newEventName,
              description: `${newEventName} description`,
              keys: [],
              data: [],
            });
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
        {eventsOpen && events.map((event, index) => (
          <div
            key={index}
            className="flex flex-row px-2 py-1 justify-between rounded-md"
            style={{
              backgroundColor:
                selectedComponent?.type === 'event' &&
                selectedComponent.componentId === index
              ? '#ffffff30' : 'transparent'
            }}
          >
            <div className="flex flex-row items-center" onClick={() => selectComponent('event', index)}>
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
