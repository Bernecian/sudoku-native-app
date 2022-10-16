import React, { useContext, useState } from "react";
import moment from "moment";

type Props = {
  children: React.ReactElement;
};

type setStateActionType<T> = React.Dispatch<React.SetStateAction<T>>;

type SudokuContextProps = {
  numberSelected: string;
  setNumberSelected: setStateActionType<string>;
  gameArray: string[];
  setGameArray: setStateActionType<string[]>;
  difficulty: string;
  setDifficulty: setStateActionType<string>;
  timeGameStarted: moment.Moment;
  setTimeGameStarted: setStateActionType<moment.Moment>;
  fastMode: boolean;
  setFastMode: setStateActionType<boolean>;
  cellSelected: number;
  setCellSelected: setStateActionType<number>;
  initArray: string[];
  setInitArray: setStateActionType<string[]>;
  won: boolean;
  lose: boolean;
  setWon: setStateActionType<boolean>;
  setLose: setStateActionType<boolean>;
  mistakesCount: number;
  setMistakesCount: setStateActionType<number>;
  mistakesMode: boolean;
  setMistakesMode: setStateActionType<boolean>;
};

export const SudokuContext = React.createContext<SudokuContextProps>({
  numberSelected: "0",
  setNumberSelected: () => {},
  gameArray: [],
  setGameArray: () => {},
  difficulty: "Easy",
  setDifficulty: () => {},
  timeGameStarted: moment(),
  setTimeGameStarted: () => {},
  fastMode: false,
  setFastMode: () => {},
  cellSelected: -1,
  setCellSelected: () => {},
  initArray: [],
  setInitArray: () => {},
  won: false,
  setWon: () => {},
  lose: false,
  setLose: () => {},
  mistakesCount: 0,
  setMistakesCount: () => {},
  mistakesMode: false,
  setMistakesMode: () => {},
});

export const SudokuProvider: React.FC<Props> = ({ children }) => {
  let [numberSelected, setNumberSelected] = useState<string>("0");
  let [gameArray, setGameArray] = useState<string[]>([]);
  let [difficulty, setDifficulty] = useState<string>("Easy");
  let [timeGameStarted, setTimeGameStarted] = useState<moment.Moment>(moment());
  let [fastMode, setFastMode] = useState<boolean>(false);
  let [cellSelected, setCellSelected] = useState<number>(-1);
  let [initArray, setInitArray] = useState<string[]>([]);
  let [won, setWon] = useState<boolean>(false);
  let [lose, setLose] = useState<boolean>(false);
  let [mistakesCount, setMistakesCount] = useState<number>(0);
  let [mistakesMode, setMistakesMode] = useState<boolean>(false);

  return (
    <SudokuContext.Provider
      value={{
        numberSelected,
        setNumberSelected,
        gameArray,
        setGameArray,
        difficulty,
        setDifficulty,
        timeGameStarted,
        setTimeGameStarted,
        fastMode,
        setFastMode,
        cellSelected,
        setCellSelected,
        initArray,
        setInitArray,
        won,
        setWon,
        lose,
        setLose,
        mistakesCount,
        setMistakesCount,
        mistakesMode,
        setMistakesMode,
      }}
    >
      {children}
    </SudokuContext.Provider>
  );
};

export const useSudokuContext = () => useContext(SudokuContext);

// Usage
// const { numberSelected, setNumberSelected } = useNumberValue();
