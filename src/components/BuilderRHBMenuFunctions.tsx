import React from 'react';
import { ContractFunctionItem } from '../types/contract';
import { useContractBuilder } from '../context/ContractBuilder';

export const BuilderRHBMenuFunctions = (props: {
  onSelect: (func: ContractFunctionItem) => void;
}) => {
  const { functions } = useContractBuilder();
  return (
    <div className="flex flex-col">
      {functions.map((func, index) => (
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
