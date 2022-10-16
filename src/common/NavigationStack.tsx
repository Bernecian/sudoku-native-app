import React, { useEffect } from "react";
import { useColorMode } from "native-base";
import { useAppContext } from "../context/AppContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Main from "../screens/Main";
import Game from "../screens/Game";
import Help from "../screens/Help";
import Settings from "../screens/Settings";

export type RootStackParamList = {
  Main: { tab: "Home" | "Stats" };
  Game: undefined;
  Help: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const NavigationStack = () => {
  const {
    init,
    theme,
    setInit,
    setTheme,
    soundEnabled,
    musicEnabled,
    setSoundEnabled,
    setMusicEnabled,
  } = useAppContext();

  const { colorMode, setColorMode } = useColorMode();

  const getSettingsData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("settings");
      if (jsonValue != null) {
        setMusicEnabled(JSON.parse(jsonValue).musicEnabled);
        setSoundEnabled(JSON.parse(jsonValue).soundEnabled);
        setTheme(JSON.parse(jsonValue).theme);
      }
      setInit(true);
    } catch (e) {
      setInit(true);
    }
  };

  const setSettingsData = async (settings: string) => {
    await AsyncStorage.setItem("settings", settings);
  };
  console.log(colorMode);
  useEffect(() => {
    !init && getSettingsData();
    return () => {
      if (init)
        setSettingsData(
          JSON.stringify({
            theme,
            soundEnabled,
            musicEnabled,
          })
        );
    };
  }, [init]);

  useEffect(() => {
    setColorMode(theme);
  }, [theme]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen
          name="Main"
          component={Main}
          initialParams={{ tab: "Home" }}
        />
        <Stack.Screen name="Help" component={Help} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
