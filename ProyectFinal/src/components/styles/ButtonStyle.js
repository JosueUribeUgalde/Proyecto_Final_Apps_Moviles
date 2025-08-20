import { StyleSheet } from 'react-native';
import { COLORS,RADIUS,FONTS } from '../constants/theme';

export default StyleSheet.create({
button:{
    backgroundColor:COLORS.backgroundBP,
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '80%',
},
buttonText:{
    color: COLORS.textWhite,
    fontSize: FONTS.large,
    fontWeight: 'bold',
    textAlign: 'center',
},
});