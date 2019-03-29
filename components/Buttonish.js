import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class Buttonish extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    buttonStyle = this.props.buttonStyle;
    if (buttonStyle == null) {
      buttonStyle = styles.buttonDefault;

    }

    if (this.props.disabled) {
      buttonStyle = { backgroundColor: '#CEE3F6'}
    }

    return (
      <TouchableOpacity 
        onPress={this.props.onPress}
        style={[styles.buttonish, buttonStyle]}
        disabled={this.props.disabled}
      >
        <Text style={[this.props.titleStyle, {color: 'white'}]}>{this.props.title}</Text>
     </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  buttonish: {
    backgroundColor: '#81BEF7',
    justifyContent: 'center',
    //height: '100%',
    padding: 10,
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    //borderStyle: 'solid',
    //borderColor: 'black',
    //borderWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderRadius: 10,
  },
});
