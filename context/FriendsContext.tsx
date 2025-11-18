import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Friend, FriendRequest } from '../utils/types';
import { generateMockFriends, generateMockFriendRequests } from '../utils/mockData';

interface FriendsContextType {
  friends: Friend[];
  friendRequests: FriendRequest[];
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  sendFriendRequest: (username: string) => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

interface FriendsProviderProps {
  children: ReactNode;
}

export const FriendsProvider = ({ children }: FriendsProviderProps) => {
  const [friends, setFriends] = useState<Friend[]>(generateMockFriends(50));
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(
    generateMockFriendRequests(3)
  );

  const addFriend = (friend: Friend) => {
    setFriends(prev => [...prev, friend]);
  };

  const removeFriend = (friendId: string) => {
    setFriends(prev => prev.filter(f => f.id !== friendId));
  };

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      // Convert request to friend
      const newFriend: Friend = {
        id: request.id,
        username: request.username,
        name: request.name,
        avatarUri: request.avatarUri,
        location: {
          latitude: 40.7128 + (Math.random() - 0.5) * 20,
          longitude: -74.0060 + (Math.random() - 0.5) * 20,
          city: 'New York',
          country: 'United States',
          countryCode: 'US',
        },
        sharingLevel: Math.random() > 0.5 ? 'realtime' : 'city',
        isOnline: Math.random() > 0.3,
        lastUpdated: new Date(),
      };
      addFriend(newFriend);
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const declineFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const sendFriendRequest = async (_username: string) => {
    // MVP: Simulate sending a friend request
    await new Promise(resolve => setTimeout(resolve, 500));
    // In real app, this would call an API
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        friendRequests,
        addFriend,
        removeFriend,
        acceptFriendRequest,
        declineFriendRequest,
        sendFriendRequest,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = (): FriendsContextType => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriends must be used within FriendsProvider');
  }
  return context;
};
