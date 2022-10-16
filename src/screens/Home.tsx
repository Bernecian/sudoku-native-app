import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  View,
  Button,
  Text,
  Switch,
  Select,
  Icon,
  ICustomTheme,
  useTheme,
  Image,
} from "native-base";
import withLayout from "../common/withLayout";
import { useNavigation } from "@react-navigation/native";
import { useSudokuContext } from "../context/SudokuContext";
import { AntDesign } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../common/NavigationStack";
import { Audio } from "expo-av";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
};

const Home: React.FC<Props> = ({ navigation }) => {
  let { difficulty, setDifficulty, mistakesMode, setMistakesMode } =
    useSudokuContext();
  const theme = useTheme();

  const styles = makeStyles(theme);

  return (
    <View style={styles.wrapper}>
      <View style={styles.heading}>
        <Text color="primary.100" fontSize="heading">
          sudoku.
        </Text>
        <Image
          alt="2"
          style={styles.homeScreenLineL}
          source={require("../assets/homeScreenLines.png")}
        />
        <Image
          alt="1"
          style={styles.homeScreenLineR}
          source={require("../assets/homeScreenLines.png")}
        />
      </View>
      <View style={styles.row}>
        <Text fontSize="regular" color="textSecondary">
          Mistakes Mode:
        </Text>
        <Switch
          value={!!mistakesMode}
          onValueChange={setMistakesMode}
          offTrackColor="textSecondary"
          onTrackColor="primary.100"
          size="md"
        />
      </View>
      <View style={styles.row}>
        <Text fontSize="regular" color="textSecondary">
          Difficulty:
        </Text>
        <Select
          _item={{
            _pressed: {
              bg: "white",
            },
          }}
          _selectedItem={{
            endIcon: (
              <Icon size={5} as={AntDesign} name="check" color="textPrimary" />
            ),
          }}
          selectedValue={difficulty}
          minWidth="120"
          size="md"
          onValueChange={(value) => setDifficulty(value)}
        >
          <Select.Item label="Easy" value="Easy" />
          <Select.Item label="Medium" value="Medium" />
          <Select.Item label="Hard" value="Hard" />
          <Select.Item label="Insane" value="Insane" />
        </Select>
      </View>
      <Button
        bgColor="primary.100"
        height={50}
        width={210}
        marginTop={5}
        onPress={async () => {
          // await sound?.playAsync();
          navigation.navigate("Game" as never);
        }}
      >
        <Text color="white" fontSize="regular">
          New Game
        </Text>
      </Button>
    </View>
  );
};
const makeStyles = (theme: ICustomTheme) =>
  StyleSheet.create({
    heading: {
      position: "relative",
      alignItems: "center",
      height: 150,
      justifyContent: "center",
      width: "100%",
      marginBottom: 100,
    },
    homeScreenLineL: {
      position: "absolute",
      top: 0,
      left: 0,
    },
    homeScreenLineR: {
      transform: [{ rotate: "180deg" }],
      position: "absolute",
      top: 0,
      right: 0,
    },
    wrapper: {
      position: "relative",
      paddingTop: 100,
      height: "100%",
      alignItems: "center",
    },
    card: {
      height: 40,
      width: 70,
      marginRight: 20,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 15,
      borderWidth: 1,
    },
    cardText: {
      color: theme.colors.white,
    },
    row: {
      alignItems: "center",
      width: "60%",
      justifyContent: "space-between",
      flexDirection: "row",
      marginBottom: 30,
    },
  });
export default Home;
