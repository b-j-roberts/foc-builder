import React, { useEffect, useState } from "react";
import Image from "next/image";

import { ContractFunctionItem } from "../types/contract";
import { useContractBuilder } from "../context/ContractBuilder";
import { getTypeColor } from "../utils/contract";

export interface ContractFunctionDetailsProps {
  componentId: number,
}

export const ContractFunctionDetailsView: React.FC<ContractFunctionDetailsProps> = (props) => {
  const { functions, editFunction } = useContractBuilder();
  const [functionItem, setFunctionItem] = useState<ContractFunctionItem | null>(null);
  useEffect(() => {
    if (props.componentId !== null && functions[props.componentId]) {
      setFunctionItem(functions[props.componentId]);
    }
  }, [props.componentId, functions]);

  // TODO: No outputs on constructor
  const [parametersOpen, setParametersOpen] = useState(false);
  const [returnsOpen, setReturnsOpen] = useState(false);

  if (!functionItem) {
    return <div className="text-gray-400">No function selected</div>;
  }

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
        <h3 className="text-xl font-semibold">{functionItem?.entrypoint}</h3>
      </div>
      <p className="text-sm text-gray-400">{functionItem?.description}</p>
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
              let newParamName = `param${functionItem?.parameters.length + 1}`;
              // Ensure the new parameter name is unique
              while (functionItem?.parameters.some(param => param.name === newParamName)) {
                newParamName = `${newParamName}_${functionItem?.parameters.length + 1}`;
              }
              const newParam = {
                name: newParamName,
                type: { name: 'uint256' }, // Default type, can be changed later
              };
              const newFunctionItem = { ...functionItem, parameters: [...functionItem.parameters, newParam] };
              editFunction(props.componentId, newFunctionItem);
              setFunctionItem(newFunctionItem);
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
            {functionItem?.parameters.length > 0 ? (
              functionItem?.parameters.map((param, index) => (
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
              let newReturnName = `return${functionItem?.returns.length + 1}`;
              // Ensure the new return name is unique
              while (functionItem?.returns.some(ret => ret.name === newReturnName)) {
                newReturnName = `${newReturnName}_${functionItem?.returns.length + 1}`;
              }
              const newReturn = {
                name: newReturnName,
                type: { name: 'uint256' }, // Default type, can be changed later
              };
              const newFunctionItem = { ...functionItem, returns: [...functionItem.returns, newReturn] };
              editFunction(props.componentId, newFunctionItem);
              setFunctionItem(newFunctionItem);
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
            {functionItem?.returns.length > 0 ? (
              functionItem?.returns.map((ret, index) => (
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
