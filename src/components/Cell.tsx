import { ICustomTheme, useTheme } from "native-base";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { useSudokuContext } from "../context/SudokuContext";

type Props = {
  value: string;
  indexOfArray: number;
  onPress: (indexOfArray: number) => void;
  row: number;
  column: number;
};

export const Cell: React.FC<Props> = ({
  value,
  indexOfArray,
  onPress,
  row,
  column,
}) => {
  let { cellSelected, initArray } = useSudokuContext();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [cellStyles, setCellStyles] = useState<StyleProp<ViewStyle>[]>([
    styles.cell,
  ]);
  function _isCellRelatedToSelectedCell(row: number, column: number) {
    if (cellSelected === indexOfArray) {
      return false;
    }
    if (cellSelected === row * 9 + column) {
      return true;
    }
    let rowOfSelectedCell = Math.floor(cellSelected / 9);
    let columnOfSelectedCell = cellSelected % 9;
    if (rowOfSelectedCell === row || columnOfSelectedCell === column) {
      return true;
    }
    return [
      [0, 3, 0, 3],
      [0, 3, 3, 6],
      [0, 3, 6, 9],
      [3, 6, 0, 3],
      [3, 6, 3, 6],
      [3, 6, 6, 9],
      [6, 9, 0, 3],
      [6, 9, 3, 6],
      [6, 9, 6, 9],
    ].some((array) => {
      if (
        rowOfSelectedCell > array[0] - 1 &&
        row > array[0] - 1 &&
        rowOfSelectedCell < array[1] &&
        row < array[1] &&
        columnOfSelectedCell > array[2] - 1 &&
        column > array[2] - 1 &&
        columnOfSelectedCell < array[3] &&
        column < array[3]
      )
        return true;
      return false;
    });
  }
  useEffect(() => {
    const res: StyleProp<ViewStyle>[] = [styles.cell];
    cellSelected === indexOfArray && res.push(styles.highlited);
    (indexOfArray + 1) % 3 === 0 &&
      (indexOfArray + 1) % 9 !== 0 &&
      res.push(styles.cellRightBorderBold);
    (indexOfArray + 1) % 3 !== 0 &&
      (indexOfArray + 1) % 9 !== 0 &&
      res.push(styles.cellRightBorder);
    _isCellRelatedToSelectedCell(row, column) &&
      res.push(styles.highlitedSecondary);
    setCellStyles(res);
  }, [indexOfArray, cellSelected, onPress]);

  const getTextColor = () => {
    if (cellSelected === indexOfArray) {
      return styles.reverseColor;
    } else if (initArray[indexOfArray] === "0") {
      return styles.userFilledCellText;
    } else return styles.filledCellText;
  };

  return (
    <Pressable
      key={indexOfArray}
      onPress={() => onPress(indexOfArray)}
      style={[...cellStyles]}
    >
      <Text style={[getTextColor(), styles.text]}>
        {value === "0" ? "" : value}
      </Text>
    </Pressable>
  );
};

const makeStyles = function (theme: ICustomTheme) {
  return StyleSheet.create({
    cellRightBorder: {
      borderRightWidth: 1,
      borderColor: theme.colors.primary[20],
    },
    cellRightBorderBold: {
      borderRightWidth: 2,
      borderColor: theme.colors.primary[20],
    },
    cell: {
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      width: (Dimensions.get("window").width - 40) / 9,
    },
    userFilledCellText: {
      color: theme.colors.textSecondary,
    },
    filledCellText: {
      color: theme.colors.primary[100],
    },
    reverseColor: {
      color: theme.colors.white,
    },
    text: {
      fontSize: 22,
    },
    highlited: {
      backgroundColor: theme.colors.primary[50],
    },
    highlitedSecondary: {
      backgroundColor: theme.colors.primary[10],
    },
  });
};
