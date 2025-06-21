import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useContractBuilder } from '../context/ContractBuilder';
import { BuilderNode, BuilderConnectorTarget } from '../types/builder';
import { FunctionNodeView } from './FunctionNodeView';
import { StorageReadNodeView } from './StorageReadNodeView';
import { StorageWriteNodeView } from './StorageWriteNodeView';
import { EventEmitNodeView } from './EventEmitNodeView';
import { EventListenNodeView } from './EventListenNodeView';
import { StarknetNodeView } from './StarknetNodeView';

export type BuilderNodeViewProps = {
  node: BuilderNode;
  createNewExecConnector: (target: BuilderConnectorTarget) => void;
  createNewVarConnector: (target: BuilderConnectorTarget) => void;
  finalizeNewExecConnector: (target: BuilderConnectorTarget) => void;
  finalizeNewVarConnector: (target: BuilderConnectorTarget) => void;
};

export const BuilderNodeView: React.FC<BuilderNodeViewProps> = (props) => {
  const { editNode } = useContractBuilder();
  const [dragging, setDragging] = useState(false);
  // TODO: Remove viewNode
  const [viewNode, setViewNode] = useState<BuilderNode | null>(null);
  useEffect(() => {
    if (props.node) {
      setViewNode(props.node);
    }
  }, [props.node]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(false);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && viewNode) {
      setViewNode({
        ...viewNode,
        position: {
          x: e.clientX - 8,
          y: e.clientY - 8, // Adjust for the icon size
        },
      });
    }
  };
  // Issue: If i move the mouse too fast, handleMouseMove is no longer called
  const throttledHandleMouseMove = (e: React.MouseEvent) => {
    if (dragging && viewNode) {
      requestAnimationFrame(() => {
        setViewNode({
          ...viewNode,
          position: {
            x: e.clientX - 10,
            y: e.clientY - 10, // Adjust for the icon size
          },
        });
      });
    }
  }
  // Handle case where mouse outside the node while dragging
  useEffect(() => {
    const handleMouseUpOutside = () => {
      if (dragging) {
        setDragging(false);
      }
    };
    const handleMouseMoveOutside = (e: MouseEvent) => {
      const nodeWidth = nodeRef.current?.offsetWidth || 0;
      if (dragging && viewNode) {
        setViewNode({
          ...viewNode,
          position: {
            x: e.clientX - nodeWidth + 10, // Center the node on the cursor
            y: e.clientY - 10, // Adjust for the icon size
          },
        });
        if (!viewNode) return;
        editNode(props.node.id, {
          ...props.node,
          position: {
            x: e.clientX - nodeWidth + 10, // Center the node on the cursor
            y: e.clientY - 10, // Adjust for the icon size
          },
        });
      }
    };
    document.addEventListener('mouseup', handleMouseUpOutside);
    document.addEventListener('mousemove', handleMouseMoveOutside);
    return () => {
      document.removeEventListener('mouseup', handleMouseUpOutside);
      document.removeEventListener('mousemove', handleMouseMoveOutside);
    };
  }, [dragging]);
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={nodeRef}
      className="flex flex-col bg-[#ffffff20] border-2 border-[#ffffff30] rounded-md absolute"
      style={{ left: viewNode?.position.x, top: viewNode?.position.y }}
    >
      {viewNode?.type === 'function' && (
        <FunctionNodeView {...props} />
      )}
      {viewNode?.type === 'storage' && viewNode?.metadata?.operation === 'Read' && (

        <StorageReadNodeView {...props} />
      )}
      {viewNode?.type === 'storage' && viewNode?.metadata?.operation === 'Write' && (
        <StorageWriteNodeView {...props} />
      )}
      {viewNode?.type === 'event' && viewNode?.metadata?.operation === 'Emit' && (
        <EventEmitNodeView {...props} />
      )}
      {viewNode?.type === 'event' && viewNode?.metadata?.operation === 'Listen' && (
        <EventListenNodeView {...props} />
      )}
      {viewNode?.type === 'starknet' && (
        <StarknetNodeView {...props} />
      )}

      <div className="absolute top-0 right-0 p-[1px]">
        <div
          className="cursor-grab"
          onMouseDown={handleMouseDown}
        >
          <Image
            src="/icons/move.png"
            alt="Edit Node"
            width={20}
            height={20}
            className="pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
