import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TicketmasterEvent } from '../hooks/useTicketmasterEvents';
import { homeStyles as styles } from '../styles/HomeScreenStyles';

interface EventCardProps {
  item: TicketmasterEvent;
  isRTL: boolean;
  isFavorite: boolean;
  onEventPress: (event: TicketmasterEvent) => void;
  onFavoritePress: (event: TicketmasterEvent) => void;
  onBookingPress: (event: TicketmasterEvent) => void;
}

const EventCard = memo<EventCardProps>(({ 
  item, 
  isRTL, 
  isFavorite, 
  onEventPress, 
  onFavoritePress, 
  onBookingPress 
}) => {
  const handleEventPress = useCallback(() => {
    onEventPress(item);
  }, [item, onEventPress]);

  const handleFavoritePress = useCallback(() => {
    onFavoritePress(item);
  }, [item, onFavoritePress]);

  const handleBookingPress = useCallback(() => {
    onBookingPress(item);
  }, [item, onBookingPress]);

  const formattedDate = useCallback(() => {
    return new Date(item.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [item.date]);

  return (
    <TouchableOpacity
      style={[styles.eventCard, isRTL && styles.rtlEventCard]}
      onPress={handleEventPress}
      activeOpacity={0.7}
    >
      <View style={styles.eventHeader}>
        <Text style={[styles.eventName, isRTL && styles.rtlText]} numberOfLines={2}>
          {item.name}
        </Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.eventVenue, isRTL && styles.rtlText]} numberOfLines={1}>
        {item.venue}
      </Text>
      <Text style={[styles.eventLocation, isRTL && styles.rtlText]}>
        {item.city}
      </Text>
      <Text style={[styles.eventDate, isRTL && styles.rtlText]}>
        {formattedDate()}
      </Text>
      
      {item.priceRanges && item.priceRanges.length > 0 && (
        <Text style={[styles.eventPrice, isRTL && styles.rtlText]}>
          From {item.priceRanges[0].currency} {item.priceRanges[0].min}
        </Text>
      )}
      
      <View style={[styles.eventActions, isRTL && styles.rtlEventActions]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEventPress}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <Text style={styles.actionIcon}>👁️</Text>
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleBookingPress}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <Text style={styles.actionIcon}>🎫</Text>
          <Text style={styles.actionText}>Book</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.date === nextProps.item.date &&
    prevProps.item.venue === nextProps.item.venue &&
    prevProps.item.city === nextProps.item.city &&
    prevProps.isRTL === nextProps.isRTL &&
    prevProps.isFavorite === nextProps.isFavorite &&
    JSON.stringify(prevProps.item.priceRanges) === JSON.stringify(nextProps.item.priceRanges)
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;