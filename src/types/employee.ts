export interface Employee {
  id: string;
  name: string;
  designation: string;
  team: string;
  managerId: string | null;
  avatar?: string;
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
