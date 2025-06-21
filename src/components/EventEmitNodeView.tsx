import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ContractEventItem } from '../types/contract';
import { useContractBuilder } from '../context/ContractBuilder';
import { getTypeColor } from '../utils/contract';
import { BuilderNodeViewProps } from './BuilderNodeView';

export const EventEmitNodeView: React.FC<BuilderNodeViewProps> = (props) => {
  const { events } = useContractBuilder();
  const [event, setEvent] = useState<ContractEventItem | null>(null);
  useEffect(() => {
    setEvent(events[props.node.componentId] || null);
  }, [props.node.componentId, events]);

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
        <h2 className="font-semibold text-md">Emit {event?.name}</h2>
      </div>
      <p className="text-xs text-gray-300">{event?.description}</p>
      <div className="mt-2">
        <div className="flex flex-row items-center justify-between">
          <Image
            onClick={() => props.finalizeNewExecConnector({
              nodeId: props.node.id,
              connectorId: 0
            })}
            src="/icons/play.png"
            alt="Execute Icon"
            width={16}
            height={16}
            className="mb-1"
          />
          <Image
            onClick={() => props.createNewExecConnector({
              nodeId: props.node.id,
              connectorId: 0
            })}
            src="/icons/play.png"
            alt="Execute Icon"
            width={16}
            height={16}
            className="mb-1"
          />
        </div>
        {event?.keys.map((key, index) => (
          <div key={index} className="flex flex-row items-center mt-1">
            <div className="w-4 h-4 rounded-full mr-1 border-2 border-[#ffffff60]"
              style={{ backgroundColor: getTypeColor(key.type.name) }}
              onClick={() => props.finalizeNewVarConnector({
                nodeId: props.node.id,
                connectorId: index
              })}
            />
            <span className="italic text-sm truncate">{key.name}</span>
          </div>
        ))}
        {event?.data.map((data, index) => (
          <div key={index} className="flex flex-row items-center mt-1">
            <div className="w-4 h-4 rounded-full mr-1 border-2 border-[#ffffff60]"
              style={{ backgroundColor: getTypeColor(data.type.name) }}
              onClick={() => props.finalizeNewVarConnector({
                nodeId: props.node.id,
                connectorId: index + event.keys.length
              })}
            />
            <span className="italic text-sm truncate">{data.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
