import React, { useCallback, useMemo, useState, useRef } from 'react';
import {
  ReactFlow,
  type Node,
  type Edge,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  type Connection,
  type NodeTypes,
  MarkerType,
  ConnectionMode,
  useReactFlow,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Employee } from '../../types/employee';
import { EmployeeNode } from './EmployeeNode';
import { buildHierarchy, getDirectReports, isValidManagerAssignment } from '../../utils/hierarchy';

interface ReactFlowChartProps {
  employees: Employee[];
  filteredTeam?: string;
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => Promise<Employee>;
  onError: (message: string) => void;
}

const nodeTypes: NodeTypes = {
  employee: EmployeeNode,
};

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

// Layout algorithm
const getLayoutedElements = (employees: Employee[]) => {
  const nodes: Node<Employee>[] = [];
  const edges: Edge[] = [];
  
  // Create a hierarchy map
  const hierarchyMap = new Map<string, Employee[]>();
  const rootEmployees = employees.filter(emp => !emp.managerId);
  
  // Build hierarchy levels
  const buildLevels = (empList: Employee[], level = 0): void => {
    empList.forEach(employee => {
      const directReports = getDirectReports(employees, employee.id);
      
      // Position calculation
      const levelEmployees = hierarchyMap.get(level.toString()) || [];
      const xPosition = levelEmployees.length * 300;
      const yPosition = level * 200;
      
      // Add to hierarchy map
      hierarchyMap.set(level.toString(), [...levelEmployees, employee]);
      
      // Create node
      nodes.push({
        id: employee.id,
        type: 'employee',
        position: { x: xPosition, y: yPosition },
        data: employee,
        draggable: true,
      });
      
      // Create edges for manager relationship
      if (employee.managerId) {
        edges.push({
          id: `edge-${employee.managerId}-${employee.id}`,
          source: employee.managerId,
          target: employee.id,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          },
          style: { strokeWidth: 2, stroke: '#6b7280' },
        });
      }
      
      // Recursively process direct reports
      if (directReports.length > 0) {
        buildLevels(directReports, level + 1);
      }
    });
  };
  
  buildLevels(rootEmployees);
  
  // Center nodes in each level
  hierarchyMap.forEach((levelEmployees, level) => {
    const totalWidth = (levelEmployees.length - 1) * 300;
    const startX = -totalWidth / 2;
    
    levelEmployees.forEach((employee, index) => {
      const node = nodes.find(n => n.id === employee.id);
      if (node) {
        node.position.x = startX + (index * 300);
      }
    });
  });
  
  return { nodes, edges };
};

export const ReactFlowChart: React.FC<ReactFlowChartProps> = ({
  employees,
  filteredTeam,
  onUpdateEmployee,
  onError,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [highlightedTeam, setHighlightedTeam] = useState<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  // Filter employees based on team filter
  const filteredEmployees = useMemo(() => {
    if (!filteredTeam || filteredTeam === 'all') {
      return employees;
    }
    
    // Get all employees in the selected team and their management chain
    const teamEmployees = employees.filter(emp => emp.team === filteredTeam);
    const allRelatedEmployees = new Set<string>();
    
    teamEmployees.forEach(emp => {
      allRelatedEmployees.add(emp.id);
      
      // Add management chain upward
      let currentManagerId = emp.managerId;
      while (currentManagerId) {
        allRelatedEmployees.add(currentManagerId);
        const manager = employees.find(e => e.id === currentManagerId);
        currentManagerId = manager?.managerId || null;
      }
      
      // Add all subordinates
      const addSubordinates = (managerId: string) => {
        const subordinates = getDirectReports(employees, managerId);
        subordinates.forEach(sub => {
          allRelatedEmployees.add(sub.id);
          addSubordinates(sub.id);
        });
      };
      addSubordinates(emp.id);
    });
    
    return employees.filter(emp => allRelatedEmployees.has(emp.id));
  }, [employees, filteredTeam]);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => 
    getLayoutedElements(filteredEmployees), 
    [filteredEmployees]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when employees change
  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = getLayoutedElements(filteredEmployees);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [filteredEmployees, setNodes, setEdges]);

  const onConnect = useCallback(
    async (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      
      try {
        const isValid = isValidManagerAssignment(
          employees,
          connection.target,
          connection.source
        );
        
        if (!isValid) {
          onError('Invalid assignment: Cannot create circular reporting structure');
          return;
        }
        
        await onUpdateEmployee(connection.target, { managerId: connection.source });
        setEdges((eds) => addEdge(connection, eds));
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Failed to update reporting relationship');
      }
    },
    [employees, onUpdateEmployee, onError, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      try {
        const employeeData = JSON.parse(event.dataTransfer.getData('application/json'));
        
        if (!employeeData || !employeeData.id) {
          onError('Invalid employee data');
          return;
        }
        
        // Check if employee is already in the chart
        const existingNode = nodes.find(node => node.id === employeeData.id);
        if (existingNode) {
          onError('Employee is already in the organization chart');
          return;
        }
        
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        
        const newNode: Node<Employee> = {
          id: employeeData.id,
          type: 'employee',
          position,
          data: employeeData,
          draggable: true,
        };
        
        setNodes(nds => [...nds, newNode]);
      } catch (error) {
        console.error('Drop error:', error);
        onError('Failed to add employee to chart');
      }
    },
    [nodes, setNodes, onError, screenToFlowPosition]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<Employee>) => {
    const team = node.data.team;
    setHighlightedTeam(prev => prev === team ? null : team);
  }, []);

  // Update node styles based on highlighted team
  const styledNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        opacity: highlightedTeam && node.data.team !== highlightedTeam ? 0.3 : 1,
        transform: highlightedTeam === node.data.team ? 'scale(1.05)' : 'scale(1)',
      },
    }));
  }, [nodes, highlightedTeam]);

  return (
    <div 
      className="h-full w-full bg-gray-50"
      ref={reactFlowWrapper}
      data-testid="organization-chart"
    >
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            const teamColors: Record<string, string> = {
              Engineering: '#3b82f6',
              Design: '#8b5cf6',
              Product: '#10b981',
              Marketing: '#ec4899',
              Leadership: '#f59e0b',
            };
            return teamColors[(node.data as Employee)?.team] || '#6b7280';
          }}
        />
      </ReactFlow>
      
      {highlightedTeam && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 border">
          <p className="text-sm text-gray-600">
            Highlighting: <span className="font-semibold">{highlightedTeam}</span> team
          </p>
          <button
            onClick={() => setHighlightedTeam(null)}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1"
          >
            Clear highlight
          </button>
        </div>
      )}
    </div>
  );
};
