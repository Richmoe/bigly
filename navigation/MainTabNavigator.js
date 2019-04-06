import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GameScreen from '../screens/GameScreen';
import RosterScreen from '../screens/RosterScreen';
import PreGameScreen from '../screens/PreGameScreen';
import StatsScreen from '../screens/StatsScreen';
import InGameOptionsScreen from '../screens/InGameOptionsScreen';
import GameOverScreen from '../screens/GameOverScreen';
import SetLineUpScreen from '../screens/SetLineUpScreen';

export default  createStackNavigator({
  Home: HomeScreen,
  PreGame: PreGameScreen,
  Game: GameScreen,
  Roster: RosterScreen,
  TeamSettings: SettingsScreen,
  Stats: StatsScreen,
  InGameOptions: InGameOptionsScreen,
  GameOver: GameOverScreen,
  SetLineUp: SetLineUpScreen,
  navigationOptions: ({navigation}) => ({
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={
          Platform.OS === 'ios'
            ? `ios-information-circle${focused ? '' : '-outline'}`
            : 'md-information-circle'
        }
      />
    ),
  }),
});


/*

const LinksStack = createStackNavigator({
  Links: GameScreen,
  Roster: RosterScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});


SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};


export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  //SettingsStack,
});
*/

