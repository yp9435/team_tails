import React from 'react';
import type { Employee } from '../../types/employee';

interface TeamFilterProps {
  employees: Employee[];
  selectedTeam: string;
  onTeamChange: (team: string) => void;
}

export const TeamFilter: React.FC<TeamFilterProps> = ({
  employees,
  selectedTeam,
  onTeamChange,
}) => {
  const teamCounts = employees.reduce((acc, emp) => {
    acc[emp.team] = (acc[emp.team] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const teams = Object.keys(teamCounts).sort();

  return (
    <div>
      <label htmlFor="team-filter" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Team
      </label>
      <select
        id="team-filter"
        value={selectedTeam}
        onChange={(e) => onTeamChange(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        data-testid="team-filter"
      >
        <option value="all">All Teams ({employees.length})</option>
        {teams.map(team => (
          <option key={team} value={team}>
            {team} ({teamCounts[team]})
          </option>
        ))}
      </select>
    </div>
  );
};
