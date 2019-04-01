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
import Team from '../model/Team.js';

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
      roster: this.currentTeam.roster.slice(0)
    };
  }

  toggleSwitch = (value) => {
    this.setState( {machinePitch: value});
  }

  _playerNameChange(text, index) {

    roster = this.state.roster;
    roster[index].name = text;
    this.setState({roster: roster});
  }

  _delPressed(text, index) {

    console.log("DEL: " + text + ", " + index);

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
    //console.log("state roster was:");
    //console.log(this.state.roster);
    var r = this.state.roster;
    r.push(new Player("",0,0));
    this.setState({roster: r});
    console.log(r);
  }

  changeInning(text) {
    if (text > "") {
      num = parseInt(text);      
    } else {
      num = 0;
    }
    this.setState({maxInnings: num});
  }

  changeMaxRuns(text) {
    if (text > "") {
      num = parseInt(text);
    } else {
      num = 0;
    }
    this.setState({maxRunsPerInning: num});
    
  }

  changeMaxFielders(text) {
    if (text > "") {
      num = parseInt(text);
    } else {
      num = 0;
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
    test = new Team();
    test._createDefaultMyRoster();

    var r = [];
    for (var i = 0;i < test.roster.length; i++) {
      r.push(test.roster[i]);
    }
    this.setState({roster: r});

  }


  saveTeam() {

    //See if we need to save:
    this.currentTeam.name = this.state.name;
    this.currentTeam.maxInnings = this.state.maxInnings; 
    this.currentTeam.machinePitch = this.state.machinePitch,
    this.currentTeam.roster = this.state.roster;
    this.currentTeam.maxRunsPerInning = this.state.maxRunsPerInning;
    this.currentTeam.maxFieldPlayers = this.state.maxFieldPlayers;

    Util.saveData("DefaultTeam", this.currentTeam);
    console.log("Saving team:");
    console.log(this.currentTeam);
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
     

    );
  }
}


const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //flexDirection: 'column',

  },
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
  buttonish: {
    backgroundColor: 'cyan',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
  },
});

