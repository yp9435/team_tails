import type { Employee } from '../types/employee';

const API_BASE = '/api';

export const employeeApi = {
  async getAll(): Promise<Employee[]> {
    const response = await fetch(`${API_BASE}/employees`);
    const data = await response.json();
    return data.employees || data;
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
