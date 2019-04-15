"use strict";
import React from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  Switch,
  Button,
} from 'react-native';
import Player from '../model/Player.js';
import * as Util from '../util/SaveLoad.js';
import Team from '../model/Team.js';
import { log } from '../util/Misc';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Team Settings',
  };

  currentTeam;


  constructor(props) {
    console.log("Creating Settings");
    super(props);

    //We should have passed in team here and game params here. We assume we loaded on launch:
    this.currentTeam = this.props.navigation.getParam("team",null);


    this.state = { 
      name: this.currentTeam.name, 
      maxInnings: this.currentTeam.maxInnings, 
      machinePitch: this.currentTeam.machinePitch,
      maxRunsPerInning: this.currentTeam.maxRunsPerInning,
      maxFieldPlayers: this.currentTeam.maxFieldPlayers,
      roster: JSON.parse(JSON.stringify(this.currentTeam.roster))
    };

  }

  toggleSwitch = (value) => {
    this.setState( {machinePitch: value});
  }

  _playerNameChange(text, key) {

    this.state.roster[key].name = text;
    this.setState({roster: roster});
  }

  _delPressed(key, index) {

    console.log("DEL: " + key + ", " + index);

    /*
    //TODO: We need a warning/confirmation
    roster = this.state.roster;
    roster.splice(index,1);
*/

    delete this.state.roster[key];
    console.log(this.state.roster);
    this.setState({roster: roster});

  }


  renderItem = ({key, index} ) => {

    return (
      <View key={index} style={{flexDirection: "row", justifyContent: 'space-between'}}>
        <Text style={{flex: 1}}>Player:</Text>
        <TextInput
          style={[styles.textInput, {flex: 3}]}
          onChangeText={(text) => this._playerNameChange(text, key)}
          value={ this.state.roster[key].name}
          placeholder="player name"
        />
        <Button style={{flex: 1}} title="Del" onPress={() => this._delPressed(key,index)} />
      </View>

      );
  }

  renderPlayerList() {
    return Object.keys(this.state.roster).map((k, i) => {
       return (
          <View key={i} style={{flexDirection: "row", justifyContent: 'space-between'}}>

            <TextInput
              style={[styles.textInput, {flex: 4}]}
              onChangeText={(text) => this._playerNameChange(text, k)}
              value={ this.state.roster[k].name}
              placeholder="player name"
            />
            <Button style={{flex: 1}} title="Del" onPress={() => this._delPressed(k,i)} />
        </View>
      );
    })
  }


  //keyExtractor = (item, index) => index.toString()

  _addPlayer() {
    //console.log("state roster was:");
    //console.log(this.state.roster);
    let r = this.state.roster;
    r.push(new Player("",0,0));
    this.setState({roster: r});
    console.log(r);
  }

  changeInning(text) {
    let num = 0;
    if (text > "") {
      num = parseInt(text);      
    }

    this.setState({maxInnings: num});
  }

  changeMaxRuns(text) {
    let num = 0;
    if (text > "") {
      num = parseInt(text);
    }
    this.setState({maxRunsPerInning: num});
    
  }

  changeMaxFielders(text) {
    let num = 0;
    if (text > "") {
      num = parseInt(text);
    }

    //Cheater:
    if (num == 99)
    {
      //preload roster
      this.preloadDragons();
    }
    this.setState({maxFieldPlayers: num});
  }

  preloadDragons() {
    //Total hack for debug purposes:
    //this.currentTeam._createDefaultMyRoster();
    let test = new Team();
    test._createDefaultMyRoster();

    this.setState({roster: JSON.parse(JSON.stringify(test.roster))});

  }


  saveTeam() {

    //See if we need to save:
    this.currentTeam.name = this.state.name;
    this.currentTeam.maxInnings = this.state.maxInnings; 
    this.currentTeam.machinePitch = this.state.machinePitch,
    this.currentTeam.roster = this.state.roster;
    this.currentTeam.maxRunsPerInning = this.state.maxRunsPerInning;
    this.currentTeam.maxFieldPlayers = this.state.maxFieldPlayers;

    Util.saveData(`Team-${this.currentTeam.uid}`, this.currentTeam);
    log("Saving Team with UID" + this.currentTeam.uid);
    //console.log("Saving team:");
    //console.log(this.currentTeam);
  }

  componentWillUnmount() {
    console.log('UNMOUNTED');

    //test
    this.saveTeam();
  }
  
  render() {

    return (
      <View style={{flex: 1, flexDirection: "column"}}>
        
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Team Name:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.setState({name: text})}
            placeholder = "team name"
            value={ this.state.name}
          />
        </View>
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Inning Count:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.changeInning(text)}
            keyboardType='numeric'
            value={ this.state.maxInnings.toString()}
          />
        </View>
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Max runs/inning:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.changeMaxRuns(text)}
            keyboardType='numeric'
            value={ this.state.maxRunsPerInning.toString()}
          />
        </View>
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Max on field:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.changeMaxFielders(text)}
            keyboardType='numeric'
            value={ this.state.maxFieldPlayers.toString()}
          />
        </View>
        <View style={{flexDirection: "row"}}>
          <Text style={[styles.textLabel, {flex: 1}]}>Pitching Machine:</Text>
          <View style={{alignItems: 'flex-start', flex: 1}}>
            <Switch
              style={styles.switch}
              onValueChange={this.toggleSwitch}
              value={ this.state.machinePitch}
              
            />
          </View>
        </View>
        <View style={{height: 5}} />
        <View style={{height: 1, backgroundColor: 'black'}} />
        <View style={{height: 5}} />

        {this.renderPlayerList()}

        <View>
          <Button style={{width: 50}} title="Add Player" onPress={() => this._addPlayer()}></Button>
        </View>
      </View>
     

    );
  }
}

const styles = StyleSheet.create({
  textLabel: {

    fontSize: 16,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  textInput: {
      flex: 1,
      fontSize: 16,
      //backgroundColor: 'yellow',
      borderStyle: 'solid',
      borderColor: 'black',
      borderWidth: 1,
  },
  switch: {
      flex: 1,
      alignItems: 'center',
      //backgroundColor: 'green',
      transform: [{ scaleX: .7  }, { scaleY: .7}] ,
  },
});

