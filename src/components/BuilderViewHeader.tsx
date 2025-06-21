import React from 'react';
import Image from 'next/image';

import { useContractBuilder } from "../context/ContractBuilder";

export const BuilderViewHeader = () => {
  const { saveContract, assembleContract } = useContractBuilder();
  return (
    <div className="absolute top-0 left-0 right-0 z-[20] 
                    flex items-center justify-start m-2"
    >
      <div className="flex items-center space-x-2">
        <button
          className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md"
          onClick={saveContract}
        >
          <Image
            src="/icons/save.png"
            alt="Save"
            width={36}
            height={36}
          />
        </button>
        <button
          className="p-2 bg-[#ffffff30] border-2 border-[#ffffff30] rounded-md"
          onClick={assembleContract}
        >
          <Image
            src="/icons/build.png"
            alt="Build"
            width={36}
            height={36}
          />
        </button>
      </div>
    </div>
  );
}
