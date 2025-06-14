import React, { useMemo } from 'react';
import type { Employee } from '../../types/employee';
import { EmployeeTile } from '../Sidebar/EmployeeTile';
import { SearchFilter } from '../Sidebar/SearchFilter';
import { TeamFilter } from '../Sidebar/TeamFilter';
import { useSearch } from '../../hooks/useSearch';
import { useDnD } from '../Sidebar/DnDContext';

interface SidebarProps {
  employees: Employee[];
  onTeamFilterChange: (team: string) => void;
  selectedTeam: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  employees,
  onTeamFilterChange,
  selectedTeam,
}) => {
  const [_, setDnDType] = useDnD();

  const teamFilteredEmployees = useMemo(() => {
    if (selectedTeam === 'all') return employees;
    return employees.filter(emp => emp.team === selectedTeam);
  }, [employees, selectedTeam]);

  const {
    searchQuery,
    setSearchQuery,
    filteredEmployees,
    clearSearch,
    hasResults,
  } = useSearch(teamFilteredEmployees);

  const handleDragStart = (employee: Employee) => {
    setDnDType(employee);
  };

  const handleDragEnd = () => {
    setDnDType(null);
  };

  return (
    <div className="w-full h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-6 bg-white border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Employee Directory
        </h2>
        
        <div className="space-y-4">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClear={clearSearch}
            resultCount={filteredEmployees.length}
          />
          
          <TeamFilter
            employees={employees}
            selectedTeam={selectedTeam}
            onTeamChange={onTeamFilterChange}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {!hasResults && searchQuery ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No employees found matching your search.</p>
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 mt-2"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEmployees.map((employee) => (
              <EmployeeTile
                key={employee.id}
                employee={employee}
                searchQuery={searchQuery}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};