import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { customButtonStyles } from './CustomButton.styles';

export const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    let styles = [customButtonStyles.button];
    
    if (variant === 'primary') {
      styles.push(customButtonStyles.primaryButton);
    } else if (variant === 'secondary') {
      styles.push(customButtonStyles.secondaryButton);
    }
    
    if (disabled) {
      styles.push(customButtonStyles.disabledButton);
    }
    
    return styles;
  };

  const getTextStyle = () => {
    let styles = [customButtonStyles.buttonText];
    
    if (variant === 'primary') {
      styles.push(customButtonStyles.primaryButtonText);
    } else if (variant === 'secondary') {
      styles.push(customButtonStyles.secondaryButtonText);
    }
    
    if (disabled) {
      styles.push(customButtonStyles.disabledButtonText);
    }
    
    return styles;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};