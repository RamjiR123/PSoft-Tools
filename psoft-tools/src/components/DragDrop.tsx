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
  type Node as RFNode,
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
  const initialNodes: RFNode[] = [
    {
      id: '1',
      type: 'input',
      data: { label: 'Entry' },
      position: { x: 250, y: 5 },
      deletable: false,
    },
  ];
  const nodeTypes: NodeTypes = { shape: ShapeNode };
  let id = 0;
  const getId = () => `dndnode_${id++}`;
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowInstance = useReactFlow();
  const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();

  const handleNodesChange = useCallback(
    (changes: any) => {
      if (changes?.some((c: any) => c.type === 'remove')) takeSnapshot();
      onNodesChange(changes);
    },
    [onNodesChange, takeSnapshot]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      if (changes?.some((c: any) => c.type === 'remove')) takeSnapshot();
      onEdgesChange(changes);
    },
    [onEdgesChange, takeSnapshot]
  );

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) => {
        takeSnapshot();
        const cleared = eds.map((e) => ({ ...e, selected: false }));
        const withNew = addEdge(params, cleared);
        const lastIdx = withNew.length - 1;
        return withNew.map((e, i) => (i === lastIdx ? { ...e, selected: true } : e));
      }),
    [takeSnapshot]
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

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      takeSnapshot();

      switch (type) {
        case 'rect': {
          const stateNode: RFNode = {
            id: type + getId(),
            type: 'shape',
            position,
            data: { type: 'rectangle', color: 'white', label: '' },
          };
          setNodes((nds) => [
            ...nds.map((n) => ({ ...n, selected: false })),
            { ...stateNode, selected: true },
          ]);
          break;
        }
        case 'diamond': {
          const branchNode: RFNode = {
            id: type + getId(),
            type: 'shape',
            position,
            data: { type: 'diamond', color: 'white', label: '' },
          };
          setNodes((nds) => [
            ...nds.map((n) => ({ ...n, selected: false })),
            { ...branchNode, selected: true },
          ]);
          break;
        }
        default: {
          const newNode: RFNode = {
            id: 'exit' + getId(),
            type: 'output',
            position,
            data: { label: 'Exit' },
          };
          setNodes((nds) => [
            ...nds.map((n) => ({ ...n, selected: false })),
            { ...newNode, selected: true },
          ]);
          break;
        }
      }
    },
    [screenToFlowPosition, setNodes, takeSnapshot]
  );

  const divStyle: CSS.Properties = { width: '1500px', height: '1000px', marginTop: '50px' };

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
        return { ...ed, data: { ...ed.data }, label: newLabel, selected: isTarget };
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
    toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
      backgroundColor: '#FFFFFF',
      width: 1500,
      height: 1500,
      style: {
        width: '1500px',
        height: '1500px',
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then(downloadImage);
  };

  const conMode: ConnectionMode = ConnectionMode.Loose;

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={divStyle}>
        <button className="download-btn" onClick={onClick}>Download Image</button>
        <button className="undo-btn" onClick={undo}>Undo</button>
        <button className="redo-btn" onClick={redo}>Redo</button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          nodeTypes={nodeTypes}
          onEdgesChange={handleEdgesChange}
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