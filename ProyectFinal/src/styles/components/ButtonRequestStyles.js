import { StyleSheet } from 'react-native';
import { FONTS, RADIUS } from '../../components/constants/theme';

/**
 * Estilos base para ButtonRequest
 * Los estilos de colores y tamaños específicos se pasan como props
 */
export default StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    gap: 6,
    // NO definimos width ni flex aquí para que el usuario lo controle vía props
  },
  buttonText: {
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
