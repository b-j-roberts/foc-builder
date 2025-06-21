import React, { useEffect, useState } from "react";

import { ContractEventItem } from "../types/contract";
import { useContractBuilder } from "../context/ContractBuilder";

export interface ContractEventDetailsProps {
  componentId: number,
}

export const ContractEventDetailsView: React.FC<ContractEventDetailsProps> = (props) => {
  const { events, editEvent } = useContractBuilder();
  const [eventItem, setEventItem] = useState<ContractEventItem | null>(null);
  useEffect(() => {
    if (props.componentId !== null && events[props.componentId]) {
      setEventItem(events[props.componentId]);
    }
  }, [props.componentId, events]);

  if (!eventItem) {
    return <div className="text-gray-400">No event selected</div>;
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h3 className="text-lg font-semibold">{eventItem.name}</h3>
      <p className="text-sm text-gray-400">{eventItem.description}</p>
      <div className="mt-2">
        <h4 className="font-semibold">Keys:</h4>
        {eventItem.keys.map((key, index) => (
          <div key={index} className="flex flex-row items-center">
            <span className="font-semibold">{key.name}:</span>
            <span className="ml-1">{key.type.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <h4 className="font-semibold">Data:</h4>
        {eventItem.data.map((data, index) => (
          <div key={index} className="flex flex-row items-center">
            <span className="font-semibold">{data.name}:</span>
            <span className="ml-1">{data.type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
