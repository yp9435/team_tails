import { createContext, useContext, useState } from 'react';
import type { Employee } from '../../types/employee';
import type { ReactNode } from 'react';

const DnDContext = createContext<[Employee | null, (e: Employee | null) => void]>([null, () => {}]);

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<Employee | null>(null);

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};