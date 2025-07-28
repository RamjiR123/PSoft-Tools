import React, { useRef, useCallback, MouseEvent, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  getNodesBounds, 
  getViewportForBounds,
  NodeTypes,
  type Edge,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar.tsx';
import './DragDrop.css';
import type * as CSS from 'csstype';
import ShapeNode from './ShapeNode.tsx';
import { toPng } from 'html-to-image';
import useUndoRedo from './useUndoRedo';

export default function DragDrop() {
  const initialNodes = [
    {
      id: '1',
      type: 'input',
      data: { label: 'Entry' },
      position: { x: 250, y: 5 },
    },
  ];
  const nodeTypes: NodeTypes = {
    shape: ShapeNode,
  };
  let id = 0;
  const getId = () => `dndnode_${id++}`;
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowInstance = useReactFlow();
  const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback(
    (event: { preventDefault: () => void; dataTransfer: { dropEffect: string } }) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },
    []
  );

  const onDrop = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { getData: (arg0: string) => any };
      clientX: any;
      clientY: any;
    }) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      takeSnapshot();

      switch (type) {
        case 'rect': {
          const stateNode = {
            id: type + getId(),
            type: 'shape',
            position,
            data: { type: 'rectangle', color: 'white', label: '' },
          };
          setNodes((nds) => nds.concat(stateNode));
          break;
        }
        case 'diamond': {
          const branchNode = {
            id: type + getId(),
            type: 'shape',
            position,
            data: { type: 'diamond', color: 'white', label: '' },
          };
          setNodes((nds) => nds.concat(branchNode));
          break;
        }
        default: {
          const newNode = {
            id: 'exit' + getId(),
            type: 'output',
            position,
            data: { label: 'Exit' },
          };
          setNodes((nds) => nds.concat(newNode));
          break;
        }
      }
    },
    [screenToFlowPosition, setNodes, takeSnapshot]
  );

  const divStyle: CSS.Properties = {
    width: '1500px',
    height: '1000px',
    marginTop: '50px',
  };

  // <-- ONLY THIS HANDLER CHANGED:
  const onEdgeClick = (event: MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setEdges((eds) =>
      eds.map((ed) => {
        const isTarget = ed.id === edge.id;
        let newLabel = ed.label;
        if (globalThis.branchVal === 'trueBranch') {
          takeSnapshot();
          if (isTarget) newLabel = 'true';
        } else if (globalThis.branchVal === 'falseBranch') {
          takeSnapshot();
          if (isTarget) newLabel = 'false';
        }
        return {
          ...ed,
          data: { ...ed.data },
          label: newLabel,
          selected: isTarget,
        };
      })
    );
  };

  function downloadImage(dataUrl: string) {
    const a = document.createElement('a');
    a.setAttribute('download', 'CFG.png');
    a.setAttribute('href', dataUrl);
    a.click();
  }

  const { getNodes } = useReactFlow();
  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(nodesBounds, 1500, 1500, 0.5, 2, 0);
    toPng(
      document.querySelector('.react-flow__viewport') as HTMLElement,
      {
        backgroundColor: '#FFFFFF',
        width: 1500,
        height: 1500,
        style: {
          width: '1500px',
          height: '1500px',
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      }
    ).then(downloadImage);
  };

  const conMode: ConnectionMode = ConnectionMode.Loose;

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={divStyle}>
        <button className="download-btn" onClick={onClick}>
          Download Image
        </button>
        <button className="undo-btn" onClick={undo}>
          Undo
        </button>
        <button className="redo-btn" onClick={redo}>
          Redo
        </button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeClick={onEdgeClick}
          connectionMode={conMode}
          fitView
        />
      </div>
      <Sidebar />
    </div>
  );
}
