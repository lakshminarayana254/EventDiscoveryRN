import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { homeStyles as styles } from '../styles/HomeScreenStyles';
import { showError } from '../utils/alertService';
import { useTicketmasterEvents, TicketmasterEvent } from '../hooks/useTicketmasterEvents';
import EventCard from '../components/EventCard';
import { secureStorage } from '../services/secureStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, addToFavorites, removeFromFavorites, isFavorite, favorites } = useAuth();
  //const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const { isRTL, t } = useLanguage();
  
  const [city, setCity] = useState('');
  const [keyword, setKeyword] = useState('');

  const { events, loading, error, fetchInitialEvents, searchEvents } = useTicketmasterEvents();

  const handleSearch = useCallback(() => {
    if (city.trim() || keyword.trim()) {
      searchEvents(city, keyword);
    } else {
      fetchInitialEvents();
    }
  }, [city, keyword, searchEvents, fetchInitialEvents]);

  const handleEventPress = useCallback((event: TicketmasterEvent) => {
    navigation.navigate('EventDetails', { event });
  }, [navigation]);

  const handleFavoritePress = useCallback(async (event: TicketmasterEvent) => {
    try {
      if (isFavorite(event.id)) {
        await removeFromFavorites(event.id);
      } else {
        await addToFavorites(event.id);
      }
    } catch (error) {
      showError('Failed to update favorites', 'Error');
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  const handleBooking = useCallback((event: TicketmasterEvent) => {
    if (event.url) {
      Linking.openURL(event.url).catch(() => {
        showError('Failed to open booking link', 'Error');
      });
    } else {
      showError('Booking link not available', 'Info');
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setCity('');
    setKeyword('');
    fetchInitialEvents();
  }, [fetchInitialEvents]);

  const renderEvent = useCallback(({ item }: { item: TicketmasterEvent }) => (
  <EventCard
    item={item}
    isRTL={isRTL}
    isFavorite={isFavorite(item.id)}
    onEventPress={handleEventPress}
    onFavoritePress={handleFavoritePress}
    onBookingPress={handleBooking}
  />
), [isRTL, isFavorite, handleEventPress, handleFavoritePress, handleBooking, favorites]); // Add favorites here

  const keyExtractor = useCallback((item: TicketmasterEvent) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 200,
    offset: 200 * index,
    index,
  }), []);

  const EmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No events found</Text>
      <Text style={styles.emptySubtext}>
        {city.trim() || keyword.trim() 
          ? "Try different search terms or clear search"
          : "No upcoming events available"
        }
      </Text>
    </View>
  ), [city, keyword]);

  const resultsText = useMemo(() => {
    if (city.trim() || keyword.trim()) {
      return `Found ${events.length} events${city.trim() ? ` in ${city}` : ''}${keyword.trim() ? ` for "${keyword}"` : ''}`;
    }
    return `${events.length} upcoming events across the US`;
  }, [events.length, city, keyword]);

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <TouchableOpacity
          style={[styles.profileButton, isRTL && styles.rtlProfileButton]}
          onPress={handleProfilePress}
        >
          <Text style={styles.profileButtonText}>👤</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isRTL && styles.rtlText]}>🎫 {t('nav.home')}</Text>
          {user && (
            <Text style={[styles.welcomeText, isRTL && styles.rtlText]}>
              {t('auth.welcome')}, {user.name || user.email}!
            </Text>
          )}
        </View>
        
        <View style={styles.headerSpacer} />
      </View>
      
      {/* Search Inputs */}
      <View style={[styles.searchContainer, isRTL && styles.rtlSearchContainer]}>
        <TextInput
          style={[styles.searchInput, isRTL && styles.rtlSearchInput, { marginBottom: 10 }]}
          placeholder="Enter city (e.g., New York, Los Angeles, Chicago)"
          placeholderTextColor="#777"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
        />
        <TextInput
          style={[styles.searchInput, isRTL && styles.rtlSearchInput]}
          placeholder="Enter event type (e.g., concert, sports, theater, comedy)"
          placeholderTextColor="#777"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
        />
        
        <View style={styles.searchButtonsContainer}>
          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>🔍 Find Events</Text>
            )}
          </TouchableOpacity>
          
          {(city.trim() || keyword.trim()) && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
              <Text style={styles.clearButtonText}>✕ Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {!loading && !error && (
        <View style={[styles.resultsHeader, isRTL && styles.rtlResultsHeader]}>
          <Text style={[styles.resultsCount, isRTL && styles.rtlText]}>
            {resultsText}
          </Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleSearch}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Events List */}
      {!loading && !error && (
        <FlatList
          data={events}
          keyExtractor={keyExtractor}
          renderItem={renderEvent}
          getItemLayout={getItemLayout}
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          ListEmptyComponent={EmptyComponent}
        />
      )}

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;