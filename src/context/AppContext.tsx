import React, { useContext, useState } from "react";
import moment from "moment";

type Props = {
  children: React.ReactElement;
};

type setStateActionType<T> = React.Dispatch<React.SetStateAction<T>>;

type AddContextProps = {
  init: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  theme: "dark" | "light";
  setSoundEnabled: setStateActionType<boolean>;
  setMusicEnabled: setStateActionType<boolean>;
  setInit: setStateActionType<boolean>;
  setTheme: setStateActionType<"dark" | "light">;
};

export const AppContext = React.createContext<AddContextProps>({
  soundEnabled: true,
  musicEnabled: true,
  theme: "light",
  init: false,
  setMusicEnabled: () => {},
  setSoundEnabled: () => {},
  setTheme: () => {},
  setInit: () => {},
});

export const AppProvider: React.FC<Props> = ({ children }) => {
  let [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  let [musicEnabled, setMusicEnabled] = useState<boolean>(true);
  let [init, setInit] = useState<boolean>(false);
  let [theme, setTheme] = useState<"dark" | "light">("light");

  return (
    <AppContext.Provider
      value={{
        init,
        setInit,
        soundEnabled,
        musicEnabled,
        theme,
        setTheme,
        setMusicEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
