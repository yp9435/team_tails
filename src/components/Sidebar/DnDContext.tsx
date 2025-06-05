import { createContext, useContext, useState } from 'react';
 

type DnDContextValue = [string | null, (type: string | null) => void];

const DnDContext = createContext<DnDContextValue>([null, () => {}]);
 
import type { ReactNode } from 'react';

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<string | null>(null);
 
  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
}
 
export default DnDContext;
 
export const useDnD = () => {
  return useContext(DnDContext);
}