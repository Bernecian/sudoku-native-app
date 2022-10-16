import React from "react";
import withLayout from "../common/withLayout";
import { Row, Text, useTheme, View } from "native-base";
import { useAppContext } from "../context/AppContext";
import { Switch } from "react-native";

const Settings = () => {
  const {
    soundEnabled,
    musicEnabled,
    setMusicEnabled,
    setSoundEnabled,
    theme,
    setTheme,
  } = useAppContext();
  const { colors } = useTheme();
  return (
    <View alignItems="center">
      <Text textAlign="center" fontSize="extraLarge" color="textPrimary">
        Settings
      </Text>
      <View width={"80%"} mt={20}>
        <Row mb={5} justifyContent="space-between" alignItems="center">
          <Text fontSize="large" color="textSecondary">
            Music:
          </Text>
          <Switch
            value={musicEnabled}
            onValueChange={setMusicEnabled}
            trackColor={{
              false: colors.primary[100],
              true: colors.primary[100],
            }}
          />
        </Row>
        <Row mb={5} justifyContent="space-between" alignItems="center">
          <Text fontSize="large" color="textSecondary">
            Sounds:
          </Text>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{
              false: colors.primary[100],
              true: colors.primary[100],
            }}
          />
        </Row>
        <Row justifyContent="space-between" alignItems="center">
          <Text fontSize="large" color="textSecondary">
            Dark Mode:
          </Text>
          <Switch
            value={theme === "dark"}
            onValueChange={(val) => setTheme(val ? "dark" : "light")}
            trackColor={{
              false: colors.primary[100],
              true: colors.primary[100],
            }}
          />
        </Row>
      </View>
    </View>
  );
};

export default withLayout(Settings);
