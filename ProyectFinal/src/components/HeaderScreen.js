import { View, Text, Pressable } from "react-native";
import styles from "./styles/HeaderScreenStyles";

export default function HeaderScreen({ title, leftIcon, rightIcon, onLeftPress, onRightPress }) {
  return (
    <View style={styles.headerRow}>
      <Pressable 
        onPress={onLeftPress}
        style={({ pressed }) => pressed && { opacity: 0.5 }}
      >
        {leftIcon}
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Pressable 
        onPress={onRightPress}
        style={({ pressed }) => pressed && { opacity: 0.5 }}
      >
        {rightIcon}
      </Pressable>
    </View>
  );
}