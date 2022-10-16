import React from "react";
import withLayout from "../common/withLayout";
import { useRoute } from "@react-navigation/native";
import Home from "./Home";
import Stats from "./Stats";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../common/NavigationStack";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Main">;
};
const Main: React.FC<Props> = ({ navigation }) => {
  const route: any = useRoute();
  return (
    <>
      {route?.params?.tab === "Home" ? (
        <Home navigation={navigation} />
      ) : (
        <Stats />
      )}
    </>
  );
};
export default withLayout<Props>(Main);
