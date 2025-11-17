import { Friend, FriendRequest } from './types';

const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
  'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Michael',
  'Emily', 'Daniel', 'Elizabeth',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Walker', 'Hall',
  'Allen', 'Young',
];

const cities = [
  { name: 'New York', country: 'United States', code: 'US', lat: 40.7128, lng: -74.0060 },
  { name: 'London', country: 'United Kingdom', code: 'GB', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', country: 'Japan', code: 'JP', lat: 35.6762, lng: 139.6503 },
  { name: 'Paris', country: 'France', code: 'FR', lat: 48.8566, lng: 2.3522 },
  { name: 'Sydney', country: 'Australia', code: 'AU', lat: -33.8688, lng: 151.2093 },
  { name: 'Berlin', country: 'Germany', code: 'DE', lat: 52.5200, lng: 13.4050 },
  { name: 'Toronto', country: 'Canada', code: 'CA', lat: 43.6532, lng: -79.3832 },
  { name: 'Singapore', country: 'Singapore', code: 'SG', lat: 1.3521, lng: 103.8198 },
  { name: 'Dubai', country: 'UAE', code: 'AE', lat: 25.2048, lng: 55.2708 },
  { name: 'São Paulo', country: 'Brazil', code: 'BR', lat: -23.5505, lng: -46.6333 },
  { name: 'Mumbai', country: 'India', code: 'IN', lat: 19.0760, lng: 72.8777 },
  { name: 'Seoul', country: 'South Korea', code: 'KR', lat: 37.5665, lng: 126.9780 },
  { name: 'Barcelona', country: 'Spain', code: 'ES', lat: 41.3851, lng: 2.1734 },
  { name: 'Amsterdam', country: 'Netherlands', code: 'NL', lat: 52.3676, lng: 4.9041 },
  { name: 'Rome', country: 'Italy', code: 'IT', lat: 41.9028, lng: 12.4964 },
  { name: 'Istanbul', country: 'Turkey', code: 'TR', lat: 41.0082, lng: 28.9784 },
  { name: 'Bangkok', country: 'Thailand', code: 'TH', lat: 13.7563, lng: 100.5018 },
  { name: 'Mexico City', country: 'Mexico', code: 'MX', lat: 19.4326, lng: -99.1332 },
  { name: 'Cairo', country: 'Egypt', code: 'EG', lat: 30.0444, lng: 31.2357 },
  { name: 'Los Angeles', country: 'United States', code: 'US', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', country: 'United States', code: 'US', lat: 41.8781, lng: -87.6298 },
  { name: 'Hong Kong', country: 'Hong Kong', code: 'HK', lat: 22.3193, lng: 114.1694 },
  { name: 'Moscow', country: 'Russia', code: 'RU', lat: 55.7558, lng: 37.6173 },
  { name: 'Buenos Aires', country: 'Argentina', code: 'AR', lat: -34.6037, lng: -58.3816 },
  { name: 'Lisbon', country: 'Portugal', code: 'PT', lat: 38.7223, lng: -9.1393 },
];

export const generateMockFriends = (count: number): Friend[] => {
  const friends: Friend[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const city = cities[i % cities.length];
    const sharingLevel = Math.random() > 0.5 ? 'realtime' : 'city';
    const isOnline = Math.random() > 0.3; // 70% chance of being online

    // Add some randomness to coordinates for realtime sharing
    const latOffset = sharingLevel === 'realtime' ? (Math.random() - 0.5) * 0.1 : 0;
    const lngOffset = sharingLevel === 'realtime' ? (Math.random() - 0.5) * 0.1 : 0;

    friends.push({
      id: `friend-${i + 1}`,
      username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}${i}`,
      name: `${firstName} ${lastName}`,
      location: {
        latitude: city.lat + latOffset,
        longitude: city.lng + lngOffset,
        city: city.name,
        country: city.country,
        countryCode: city.code,
      },
      sharingLevel,
      isOnline,
      lastUpdated: new Date(Date.now() - Math.random() * 3600000), // Random time in last hour
    });
  }

  return friends;
};

export const generateMockFriendRequests = (count: number): FriendRequest[] => {
  const requests: FriendRequest[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[(i + 10) % firstNames.length];
    const lastName = lastNames[(i + 10) % lastNames.length];

    requests.push({
      id: `request-${i + 1}`,
      username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
      name: `${firstName} ${lastName}`,
      requestedAt: new Date(Date.now() - Math.random() * 86400000), // Random time in last day
    });
  }

  return requests;
};
