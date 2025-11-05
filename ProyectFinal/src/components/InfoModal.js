import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles/InfoModalStyles';
import { COLORS } from './constants/theme';

export default function InfoModal({ 
  visible, 
  onClose, 
  title = 'Información',
  message 
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Ionicons name="information-circle" size={40} color={COLORS.primary} />
            <Text style={styles.title}>{title}</Text>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.message}>{message}</Text>
          </View>
          
          <Pressable 
            style={({ pressed }) => [
              styles.closeButton,
              pressed && { opacity: 0.7 }
            ]} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Entendido</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
