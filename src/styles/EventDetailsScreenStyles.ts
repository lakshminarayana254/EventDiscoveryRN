import { StyleSheet } from 'react-native';

export const eventDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center'
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 5
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333'
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    lineHeight: 30
  },
  infoSection: {
    padding: 20
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 15,
    marginTop: 5
  },
  infoContent: {
    flex: 1
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: '500'
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  infoSubtext: {
    fontSize: 14,
    color: '#999'
  },
  descriptionSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555'
  },
  additionalInfo: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400'
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 10
  },
  bookButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  shareButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600'
  },
  profileButton: {
    padding: 8,
    marginRight: 5,
  },
  profileButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteHeaderButton: {
    padding: 8,
    marginRight: 8,
  },
  favoriteHeaderIcon: {
    fontSize: 18,
  },
  // RTL styles
  rtlContainer: {
    direction: 'rtl',
  },
  rtlHeader: {
    direction: 'rtl',
  },
  rtlCategoryBadge: {
    flexDirection: 'row-reverse',
  },
  rtlCategoryEmoji: {
    marginLeft: 5,
    marginRight: 0,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rtlInfoSection: {
    direction: 'rtl',
  },
  rtlInfoCard: {
    flexDirection: 'row-reverse',
  },
  rtlInfoIcon: {
    marginLeft: 15,
    marginRight: 0,
  },
  rtlInfoContent: {
    direction: 'rtl',
  },
  rtlDescriptionSection: {
    direction: 'rtl',
  },
  rtlAdditionalInfo: {
    direction: 'rtl',
  },
  rtlDetailRow: {
    flexDirection: 'row-reverse',
  },
  rtlActionButtons: {
    flexDirection: 'row-reverse',
  },
  // Map styles
  mapButton: {
    padding: 8,
    marginLeft: 10,
  },
  mapButtonText: {
    fontSize: 18,
  },
  mapPreview: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  mapContent: {
    flex: 1,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  mapAddress: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  mapCity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  mapArrow: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
  },
  mapButtonLabel: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  // RTL Map styles
  rtlMapPreview: {
    direction: 'rtl',
  },
  rtlMapContainer: {
    flexDirection: 'row-reverse',
  },
  rtlMapContent: {
    direction: 'rtl',
  },
  rtlMapArrow: {
    marginRight: 10,
    marginLeft: 0,
  },
  // Image styles
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  // Price styles
  priceSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  rtlPriceSection: {
    direction: 'rtl',
    flexDirection: 'row-reverse',
  },
  // Disabled button styles
  bookButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonTextDisabled: {
    color: '#999',
  },
});
