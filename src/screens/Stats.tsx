import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import {
  View,
  Button,
  Text,
  Switch,
  Select,
  Icon,
  Box,
  HStack,
  Spacer,
  VStack,
  FlatList,
  Pressable,
  ICustomTheme,
  useTheme,
} from "native-base";
import withLayout from "../common/withLayout";
import {
  NavigationProp,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import moment from "moment";
import { difficultyLvls } from "../common/constants";
import type { difficultyType, gameStatsType } from "../common/types";
import { getTime } from "../common/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const titles = ["Date", "Duration", "Result"];

const Stats: React.FC = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [filter, setFilter] = useState<difficultyType>("Easy");
  const [gameStats, setGameStats] = useState<gameStatsType[]>([]);
  const [pageData, setPageData] = useState<{
    stats: Array<gameStatsType>;
    won?: number;
    lost?: number;
    winRate?: string;
  }>();
  const getLocalStats = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("stats");
      const data = jsonValue ? JSON.parse(jsonValue) : [];
      if (jsonValue != null && Array.isArray(data)) {
        if (Array.isArray(data)) {
          setGameStats(data);
        }
      }
    } catch (e) {}
  };
  useEffect(() => {
    getLocalStats();
  }, []);
  useEffect(() => {
    let lost = 0;
    let won = 0;
    const filteredStats = gameStats.filter(
      (item) => item.difficulty === filter
    );
    for (let i = 0; i < filteredStats.length; i++) {
      filteredStats[i].won ? won++ : lost++;
    }
    const winRate = filteredStats.length
      ? ((100 / filteredStats.length || 0) * won).toFixed(1)
      : "0.0";

    setPageData({
      stats: filteredStats.reverse(),
      won,
      lost,
      winRate,
    });
  }, [filter, gameStats]);
  console.log(gameStats);

  return (
    <View style={styles.wrapper}>
      <Text color="primary.100" fontSize="large">
        Statistic
      </Text>
      <HStack style={styles.difficultyFilter}>
        {difficultyLvls.map((item) => (
          <Pressable
            key={item.title}
            onPress={() => setFilter(item.title)}
            style={styles.filterOption}
            bg={filter === item.title ? "primary.100" : "primary.10"}
          >
            <Text color={filter === item.title ? "white" : "primary.100"}>
              {item.title}
            </Text>
          </Pressable>
        ))}
      </HStack>
      <View style={styles.percentage}>
        <Text fontSize="regular" color="textPrimary">
          Win Rate
        </Text>
        <Text fontSize={80} color="textPrimary">
          {pageData?.winRate}%
        </Text>
        <HStack space={[10]}>
          <Text fontSize="extraSmall" color="textSecondary">
            Played: {pageData?.stats.length}
          </Text>
          <Text fontSize="extraSmall" color="textSecondary">
            Won: {pageData?.won}
          </Text>
          <Text fontSize="extraSmall" color="textSecondary">
            Lose: {pageData?.lost}
          </Text>
        </HStack>
      </View>
      <View style={[styles.titles]}>
        {titles.map((item) => (
          <Box key={item} style={styles.title}>
            <Text fontSize="extraSmall" fontWeight="bold">
              {item}
            </Text>
          </Box>
        ))}
      </View>
      {!pageData?.stats.length && (
        <Text
          style={{ textAlign: "center" }}
          fontSize="small"
          color="textSecondary"
          mt={5}
        >
          No data
        </Text>
      )}
      <FlatList
        style={{ width: "100%" }}
        data={pageData?.stats}
        renderItem={({ item, index }) => (
          <>
            <View key={item.id} style={styles.row}>
              <Box>
                <Box>
                  <Text style={styles.title}>
                    {moment(item.date).format("DD-MMM")}
                  </Text>
                </Box>
                <Box>
                  <Text style={styles.title}>
                    {moment(item.date).format("hh:mm")}
                  </Text>
                </Box>
              </Box>
              <Box style={styles.title}>
                <Text>{getTime(item.time)}</Text>
              </Box>
              <Box style={styles.title}>
                <Text>{item.won ? "Won" : "Lost"}</Text>
              </Box>
            </View>
            {index + 1 === pageData?.stats.length && (
              <View style={styles.row}></View>
            )}
          </>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
const makeStyles = function (theme: ICustomTheme) {
  return StyleSheet.create({
    wrapper: {
      height: "100%",
      width: "100%",
    },
    title: {
      width: 60,
    },
    titles: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 20,
      backgroundColor: theme.colors.grey[50],
      paddingVertical: 10,
      paddingHorizontal: 5,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      borderBottomWidth: 1,
      marginTop: 20,
      borderColor: theme.colors.grey[50],
      paddingHorizontal: 5,
      minHeight: 30,
    },
    difficultyFilter: {
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
      height: 60,
      paddingRight: 10,
      paddingLeft: 10,
      borderRadius: 10,
      backgroundColor: theme.colors.primary[10],
      marginVertical: 10,
    },
    filterOption: {
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 5,
    },
    percentage: {
      width: "100%",
      alignItems: "center",
    },
  });
};
export default Stats;
