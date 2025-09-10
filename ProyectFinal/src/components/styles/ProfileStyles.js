import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../constants/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    profileContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.backgroundWhite,
        ...SHADOWS.light
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    userName: {
        fontSize: FONTS.big,
        fontWeight: 'bold',
        color: COLORS.textBlack,
        marginBottom: 5,
    },
    jobTitle: {
        fontSize: FONTS.regular,
        color: COLORS.textGray,
        marginBottom: 10,
    },
    contactInfo: {
        alignItems: 'center',
    },
    userEmail: {
        fontSize: FONTS.small,
        color: COLORS.textGray,
        marginBottom: 5,
    },
    userPhone: {
        fontSize: FONTS.small,
        color: COLORS.textGray,
    },
    preferencesSection: {
        marginTop: 20,
    },
    accountSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: FONTS.regular,
        fontWeight: 'bold',
        marginLeft: 15,
        marginBottom: 10,
        color: COLORS.textBlack,
    },
    preferenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.backgroundWhite,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderGray,
    },
    preferenceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    preferenceTextContainer: {
        marginLeft: 15,
    },
    preferenceTitle: {
        fontSize: FONTS.regular,
        color: COLORS.textBlack,
        marginBottom: 4,
    },
    preferenceSubtitle: {
        fontSize: FONTS.small,
        color: COLORS.textGray,
    },
    helpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundWhite,
        padding: 15,
        marginTop: 20,
    },
    helpButtonText: {
        marginLeft: 15,
        fontSize: FONTS.regular,
        color: COLORS.textBlack,
    },
    signOutButton: {
        padding: 15,
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    signOutText: {
        color: COLORS.error,
        fontSize: FONTS.regular,
    }
});