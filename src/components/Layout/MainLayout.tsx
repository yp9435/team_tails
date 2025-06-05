import React, { useRef, useCallback, useState } from 'react';
import { Sidebar } from './Sidebar';
import { useEmployees } from '../../hooks/useEmployees';
import type { Employee } from '../../types/employee';
import { DnDProvider, useDnD } from '../Sidebar/DnDContext';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  type Edge,
  type Node,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { EmployeeNode } from '../Chart/EmployeeNode';
import Navbar from '../Navbar/Navbar';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'employee',
    data: {
      id: '1',
      name: 'Shalin Jain',
      designation: 'CEO',
      team: 'Leadership',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      managerId: null,
    },
    position: { x: 250, y: 5 },
  },
];

let id = 1;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
  employee: EmployeeNode,
};

const FlowChartArea: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD(); // type is possibly Employee | string | null

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeId = getId();

      const newNode: Node = {
        id: nodeId,
        type: 'employee',
        position,
        data:
          typeof type === 'object'
            ? {
                ...(type as Employee),
                id: nodeId,
              }
            : {
                id: nodeId,
                name: 'New Person',
                designation: 'engineer',
                team: 'Engineering',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nodeId}`,
                managerId: null,
              },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes]
  );

  return (
    <div className="reactflow-wrapper h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        style={{ backgroundColor: '#F7F9FB', height: '100%' }}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export const MainLayout: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const { employees, loading, error } = useEmployees();



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <Navbar/>
      <DnDProvider>
        <div className="h-screen flex bg-gray-100">
          <div className="w-[30%] min-w-[400px] max-w-[500px]">
            <Sidebar
              employees={employees}
              selectedTeam={selectedTeam}
              onTeamFilterChange={setSelectedTeam}
            />
          </div>
          <div className="flex-1">
            <FlowChartArea />
          </div>
        </div>
      </DnDProvider>
    </ReactFlowProvider>
  );
};