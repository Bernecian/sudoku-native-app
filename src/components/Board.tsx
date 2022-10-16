import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Cell } from "./Cell";
import { useSudokuContext } from "../context/SudokuContext";
import { ICustomTheme, useTheme } from "native-base";
import { Audio } from "expo-av";

type Props = {
  onPressCell: (indexOfArray: number) => void;
};

const Board = (props: Props) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let { gameArray } = useSudokuContext();
  // const [sound, setSound] = useState<Audio.Sound>();
  // async function playSound() {
  //   const { sound } = await Audio.Sound.createAsync(
  //     require("../assets/numberClick.wav")
  //   );
  //   setSound(sound);
  // }
  // useEffect(() => {
  //   playSound();
  //   return sound
  //     ? () => {
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);
  // const onCellPress = async (indexOfArray: number) => {
  //   await sound?.playAsync();
  //   props.onPressCell(indexOfArray);
  // };
  return (
    <View style={styles.board}>
      {rows.map((row) => {
        return (
          <View
            key={row}
            style={[
              styles.row,
              row !== 8 && styles.borderBottom,
              (row + 1) % 3 === 0 && row !== 8 && styles.borderBottomBold,
            ]}
          >
            {rows.map((column) => {
              const indexOfArray = row * 9 + column;
              const value = gameArray[indexOfArray];
              return (
                <Cell
                  row={row}
                  column={column}
                  key={indexOfArray}
                  onPress={props.onPressCell}
                  indexOfArray={indexOfArray}
                  value={value}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

const makeStyles = function (theme: ICustomTheme) {
  return StyleSheet.create({
    board: {
      backgroundColor: theme.colors.white,
      alignItems: "center",
      justifyContent: "center",
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderColor: theme.colors.primary[10],
    },
    borderBottomBold: {
      borderBottomWidth: 2,
      borderColor: theme.colors.primary[20],
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      height: 40,
    },
  });
};
export default Board;
