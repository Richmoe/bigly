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
} from 'react-native';


import { MonoText } from '../components/StyledText';

import Layout from '../constants/Layout';

import Buttonish from '../components/Buttonish';

import * as Util from '../util/SaveLoad';
import Team from '../model/Team';
import LineUp from '../model/LineUp';
import GameParams from '../model/GameParams';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  defaultTeam;

  constructor(props)
  {
    super(props);

    this._loadDefaultTeam();

  }

  async _loadDefaultTeam() {

    
    //this.defaultTeam = await Util.retrieveData("DefaultTeam");
    if (this.defaultTeam == null) {
      console.log("Creating Default Team");
      this.defaultTeam = new Team("New Team");
      //TEST:
      this.defaultTeam._createDefaultMyRoster();
    }
    //console.log("default Team is: ");
    //console.log(this.defaultTeam);
    //console.log(this.defaultTeam.roster);
    //console.log(`testing length: ${Object.keys(this.defaultTeam.roster).length}`);
  
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/biglyLogo.png')}
              style={styles.welcomeImage}
            />
          </View>

          <Buttonish 
              title="Start Game" onPress={this._startGamePress}
              titleStyle={styles.buttonText}
          />
          <Buttonish
              title="Settings" onPress={this._settingsPress}              
              titleStyle={styles.buttonText}
          />
          <Buttonish
              title="Debug Home Game" onPress={this._debugHome}
              titleStyle={styles.buttonText}
          />
          <Buttonish
              title="Debug Away Game" onPress={this._debugAway}
              titleStyle={styles.buttonText}
          />
        </ScrollView>
      </View>
    );
  }

  _startGamePress = () => {
    this.props.navigation.navigate('PreGame', {myTeam: this.defaultTeam});
 
  };

  _settingsPress = () => {
    this.props.navigation.navigate('TeamSettings', { team: this.defaultTeam});
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
    //l1._createDefaultLineup();
    //var json = t1.createSave();
    //console.log("1*****************");
    //console.log(json);
    //console.log(l1);

    console.log("2*****************");
    var t2 = new Team("Opponent");
    t2._createDefaultRoster();
    var l2 = new LineUp(t2);
    //l2._createDefaultLineup();
    //console.log(l2);
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
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  buttonText: {
    fontSize: 22,
  }
});
