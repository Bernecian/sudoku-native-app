import { Icon, View, Text, ICustomTheme, useTheme } from "native-base";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  actions: {
    onPressNewGame: (difficulty?: "Easy" | "Medium" | "Hard") => void;
    onPressHint: () => void;
    onPressUndo: () => void;
    onPressErase: () => void;
  };
};

export const Actions: React.FC<Props> = ({ actions }) => {
  const theme = useTheme();

  const styles = makeStyles(theme);
  return (
    <View style={styles.actions}>
      <Pressable style={styles.action} onPress={() => actions.onPressUndo()}>
        <Icon size={5} as={MaterialIcons} name="undo" color="textPrimary" />
        <Text>Undo</Text>
      </Pressable>
      <Pressable style={styles.action} onPress={() => actions.onPressErase()}>
        <Icon
          size={5}
          as={MaterialIcons}
          name="backspace"
          color="textPrimary"
        />
        <Text>Erase</Text>
      </Pressable>
      <Pressable style={styles.action} onPress={() => actions.onPressHint()}>
        <Icon
          size={5}
          as={MaterialIcons}
          name="lightbulb"
          color="textPrimary"
        />
        <Text>Hint</Text>
      </Pressable>
      <Pressable style={styles.action} onPress={() => actions.onPressNewGame()}>
        <Icon size={5} as={MaterialIcons} name="replay" color="textPrimary" />
        <Text>New game</Text>
      </Pressable>
    </View>
  );
};

const makeStyles = function (theme: ICustomTheme) {
  return StyleSheet.create({
    actions: {
      marginTop: 30,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    action: {
      width: 80,
      height: 80,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary[10],
      borderRadius: 20,
    },
  });
};
