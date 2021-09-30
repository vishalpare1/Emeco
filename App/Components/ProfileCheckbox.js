import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  CheckBox,
  View,
  Text,
} from "react-native";
import styles from "./Styles/ProfileCheckboxStyles";

export default class ProfileCheckbox extends Component {
  // Prop type warnings
  static propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func,
    isEditable: PropTypes.bool,
  };

  //Defaults for props
  static defaultProps = {
    isEditable: true,
    value: false,
  };

  render() {
    const { value, isEditable, onChange } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={value}
            onValueChange={onChange}
            style={styles.checkbox}
            disabled={!isEditable}
          />
          <Text style={styles.label}>Alternate Supervisor</Text>
        </View>
      </View>
    );
  }
}