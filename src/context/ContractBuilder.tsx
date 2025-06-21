import React, { createContext, useCallback, useContext, useState, useEffect } from "react";
import { BuilderNode, BuilderConnector } from "../types/builder";
import { ContractFunctionItem, ContractStorageItem, ContractEventItem } from "../types/contract";
import { AssembleContract } from "../utils/assembleContract";

type ContractBuilderContextType = {
  contractName: string;
  setContractName: React.Dispatch<React.SetStateAction<string>>;

  nodes: BuilderNode[];
  functions: ContractFunctionItem[];
  storage: ContractStorageItem[];
  events: ContractEventItem[];
  execConnectors: BuilderConnector[];
  varConnectors: BuilderConnector[];
  selectedComponent?: { type: string | null; componentId: number | null };

  addNode: (node: BuilderNode) => void;
  editNode: (id: number, updatedNode: BuilderNode) => void;
  addFunction: (func: ContractFunctionItem) => void;
  editFunction: (id: number, updatedFunction: ContractFunctionItem) => void;
  addStorage: (storage: ContractStorageItem) => void;
  editStorage: (id: number, updatedStorage: ContractStorageItem) => void;
  addEvent: (event: ContractEventItem) => void;
  editEvent: (id: number, updatedEvent: ContractEventItem) => void;
  addExecConnector: (connector: BuilderConnector) => void;
  addVarConnector: (connector: BuilderConnector) => void;
  assembleContract: () => Promise<void>;
  selectComponent: (type: string, componentId: number | null) => void;

  saveContract: () => Promise<void>;
  loadContract: () => Promise<void>;
}

const ContractBuilderContext = createContext<ContractBuilderContextType | undefined>(undefined);

export const useContractBuilder = () => {
  const context = useContext(ContractBuilderContext);
  if (!context) {
    throw new Error("useContractBuilder must be used within a ContractBuilderProvider");
  }
  return context;
};

export const ContractBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contractName, setContractName] = useState<string>("New Contract");
  const [nodes, setNodes] = useState<BuilderNode[]>([]);
  const [functions, setFunctions] = useState<ContractFunctionItem[]>([]);
  const [storage, setStorage] = useState<ContractStorageItem[]>([]);
  const [events, setEvents] = useState<ContractEventItem[]>([]);
  const [execConnectors, setExecConnectors] = useState<BuilderConnector[]>([]);
  const [varConnectors, setVarConnectors] = useState<BuilderConnector[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<{ type: string | null; componentId: number | null }>({ type: null, componentId: null });

  useEffect(() => {
    // Load the contract nodes when the component mounts
    loadContract();
  }, []);

  const addNode = useCallback((node: BuilderNode) => {
    setNodes(prevNodes => [...prevNodes, node]);
  }, []);

  const editNode = useCallback((id: number, updatedNode: BuilderNode) => {
    setNodes(prevNodes => {
      const updatedNodes = [...prevNodes];
      updatedNodes[prevNodes.findIndex(n => n.id === id)] = updatedNode;
      return updatedNodes;
    });
  }, []);

  const addFunction = useCallback((func: ContractFunctionItem) => {
    setFunctions(prevFunctions => [...prevFunctions, func]);
  }, []);

  // TODO: Move to id on each component type instead of index in functions array?
  const editFunction = useCallback((id: number, updatedFunction: ContractFunctionItem) => {
    setFunctions(prevFunctions => {
      const updatedFunctions = [...prevFunctions];
      updatedFunctions[id] = updatedFunction;
      return updatedFunctions;
    });
  }, []);

  const addStorage = useCallback((storage: ContractStorageItem) => {
    setStorage(prevStorage => [...prevStorage, storage]);
  }, []);

  const editStorage = useCallback((id: number, updatedStorage: ContractStorageItem) => {
    setStorage(prevStorage => {
      const updatedStorageArray = [...prevStorage];
      updatedStorageArray[id] = updatedStorage;
      return updatedStorageArray;
    });
  }, []);

  const addEvent = useCallback((event: ContractEventItem) => {
    setEvents(prevEvents => [...prevEvents, event]);
  }, []);

  const editEvent = useCallback((id: number, updatedEvent: ContractEventItem) => {
    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents];
      updatedEvents[id] = updatedEvent;
      return updatedEvents;
    });
  }, []);

  const addExecConnector = useCallback((connector: BuilderConnector) => {
    setExecConnectors(prevConnectors => [...prevConnectors, connector]);
  }, []);

  const addVarConnector = useCallback((connector: BuilderConnector) => {
    setVarConnectors(prevConnectors => [...prevConnectors, connector]);
  }, []);

  const assembleContract = useCallback(async () => {
    console.log("Assembling contract with nodes:", contractName, nodes, functions, storage, events);
    const contract = await AssembleContract(contractName, nodes, functions, storage, events);
    console.log("Contract assembled successfully.");
  }, [contractName, nodes, functions, storage, events]);

  const selectComponent = useCallback((type: string, componentId: number | null) => {
    setSelectedComponent({ type, componentId });
  }, []);

  const saveContract = useCallback(async () => {
    try {
      const serializedNodes = JSON.stringify(nodes);
      const serializedFunctions = JSON.stringify(functions);
      const serializedStorage = JSON.stringify(storage);
      const serializedEvents = JSON.stringify(events);
      const contractData = {
        name: contractName,
        nodes: serializedNodes,
        functions: serializedFunctions,
        storage: serializedStorage,
        events: serializedEvents,
      };
      console.log("Saving contract:", contractData);
      localStorage.setItem(`focbuilder.${contractName}`, JSON.stringify(contractData));
      // TODO: Implement actual saving logic, e.g., to a database or file system
      console.log("Contract saved successfully.");
    } catch (error) {
      console.error("Error saving contract:", error);
    }
  }, [nodes, contractName, functions, storage, events]);

  const loadContract = useCallback(async () => {
    try {
      const savedContract = localStorage.getItem(`focbuilder.${contractName}`);
      if (savedContract) {
        const contractData = JSON.parse(savedContract);
        setNodes(JSON.parse(contractData.nodes));
        setFunctions(JSON.parse(contractData.functions));
        setStorage(JSON.parse(contractData.storage));
        setEvents(JSON.parse(contractData.events));
        console.log("Contract loaded successfully:", contractData);
      } else {
        console.warn("No saved contract found with the name:", contractName);
      }
    } catch (error) {
      console.error("Error loading contract:", error);
    }
  }, [contractName]);

  return (
    <ContractBuilderContext.Provider value={{
      nodes, addNode, editNode, contractName, setContractName, saveContract, loadContract,
      assembleContract, functions, addFunction, storage, addStorage, events, addEvent,
      editFunction, editStorage, editEvent, execConnectors, addExecConnector,
      selectedComponent, selectComponent, varConnectors, addVarConnector
    }}>
      {children}
    </ContractBuilderContext.Provider>
  );
};
