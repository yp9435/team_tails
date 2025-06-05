import React from 'react';
import type { Employee } from '../../types/employee';
import { highlightText } from '../../utils/hierarchy';

interface EmployeeTileProps {
  employee: Employee;
  searchQuery?: string;
  onDragStart: (employee: Employee) => void;
  onDragEnd: () => void;
}

const teamColors: Record<string, string> = {
  Engineering: 'bg-blue-100 text-blue-800 border-blue-200',
  Design: 'bg-purple-100 text-purple-800 border-purple-200',
  Product: 'bg-green-100 text-green-800 border-green-200',
  Marketing: 'bg-pink-100 text-pink-800 border-pink-200',
  Leadership: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export const EmployeeTile: React.FC<EmployeeTileProps> = ({
  employee,
  searchQuery = '',
  onDragStart,
  onDragEnd,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(employee));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(employee);
  };

  const teamColor = teamColors[employee.team] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-move hover:shadow-lg hover:border-gray-300 transition-all duration-200 transform hover:-translate-y-1"
      data-testid={`employee-tile-${employee.id}`}
    >
      <div className="flex items-start space-x-3">
        <img
          src={employee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`}
          alt={employee.name}
          className="w-12 h-12 rounded-full border-2 border-gray-200"
        />
        <div className="flex-1 min-w-0">
          <h3 
            className="text-sm font-semibold text-gray-900 truncate"
            dangerouslySetInnerHTML={{ 
              __html: highlightText(employee.name, searchQuery) 
            }}
          />
          <p 
            className="text-sm text-gray-600 truncate"
            dangerouslySetInnerHTML={{ 
              __html: highlightText(employee.designation, searchQuery) 
            }}
          />
          <span 
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full border mt-2 ${teamColor}`}
          >
            {employee.team}
          </span>
        </div>
      </div>
    </div>
  );
};
