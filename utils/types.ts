/**
 * Type definitions for the application
 */

export type SharingLevel = 'city' | 'realtime';

export type Friend = {
  id: string;
  username: string;
  name: string;
  avatarUri?: string;
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
    countryCode?: string;
  };
  sharingLevel: SharingLevel;
  isOnline: boolean;
  lastUpdated: Date;
};

export type FriendRequest = {
  id: string;
  username: string;
  name: string;
  avatarUri?: string;
  requestedAt: Date;
};

export type User = {
  id: string;
  username: string;
  name: string;
  bio?: string;
  avatarUri?: string;
  email: string;
  sharingLevel: SharingLevel;
  locationEnabled: boolean;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
    countryCode?: string;
  };
};

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type PooledMarker = {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  friends: Friend[];
  count: number;
};

export type ToastType = 'success' | 'error' | 'info';
