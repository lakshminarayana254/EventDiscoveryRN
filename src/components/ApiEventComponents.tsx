import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ApiComponent, useApiCall } from './ApiComponent';
import { useAuth } from '../contexts/AuthContext';
import { showError } from '../utils/alertService';

// Event List Component using API Component
interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  category: string;
  price?: {
    min: number;
    max: number;
    currency: string;
  };
}

interface EventListProps {
  filters?: {
    category?: string;
    city?: string;
    search?: string;
  };
  onEventPress?: (event: Event) => void;
  refreshInterval?: number;
}

export const EventListComponent: React.FC<EventListProps> = ({
  filters,
  onEventPress,
  refreshInterval,
}) => {
  // Get favorites functionality from AuthContext
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();

  // Handle favorite press
  const handleFavoritePress = async (event: Event) => {
    console.log('Favorite pressed for event:', event.id);
    
    if (!user) {
      showError('Please sign in to add favorites', 'Authentication Required');
      return;
    }

    try {
      if (isFavorite(event.id)) {
        console.log('Removing from favorites...');
        await removeFromFavorites(event.id);
      } else {
        console.log('Adding to favorites...');
        await addToFavorites(event.id);
      }
    } catch (error: any) {
      console.error('Error updating favorites:', error);
      showError(error.message || 'Failed to update favorites', 'Error');
    }
  };

  // Mock API function for now (replace with real API when available)
  const fetchEvents = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with: return BankingApiService.getEvents(filters);
    return {
      events: [
        {
          id: 'api_event_1',
          name: 'Rock Concert Live',
          date: '2024-12-15T19:00:00Z',
          venue: 'Madison Square Garden',
          city: 'New York',
          category: 'music',
          price: { min: 50, max: 200, currency: 'USD' },
        },
        {
          id: 'api_event_2',
          name: 'Comedy Night Special',
          date: '2024-12-20T20:00:00Z',
          venue: 'Comedy Cellar',
          city: 'New York',
          category: 'comedy',
          price: { min: 25, max: 75, currency: 'USD' },
        },
        {
          id: 'api_event_3',
          name: 'Basketball Championship',
          date: '2024-12-25T18:00:00Z',
          venue: 'Barclays Center',
          city: 'Brooklyn',
          category: 'sports',
          price: { min: 100, max: 500, currency: 'USD' },
        },
      ],
      total: 3,
      page: 1,
      totalPages: 1,
    };
  };

  const renderEventCard = (event: Event) => {
    const isEventFavorite = isFavorite(event.id);
    
    return (
      <TouchableOpacity
        key={event.id}
        style={styles.eventCard}
        onPress={() => onEventPress?.(event)}
        activeOpacity={0.7}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.eventCategory}>{event.category.toUpperCase()}</Text>
        </View>
        
        <Text style={styles.eventVenue}>{event.venue}</Text>
        <Text style={styles.eventLocation}>{event.city}</Text>
        <Text style={styles.eventDate}>
          {new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        
        {event.price && (
          <Text style={styles.eventPrice}>
            ${event.price.min} - ${event.price.max}
          </Text>
        )}

        {/* Favorite Button */}
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isEventFavorite ? styles.favoriteButtonActive : styles.favoriteButtonInactive
          ]}
          onPress={() => handleFavoritePress(event)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.favoriteButtonText,
            isEventFavorite ? styles.favoriteTextActive : styles.favoriteTextInactive
          ]}>
            {isEventFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
          </Text>
        </TouchableOpacity>

        {/* Debug Info (remove in production) */}
        <Text style={styles.debugText}>
          ID: {event.id} | Fav: {isEventFavorite ? 'YES' : 'NO'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEventList = (data: any) => (
    <FlatList
      data={data.events}
      renderItem={({ item }) => renderEventCard(item)}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      extraData={user} // Re-render when user/favorites change
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎭</Text>
      <Text style={styles.emptyTitle}>No Events Found</Text>
      <Text style={styles.emptyMessage}>
        Try adjusting your search filters or check back later for new events.
      </Text>
    </View>
  );

  return (
    <ApiComponent
      apiFunction={fetchEvents}
      renderData={renderEventList}
      renderEmpty={renderEmpty}
      isEmpty={(data) => !data.events || data.events.length === 0}
      refreshInterval={refreshInterval}
      onSuccess={(data) => console.log('✅ Events loaded:', data.events.length)}
      onError={(error) => console.error('❌ Events error:', error)}
    />
  );
};

// User Profile Component with Favorites Count
interface UserProfile {
  id: string;
  name: string;
  email: string;
  favoriteEvents: string[];
  createdAt: string;
}

interface UserProfileProps {
  onEditPress?: () => void;
}

export const UserProfileComponent: React.FC<UserProfileProps> = ({ onEditPress }) => {
  // Get current user and favorites from AuthContext
  const { user, favorites } = useAuth();

  const fetchUserProfile = async (): Promise<UserProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Use real user data from AuthContext
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    return {
      id: user.id,
      name: user.name || 'User',
      email: user.email,
      favoriteEvents: favorites, // Use real favorites
      createdAt: user.createdAt,
    };
  };

  const renderProfile = (profile: UserProfile) => (
    <View style={styles.profileContainer}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.userName}>{profile.name}</Text>
      <Text style={styles.userEmail}>{profile.email}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profile.favoriteEvents.length}</Text>
          <Text style={styles.statLabel}>Favorite Events</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
          </Text>
          <Text style={styles.statLabel}>Days Member</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = (error: string, retry: () => Promise<UserProfile>) => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>👤</Text>
      <Text style={styles.errorTitle}>Profile Error</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={retry}>
        <Text style={styles.retryButtonText}>Reload Profile</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ApiComponent
      apiFunction={fetchUserProfile}
      renderData={renderProfile}
      renderError={renderError}
      showRefreshControl={true}
      onSuccess={(profile) => console.log('✅ Profile loaded:', profile.name)}
      onError={(error) => console.error('❌ Profile error:', error)}
    />
  );
};

// Standalone hook usage example
export const useEventData = (eventId: string) => {
  const fetchEvent = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: eventId,
      name: 'Sample Event',
      date: '2024-12-15T19:00:00Z',
      venue: 'Sample Venue',
      city: 'Sample City',
      category: 'music',
    };
  };

  return useApiCall(fetchEvent, {
    autoFetch: true,
    onSuccess: (data) => console.log('Event loaded:', data.name),
    onError: (error) => console.error('Event error:', error),
  });
};

// Styles
const styles = StyleSheet.create({
  // Event Card Styles
  listContainer: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  eventCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventVenue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  eventPrice: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  // Favorite Button Styles
  favoriteButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  favoriteButtonActive: {
    backgroundColor: '#ffe6e6',
    borderColor: '#ff4444',
  },
  favoriteButtonInactive: {
    backgroundColor: '#f8f8f8',
    borderColor: '#ccc',
  },
  favoriteButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  favoriteTextActive: {
    color: '#ff4444',
  },
  favoriteTextInactive: {
    color: '#666',
  },

  // Debug Text
  debugText: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'Courier',
    marginTop: 5,
    backgroundColor: '#f0f0f0',
    padding: 3,
    borderRadius: 3,
  },
  
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Profile Styles
  profileContainer: {
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Error Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventListComponent;