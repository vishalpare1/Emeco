import React, { useCallback, useState } from "react";
import API from "../Services/Api";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ApplicationStyles, Fonts, Images } from "../Themes";
import Colors from "../Themes/Colors";
import { useSelector } from "react-redux";
import Header from "../Components/Header";

const { api } = API;

const ManualItem = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.manualItem}>
        <Text style={styles.manualItemText}>{props.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ManualListScreen = (props) => {
  const headers = useSelector(({ login }) => login?.payload?.headers);
  const [manuals, setManuals] = useState(null);

  const getManuals = useCallback(async () => {
    const response = await api.getManuals(null, headers);
    if (Array.isArray(response?.data)) {
      setManuals(response.data);
    }
    return response;
  }, [headers]);

  useState(() => {
    getManuals();
  }, [getManuals]);

  return (
    <View style={styles.container}>
      <LinearGradient
        useAngle
        angle={0}
        colors={["#FB5825", "#A41B21", "#630C43"]}
        style={styles.background}
      />
      <Header title="Manuals" onPressBack={() => props.navigation.goBack()} />
      <FlatList
        data={manuals}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item }) => (
          <ManualItem
            name={item.name}
            onPress={() =>
              props.navigation.navigate("PDFViewerScreen", {
                file: { name: item.name, url: item.file.url },
              })
            }
          />
        )}
      />
    </View>
  );
};

export default ManualListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFill,
  },
  header: {
    ...ApplicationStyles.topContainer,
    alignItems: "flex-end",
    padding: 20,
  },
  backButtonImage: {},
  mainHeading: {
    ...Fonts.style.titleFont,
    fontSize: 32,
    color: Colors.snow,
    marginTop: 6,
    marginLeft: 15,
  },
  manualItem: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
  },
  manualItemText: {
    flex: 1,
    ...Fonts.style.fontWeight600,
    fontSize: 20,
    color: Colors.snow,
    marginLeft: 30,
  },
});
