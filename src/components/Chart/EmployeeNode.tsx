import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface EmployeeNodeData {
  id: string;
  type: 'employee';
  name: string;
  avatar?: string;
  designation: string;
  team: string;
}

interface EmployeeNodeProps {
  data: EmployeeNodeData;
}

export const EmployeeNode: React.FC<EmployeeNodeProps> = ({ data }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 min-w-[200px]">
    <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-gray-400 bg-white" />
    <div className="flex items-start space-x-3">
      <img
        src={data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.id}`}
        alt={data.name}
        className="w-12 h-12 rounded-full border-2 border-gray-200"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{data.name}</h3>
        <p className="text-sm text-gray-600 truncate">{data.designation}</p>
        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full border mt-2 bg-gray-100 text-gray-800 border-gray-200">
          {data.team}
        </span>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-gray-400 bg-white" />
  </div>
);
