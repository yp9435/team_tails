import type { Employee } from '../types/employee';

const API_BASE = '/api';

export const employeeApi = {
  async getAll(): Promise<Employee[]> {
    if (process.env.NODE_ENV === 'development') {
      // Use MirageJS API in development
      const response = await fetch(`/api/employees`);
      const data = await response.json();
      return data.employees || data;
    } else {
      // Use static JSON in production
      const response = await fetch('/employees.json');
      if (!response.ok) throw new Error('Failed to fetch employees (prod)');
      return response.json();
    }
  },

  async update(id: string, updates: Partial<Employee>): Promise<Employee> {
    const response = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update employee');
    }
    
    const data = await response.json();
    return data.employee || data;
  },

  async create(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const response = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...employee, id: Date.now().toString() }),
    });
    
    const data = await response.json();
    return data.employee || data;
  },

  async delete(id: string): Promise<void> {
    await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE',
    });
  },
};
