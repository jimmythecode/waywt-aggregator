import React, { useState } from 'react';

interface GlobalContextInterface {
      filterMobileOpen: boolean;
      setFilterMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const GlobalContext = React.createContext<GlobalContextInterface>({} as GlobalContextInterface);

export default function GlobalContextProvider(props: { children: React.ReactNode }) {
  const [filterMobileOpen, setFilterMobileOpen] = useState(false);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <GlobalContext.Provider value={{filterMobileOpen, setFilterMobileOpen}} {...props} />;
}
