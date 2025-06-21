import React, { useState, useEffect, useRef } from 'react';
import { useContractBuilder } from '../context/ContractBuilder';
import { BuilderViewHeader } from './BuilderViewHeader';
import { ContractComponentsView } from './ContractComponentsView';
import { ContractComponentDetailsView } from './ContractComponentDetailsView';
import { BuilderNodesView } from './BuilderNodesView';
import { BuilderRHBMenu } from './BuilderRHBMenu';
import { BuilderConnectorTarget } from '../types/builder';

export const BuilderView = () => {
  const { nodes, execConnectors, varConnectors, addExecConnector, addVarConnector } = useContractBuilder();
  const [rhbMenuOpen, setRhbMenuOpen] = useState(false);
  const [rhbMenuPosition, setRhbMenuPosition] = useState({ x: 0, y: 0 });

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setRhbMenuPosition({ x: event.clientX, y: event.clientY });
    setRhbMenuOpen(true);
  }

  const [newExecConnector, setNewExecConnector] = useState<{
    from: BuilderConnectorTarget;
    to: { position: { x: number; y: number } }
  } | null>(null);
  const execConnectorsRef = useRef(null);
  const [buildingNewExecConnector, setBuildingNewExecConnector] = useState(false);

  const [newVarConnector, setNewVarConnector] = useState<{
    from: BuilderConnectorTarget,
    to: { position: { x: number; y: number } }
  } | null>(null);
  const varConnectorsRef = useRef(null);
  const [buildingNewVarConnector, setBuildingNewVarConnector] = useState(false);

  const createNewExecConnector = (target: BuilderConnectorTarget): void => {
    const fromNodePosition = nodes.find(node => node.id === target.nodeId)?.position;
    const toX = fromNodePosition ? fromNodePosition.x + 187 : 0;
    const toY = fromNodePosition ? fromNodePosition.y + 66 : 0;
    setNewExecConnector({
      from: target,
      to: { position: { x: toX, y: toY } }
    });
    setBuildingNewExecConnector(true);
  }

  const finalizeNewExecConnector = (target: BuilderConnectorTarget): void => {
    if (!newExecConnector) return;
    addExecConnector({
      from: newExecConnector.from,
      to: target
    });
    setNewExecConnector(null);
    setBuildingNewExecConnector(false);
  };

  useEffect(() => {
    if (execConnectorsRef.current) {
      const ctx = (execConnectorsRef.current as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        execConnectors.map((connector) => {
          const fromNode = nodes.find(node => node.id === connector.from.nodeId);
          const toNode = nodes.find(node => node.id === connector.to.nodeId);
          if (fromNode && toNode) {
            ctx.beginPath();
            ctx.moveTo(fromNode.position.x + 187, fromNode.position.y + 66); // Center the node
            ctx.lineTo(toNode.position.x + 8, toNode.position.y + 66); // Center the node
            ctx.strokeStyle = '#ffffffd0';
            ctx.lineWidth = 4;
            ctx.stroke();
          }
        });
        if (newExecConnector) {
          const fromNode = nodes.find(node => node.id === newExecConnector.from.nodeId);
          if (fromNode) {
            ctx.beginPath();
            ctx.moveTo(fromNode.position.x + 187, fromNode.position.y + 66); // Center the node
            ctx.lineTo(newExecConnector.to.position.x, newExecConnector.to.position.y); // Center the node
            ctx.strokeStyle = '#fffffff0';
            ctx.lineWidth = 4;
            ctx.stroke();
          }
        }
      }
    }
  }, [execConnectors, nodes, execConnectorsRef, newExecConnector]);

  useEffect(() => {
    // Add mouse listeners to handle the new execution connector
    const handleMouseMove = (e: MouseEvent) => {
      if (buildingNewExecConnector && newExecConnector) {
        setNewExecConnector({
          ...newExecConnector,
          to: { position: { x: e.clientX, y: e.clientY } },
        });
      } else {
        setNewExecConnector(null); // Reset if not building a new connector
      }
    }
    if (buildingNewExecConnector && newExecConnector) {
      const handleMouseUp = (e: MouseEvent) => {
        if (newExecConnector) {
          // Check if mouse is over a node
          const toNode = nodes.find(node => {
            const rect = document.querySelector(`[data-node-id="${node.id}"]`)?.getBoundingClientRect();
            return rect && e.clientX >= rect.left && e.clientX <= rect.right &&
                   e.clientY >= rect.top && e.clientY <= rect.bottom;
          });
          if (toNode) {
            finalizeNewExecConnector({ nodeId: toNode.id, connectorId: 0 });
          } else {
            setNewExecConnector(null); // Cancel the new connector
          }
        }
      };
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      setNewExecConnector(null); // Reset if not building a new connector
      document.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [newExecConnector, buildingNewExecConnector, nodes]);

  const createNewVarConnector = (target: BuilderConnectorTarget): void => {
    const fromNodePosition = nodes.find(node => node.id === target.nodeId)?.position;
    const toX = fromNodePosition ? fromNodePosition.x + 187 : 0;
    const toY = fromNodePosition ? fromNodePosition.y + 66 : 0;
    setNewVarConnector({
      from: target,
      to: { position: { x: toX, y: toY } }
    });
    setBuildingNewVarConnector(true);
  };

  const finalizeNewVarConnector = (target: BuilderConnectorTarget): void => {
    if (!newVarConnector) return;
    addVarConnector({
      from: newVarConnector.from,
      to: target
    });
    setNewVarConnector(null);
    setBuildingNewVarConnector(false);
  };

  useEffect(() => {
    if (varConnectorsRef.current) {
      const ctx = (varConnectorsRef.current as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        varConnectors.map((connector) => {
          const fromNode = nodes.find(node => node.id === connector.from.nodeId);
          const toNode = nodes.find(node => node.id === connector.to.nodeId);
          if (fromNode && toNode) {
            ctx.beginPath();
            ctx.moveTo(fromNode.position.x + 182, fromNode.position.y + 72); // Center the node
            ctx.lineTo(toNode.position.x + 14, toNode.position.y + 92); // Center the node
            ctx.strokeStyle = '#ffff00d0'; // TODO: Color based on type
            ctx.lineWidth = 4;
            ctx.stroke();
          }
        });
        if (newVarConnector) {
          const fromNode = nodes.find(node => node.id === newVarConnector.from.nodeId);
          if (fromNode) {
            ctx.beginPath();
            ctx.moveTo(fromNode.position.x + 182, fromNode.position.y + 72); // Center the node
            ctx.lineTo(newVarConnector.to.position.x, newVarConnector.to.position.y); // Center the node
            ctx.strokeStyle = '#ffff00f0';
            ctx.lineWidth = 4;
            ctx.stroke();
          }
        }
      }
    }
  }, [varConnectors, nodes, varConnectorsRef, newVarConnector]);

  useEffect(() => {
    // Add mouse listeners to handle the new variable connector
    const handleMouseMove = (e: MouseEvent) => {
      if (buildingNewVarConnector && newVarConnector) {
        setNewVarConnector({
          ...newVarConnector,
          to: { position: { x: e.clientX, y: e.clientY } },
        });
      } else {
        setNewVarConnector(null); // Reset if not building a new connector
      }
    }
    if (buildingNewVarConnector && newVarConnector) {
      const handleMouseUp = (e: MouseEvent) => {
        if (newVarConnector) {
          // Check if mouse is over a node
          const toNode = nodes.find(node => {
            const rect = document.querySelector(`[data-node-id="${node.id}"]`)?.getBoundingClientRect();
            return rect && e.clientX >= rect.left && e.clientX <= rect.right &&
                   e.clientY >= rect.top && e.clientY <= rect.bottom;
          });
          if (toNode) {
            // TODO: Get input index from node 
            finalizeNewVarConnector({ nodeId: toNode.id, connectorId: 0 });
          } else {
            setNewVarConnector(null); // Cancel the new connector
          }
        }
      };
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      setNewVarConnector(null); // Reset if not building a new connector
      document.removeEventListener('mousemove', handleMouseMove);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [newVarConnector, buildingNewVarConnector, nodes]);

  return (
    <div
      className="w-full flex-1 relative"
      style={{
        backgroundImage: 'url(/background/chalk-grid.png)',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
      }}
      onContextMenu={handleRightClick}
      onClick={() => {
        if (rhbMenuOpen) {
          setRhbMenuOpen(false);
        }
      }}
    >
      <BuilderViewHeader />
      {rhbMenuOpen && (
        <BuilderRHBMenu position={rhbMenuPosition} closeMenu={() => setRhbMenuOpen(false)} />
      )}
      <BuilderNodesView
        createNewExecConnector={createNewExecConnector}
        createNewVarConnector={createNewVarConnector}
        finalizeNewExecConnector={finalizeNewExecConnector}
        finalizeNewVarConnector={finalizeNewVarConnector}
      />
      <canvas ref={varConnectorsRef} className="absolute pointer-events-none"
        width={window.innerWidth} height={window.innerHeight}
      />
      <canvas ref={execConnectorsRef} className="absolute pointer-events-none"
        width={window.innerWidth} height={window.innerHeight}
      />
      <div className="absolute top-0 right-0 z-10 w-100 flex flex-col items-center gap-2 m-2 h-full">
        <div className="h-[calc(50%-var(--spacing)*3)] w-full p-1 overflow-scroll rounded-md border-2 border-[#ffffff30] bg-[#ffffff20]">
          <ContractComponentsView />
        </div>
        <div className="h-[calc(50%-var(--spacing)*3)] w-full p-1 overflow-scroll rounded-md border-2 border-[#ffffff30] bg-[#ffffff20]">
          <ContractComponentDetailsView />
        </div>
      </div>
    </div>
  );
}
