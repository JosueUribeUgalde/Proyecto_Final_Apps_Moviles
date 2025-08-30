import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        alignItems: 'center',
        backgroundColor: COLORS.background,

        borderTopWidth: 1,
        borderTopColor: COLORS.borderSecondary,
        width: '100%',
    },
    button: {
        alignItems: 'center',
        padding: 5,
    },
    buttonText: {
        color: COLORS.textGray,
        fontSize: FONTS.small,
    }
});