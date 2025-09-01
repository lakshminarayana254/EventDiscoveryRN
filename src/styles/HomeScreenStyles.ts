import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 5,
    color: '#333'
  },
  searchContainer: {
    marginBottom: 20
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  searchHint: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 5,
    textAlign: 'center',
  },
  resultsHeader: {
    marginBottom: 15
  },
  resultsCount: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500'
  },
  eventsList: {
    flex: 1
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  categoryEmoji: {
    fontSize: 20
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  eventCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    fontStyle: 'italic'
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 18,
    marginBottom: 5
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#bbb',
    fontSize: 14
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 50, // Same width as profile button to balance layout
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  eventTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 8,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  // Map and action styles
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapButton: {
    padding: 8,
    marginRight: 8,
  },
  mapIcon: {
    fontSize: 18,
  },
  // RTL styles
  rtlEventCard: {
    direction: 'rtl',
  },
  rtlEventHeader: {
    flexDirection: 'row-reverse',
  },
  rtlEventTitleContainer: {
    flexDirection: 'row-reverse',
  },
  rtlEventActions: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rtlContainer: {
    direction: 'rtl',
  },
  rtlHeader: {
    flexDirection: 'row-reverse',
  },
  rtlSearchContainer: {
    direction: 'rtl',
  },
  rtlSearchInput: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rtlSearchHint: {
    textAlign: 'center',
    direction: 'rtl',
  },
  rtlResultsHeader: {
    direction: 'rtl',
  },
  // Profile button styles
  profileButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  rtlProfileButton: {
    direction: 'rtl',
  },
  // Event detail styles
  eventVenue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    fontWeight: '500',
  },
  eventLocation: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  eventPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
  },
  // Action button styles
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  // Search button styles
  searchButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  searchButtonDisabled: {
    backgroundColor: '#ccc',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // Error and loading styles
  errorContainer: {
    backgroundColor: '#ffe6e6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  loadingMoreContainer: {
  paddingVertical: 20,
  paddingHorizontal: 16,
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
},
loadingMoreText: {
  marginTop: 8,
  fontSize: 14,
  color: '#666',
  textAlign: 'center',
},
});
