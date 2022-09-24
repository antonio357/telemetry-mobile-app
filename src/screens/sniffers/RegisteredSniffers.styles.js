import { StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  view: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 20,
  }
});