import { ICustomTheme, useTheme } from "native-base";
import React from "react";
import { Pressable, StyleSheet, Text, Touchable, View } from "react-native";

type Props = {
  onPressNumber: (number: string) => void;
};

export const Numpad: React.FC<Props> = ({ onPressNumber }) => {
  const numbers = [
    ["1", "2", "3", "4", "5"],
    ["6", "7", "8", "9"],
  ];
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.numpad}>
      {numbers.map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map((number) => (
            <Pressable
              key={number}
              style={styles.numberWrapper}
              onPress={() => onPressNumber(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

const makeStyles = (theme: ICustomTheme) =>
  StyleSheet.create({
    numpad: {
      marginTop: 25,
      width: "100%",
    },
    row: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    numberWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 60,
      width: 60,
      backgroundColor: theme.colors.primary[10],
      borderRadius: 25,
      marginRight: 5,
      marginLeft: 5,
    },
    number: {
      fontWeight: "bold",
      fontSize: 30,
      color: theme.colors.textPrimary,
    },
  });
