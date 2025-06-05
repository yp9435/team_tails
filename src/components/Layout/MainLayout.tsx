import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ReactFlowChart } from '../Chart/ReactFlowChart';
import { useEmployees } from '../../hooks/useEmployees';
import { toast } from 'sonner';
import type { Employee } from '../../types/employee';

export const MainLayout: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const { employees, loading, error, updateEmployee } = useEmployees();

  const handleError = (message: string) => {
    toast.error(message);
  };

  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  const handleUpdateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      await updateEmployee(id, updates);
      handleSuccess('Employee updated successfully');
      return employees.find(emp => emp.id === id)!;
    } catch (error) {
      throw error;
    }
  };

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
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar - 30% width */}
      <div className="w-[30%] min-w-[400px] max-w-[500px]">
        <Sidebar
          employees={employees}
          selectedTeam={selectedTeam}
          onTeamFilterChange={setSelectedTeam}
        />
      </div>

      {/* Main Chart Area - 70% width */}
      <div className="flex-1">
        <ReactFlowChart
          employees={employees}
          filteredTeam={selectedTeam}
          onUpdateEmployee={handleUpdateEmployee}
          onError={handleError}
        />
      </div>
    </div>
  );
};
