import React from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  Switch,
  FlatList,
  Button,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Player from '../model/Player.js';
import * as Util from '../util/SaveLoad.js';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Team Settings',
  };

  currentTeam;
  currentParams;

  constructor(props) {
    console.log("Creating Settings");
    super(props);

    //We should have passed in team here and game params here. We assume we loaded on launch:
    //TODO Refactor so team has params

    currentTeam = this.props.navigation.getParam("team",[]);
    currentParams = this.props.navigation.getParam("settings", {});





    //local copy of roster:
    roster = [];
    roster.push(new Player("Test Player",0,0));
    

    this.state = { 
      text: '', 
      inningCount: 5, 
      isMachinePitch: true,
      roster: roster
    };
  }

  toggleSwitch = (value) => {
    this.setState( {isMachinePitch: value});
  }

  _playerNameChange(text, index) {

    console.log(text + ", " + index);
    roster = this.state.roster;
    roster[index].name = text;
    this.setState({roster: roster});
  }

  _delPressed(text, index) {

    console.log("DEL: " + text + ", " + index);
    console.log(text);

    //TODO: We need a warning/confirmation
    roster = this.state.roster;
    roster.splice(index,1);

    this.setState({roster: roster});

  }


  renderItem = ({item, index} ) => {
    return (
      <View key={index} style={{flexDirection: "row", justifyContent: 'space-between'}}>
        <Text style={{flex: 1}}>Player:</Text>
        <TextInput
          style={[styles.textInput, {flex: 3}]}
          onChangeText={(text) => this._playerNameChange(text, index)}
          value={ item.name}
          placeholder="player name"
        />
        <Button style={{flex: 1}} title="Del" onPress={() => this._delPressed(item,index)} />
      </View>

      );
  }

  keyExtractor = (item, index) => index.toString()

  _addPlayer() {
    console.log("state roster was:");
    console.log(this.state.roster);
    roster = this.state.roster;
    roster.push(new Player("",0,0));
    this.setState({roster: roster});
    console.log(roster);
  }

  componentWillUnmount() {
    console.log('UNMOUNTED');
  }
  
  render() {
    return (
      <View style={{flex: 1, flexDirection: "column"}}>
        <View style={{flex: 1, flexDirection: "column"}}>
          <View style={{flexDirection: "row"}}>
            <Text style={styles.textLabel}>Team Name:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.setState({text})}
              placeholder = "team name"
              value={ this.state.text}
            />
          </View>
          <View style={{flexDirection: "row"}}>
            <Text style={styles.textLabel}>Inning Count:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.changeText(text)}
              value={ this.state.inningCount.toString()}
            />
          </View>
          <View style={{flexDirection: "row"}}>
            <Text style={styles.textLabel}>Pitching Machine:</Text>
            <Switch
              style={styles.switch}
              onValueChange={this.toggleSwitch}
              value={ this.state.isMachinePitch}
            />
          </View>
        </View>
        <View style={{flex: 6, flexDirection: "column", justifyContent: 'flex-start'}}>
          <Text style={styles.textLabel}>Players:</Text>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.state.roster}
            renderItem={this.renderItem}
            extraData={this.state}
            />
            <View>
            <Button title="Add Player" onPress={() => this._addPlayer()}></Button>
            </View>
          </View>
      </View>

    );
  }
}


const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //flexDirection: 'column',

  },
  textLabel: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  textInput: {
      flex: 1,
      fontSize: 22,
      //backgroundColor: 'yellow',
      borderStyle: 'solid',
      borderColor: 'black',
      borderWidth: 1,
  },
  switch: {
      flex: 1,
      //backgroundColor: 'green',
  },
  buttonish: {
    backgroundColor: 'cyan',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
  },
});

