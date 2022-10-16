import React from "react";
import {
  Pressable,
  View,
  Text,
  Icon,
  ICustomTheme,
  useTheme,
} from "native-base";
import { StyleSheet } from "react-native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function withLayout<T extends object>(
  Component: React.FC<T>
): React.FC<T> {
  return function (props) {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const navigation = useNavigation();
    const route = useRoute<{
      name: string;
      params: { tab: string };
      key: string;
    }>();
    return (
      <View style={styles.layout}>
        <View style={styles.headingRow}>
          {route.params?.tab !== "Home" ? (
            <Icon
              onPress={() =>
                route.params?.tab !== "Stats"
                  ? navigation.goBack()
                  : navigation.navigate(
                      "Main" as never,
                      { tab: "Home" } as never
                    )
              }
              size={8}
              as={Ionicons}
              name="ios-arrow-back"
              color="textSecondary"
            />
          ) : (
            <Icon
              size={8}
              as={MaterialIcons}
              name="help-outline"
              color="textSecondary"
              onPress={() => navigation.navigate("Help" as never)}
            />
          )}
          {route.name !== "Settings" && (
            <Icon
              size={7}
              as={Feather}
              name="settings"
              color="textSecondary"
              onPress={() => navigation.navigate("Settings" as never)}
            />
          )}
        </View>
        <View style={styles.content}>
          <Component {...props} />
        </View>
        {route.name !== "Game" && (
          <View style={styles.navigation}>
            <Pressable
              style={styles.navigationItem}
              onPress={() =>
                navigation.navigate("Main" as never, { tab: "Home" } as never)
              }
            >
              <Icon
                size={7}
                as={MaterialIcons}
                name="home"
                color={
                  route.params?.tab === "Home" ? "primary.100" : "textSecondary"
                }
              />
              <Text
                fontSize="extraSmall"
                color={
                  route.params?.tab === "Home" ? "primary.100" : "textSecondary"
                }
              >
                Home
              </Text>
            </Pressable>
            <Pressable
              style={styles.navigationItem}
              onPress={() =>
                navigation.navigate("Main" as never, { tab: "Stats" } as never)
              }
            >
              <Icon
                size={7}
                as={Ionicons}
                name="stats-chart"
                color={
                  route.params?.tab === "Stats"
                    ? "primary.100"
                    : "textSecondary"
                }
              />
              <Text
                fontSize="extraSmall"
                color={
                  route.params?.tab === "Stats"
                    ? "primary.100"
                    : "textSecondary"
                }
              >
                Stats
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };
}

const makeStyles = function (theme: ICustomTheme) {
  return StyleSheet.create({
    layout: {
      position: "relative",
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.white,
      paddingTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
    },
    content: {
      height: "80%",
      width: "100%",
    },
    headingRow: {
      justifyContent: "space-between",
      flexDirection: "row",
      position: "absolute",
      width: "100%",
      top: 50,
    },
    navigation: {
      justifyContent: "space-between",
      flexDirection: "row",
      position: "absolute",
      width: "100%",
      bottom: 0,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 50,
      paddingTop: 20,
      backgroundColor: "white",
    },
    navigationItem: {
      alignItems: "center",
      justifyContent: "center",
    },
  });
};
