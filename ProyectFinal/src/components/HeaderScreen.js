import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles/HeaderScreenStyles";

export default function HeaderScreen({ title, leftIcon, rightIcon, onLeftPress, onRightPress }) {
  return (

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onLeftPress}>
          {leftIcon}
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onRightPress}>
          {rightIcon}
        </TouchableOpacity>
      </View>
 
    
  );
}