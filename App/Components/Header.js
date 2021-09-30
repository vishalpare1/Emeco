import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { ApplicationStyles, Fonts, Images } from "../Themes";
import Colors from "../Themes/Colors";

/**
 * @typedef HeaderProps
 * @property {string} title
 * @property {() => void} [onPressBack]
 */

/**
 * @type {React.FunctionComponent<HeaderProps>}
 */

const Header = (props) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={props.onPressBack}>
        <Image style={styles.backButtonImage} source={Images.whiteBackIcon} />
      </TouchableOpacity>
      <Text style={styles.mainHeading}>{props.title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
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
});
