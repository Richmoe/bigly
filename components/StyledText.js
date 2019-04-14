import React from 'react';
import { Text, View } from 'react-native';

export class MonoText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'space-mono' }]} />;
  }
}

export class VText extends React.Component {
  render() {
    return <View style={[this.props.style, {justifyContent: 'center'}]}><Text>{this.props.children}</Text></View>;
  }
}
