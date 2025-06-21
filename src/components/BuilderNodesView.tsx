import { useContractBuilder } from '../context/ContractBuilder';
import { BuilderNodeView } from './BuilderNodeView';
import { BuilderConnectorTarget } from '../types/builder';

export type BuilderNodesViewProps = {
  createNewExecConnector: (target: BuilderConnectorTarget) => void;
  createNewVarConnector: (target: BuilderConnectorTarget) => void;
  finalizeNewExecConnector: (target: BuilderConnectorTarget) => void;
  finalizeNewVarConnector: (target: BuilderConnectorTarget) => void;
};

export const BuilderNodesView: React.FC<BuilderNodesViewProps> = (props) => {
  const { nodes } = useContractBuilder();

  return (
    nodes.map((node, index) => {
      return (
        <BuilderNodeView key={index} node={node} {...props} />
      );
    })
  );
};
