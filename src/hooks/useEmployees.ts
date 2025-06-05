import { useState, useEffect } from 'react';
import type { Employee } from '../types/employee';
import { employeeApi } from '../services/api';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const updatedEmployee = await employeeApi.update(id, updates);
      setEmployees(prev => 
        prev.map(emp => emp.id === id ? updatedEmployee : emp)
      );
      return updatedEmployee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee');
      throw err;
    }
  };

  const createEmployee = async (employee: Omit<Employee, 'id'>) => {
    try {
      const newEmployee = await employeeApi.create(employee);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee');
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await employeeApi.delete(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
      throw err;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    updateEmployee,
    createEmployee,
    deleteEmployee,
    refetch: fetchEmployees,
  };
}
