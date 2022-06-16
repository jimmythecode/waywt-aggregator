import React, { useState } from 'react';
import { getTimestampsFromLocalStorage } from '../utils/localStorageActions';

export interface Timestamps {
  fetchPosts: string | null;
}

interface GlobalContextInterface {
  filterMobileOpen: boolean;
  setFilterMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  timestamps: Timestamps;
  setTimestamps: React.Dispatch<React.SetStateAction<Timestamps>>;
}
export const GlobalContext = React.createContext<GlobalContextInterface>(
  {} as GlobalContextInterface
);

export default function GlobalContextProvider(props: { children: React.ReactNode }) {
  const [filterMobileOpen, setFilterMobileOpen] = useState(false);
  const [timestamps, setTimestamps] = useState(getTimestampsFromLocalStorage());

  const value = React.useMemo(
    () => ({
      filterMobileOpen,
      setFilterMobileOpen,
      timestamps,
      setTimestamps,
    }),
    [filterMobileOpen, timestamps]
  );
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <GlobalContext.Provider value={value} {...props} />;
}
