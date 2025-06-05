
import type { Employee } from '../types/employee';

export function buildHierarchy(employees: Employee[]): Employee[] {
  const roots: Employee[] = [];
  
  employees.forEach(employee => {
    if (!employee.managerId) {
      roots.push(employee);
    }
  });
  
  return roots;
}

export function getDirectReports(employees: Employee[], managerId: string): Employee[] {
  return employees.filter(emp => emp.managerId === managerId);
}

export function getAllSubordinates(employees: Employee[], managerId: string): Employee[] {
  const subordinates: Employee[] = [];
  const directReports = getDirectReports(employees, managerId);
  
  directReports.forEach(report => {
    subordinates.push(report);
    subordinates.push(...getAllSubordinates(employees, report.id));
  });
  
  return subordinates;
}

export function isValidManagerAssignment(
  employees: Employee[],
  employeeId: string,
  newManagerId: string | null
): boolean {
  if (!newManagerId || newManagerId === employeeId) return true;
  
  // Check if new manager is a subordinate of the employee
  const subordinates = getAllSubordinates(employees, employeeId);
  return !subordinates.some(sub => sub.id === newManagerId);
}

export function getTeamMembers(employees: Employee[], team: string): Employee[] {
  return employees.filter(emp => emp.team === team);
}

export function searchEmployees(employees: Employee[], query: string): Employee[] {
  if (!query.trim()) return employees;
  
  const lowerQuery = query.toLowerCase();
  return employees.filter(emp =>
    emp.name.toLowerCase().includes(lowerQuery) ||
    emp.designation.toLowerCase().includes(lowerQuery) ||
    emp.team.toLowerCase().includes(lowerQuery)
  );
}

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}
