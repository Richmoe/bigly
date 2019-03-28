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

import * as Util from '../util/SaveLoad';
import Team from '../model/Team';

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

    this.defaultTeam = await Util.retrieveData("DefaultTeam");
    if (this.defaultTeam == null) {
      this.defaultTeam = new Team("New Team");
    }
    console.log("default Team is: ");
    console.log(this.defaultTeam);
    

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

          <View style={styles.getStartedContainer}>
              <Button title="Start Game" onPress={this._startGamePress}></Button>
          </View>
          <View style={styles.getStartedContainer}>
              <Button title="Settings" onPress={this._settingsPress}></Button>
          </View>
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
});
