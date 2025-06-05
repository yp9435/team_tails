export interface Employee extends Record<string, unknown> {
  id: string;
  name: string;
  designation: string;
  team: string;
  avatar?: string;
  managerId?: string | null;
}


export interface TeamInfo {
  name: string;
  color: string;
  count: number;
}

export interface DragItem {
  type: 'employee';
  employee: Employee;
  fromChart?: boolean;
}

export interface DropResult {
  employeeId: string;
  newManagerId: string | null;
}
