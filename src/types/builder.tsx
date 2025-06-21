export type BuilderNodeType = 'function' | 'storage' | 'event' | 'starknet' | 'utility';

export type BuilderNode = {
  id: number;
  position: { x: number; y: number };
  type: BuilderNodeType;
  componentId: number;
  metadata?: any;
};

export type BuilderConnectorTarget = {
  nodeId: number;
  connectorId: number;
};

export type BuilderConnector = {
  from: BuilderConnectorTarget;
  to: BuilderConnectorTarget;
}
