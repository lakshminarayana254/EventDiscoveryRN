import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface EyeIconProps {
  isVisible: boolean;
  size?: number;
  color?: string;
}

export const EyeIcon: React.FC<EyeIconProps> = ({ 
  isVisible, 
  size = 14, 
  color = '#007AFF' 
}) => {
  return (
    <Text style={[
      styles.icon, 
      { 
        fontSize: size, 
        color: color,
      }
    ]}>
      {isVisible ? 'Hide' : 'Show'}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
    fontWeight: '600',
    includeFontPadding: false,
  },
});

export default EyeIcon;
