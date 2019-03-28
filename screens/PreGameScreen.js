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
import Buttonish from '../components/Buttonish';
import Player from '../model/Player.js';

import Team from '../model/Team.js';

export default class PreGameScreen extends React.Component {
    static navigationOptions = {
        title: 'Pre Game Settings',
    };


    constructor(props) {
        console.log("Creating PreGame");
        super(props);

        //We should have passed in team here and game params here. We assume we loaded on launch:
        this.myTeam = this.props.navigation.getParam("myTeam",null);

        //We need to create our opponent. For now let's just default to 11:
        this.opponentTeam = new Team();
        this.opponentTeam._createDefaultRoster();

        this.state = {
            homeTeam: true,
        }
    }

    onHomeAway = () => {
        this.setState({homeTeam: !this.state.homeTeam});
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex:10, backgroundColor: 'red'}}>
                    <View style={{flex: 5, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 48, fontWeight: 'bold'}}>{this.myTeam.name}</Text>
                        {this.state.homeTeam && <Text style={{fontSize: 22}}>(Home)</Text>}
                        {!this.state.homeTeam && <Text style={{fontSize: 22}}>(Away)</Text>}
                    </View>
                    <View style={{flex: 2, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                        {this.state.homeTeam && 
                            <Buttonish 
                                title="VS"
                                buttonStyle={{fontSize: 24, fontWeight: 'bold'}}
                                onPress={this.onHomeAway}
                            />
                        }
                        {!this.state.homeTeam &&
                            <Buttonish 
                                title="AT"
                                buttonStyle={{fontSize: 24, fontWeight: 'bold'}}
                                onPress={this.onHomeAway}
                            />
                        }                
                    </View>
                    <View style={{flex: 5, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                        
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.opponentTeam.name = text}
                            placeholder = "team name"
                            value={ this.opponentTeam.name}
                        />



                        {!this.state.homeTeam && <Text style={{fontSize: 22}}>(Home)</Text>}
                        {this.state.homeTeam && <Text style={{fontSize: 22}}>(Away)</Text>}
                    </View>
                </View>
                <View style={{flex:3, backgroundColor: 'green'}}>
                <Text style={{fontSize: 18}}>MachinePitch: Yes</Text>
                <Text style={{fontSize: 18}}>Max Innings: 5</Text>
                <Text style={{fontSize: 18}}>Max Runs/Inning: 5</Text>
                <Text style={{fontSize: 18}}>Max Fielders: 11</Text>

                </View>
                <View style={{flex:2, backgroundColor: 'yellow', alignItems: 'center', justifyContent: 'center'}}>
                    <Buttonish 
                        title="Starting Line Up"
                        buttonStyle={{fontSize: 24, fontWeight: 'bold'}}
                    />
                </View>
            </View>
        );
    }
}

/*

                    <Text style={{fontSize: 24}}>Starting Line Up</Text>
<Text style={{fontSize: 48, fontWeight: 'bold'}}>{this.opponentTeam.name}</Text>

*/



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',

  },
  textLabel: {

    fontSize: 16,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  textInput: {
      //flex: 1,
      fontSize: 48,
      fontWeight: 'bold',
      textAlign: 'center',
      //backgroundColor: 'yellow',
      borderStyle: 'solid',
      borderColor: 'grey',
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

