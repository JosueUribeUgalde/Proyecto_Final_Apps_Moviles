import { View, Text, Animated } from 'react-native';
import { useState, useEffect } from 'react';
import styles from '../styles/components/BannerStyles';
import { Ionicons } from '@expo/vector-icons';

export default function Banner({ message, type = 'error', visible, onHide }) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Llamar a onHide cuando la animación termine
        onHide && onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <Ionicons name="alert-circle" size={24} color="white" />;
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color="white" />;
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, styles[type], { opacity: fadeAnim }]}>
      <View style={styles.content}>
        {getIcon()}
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}