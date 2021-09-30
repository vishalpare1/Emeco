import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import PDFView from "react-native-view-pdf";
import Header from "../Components/Header";

const PDFViewerScreen = (props) => {
  const { name, url } = props.navigation.getParam("file") || {};
  return (
    <View style={styles.container}>
      <Header title={name} onPressBack={() => props.navigation.goBack()} />
      {/* <WebView
        source={{
          uri: Platform.select({
            ios: url,
            android: `https://docs.google.com/gview?embedded=true&url=${url}`,
          }),
        }}
      /> */}
      <PDFView
        fadeInDuration={250.0}
        style={{ flex: 1 }}
        resource={url}
        resourceType="url"
        onLoad={() => console.log(`PDF rendered from url`)}
        onError={(error) => console.log("Cannot render PDF", error)}
      />
    </View>
  );
};

export default PDFViewerScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
