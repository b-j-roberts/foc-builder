import React from 'react';

export const BuilderRHBMenuStarknet = (props: {
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
