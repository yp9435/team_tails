
import { useState, useMemo } from 'react';
import type { Employee } from '../types/employee';
import { searchEmployees } from '../utils/hierarchy';

export function useSearch(employees: Employee[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = useMemo(() => {
    return searchEmployees(employees, searchQuery);
  }, [employees, searchQuery]);

  const clearSearch = () => setSearchQuery('');

  return {
    searchQuery,
    setSearchQuery,
    filteredEmployees,
    clearSearch,
    hasResults: filteredEmployees.length > 0,
  };
}
