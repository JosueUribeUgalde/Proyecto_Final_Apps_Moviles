// Componente de botón reutilizable para peticiones (aprobar, rechazar, etc.)
import React from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/components/ButtonRequestStyles';

/**
 * ButtonRequest - Botón personalizable para acciones de peticiones
 * 
 * @param {string} title - Texto del botón
 * @param {string} icon - Nombre del ícono de Ionicons
 * @param {string} iconColor - Color del ícono
 * @param {string} textColor - Color del texto
 * @param {string} backgroundColor - Color de fondo del botón
 * @param {string} borderColor - Color del borde (opcional)
 * @param {function} onPress - Función a ejecutar al presionar
 * @param {object} style - Estilos adicionales del contenedor (para width, flex, etc.)
 * @param {boolean} disabled - Estado deshabilitado (opcional)
 */
const ButtonRequest = ({
  title,
  icon,
  iconColor,
  textColor,
  backgroundColor,
  borderColor = null,
  onPress,
  style = {},
  disabled = false,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: backgroundColor,
          borderColor: borderColor || 'transparent',
          borderWidth: borderColor ? 1 : 0,
        },
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style, // Permite al usuario controlar width, flex, margins, etc.
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && <Ionicons name={icon} size={20} color={iconColor} />}
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
};

export default ButtonRequest;
