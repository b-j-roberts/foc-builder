import { ContractFunctionItem, ContractStorageItem, ContractEventItem } from '../types/contract';
import { BuilderNode } from '../types/builder';

export const getAssembledContractImports = (
  nodes: BuilderNode[],
  storage: ContractStorageItem[],
  events: ContractEventItem[],
  functions: ContractFunctionItem[]
): string => {
  // TODO: Implement import handling
  return "use starknet::{ContractAddress, get_caller_address};\n";
}

export const getAssembledContractComponents = (): string => {
  // TODO: Implement component handling
  return "";
}

export const getAssembledContractStorage = (storage: ContractStorageItem[]): string => {
  return storage.map(item => {
    return `${item.name}: ${item.type.name}, // ${item.description || ''}`
  }).join('\n');
}

export const getAssembledContractEventTypes = (events: ContractEventItem[]): string => {
  return events.map(event => {
    const keys = event.keys.map(key => `#[key]\n${key.name}: ${key.type.name}`).join(', ');
    const data = event.data.map(data => `${data.name}: ${data.type.name}`).join(', ');
    return `
  #[derive(Drop, starknet::Event)]
  struct ${event.name} {
    ${keys}
    ${data}
  }
    `;
  }).join('\n');
}

export const getAssembledContractEvents = (events: ContractEventItem[]): string => {
  return events.map(event => {
    return `${event.name}: ${event.name}, // ${event.description || ''}`
  }).join('\n');
}

export const getAssembledContractConstructors = (): string => {
  // TODO: Implement constructor handling
  return "";
}

export const getAssembledContractPublicFunctions = (functions: ContractFunctionItem[]): string => {
  return functions.map(func => {
    if (!func.public) {
      return '';
    }

    return `
    fn ${func.entrypoint}(
      ${func.readonly ? 'self: @ContractState,' : 'ref self: ContractState,'}
      ${func.parameters.map(param => `${param.name}: ${param.type.name}`).join(', ')}
    ) -> (${func.returns.length > 0 ? func.returns.map(ret => ret.type.name).join(', ') : ''}) {
      println!("Calling function: {}", "${func.entrypoint}");
    }
    `;
  }).join('\n');
}

export const getAssembledContractPrivateFunctions = (functions: ContractFunctionItem[]) => {
  return functions.map(func => {
    if (func.public) {
      return '';
    }

    return `
    fn ${func.entrypoint}(
      ${func.readonly ? 'self: @ContractState,' : 'ref self: ContractState,'}
      ${func.parameters.map(param => `${param.name}: ${param.type.name}`).join(', ')}
    ) -> (${func.returns.length > 0 ? func.returns.map(ret => ret.type.name).join(', ') : ''}) {
      println!("Calling private function: {}", "${func.entrypoint}");
    }
    `;
  }).join('\n');
}

export const AssembleContract = async (
  contractName: string,
  nodes: BuilderNode[],
  functions: ContractFunctionItem[],
  storage: ContractStorageItem[],
  events: ContractEventItem[],
): Promise<string> => {
  // TODO: Ensure contractName is a valid identifier

  const replacementFunctions = {
    "__CONTRACT_NAME__": contractName,
    "__CONTRACT_IMPORTS__": getAssembledContractImports(nodes, storage, events, functions),
    "__CONTRACT_COMPONENTS__": getAssembledContractComponents(),
    "__CONTRACT_STORAGE__": getAssembledContractStorage(storage),
    "__CONTRACT_EVENT_TYPES__": getAssembledContractEventTypes(events),
    "__CONTRACT_EVENTS__": getAssembledContractEvents(events),
    "__CONTRACT_CONSTRUCTOR__": getAssembledContractConstructors(),
    "__CONTRACT_PUBLIC_FUNCTIONS__": getAssembledContractPublicFunctions(functions),
    "__CONTRACT_PRIVATE_FUNCTIONS__": getAssembledContractPrivateFunctions(functions),
  };

  const contractTemplateFile = await fetch(`templates/contract_template.cairo`);
  let assembledContract = '';
  contractTemplateFile.arrayBuffer().then((buffer) => {
    const contractTemplate = new TextDecoder("ascii").decode(buffer);
    assembledContract = contractTemplate;
    for (const [key, value] of Object.entries(replacementFunctions)) {
      assembledContract = assembledContract.replace(new RegExp(key, 'g'), value);
    }
    console.log("Assembled Contract:\n", assembledContract);
  });

  return assembledContract;
}
