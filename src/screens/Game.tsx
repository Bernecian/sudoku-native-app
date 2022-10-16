import React, { useState, useEffect } from "react";
import moment from "moment";
import uuid from "react-native-uuid";
import Board from "../components/Board";
import { getTime } from "../common/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Status } from "../components/Status";
import { Numpad } from "../components/Numpad";
import withLayout from "../common/withLayout";
import { Actions } from "../components/Actions";
import { gameStats } from "../common/constants";
import type { difficultyType, gameStatsType } from "../common/types";
import { View, StyleSheet, Image } from "react-native";
import { ParamListBase } from "@react-navigation/native";
import { getUniqueSudoku } from "../sudoku/uniqueSudoku";
import { useSudokuContext } from "../context/SudokuContext";
import { Button, Text, ICustomTheme, useTheme } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Audio } from "expo-av";
import { useAppContext } from "../context/AppContext";

const Game: React.FC<{
  navigation: NativeStackNavigationProp<ParamListBase>;
}> = ({ navigation }) => {
  let {
    numberSelected,
    setNumberSelected,
    gameArray,
    setGameArray,
    difficulty,
    setDifficulty,
    setTimeGameStarted,
    timeGameStarted,
    fastMode,
    setFastMode,
    cellSelected,
    setCellSelected,
    initArray,
    setInitArray,
    setWon,
    won,
    setLose,
    lose,
    mistakesCount,
    setMistakesCount,
    mistakesMode,
    setMistakesMode,
  } = useSudokuContext();
  const { musicEnabled } = useAppContext();
  const theme = useTheme();
  const styles = makeStyles(theme);
  let [history, setHistory] = useState<string[][]>([]);
  const [gameTime, setGameTime] = useState<string>("");
  let [solvedArray, setSolvedArray] = useState<string[]>([]);
  // let [overlay, setOverlay] = useState<boolean>(false);

  function _createNewGame(value?: difficultyType) {
    let [temporaryInitArray, temporarySolvedArray] = getUniqueSudoku(
      difficulty,
      value
    );

    setInitArray(temporaryInitArray);
    setGameArray(temporaryInitArray);
    setSolvedArray(temporarySolvedArray);
    setNumberSelected("0");
    setTimeGameStarted(moment());
    setCellSelected(-1);
    setHistory([]);
    setWon(false);
    setLose(false);
    setMistakesCount(0);
    setGameTime("");
  }

  function _isSolved(index: number, value: string) {
    if (
      gameArray.every((cell: string, cellIndex: number) => {
        if (cellIndex === index) return value === solvedArray[cellIndex];
        else return cell === solvedArray[cellIndex];
      })
    ) {
      return true;
    }
    return false;
  }
  function solveArray() {
    setGameArray(solvedArray);
  }
  function _fillCell(index: number, value: string) {
    if (initArray[index] === "0") {
      // Direct copy results in interesting set of problems, investigate more!
      let tempArray = gameArray.slice();
      let tempHistory = history.slice();

      // Can't use tempArray here, due to Side effect below!!
      tempHistory.push(gameArray.slice());
      setHistory(tempHistory);

      tempArray[index] = value;
      setGameArray(tempArray);
      if (_isSolved(index, value)) {
        // setOverlay(true);
        setWon(true);
        return;
      }
      if (mistakesMode) {
        if (value !== solvedArray[index]) {
          if (mistakesCount !== 3) {
            setMistakesCount(mistakesCount + 1);
            return;
          }
          setLose(true);
        }
      }
    }
  }
  function onPressNewGame() {
    _createNewGame();
  }
  function onPressCell(indexOfArray: number) {
    if (fastMode && numberSelected !== "0") {
      _fillCell(indexOfArray, numberSelected);
    }
    setCellSelected(indexOfArray);
  }
  function onChangeDifficulty(value: difficultyType) {
    setDifficulty(value);
    _createNewGame(value);
  }
  function onPressNumber(number: string) {
    if (fastMode) {
      setNumberSelected(number);
    } else if (cellSelected !== -1) {
      _fillCell(cellSelected, number);
    }
  }

  function onPressUndo() {
    if (history.length) {
      let tempHistory = history.slice();
      let tempArray = tempHistory.pop();
      setHistory(tempHistory);
      if (tempArray !== undefined) setGameArray(tempArray);
    }
  }

  function onPressHint() {
    if (cellSelected !== -1) {
      _fillCell(cellSelected, solvedArray[cellSelected]);
    }
  }

  function onMistakesModeChange(val: boolean) {
    setMistakesMode(val);
  }

  function onPressFastMode() {
    if (fastMode) {
      setNumberSelected("0");
    }
    setCellSelected(-1);
    setFastMode(!fastMode);
  }

  // function onClickOverlay() {
  //   setOverlay(false);
  //   _createNewGame();
  // }
  function onPressErase() {
    if (cellSelected !== -1 && gameArray[cellSelected] !== "0") {
      _fillCell(cellSelected, "0");
    }
  }
  const storeGameStats = async (value: gameStatsType) => {
    let oldStats = await AsyncStorage.getItem("stats");
    if (oldStats !== null) {
      const oldStatsArr = JSON.parse(oldStats);
      console.log(oldStatsArr, "old");
      // JSON.parse(oldStats);
      const jsonValue = JSON.stringify([...oldStatsArr, value]);
      await AsyncStorage.setItem("stats", jsonValue);
    } else {
      const jsonValue = JSON.stringify([value]);
      await AsyncStorage.setItem("stats", jsonValue);
    }
  };
  const [sound, setSound] = useState<Audio.Sound>();
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/backgroundMusic.mp3")
    );
    sound?.setIsLoopingAsync(true);
    await sound?.playAsync();
    console.log("here");
    setSound(sound);
  }
  useEffect(() => {
    if (musicEnabled) {
      playSound();
    } else {
      sound?.unloadAsync();
    }
  }, [musicEnabled]);
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  useEffect(() => {
    _createNewGame();
  }, []);
  useEffect(() => {
    if (won || lose) {
      storeGameStats({
        date: moment(),
        time: moment().diff(timeGameStarted, "seconds"),
        mode: mistakesMode ? "Mistakes" : "Standard",
        won: won,
        difficulty,
        id: uuid.v4().toString(),
      });
      setGameTime(getTime(moment().diff(timeGameStarted, "seconds")));
    }
  }, [won, lose]);
  return (
    <View style={styles.game}>
      {won || lose ? (
        <View
          style={{
            alignItems: "center",
            position: "relative",
            width: "100%",
            height: "100%",
            paddingTop: 50,
            justifyContent: "space-between",
          }}
        >
          <Text marginBottom={100} fontSize="large" color="primary.50">
            {won
              ? `You have solved the pazzle !`
              : `Don't give up and try again. 
              It will be better`}
          </Text>
          {won ? (
            <Image source={require("../assets/happyPineapple.png")} />
          ) : (
            <Image source={require("../assets/sadPineapple.png")} />
          )}
          <Text fontSize="extraLarge" color="primary.100">
            Time: {gameTime}
          </Text>
          <Button
            onPress={() => onPressNewGame()}
            marginTop={5}
            padding={5}
            backgroundColor="primary.100"
          >
            Start new game
          </Button>
        </View>
      ) : (
        <>
          <Status />
          {/* <Pressable onPress={() => solveArray()}>
            <Text>Solve</Text>
          </Pressable> */}
          <Board onPressCell={onPressCell} />
          <Actions
            actions={{
              onPressNewGame,
              onPressHint,
              onPressUndo,
              onPressErase,
            }}
          />
          <Numpad onPressNumber={onPressNumber} />
        </>
      )}
    </View>
  );
};

const makeStyles = (theme: ICustomTheme) =>
  StyleSheet.create({
    game: {
      backgroundColor: theme.colors.white,
      alignItems: "center",
      justifyContent: "center",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
  });

export default withLayout(Game);
