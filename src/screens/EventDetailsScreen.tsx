import React, { useLayoutEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Image, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { eventDetailsStyles as styles } from '../styles/EventDetailsScreenStyles';
import { showError, showInfo } from '../utils/alertService';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetails'>;

const EventDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { event } = route.params;
  const { addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const { isRTL, t } = useLanguage();

  const handleToggleFavorite = useCallback(async () => {
    try {
      if (isFavorite(event.id)) {
        await removeFromFavorites(event.id);
      } else {
        await addToFavorites(event.id);
      }
    } catch (error) {
      showError(t('eventDetails.favoritesError'), t('eventDetails.error'));
    }
  }, [event.id, isFavorite, addToFavorites, removeFromFavorites, t]);

  const handleBookNow = useCallback(() => {
    if (event.url) {
      Linking.openURL(event.url);
    } else {
      showInfo(t('eventDetails.bookingMessage'), t('eventDetails.booking'));
    }
  }, [event.url, t]);

  const handleShare = useCallback(() => {
    showInfo(t('eventDetails.shareMessage').replace('{eventName}', event.name), t('eventDetails.shareTitle'));
  }, [event.name, t]);

  const handleViewMap = useCallback(() => {
    const address = `${event.venue}, ${event.city}`;
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
    
    Linking.openURL(mapUrl).catch(() => {
      showError(t('eventDetails.mapError'), t('eventDetails.error'));
    });
  }, [event.venue, event.city, t]);

  const getCategoryEmoji = useMemo(() => {
    const category = event.category?.toLowerCase() || 'general';
    switch (category) {
      case 'music': 
      case 'musical': 
      case 'concerts': return '🎵';
      case 'comedy': return '😄';
      case 'sports': 
      case 'sport': return '⚽';
      case 'theater': 
      case 'theatre': 
      case 'arts & theatre': return '🎭';
      case 'art': 
      case 'arts': return '🎨';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'film': return '🎬';
      case 'miscellaneous': 
      case 'undefined': 
      default: return '🎫';
    }
  }, [event.category]);

  const formattedDate = useMemo(() => {
    const date = new Date(event.date);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [event.date]);

  const eventTime = useMemo(() => {
    const date = new Date(event.date);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }, [event.date]);

  const eventImage = useMemo(() => {
    if (event.images && event.images.length > 0) {
      // Find the best image size (preferably landscape and medium size)
      const sortedImages = event.images
        .filter(img => img.width && img.height)
        .sort((a, b) => {
          // Prefer landscape images and medium sizes
          const aRatio = a.width / a.height;
          const bRatio = b.width / b.height;
          const aSize = a.width * a.height;
          const bSize = b.width * b.height;
          
          // Prefer landscape (ratio > 1) and reasonable size
          if (aRatio > 1 && bRatio <= 1) return -1;
          if (bRatio > 1 && aRatio <= 1) return 1;
          
          // If both are landscape or both are portrait, prefer medium size
          const idealSize = 300 * 200; // Target size
          const aDiff = Math.abs(aSize - idealSize);
          const bDiff = Math.abs(bSize - idealSize);
          
          return aDiff - bDiff;
        });
      
      return sortedImages[0]?.url;
    }
    return null;
  }, [event.images]);

  const priceInfo = useMemo(() => {
    if (event.priceRanges && event.priceRanges.length > 0) {
      const priceRange = event.priceRanges[0];
      if (priceRange.min === priceRange.max) {
        return `${priceRange.currency} ${priceRange.min}`;
      }
      return `${priceRange.currency} ${priceRange.min} - ${priceRange.max}`;
    }
    return null;
  }, [event.priceRanges]);

  const eventDescription = useMemo(() => {
    const category = event.category?.toLowerCase() || 'general';
    const descriptions = {
      music: `Experience live music at its finest! Join us for an unforgettable evening of ${event.name} at ${event.venue}. This musical event promises to deliver exceptional entertainment with top-notch sound quality and an amazing atmosphere.`,
      comedy: `Get ready to laugh until your sides hurt! ${event.name} brings the best comedy entertainment to ${event.venue}. Enjoy an evening filled with humor, wit, and unforgettable moments.`,
      sports: `Don't miss this exciting sporting event! ${event.name} at ${event.venue} promises thrilling action and competitive spirit. Be part of the crowd and experience the energy firsthand.`,
      theater: `Immerse yourself in the world of live theater! ${event.name} at ${event.venue} offers a captivating performance that will leave you mesmerized. Experience the magic of live storytelling.`,
      family: `Perfect for the whole family! ${event.name} at ${event.venue} offers entertainment suitable for all ages. Create lasting memories with your loved ones at this special event.`,
      default: `Join us for ${event.name} at ${event.venue}. This exciting event promises great entertainment and an unforgettable experience. Don't miss out on this amazing opportunity!`
    };
    
    return descriptions[category as keyof typeof descriptions] || descriptions.default;
  }, [event.category, event.name, event.venue]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.favoriteHeaderButton}
            onPress={handleToggleFavorite}
          >
            <Text style={styles.favoriteHeaderIcon}>
              {isFavorite(event.id) ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileButtonText}>👤</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, event.id, isFavorite(event.id), handleToggleFavorite]);

  return (
    <ScrollView style={[styles.container, isRTL && styles.rtlContainer]}>
      {/* Event Image */}
      {eventImage && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: eventImage }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Header Section */}
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <Text style={[styles.eventTitle, isRTL && styles.rtlText]}>{event.name}</Text>
        <View style={[styles.categoryBadge, isRTL && styles.rtlCategoryBadge]}>
          <Text style={[styles.categoryEmoji, isRTL && styles.rtlCategoryEmoji]}>{getCategoryEmoji}</Text>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
      </View>

      {/* Price Information */}
      {priceInfo && (
        <View style={[styles.priceSection, isRTL && styles.rtlPriceSection]}>
          <Text style={[styles.priceLabel, isRTL && styles.rtlText]}>💰 Price Range</Text>
          <Text style={[styles.priceValue, isRTL && styles.rtlText]}>{priceInfo}</Text>
        </View>
      )}

      {/* Map Preview Section */}
      <View style={[styles.mapPreview, isRTL && styles.rtlMapPreview]}>
        <TouchableOpacity style={[styles.mapContainer, isRTL && styles.rtlMapContainer]} onPress={handleViewMap}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <View style={[styles.mapContent, isRTL && styles.rtlMapContent]}>
            <Text style={[styles.mapTitle, isRTL && styles.rtlText]}>{t('eventDetails.location')}</Text>
            <Text style={[styles.mapAddress, isRTL && styles.rtlText]}>{event.venue}</Text>
            <Text style={[styles.mapCity, isRTL && styles.rtlText]}>{event.city}</Text>
          </View>
          <Text style={[styles.mapArrow, isRTL && styles.rtlMapArrow]}>→</Text>
        </TouchableOpacity>
        <Text style={[styles.mapButtonLabel, isRTL && styles.rtlText]}>{t('eventDetails.tapToViewMap')}</Text>
      </View>

      {/* Event Details Section */}
      <View style={[styles.infoSection, isRTL && styles.rtlInfoSection]}>
        <View style={[styles.infoCard, isRTL && styles.rtlInfoCard]}>
          <Text style={[styles.infoIcon, isRTL && styles.rtlInfoIcon]}>📅</Text>
          <View style={[styles.infoContent, isRTL && styles.rtlInfoContent]}>
            <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>{t('eventDetails.date')}</Text>
            <Text style={[styles.infoValue, isRTL && styles.rtlText]}>{formattedDate}</Text>
            <Text style={[styles.infoSubtext, isRTL && styles.rtlText]}>{eventTime}</Text>
          </View>
        </View>
        
        <View style={[styles.infoCard, isRTL && styles.rtlInfoCard]}>
          <Text style={[styles.infoIcon, isRTL && styles.rtlInfoIcon]}>🏛️</Text>
          <View style={[styles.infoContent, isRTL && styles.rtlInfoContent]}>
            <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>{t('eventDetails.venue')}</Text>
            <Text style={[styles.infoValue, isRTL && styles.rtlText]}>{event.venue}</Text>
            <Text style={[styles.infoSubtext, isRTL && styles.rtlText]}>{event.city}</Text>
          </View>
        </View>
        
        <View style={[styles.infoCard, isRTL && styles.rtlInfoCard]}>
          <Text style={[styles.infoIcon, isRTL && styles.rtlInfoIcon]}>{getCategoryEmoji}</Text>
          <View style={[styles.infoContent, isRTL && styles.rtlInfoContent]}>
            <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>{t('eventDetails.category')}</Text>
            <Text style={[styles.infoValue, isRTL && styles.rtlText]}>{event.category}</Text>
          </View>
        </View>

        {/* Ticketmaster Source */}
        <View style={[styles.infoCard, isRTL && styles.rtlInfoCard]}>
          <Text style={[styles.infoIcon, isRTL && styles.rtlInfoIcon]}>🎫</Text>
          <View style={[styles.infoContent, isRTL && styles.rtlInfoContent]}>
            <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>Source</Text>
            <Text style={[styles.infoValue, isRTL && styles.rtlText]}>Ticketmaster</Text>
            <Text style={[styles.infoSubtext, isRTL && styles.rtlText]}>Live event data</Text>
          </View>
        </View>
      </View>

      {/* Description Section */}
      <View style={[styles.descriptionSection, isRTL && styles.rtlDescriptionSection]}>
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('eventDetails.description')}</Text>
        <Text style={[styles.description, isRTL && styles.rtlText]}>
          {eventDescription}
        </Text>
      </View>

      {/* Additional Information */}
      <View style={[styles.additionalInfo, isRTL && styles.rtlAdditionalInfo]}>
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('eventDetails.additionalInfo')}</Text>
        
        <View style={[styles.detailRow, isRTL && styles.rtlDetailRow]}>
          <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>Event ID:</Text>
          <Text style={[styles.detailValue, isRTL && styles.rtlText]}>{event.id}</Text>
        </View>
        
        {priceInfo && (
          <View style={[styles.detailRow, isRTL && styles.rtlDetailRow]}>
            <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>Price Range:</Text>
            <Text style={[styles.detailValue, isRTL && styles.rtlText]}>{priceInfo}</Text>
          </View>
        )}
        
        <View style={[styles.detailRow, isRTL && styles.rtlDetailRow]}>
          <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>Category:</Text>
          <Text style={[styles.detailValue, isRTL && styles.rtlText]}>{event.category}</Text>
        </View>
        
        {event.url && (
          <View style={[styles.detailRow, isRTL && styles.rtlDetailRow]}>
            <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>Booking:</Text>
            <Text style={[styles.detailValue, isRTL && styles.rtlText]}>Available on Ticketmaster</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={[styles.actionButtons, isRTL && styles.rtlActionButtons]}>
        {event.url ? (
          <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
            <Text style={styles.bookButtonText}>🎫 Book on Ticketmaster</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.bookButton, styles.bookButtonDisabled]} disabled>
            <Text style={[styles.bookButtonText, styles.bookButtonTextDisabled]}>Booking Unavailable</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>📤 {t('eventDetails.shareEvent')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EventDetailsScreen;
