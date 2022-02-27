import React, { useState } from 'react';

interface UserMeasurements {
  height: number;
  chest: number;
  waist: number;
}

interface UserDetails {
  username: string;
  season: string;
  measurements: UserMeasurements;
}

interface UserContextInterface {
  userDetails: UserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
}
export const UserContext = React.createContext<UserContextInterface>({} as UserContextInterface);

export default function UserContextProvider(props: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState({
    username: 'temporaryUser',
    season: 'winter',
    measurements: {
      height: 183,
      chest: 100,
      waist: 80,
    },
  });

  const value = React.useMemo(() => ({
    userDetails, setUserDetails
  }), [userDetails]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <UserContext.Provider value={value} {...props} />;
}
