import React from 'react';
import Image from 'next/image';
import { getTypeColor } from '../utils/contract';
import { BuilderNodeViewProps } from './BuilderNodeView';

export const StarknetNodeView: React.FC<BuilderNodeViewProps> = (props) => {
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
