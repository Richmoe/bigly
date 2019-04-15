"use strict";

import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Picker,
  PickerIOS,
} from 'react-native';
import { 
  AppLoading, 
} from 'expo';

import * as Util from '../util/SaveLoad';
import { log } from '../util/Misc';
import Team from '../model/Team';
import LineUp from '../model/LineUp';
import GameParams from '../model/GameParams';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props)
  {
    super(props);

    //this._loadDefaultTeam();
    this.teamList = [];
    this._loadTeamListAndDefault();

    this.state = { 
      isLoadingComplete : false,
      defaultTeam : null
    };
  }

  createAndSaveNewTeam() {
    let team = new Team("Default Team");
    //Test:
    team._createDefaultMyRoster();

    team._saveTeam();

    //Add it to SavedTeams
    if (this.teamList == null) this.teamList = [];
    this.teamList.push({name: team.name, uid: team.uid});
    log("new teamList ", this.teamList);
    //Save new SavedTeams;
    Util.saveData("SavedTeams", this.teamList);

    log("Saved Team?");
    //Set as default
    Util.saveData("DefaultTeam", team.uid);
    log("Saved default?");

    return team;
  }

  async _loadTeam(UID) {
    log ("loading team: " + UID);
    let teamObject = await Util.retrieveData(`Team-${UID}`);
    if (teamObject != null) {
      log("making team from object");
      let team = new Team();
      team.fromJSON(teamObject);
      return team;
    } else {
      log("couldn't find save so creating new");
      return this.createAndSaveNewTeam();
    }
  }

  async _loadTeamListAndDefault() {
    let defaultTeamUid = -1;
    let defaultTeam = null;
    this.teamList = await Util.retrieveData("SavedTeams");

    log("team list:", this.teamList);

    //this.teamList = null; //wipe


    if (this.teamList != null) {
      //get default team
      defaultTeamUid = await Util.retrieveData("DefaultTeam");
      if (defaultTeamUid == null) {
        log("No default team. Creating and saving new one.")
        //set default to be the 1st team
        defaultTeamUid = this.teamList[0].uid;
        Util.saveData("DefaultTeam", defaultTeamUid);
      } else {
        log("Loaded team: " + defaultTeamUid);
      }

      defaultTeam = await this._loadTeam(defaultTeamUid);
      if (defaultTeam.uid != defaultTeamUid) {
        //If we get here, we made a new team.
        log("Saving new default team's uid as default");
        Util.saveData("DefaultTeam", defaultTeam.uid)
        defaultTeamUid = defaultTeam.uid;
      } else {
        log("we have team:", defaultTeam.name);
      }

    } else {
      //Create new team:

      log("Creeating new team because team list is null");
      defaultTeam = this.createAndSaveNewTeam();  
      defaultTeamUid = defaultTeam.uid;
    }

    this.setState({
      isLoadingComplete: true,
      defaultTeam: defaultTeam,
      defaultTeamUid: defaultTeamUid,

    });

  }

  cbSettingsClosed = (teamName) => {
    log("Settings callback!!!", this.teamList, this.state.defaultTeamUid);

    //update name in case:
    let t = this.teamList.find(o => o.uid == this.state.defaultTeamUid);
    t.name = teamName;

    //save teamlist:
    Util.saveData("SavedTeams", this.teamList);

    //Trigger re-render
    this.setState({
      defaultTeam: this.state.defaultTeam,
    });
  
  }

  teamsPicker = () => {

    let jsx = [];
    for (let i = 0;i < this.teamList.length; i++) {
      jsx = [...jsx, <Picker.Item key={i} label={this.teamList[i].name} value={this.teamList[i].uid} />];
    }
    //TODO enable later?
    //jsx = [...jsx, <Picker.Item key={99} label="Create Team..." value="-1" />]
    
    return jsx;
  }

  async selectTeam(uid) {
    let defaultTeam = await this._loadTeam(uid);
    if (defaultTeam.uid != uid) {
      //If we get here, we made a new team.
      log("Saving new default team's uid as default");
      Util.saveData("DefaultTeam", defaultTeam.uid);
    } 
    this.setState({defaultTeam: defaultTeam });
  }

  pickerPick = (itemValue, itemIndex) => {
    log("Value Changex: " + itemValue + ", " + itemIndex);
    if (itemValue == -1) {
      log("creating new team:");
      //new team: - just need to spawn this out.
      let defaultTeam = this.createAndSaveNewTeam();
      this.setState({defaultTeam: defaultTeam});

    } else {
      //load team where UID = itemValue
      this.selectTeam(itemValue);

    }
  }

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading

        />
      );
    } else {
      var startString = `Start Game (${this.state.defaultTeam.name})`;
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
              <Image
                source={require('../assets/images/biglyLogo.png')}
                style={styles.welcomeImage}
              />
            </View>

            <View style={{flex: 1, justifyContent: "center"}}>
              <Picker
                selectedValue={this.state.defaultUid}
                onValueChange={this.pickerPick}
                style={{width: 250}}
              >
                {this.teamsPicker()}

              </Picker>
            </View>

            <Button 
                title={startString} onPress={this._startGamePress}

            />
            <Button
                title="Settings" onPress={this._settingsPress}              

            />
            <Button
                title="Debug Home Game" onPress={this._debugHome}

            />
            <Button
                title="Debug Away Game" onPress={this._debugAway}

            />

    
          </ScrollView>
        </View>
      );
    }
  }

  _startGamePress = () => {
    this.props.navigation.navigate('PreGame', {myTeam: this.state.defaultTeam});
 
  };

  _settingsPress = () => {
    this.props.navigation.navigate('TeamSettings', { team: this.state.defaultTeam, closeCB: this.cbSettingsClosed});
  };

  _debugHome = () => {
    this.debugGame(true);
  }

  _debugAway = () => {
    this.debugGame(false);

  }


  debugGame(isHome) {
    //Going to make a quick game here:

    var t1 = new Team("Dragons");
    t1._createDefaultMyRoster();
    t1.myTeam = true;
    console.log("1*****************");
    var l1 = new LineUp(t1);

    console.log("2*****************");
    var t2 = new Team("Opponent");
    t2._createDefaultRoster();
    var l2 = new LineUp(t2);

    //Extract game settings from team. Do I want to do this? TODO
    var gameSettings = new GameParams(t1);

    //Testing a 1 inning game.
    gameSettings.maxInnings = 1;

    var homeTeam, awayTeam;
    if (isHome) {
      homeTeam = l1;
      awayTeam = l2;
    } else {
      homeTeam = l2;
      awayTeam = l1;
    }

    var date = new Date().toISOString().slice(0,10);

    this.props.navigation.navigate('Game', { homeLineUp: homeTeam, awayLineUp: awayTeam, gameParams: gameSettings, date: date});

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  buttonText: {
    fontSize: 22,
  }
});
