import { StyleSheet } from 'react-native';
import { COLORS,RADIUS,FONTS } from '../../components/constants/theme';

export default StyleSheet.create({
input:{
    backgroundColor:COLORS.backgroundWhite,
    borderRadius: RADIUS.md,
    borderColor: COLORS.borderSecondary,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 8,
    width: '100%',
},
inputText:{
    color: COLORS.textBlack,
    fontSize: FONTS.regular,
    fontWeight: 'normal',
    textAlign: 'center',
},
});