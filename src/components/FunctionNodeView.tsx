import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ContractFunctionItem } from '../types/contract';
import { useContractBuilder } from '../context/ContractBuilder';
import { getTypeColor } from '../utils/contract';
import { BuilderNodeViewProps } from './BuilderNodeView';

export const FunctionNodeView: React.FC<BuilderNodeViewProps> = (props) => {
  const { functions } = useContractBuilder();
  const [func, setFunc] = useState<ContractFunctionItem | null>(null);
  useEffect(() => {
    setFunc(functions[props.node.componentId] || null);
  }, [props.node.componentId, functions]);

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
        <h2 className="font-semibold text-lg">{func?.entrypoint}</h2>
      </div>
      <p className="text-xs text-gray-300">{func?.description}</p>
      <div className="mt-2 flex flex-row">
        <div className="flex flex-col w-1/2">
          {func?.entrypoint !== 'constructor' ? (
            <div className="">
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
          {func && func?.parameters.length > 0 && (
            <>
            <h3 className="font-semibold text-sm">Inputs</h3>
            {func?.parameters.map((param, index) => (
              <div key={index} className="flex flex-row items-center justify-start mt-1">
                <div className="w-4 h-4 rounded-full ml-1 border-2 border-[#ffffff60]"
                  style={{ backgroundColor: getTypeColor(param.type.name) }}
                  onClick={() => props.finalizeNewVarConnector({
                    nodeId: props.node.id,
                    connectorId: index
                  })}
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
              onClick={() => props.createNewExecConnector({
                nodeId: props.node.id,
                connectorId: 0
              })}
              src="/icons/play.png"
              alt="Return Icon"
              width={16}
              height={16}
              className="mb-1"
            />
          </div>
          {func && func?.returns.length > 0 && (
            <>
            <h3 className="font-semibold text-sm text-right">Outputs</h3>
            {func?.returns.map((ret, index) => (
              <div key={index} className="flex flex-row justify-end items-center mt-1">
                <span className="italic text-sm truncate">{ret.name}</span>
                <div className="w-4 h-4 rounded-full ml-1 border-2 border-[#ffffff60]"
                  style={{ backgroundColor: getTypeColor(ret.type.name) }}
                  onClick={() => props.createNewVarConnector({
                    nodeId: props.node.id,
                    connectorId: index
                  })}
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
