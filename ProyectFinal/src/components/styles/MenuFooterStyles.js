import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

// Calcula el ancho exacto para cada botón (pantalla dividida en 5)
const screenWidth = Dimensions.get('window').width;
const buttonWidth = screenWidth / 5;

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Cambiado de center a space-between
        alignItems: 'center',
        backgroundColor: COLORS.background,
        paddingVertical: 4, // Añadido padding vertical
        borderTopWidth: 1,
        borderTopColor: COLORS.borderSecondary,
        width: '100%',
    },
    button: {
        alignItems: 'center',
        width: buttonWidth, // Ancho fijo para cada botón
        paddingVertical: 5,
    },
    buttonText: {
        color: COLORS.textGray,
        fontSize: FONTS.small,
        marginTop: 4, // Espacio entre el icono y el texto
        textAlign: 'center', // Centrar el texto
    }
});