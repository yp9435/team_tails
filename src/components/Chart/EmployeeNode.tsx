import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { Employee } from '../../types/employee';

const teamColors: Record<string, string> = {
  Engineering: 'border-blue-500 bg-blue-50',
  Design: 'border-purple-500 bg-purple-50',
  Product: 'border-green-500 bg-green-50',
  Marketing: 'border-pink-500 bg-pink-50',
  Leadership: 'border-yellow-500 bg-yellow-50',
};

const teamBadgeColors: Record<string, string> = {
  Engineering: 'bg-blue-100 text-blue-800',
  Design: 'bg-purple-100 text-purple-800',
  Product: 'bg-green-100 text-green-800',
  Marketing: 'bg-pink-100 text-pink-800',
  Leadership: 'bg-yellow-100 text-yellow-800',
};

type EmployeeNodeType = Node<Employee>;

export const EmployeeNode = memo((props: NodeProps<EmployeeNodeType>) => {
  const { data, selected } = props;
  const teamColor = teamColors[data.team] || 'border-gray-500 bg-gray-50';
  const badgeColor = teamBadgeColors[data.team] || 'bg-gray-100 text-gray-800';

  return (
    <div 
      className={`bg-white rounded-lg border-2 p-4 shadow-lg min-w-[200px] transition-all duration-200 ${
        selected ? 'border-blue-600 shadow-xl' : teamColor
      } hover:shadow-xl`}
      data-testid={`employee-node-${data.id}`}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 border-2 border-gray-400 bg-white"
      />
      
      <div className="flex items-center space-x-3">
        <img
          src={data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.id}`}
          alt={data.name}
          className="w-12 h-12 rounded-full border-2 border-gray-200"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {data.name}
          </h3>
          <p className="text-xs text-gray-600 truncate">
            {data.designation}
          </p>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${badgeColor}`}>
            {data.team}
          </span>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 border-2 border-gray-400 bg-white"
      />
    </div>
  );
});

EmployeeNode.displayName = 'EmployeeNode';
