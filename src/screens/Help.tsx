import React from "react";
import withLayout from "../common/withLayout";
import { MaterialIcons } from "@expo/vector-icons";
import { Icon, Row, Text, View, Image } from "native-base";

const Help = () => {
  return (
    <View>
      <Row bg="grey.50" padding={5} alignItems="center" mb={5}>
        <Text color="textSecondary" fontSize="regular" mr={2}>
          How to play
        </Text>
        <Icon size={5} as={MaterialIcons} name="help" color="textPrimary" />
      </Row>
      <View alignItems="center">
        <Image
          alt=""
          source={require("../assets/sudokuExample.png")}
          width={300}
          height={300}
        />
        <Text width={"100%"} alignItems="flex-start" p={5}>
          The goal is to fill in a 9×9 grid with digits so that each column,
          row, and 3×3 section contain the numbers between 1 to 9. At the start
          of the game you have 9×9 grid of squares,and some of squares are
          filled, Your job is to fill in the missing digits and complete
          thegrid.
        </Text>
      </View>
    </View>
  );
};

export default withLayout(Help);
