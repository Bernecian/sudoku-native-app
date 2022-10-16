import React from "react";
import { Timer } from "./Timer";
import { Box, Text, View } from "native-base";
import { Dimensions, StyleSheet } from "react-native";
import { useSudokuContext } from "../context/SudokuContext";

export const Status: React.FC = () => {
  let { difficulty, mistakesMode, mistakesCount } = useSudokuContext();
  return (
    <View style={styles.status}>
      <View style={styles.row}>
        <Box style={styles.rowItem}>
          <Text
            style={styles.difficulty}
            color="textSecondary"
            fontSize="large"
          >
            {difficulty}
          </Text>
        </Box>
        <Box style={[styles.rowItem, styles.mistakes]}>
          {mistakesMode && (
            <Text
              color={
                mistakesCount === 3
                  ? "red.600"
                  : mistakesCount === 2
                  ? "red.300"
                  : "textSecondary"
              }
              fontSize="small"
            >
              Mistakes {mistakesCount}/3
            </Text>
          )}
        </Box>
        <Box style={[styles.rowItem, styles.timer]}>
          <Timer timeMode={false} />
        </Box>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowItem: {
    width: (Dimensions.get("window").width - 40) / 3,
  },
  difficulty: {
    alignItems: "flex-start",
  },
  status: {
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 20,
  },
  mistakes: {
    alignItems: "center",
  },
  timer: {
    alignItems: "flex-end",
  },
});
