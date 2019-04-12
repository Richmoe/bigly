"use strict";

import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StackActions, NavigationActions } from 'react-navigation';


import Team, { LineUp } from '../model/Team';
import GameParams from '../model/GameParams';
import Game from '../model/Game';


import PitchControl from '../components/PitchControl.js';
import PitcherView from '../components/PitcherView.js';
import BatterView from '../components/BatterView.js';
import HitView from '../components/HitView.js';
import GameStateView from '../components/GameStateView';
import Buttonish from '../components/Buttonish';
import GameConst from '../constants/GameConst';

export default class GameScreen extends Component {
  static navigationOptions = {
    header: null,
  };


    mBaseRunners; //Array (11 elements) containing IXs of players before and after a play. 0 = batter, 1-3 base, 4-8 are runs, 9-11 are outs
    mBaseRunnersPreHit; //Store off copy of pre-hit UX runners in case we need to reset
    mGame;
    mGameState;

    constructor(props) {
      console.log("Setting up Game");
      super(props);

      //Init Game
      var homeLineUp = this.props.navigation.getParam("homeLineUp");
      var awayLineUp = this.props.navigation.getParam('awayLineUp');
      var params = this.props.navigation.getParam('gameParams');
      var date = this.props.navigation.getParam('date');

      this.mGame = new Game(homeLineUp, awayLineUp, params, date);
      this.mGameState = {
        awayScore: 0,
        homeScore: 0,
        outs: 0, 
        balls: 0,
        strikes: 0,
      };

      console.log(`my team is batting: ${this.mGame.myTeamIsBatting}, home team: ${this.mGame.homeLineUp.teamName}, away team : ${this.mGame.awayLineUp.teamName}`);
      console.log('-----------------');
      //console.log(this.mGame);
      console.log(`isTop = ${this.mGame.isTop} , batting team = ${this.mGame.battingTeam.teamName}. myTeam =  ${this.mGame.myTeam.teamName}`);
      // /console.log(this.mGame.battingTeam);
      //console.log(`AwayTeamMy = ${this.mGame.awayLineUp.myTeam}, HomeTeamMy = ${this.mGame.homeLineUp.myTeam}`);
      console.log('-----------------');

      var batterUpIx = this.mGame.battingTeam.nextBatterIx;
      console.log("Next batterIX = " + batterUpIx);
      this.mGame.parseEvent({type: 'atbat'});
  
      this.state = {
          machinePitch: true,
          currentPitcher: this.mGame.homeLineUp.currentPitcher,
          inHittingUX: false,
          batterUpIx: batterUpIx,
          hitSelected: -1,
          hitMenu: false,
          pitchCount: 0,
          endGame: false,
      }

      this.mBaseRunners = [batterUpIx,  -1,-1,-1, -1,-1,-1,-1, -1,-1,-1];
    }

    nextBatter() {
        this.mGameState.balls = 0;
        this.mGameState.strikes = 0;

        var batterUpIx = this.mGame.battingTeam.nextBatterIx;
        
        this.setState( {batterUpIx: batterUpIx }) ;
        this.mBaseRunners[0] = batterUpIx;

        this.mGame.parseEvent({type: 'atbat'});

        console.log("NextBatter baseRunners:");
        console.log(this.mBaseRunners);



    };

    gameOver() {

      //This resets the Stack so back goes to Home screen
      // then it navigates to Game Over

      console.log("in gameOVer function");
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'Home' }),
          NavigationActions.navigate({ routeName: 'GameOver', params: { game: this.mGame } }),
        ],
      });
      this.props.navigation.dispatch(resetAction);

      //this.props.navigation.navigate('GameOver', { game: this.mGame });

    }

    cbSettings = (event) => {

      console.log("CBSettings:")
      if (event == 'EndGame') {
        //this.setState({endGame: true});
        this.gameOver();
      }
    }

    newInning() {

      var newInning = this.mGame.newInning();
      if (newInning != GameConst.GAME_OVER) {
        this.mGameState.outs = 0;
        this.mGameState.balls = 0;
        this.mGameState.strikes = 0;

        this.setState({currentPitcher: this.mGame.fieldingTeam.currentPitcher });

        this.mBaseRunners = [-1, -1,-1,-1, -1,-1,-1,-1, -1,-1,-1];
        this.nextBatter();
        console.log(`New inning: ${this.mGame.inning}  (TOP: ${this.mGame.isTop}), starting onBase: ${this.mBaseRunners}, pitcher: ${this.mGame.fieldingTeam.currentPitcher.name}`);
      } else {
        console.log("GAME OVER - now what???");
        this.gameOver();

      }
    };

    pitchCallback = (pitchType) => {

      //Special cases:
      if (pitchType == 'reset') {
        this.mBaseRunners = [...this.mBaseRunnersPreHit];
        this.setState( {inHittingUX: false, hitMenu: false});
        return;
      } else if (pitchType === 'hit') {
        this.onHitClick(0); //trigger batter click
        return;
      }

      //This is to catch cases where we hit the "Done" and "Reset" when the modal is up (which means it truly isn't modal) TODO Refactor
      if (this.state.hitMenu) {
        console.log("******************* IGNORE***");
        this.setState( {inHittingUX: false, hitMenu: false});
        return;
      }

      var event = new Object();
      event.type = pitchType;

      if (pitchType === 'strike') {
        ++this.mGameState.strikes ;

        if (this.mGameState.strikes >= 3) {
          //strikeout
          event.type = 'strikeout'; //overwrite
          ++this.mGameState.outs;
          if (this.mGameState.outs > 2){
            console.log(`Strikeout! Retired the side`);
  
            this.newInning();
          } else {
            console.log(`Strikeout! Outs: ${this.mGameState.outs}`);
            //this.setState( { outs: curOutCount });
            this.nextBatter();
          }
        }
      } else if (pitchType === 'ball') {
        ++this.mGameState.balls;
        if (this.mGameState.balls >= 4) {
          //Walk
          event.type = 'walk'; //overwrite

          this.advanceRunner(1);
          this.resolveHit(true);
        }

      } else if (pitchType === 'foul') {
        if (this.mGameState.strikes < 2) {
            ++this.mGameState.strikes;
        }
      } else if (pitchType === 'hbp') {

        //should be same as a walk
        this.advanceRunner(1);
        this.resolveHit(true);

      } else if (pitchType === 'done') {

        this.resolveHit();
        //get current outs?

        this.setState( {inHittingUX: false});
        event = null; //We don't need to pass through the type since we handle the event in the Resolve
      } else {
        console.log("error pitch type: " + pitchType);
      }

      if (event != null) {
        this.mGame.parseEvent(event);
        this.setState({pitchCount: this.state.pitchCount + 1}); //this is more to trigger update than anything else
      }
    };


    onHitClick = (position) => {
      console.log("OHC! " + position);
      if (position == -1) {
        //hide menu
        this.setState({ hitSelected: -1, hitMenu: false});
      } else {
        //show menu
        this.mBaseRunnersPreHit = [...this.mBaseRunners];
        this.setState({ inHittingUX : true, hitSelected: position, hitMenu: true});
      }

    }

    cbPitcherChange = () => {

      console.log(`cbPitcherChange `);
      this.setState({currentPitcher: this.mGame.fieldingTeam.currentPitcher});
      this.setState({ pitchCount: 0}); //this is more to trigger update

    }

    onMachineChange = () => {      
      this.setState ( {machinePitch : !this.state.machinePitch});
      this.mGame.isMachinePitching = !this.mGame.isMachinePitching;
    }

    totalRunners = (total, num) => {
      if (num >= 0) {
        return (total + 1);
      } else {
        return total;
      }
    }

    advanceRunner = (ix) => {
      if (this.mBaseRunners[(ix)] != -1) {
        this.advanceRunner(ix+1);
      }
        
      this.mBaseRunners[(ix)] = this.mBaseRunners[ix-1];
      this.mBaseRunners[ix-1] = -1;
      
    }


    resolveHit = (walk) => {
      
      //Store current Batter:
      //Find batter:
      var batterLoc = this.mBaseRunners.indexOf(this.state.batterUpIx);
      console.log(`batter advanced to ${batterLoc}`);

      if (batterLoc == 1)
      {
        this.mGame.parseEvent({type: 'single'});
        this.mGame.addHit(1);
      } else if (batterLoc == 2) {
        this.mGame.parseEvent({type: 'double'});
        this.mGame.addHit(1);
      } else if (batterLoc == 3) {
        this.mGame.parseEvent({type: 'triple'});
        this.mGame.addHit(1);
      } else if (batterLoc > 7) {
        //This assume batter hit the ball but was thrown out.
        //batter is out, just count the pitch itself
        this.mGame.parseEvent({type: 'strike'});
      }

      //get runs:
      var runCount = 0;
      //loop though:
      for (var i = 4; i < 8;i++) {
        if (this.mBaseRunners[i] != -1) {
          ++runCount;

          if (this.mBaseRunners[i] == this.state.batterUpIx)
          {
            this.mGame.parseEvent({type: 'homerun'});
            this.mGame.addHit(1);
          } else {
            this.mGame.parseEvent({type: 'run', other: this.mBaseRunners[i]});
          }
        }
      }
      //var runCount = runs.reduce(this.totalRunners,0);
      //console.log("runCount " + runCount);
      //console.log(runs);
      if (runCount > 0)  {
        this.mGame.addScore(runCount);
        let {away, home} = this.mGame.score;
  
        this.mGameState.awayScore = away;
        this.mGameState.homeScore = home;
      }


      //get outs - mBaseRunners ix 8-11
      var outs = this.mBaseRunners.slice(8,11);
      var outCount = outs.reduce(this.totalRunners,0);
      if (outCount > 0) {
        this.mGameState.outs += outCount;
        //this.setState( { outs: curOutCount });
        if (this.mGameState.outs > 2){
          this.newInning();
        } else {
          this.nextBatter();
        }
      } else {
        this.nextBatter();
      }

      //Clean out extra status, ix 4-11
      this.mBaseRunners.fill(-1,4);
    }


    render() {
 
      if (this.state.endGame == true) {
        this.gameOver();
        return null;
      }
      return (
        <Grid style={styles.container}>
          <Row style= {{height: 20}} />
          <Row style={{height: 45}}>
            <GameStateView
              gameState={this.mGame}
              inningState={this.mGameState}
            /> 
          </Row>
          <Row size={80} >
          {true && 
            <HitView 
              baseRunners = {this.mBaseRunners} 
              battingLineUp={this.mGame.battingTeam} 
              clickCB={this.onHitClick}
              showMenu={this.state.hitMenu} 
              clickPos={this.state.hitSelected}
            />
          }
          </Row>
          
          <Row size={10} >
            <PitchControl style={styles.pitchcontrol} clickHandler = {this.pitchCallback} isHitting= {this.state.inHittingUX} />
          </Row>
          <Row size={10} >
          { true && this.mGame.myTeamIsBatting == false && 
            <PitcherView 
              onMachineChange = {this.onMachineChange} 
              isMachinePitch={this.state.machinePitch} 
              lineUp = {this.mGame.fieldingTeam} 
              disabled = {this.state.inHittingUX}
            />
          }
          { true && this.mGame.myTeamIsBatting == true && 
            <BatterView 
              battingTeam = {this.mGame.battingTeam}
              //batterClick = {this.onBatterClick}
              disabled = {this.state.inHittingUX}
            />
          }
          </Row>
          <Row style={{height: 65, alignItems: 'center', justifyContent: 'center'}} >

            <Col>
              <Buttonish 
                title="Line Up" 
                onPress={() => this.props.navigation.navigate('Roster', { team: this.mGame.myTeam, view: "fielding", callBack: this.cbPitcherChange})}
                disabled = {this.state.inHittingUX}
              />
            </Col >
            <Col>
            <Buttonish 
                title="Stats" 
                onPress={() => this.props.navigation.navigate('Stats', { team: this.mGame.myTeam})}
                disabled = {this.state.inHittingUX}
              />
            </Col>
            <Col>
            <Buttonish 
                title="Other" 
                onPress={() => this.props.navigation.navigate('InGameOptions', { game: this.mGame, callBack: this.cbSettings})}
                disabled = {this.state.inHittingUX}
              />
            </Col>
          </Row>
          {false && <View style={styles.overlay}>
          </View>
          }


        </Grid>

        );
           
    }

  }

  const styles = StyleSheet.create({
    container: {
      //flex: 1,
      //flexDirection: 'column',

    },
    pitchcontrol: {
        //flex: .5,
        backgroundColor: 'yellow',
    },
    gamestate: {
        //flex: 3,
        backgroundColor: 'green',
    },
    overlay:{
      position: 'absolute',
      top: 60,
      bottom: 0,
      left: 0,
      right: 0,
      height: 100,
      backgroundColor: 'rgba(0,0,0,0.2)'
    },
  });
