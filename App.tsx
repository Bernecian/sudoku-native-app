import React, { useEffect, useState } from "react";
import {
  // Text,
  // HStack,
  // Switch,
  // useColorMode,
  NativeBaseProvider,
  extendTheme,
} from "native-base";
import { SudokuProvider } from "./src/context/SudokuContext";
import {
  NavigationStack,
  RootStackParamList,
} from "./src/common/NavigationStack";
import { LogBox } from "react-native";
import { AppProvider } from "./src/context/AppContext";
import { Audio } from "expo-av";

const theme = extendTheme({
  fontSizes: {
    heading: "48",
    extraLarge: "40",
    large: "22",
    regular: "18",
    small: "16",
    extraSmall: "14",
  },
  colors: {
    textPrimary: "#212121",
    textSecondary: "#5F5F5F",
    primary: {
      100: "#FE8430",
      50: "#FFBD7B",
      20: "#FFE1C5",
      10: "#FFF3E7",
    },
    grey: {
      50: "#EBEBEB",
    },
    // secondary: "#FFF3E7",
  },
});
type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType {}
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
LogBox.ignoreLogs([
  "We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320",
]);
export default function App() {
  // const [sound, setSound] = useState<Audio.Sound>();
  // async function playSound() {
  //   const { sound } = await Audio.Sound.createAsync(
  //     require("./assets/backgroundMusic.mp3")
  //   );
  //   await sound?.playAsync();
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
  return (
    <NativeBaseProvider theme={theme}>
      <SudokuProvider>
        <AppProvider>
          <NavigationStack />
        </AppProvider>
      </SudokuProvider>
    </NativeBaseProvider>
  );
}

// Todo: Add some color schemes

// // Color Switch Component
// function ToggleDarkMode() {
//   const { colorMode, toggleColorMode } = useColorMode();
//   return (
//     <HStack space={2} alignItems="center">
//       <Text>Dark</Text>
//       <Switch
//         isChecked={colorMode === "light"}
//         onToggle={toggleColorMode}
//         aria-label={
//           colorMode === "light" ? "switch to dark mode" : "switch to light mode"
//         }
//       />
//       <Text>Light</Text>
//     </HStack>
//   );
// }
