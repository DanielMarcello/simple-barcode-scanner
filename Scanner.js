import React, { Component } from "react";

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Alert,
  Linking,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Image
} from "react-native";
import { Constants, BarCodeScanner, Camera, Permissions } from "expo";

class Scanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      pendingAction: false,
      inputText: "",
      enabledInput: true
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
    if (!this.state.enabledInput) {
      if (!this.state.pendingAction) {
        this.setState({ pendingAction: !this.state.pendingAction });
        Alert.alert(
          this.state.TextInput,
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
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              flashMode={Camera.Constants.FlashMode.auto}
              style={{ height: "100%", width: Dimensions.get("window").width }}
            >
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  onChangeText={text => this.setState({ TextInput: text })}
                  value={this.state.text}
                  placeholder="Escribe el código de lista..."
                  editable={this.state.enabledInput}
                />
                <TouchableHighlight
                  style={styles.inputTouchable}
                  onPress={() => {
                    Keyboard.dismiss();
                    this.setState({ enabledInput: !this.state.enabledInput });
                  }}
                >
                  {!this.state.enabledInput ? (
                    <Image
                      style={styles.inputImage}
                      source={require("./static/img/greenCheck.png")}
                    />
                  ) : (
                    <Image
                      style={styles.inputImage}
                      source={require("./static/img/grayCheck.png")}
                    />
                  )}
                </TouchableHighlight>
              </View>
            </BarCodeScanner>
          </TouchableWithoutFeedback>
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
  },
  inputView: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 10
  },
  inputText: {
    height: 40,
    width: "80%",
    backgroundColor: "white",
    alignSelf: "center",
    paddingHorizontal: 10,
    flex: 4
  },
  inputTouchable: {
    flex: 1,
    alignItems: "stretch",
    padding: 2,
    backgroundColor: "white"
  },
  inputImage: {
    flex: 1,
    width: null,
    height: null
  }
});

export default Scanner;
