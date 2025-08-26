// Mock data fallback for when API fails
export const mockEvents = [
  {
    id: 'mock-1',
    name: 'Summer Music Festival 2025',
    date: '2025-09-15',
    venue: 'Central Park',
    city: 'New York',
    category: 'music',
    url: 'https://www.ticketmaster.com',
    images: [
      {
        url: 'https://via.placeholder.com/400x300/007AFF/FFFFFF?text=Music+Festival',
        width: 400,
        height: 300
      }
    ],
    priceRanges: [
      {
        min: 50,
        max: 150,
        currency: 'USD'
      }
    ]
  },
  {
    id: 'mock-2',
    name: 'Comedy Night Live',
    date: '2025-09-20',
    venue: 'Comedy Club Downtown',
    city: 'Los Angeles',
    category: 'comedy',
    url: 'https://www.ticketmaster.com',
    images: [
      {
        url: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Comedy+Show',
        width: 400,
        height: 300
      }
    ],
    priceRanges: [
      {
        min: 25,
        max: 75,
        currency: 'USD'
      }
    ]
  },
  {
    id: 'mock-3',
    name: 'Basketball Championship',
    date: '2025-09-25',
    venue: 'Madison Square Garden',
    city: 'New York',
    category: 'sports',
    url: 'https://www.ticketmaster.com',
    images: [
      {
        url: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Basketball+Game',
        width: 400,
        height: 300
      }
    ],
    priceRanges: [
      {
        min: 100,
        max: 500,
        currency: 'USD'
      }
    ]
  },
  {
    id: 'mock-4',
    name: 'Broadway Musical',
    date: '2025-10-01',
    venue: 'Broadway Theater',
    city: 'New York',
    category: 'theater',
    url: 'https://www.ticketmaster.com',
    images: [
      {
        url: 'https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Broadway+Show',
        width: 400,
        height: 300
      }
    ],
    priceRanges: [
      {
        min: 80,
        max: 300,
        currency: 'USD'
      }
    ]
  },
  {
    id: 'mock-5',
    name: 'Art Exhibition Opening',
    date: '2025-10-05',
    venue: 'Museum of Modern Art',
    city: 'New York',
    category: 'arts',
    url: 'https://www.ticketmaster.com',
    images: [
      {
        url: 'https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Art+Exhibition',
        width: 400,
        height: 300
      }
    ],
    priceRanges: [
      {
        min: 20,
        max: 50,
        currency: 'USD'
      }
    ]
  }
];

export default mockEvents;
