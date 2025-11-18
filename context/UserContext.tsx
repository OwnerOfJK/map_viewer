import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, SharingLevel } from '../utils/types';

interface UserContextType {
  user: User | null;
  updateProfile: (updates: Partial<User>) => void;
  setSharingLevel: (level: SharingLevel) => void;
  toggleLocationSharing: (enabled: boolean) => void;
  setUserLocation: (latitude: number, longitude: number, city?: string, country?: string, countryCode?: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>({
    id: 'user-1',
    username: 'john_doe',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Love to travel and explore new places!',
    sharingLevel: 'city',
    locationEnabled: true,
  });

  const updateProfile = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const setSharingLevel = (level: SharingLevel) => {
    setUser(prev => prev ? { ...prev, sharingLevel: level } : null);
  };

  const toggleLocationSharing = (enabled: boolean) => {
    setUser(prev => prev ? { ...prev, locationEnabled: enabled } : null);
  };

  const setUserLocation = (
    latitude: number,
    longitude: number,
    city?: string,
    country?: string,
    countryCode?: string
  ) => {
    setUser(prev => prev ? {
      ...prev,
      location: { latitude, longitude, city, country, countryCode }
    } : null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateProfile,
        setSharingLevel,
        toggleLocationSharing,
        setUserLocation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
