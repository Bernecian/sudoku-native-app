import React, { useEffect, useState } from "react";
import moment, { Duration } from "moment";
import { StyleSheet } from "react-native";
import { Icon, Text, View } from "native-base";
import { useSudokuContext } from "../context/SudokuContext";
import { Ionicons } from "@expo/vector-icons";

export const Timer: React.FC<{
  timeMode: boolean;
}> = ({ timeMode }) => {
  let [currentTime, setCurrentTime] = useState(moment());
  const { timeGameStarted, won, setWon } = useSudokuContext();
  useEffect(() => {
    if (!won) setTimeout(() => setCurrentTime(moment()), 1000);
  });

  function getTimer(): { stringTimer: string; duration?: Duration } {
    const totalSeconds = currentTime.diff(timeGameStarted, "seconds");
    if (totalSeconds <= 0) {
      return { stringTimer: "00:00" };
    }
    let duration = moment.duration(totalSeconds, "seconds");
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    let stringTimer = "";
    stringTimer += hours ? "" + hours + ":" : "";
    stringTimer += minutes ? (minutes < 10 ? "0" : "") + minutes + ":" : "00:";
    stringTimer += seconds < 10 ? "0" + seconds : seconds;

    return { stringTimer, duration };
  }
  useEffect(() => {
    if (timeMode) {
      let duration = getTimer().duration;
      if (duration) {
        if (duration.minutes() === 30) {
          setWon(false);
        }
      }
    }
  }, [getTimer()]);

  return (
    <View style={styles.timer}>
      <Icon size={6} as={Ionicons} name="timer-sharp" color="textPrimary" />
      <Text color="textSecondary">{getTimer().stringTimer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timer: {
    flexDirection: "row",
    paddingLeft: 20,
    width: 80,
  },
});
