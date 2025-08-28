import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundWhite,
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  infoContainer: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    width: '80%',
    alignSelf: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: FONTS.regular,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginBottom: 4,
  },
  infoText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    lineHeight: 20,
  },
  group: {
    width: '80%',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    marginBottom: 8,
    color: COLORS.textBlack,
    fontSize: FONTS.regular,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  spamText: {
    fontSize: FONTS.small,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    width: '80%',
  },
  bannerContainer: {
    width: '100%',    
    height: 60,
    justifyContent: 'center',
    marginBottom: 20,
  },
});