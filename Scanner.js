import React, { Component } from "react";

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Alert,
  Linking
} from "react-native";
import { Constants, BarCodeScanner, Camera, Permissions } from "expo";

class Scanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      pendingAction: false
    };
  }

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  };

  _handleBarCodeRead = data => {
    if (!this.state.pendingAction) {
      this.setState({ pendingAction: !this.state.pendingAction });
      Alert.alert(
        "Scan successful!",
        JSON.stringify(data),
        [
          {
            text: "Cancel",
            onPress: () =>
              this.setState({ pendingAction: !this.state.pendingAction }),
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () => {
              this.setState({ pendingAction: !this.state.pendingAction });
              Linking.openURL("https://google.com");
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : this.state.hasCameraPermission === false ? (
          <Text>Camera permission is not granted</Text>
        ) : (
          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            flashMode={Camera.Constants.FlashMode.auto}
            style={{ height: "100%", width: Dimensions.get("window").width }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  }
});

export default Scanner;
