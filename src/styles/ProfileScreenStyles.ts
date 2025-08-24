import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  avatarContainer: {
    marginBottom: 15,
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
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
  },
  signOutButtonText: {
    color: '#FFFFFF',
  },
  // RTL styles
  rtlContainer: {
    direction: 'rtl',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rtlSection: {
    direction: 'rtl',
  },
  rtlInfoItem: {
    flexDirection: 'row-reverse',
  },
// Add these styles to your ProfileScreenStyles.ts:

navigationHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#E0E0E0',
  backgroundColor: '#fff',
},
rtlNavigationHeader: {
  flexDirection: 'row-reverse',
},
backButton: {
  padding: 10,
  marginRight: 10,
},
rtlBackButton: {
  marginRight: 0,
  marginLeft: 10,
},
backButtonText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#007AFF',
},
headerTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  flex: 1,
  textAlign: 'center',
},
headerSpacer: {
  width: 44, // Same width as back button for centering
},
favoriteCount: {
  fontWeight: 'bold',
  color: '#FF6B6B',
},
userIdText: {
  fontSize: 12,
  fontFamily: 'Courier', // Monospace font for IDs
}
});
