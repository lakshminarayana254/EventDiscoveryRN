import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { profileStyles as styles } from '../styles/ProfileScreenStyles';
import { showConfirmation, showError, showInfo } from '../utils/alertService';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, signOut, favorites } = useAuth();
  const { language, isRTL, toggleLanguage, t } = useLanguage();

  const handleSignOut = useCallback(async () => {
    showConfirmation({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      destructive: true,
      onConfirm: async () => {
        try {
          await signOut();
        } catch (error: any) {
          showError('Failed to sign out: ' + error.message, 'Error');
        }
      },
    });
  }, [signOut]);

  const handleEditProfile = useCallback(() => {
    showInfo('Profile editing feature coming soon!', 'Edit Profile');
  }, []);

  const avatarText = useMemo(() => {
    return user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
  }, [user?.name, user?.email]);

  const favoriteEventsCount = useMemo(() => {
    return favorites?.length || 0;
  }, [favorites?.length]);

  const languageDisplayText = useMemo(() => {
    return `🌐 Language: ${language === 'en' ? 'English' : 'Arabic'}`;
  }, [language]);

  const userCreatedDate = useMemo(() => {
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString();
    }
    return 'Not Available';
  }, [user?.createdAt]);

  const userLastLogin = useMemo(() => {
    if (user?.lastLogin) {
      return new Date(user.lastLogin).toLocaleDateString();
    }
    return 'Not Available';
  }, [user?.lastLogin]);

  return (
    <SafeAreaView style={[styles.container, isRTL && styles.rtlContainer]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Avatar and Basic Info */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {avatarText}
              </Text>
            </View>
          </View>
          <Text style={[styles.userName, isRTL && styles.rtlText]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.userEmail, isRTL && styles.rtlText]}>
            {user?.email}
          </Text>
        </View>

        {/* Account Information Section */}
        <View style={[styles.section, isRTL && styles.rtlSection]}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            Account Information
          </Text>
          
          <View style={[styles.infoItem, isRTL && styles.rtlInfoItem]}>
            <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
              Full Name
            </Text>
            <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
              {user?.name || 'Not Provided'}
            </Text>
          </View>
          
          <View style={[styles.infoItem, isRTL && styles.rtlInfoItem]}>
            <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
              Email Address
            </Text>
            <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
              {user?.email}
            </Text>
          </View>
          
          <View style={[styles.infoItem, isRTL && styles.rtlInfoItem]}>
            <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
              User ID
            </Text>
            <Text style={[styles.infoValue, styles.userIdText, isRTL && styles.rtlText]} numberOfLines={1}>
              {user?.id}
            </Text>
          </View>
          
          <View style={[styles.infoItem, isRTL && styles.rtlInfoItem]}>
            <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
              Member Since
            </Text>
            <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
              {userCreatedDate}
            </Text>
          </View>
          
          <View style={[styles.infoItem, isRTL && styles.rtlInfoItem]}>
            <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
              Last Login
            </Text>
            <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
              {userLastLogin}
            </Text>
          </View>
        </View>

        {/* Activity Section */}
        <View style={[styles.section, isRTL && styles.rtlSection]}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            Activity
          </Text>
          
          <View style={[styles.infoItem, isRTL && styles.rtlInfoItem]}>
            <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
              ❤️ Favorite Events
            </Text>
            <Text style={[styles.infoValue, styles.favoriteCount, isRTL && styles.rtlText]}>
              {favoriteEventsCount} events
            </Text>
          </View>
        </View>

        {/* Actions Section */}
        <View style={[styles.section, isRTL && styles.rtlSection]}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            Settings & Actions
          </Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <Text style={styles.actionButtonText}>
              ✏️ Edit Profile
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={toggleLanguage}>
            <Text style={styles.actionButtonText}>
              {languageDisplayText}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.signOutButton]} 
            onPress={handleSignOut}
          >
            <Text style={[styles.actionButtonText, styles.signOutButtonText]}>
              🚪 Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;