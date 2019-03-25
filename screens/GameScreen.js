import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Team, { LineUp } from '../model/Team';
import GameParams from '../model/GameParams';
import Game from '../model/Game';

import PitchControl from '../components/PitchControl.js';
import PitcherView from '../components/PitcherView.js';
import BatterView from '../components/BatterView.js';
import GameStateView from '../components/GameStateView.js';
import FieldView from '../components/FieldView.js';
import HitView from '../components/HitView.js';

export default class GameScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Dragons'),
    };
  };


    mBaseRunners; //Array (11 elements) containing IXs of players before and after a play. 0 = batter, 1-3 base, 4-8 are runs, 9-11 are outs
    mBaseRunnersPreHit; //Store off copy of pre-hit UX runners in case we need to reset
    mGame;
    mGameState;

    constructor(props) {
        console.log("Setting up Game ");
        super(props);

        //Init Game
        defaultGame = this._testGame();


        this.mGame = defaultGame;
        //console.log(this.mGame);
        batterUp = this.mGame.nextBatter;

        this.mGame.parseEvent({type: 'atbat'});

        this.mGameState = {
          awayScore: 0,
          homeScore: 0,
          outs: 0, 
          balls: 0,
          strikes: 0,
        };


        this.state = {
            machinePitch: true,

            inHittingUX: false,
            batterUp: batterUp,
            hitSelected: -1,
            hitMenu: false
        }

        this.mBaseRunners = [batterUp,  -1,-1,-1, -1,-1,-1,-1, -1,-1,-1];
        
        titleStr = `Inning: ${this.mGame.inning}${this.mGame.isTop? "˄" : "˅"}  ${this.mGameState.balls}-${this.mGameState.strikes} Outs: ${this.mGameState.outs} Score: ${this.mGameState.awayScore}-${this.mGameState.homeScore}`;
        this.props.navigation.setParams({title: titleStr});
    }


    _testGame () {
      
      t1 = new Team("Dragons");
      t1._createDefaultMyRoster();
      t1.myTeam = true;
      l1 = new LineUp(t1);
      l1._createDefaultLineup();

      t2 = new Team("Opponent");
      t2._createDefaultRoster();
      l2 = new LineUp(t2);
      l2._createDefaultLineup();
      
      gameSettings = new GameParams(10,false,true);

      return new Game(l2, l1, gameSettings);
    }

    nextBatter() {
        this.mGameState.balls = 0;
        this.mGameState.strikes = 0;

        batterUp = this.mGame.nextBatter;

        this.setState( {batterUp: batterUp }) ;
        this.mBaseRunners[0] = batterUp;

        this.mGame.parseEvent({type: 'atbat'});
    };

    newInning() {

      this.mGame.newInning();
      this.mGameState.outs = 0;
      this.mGameState.balls = 0;
      this.mGameState.strikes = 0;

      this.mBaseRunners = [-1, -1,-1,-1, -1,-1,-1,-1, -1,-1,-1];
      this.nextBatter();
      console.log(`New inning: ${this.mGame.inning}  (TOP: ${this.mGame.isTop}), starting onBase: ${this.mBaseRunners}`);
    };

    scoreRun(player, pitcher, runcount = 1) //Need to figure out RBIs etc.
    {

      console.log("Score run " + runcount);
      /*
      var newScore = this.state.score;
      newScore[this.state.inning % 2] += runcount;
      this.setState ( {
          score : newScore
      });
      */
      this.mGame.addScore(runcount);
      let {away, home} = this.mGame.score;
      console.log(`Score: ${away} - ${home}`);
      this.mGameState.awayScore = away;
      this.mGameState.homeScore = home;

    };

    updatePitcherStats = (pitchType) => {

      pitcherPlayer = this.mGame.fieldingTeam.playerByPos(0);

      if (['strike','foul','hit'].indexOf(pitchType) >= 0) {
        pitcherPlayer.pitcherStats.strikes += 1;
      } else if (['ball','hbp'].indexOf(pitchType) >= 0) {
        pitcherPlayer.pitcherStats.balls += 1;
      } else {
        console.log("Invalid PitchType: " + pitchType);
      };

    }

    pitchCallback = (pitchType) => {

      //Special cases:
      if (pitchType == 'reset') {
        this.mBaseRunners = [...this.mBaseRunnersPreHit];
        this.setState( {inHittingUX: false});
        return;
      } else if (pitchType === 'hit') {
        this.onHitClick(0); //trigger batter click
        return;
      }

      if (!this.state.machinePitch)  this.updatePitcherStats(pitchType);

      event = new Object();
      event.type = pitchType

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
          //Update the baserunners: simply insert -1 to move the runner to 1st, then trim the last element (Out3 which is -1)
          //this.mBaseRunners.unshift(-1);
          //this.mBaseRunners.pop();
          this.advanceRunner(1);
          this.resolveHit(true);
        }

      } else if (pitchType === 'foul') {
        if (this.mGameState.strikes < 2) {
            ++this.mGameState.strikes;
        }
      } else if (pitchType === 'hbp') {
        //this.mBaseRunners.unshift(-1);
        //this.mBaseRunners.pop();
        //should be same as a walk
        this.advanceRunner(1);
        resolved = this.resolveHit(true);

      } else if (pitchType === 'done') {
        resolved = this.resolveHit();
        //get current outs?

        this.setState( {inHittingUX: false});
        event = null; //We don't need to pass through the type since we handle the event in the Resolve
      } else {
        console.log("error pitch type: " + pitchType);
      }

      titleStr = `Inning: ${this.mGame.inning}${this.mGame.isTop? "˄" : "˅"} ${this.mGameState.balls}-${this.mGameState.strikes} Outs: ${this.mGameState.outs} Score: ${this.mGameState.awayScore}-${this.mGameState.homeScore}`;
      console.log(titleStr);

      this.props.navigation.setParams({title: titleStr});

      if (event != null) this.mGame.parseEvent(event);
      //this.logEvent(event);
    };

    onPitcherClick = () => {
      this.props.navigation.navigate('Roster', { team: this.mGame.fieldingTeam, view: 'pitching', callBack: this.onPitcherChange});
    };


    onBatterClick = () => {
      this.props.navigation.navigate('Roster', { team: this.mGame.battingTeam, view: 'batting'});     
    }

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

    onPitcherChange = (newPitcherIx) => {
      var currentPitcherIx = this.mGame.fieldingTeam.fieldPositions[0];
   
      if (newPitcherIx == currentPitcherIx) {
        console.log("No change in pitcher!");
        return;
      }

      //TODO Refactor
      //baseline is to swap with other position:
      //Update team orders
      var oldPos = this.mGame.fieldingTeam.getPlayer(newPitcherIx).positionByInning[0];
      console.log(`Old position for new pitcher was ${oldPos}`);

      //Updated old Player's positionByInning:
      this.mGame.fieldingTeam.getPlayer(currentPitcherIx).positionByInning[0] = oldPos;
      //set new player's position to Pitcher:
      this.mGame.fieldingTeam.getPlayer(newPitcherIx).positionByInning[0] = 0;

      //Update fieldPositionsArray
      this.mGame.fieldingTeam.fieldPositions[oldPos] = this.mGame.fieldingTeam.fieldPositions[0];
      this.mGame.fieldingTeam.fieldPositions[0] = newPitcherIx;

      console.log(this.mGame.fieldingTeam.fieldPositions);

      //Since I'm not tying this to state now, just force the update
      this.forceUpdate();

    }

    onMachineChange = () => {      
      //this.setState ( {machinePitch : !this.state.machinePitch});
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
      
      if (walk == null) {
        console.log("resolveHit Hit " + this.mGame.battingTeam.battingOrder[this.mGame.battingTeam.currentBatterIx] + ", BatterUP: " + this.state.batterUp);
      }else {
        console.log("resolveHit WALK");
      }

      //Store current Batter:
      //Find batter:
      var batterLoc = this.mBaseRunners.indexOf(this.state.batterUp);
      console.log(`batter advanced to ${batterLoc}`);

      if (batterLoc == 1)
      {
        this.mGame.parseEvent({type: 'single'});
      } else if (batterLoc == 2) {
        this.mGame.parseEvent({type: 'double'});
      } else if (batterLoc == 3) {
        this.mGame.parseEvent({type: 'triple'});
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

          if (this.mBaseRunners[i] == this.state.batterUp)
          {
            this.mGame.parseEvent({type: 'homerun'});
          } else {
            this.mGame.parseEvent({type: 'run', other: this.mBaseRunners[i]});
          }
        }
      }
      //var runCount = runs.reduce(this.totalRunners,0);
      //console.log("runCount " + runCount);
      //console.log(runs);
      if (runCount > 0)  this.scoreRun(0,0,runCount);


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
 
      return (
        <Grid style={styles.container}>
          <Row size={80} >
            <HitView 
              baseRunners = {this.mBaseRunners} 
              battingTeam={this.mGame.battingTeam} 
              clickCB={this.onHitClick}
              showMenu={this.state.hitMenu} 
              clickPos={this.state.hitSelected}
            />
          </Row>
          
          <Row size={10} >
            <PitchControl style={styles.pitchcontrol} clickHandler = {this.pitchCallback} isHitting= {this.state.inHittingUX} />
          </Row>
          <Row size={10} >
          { this.mGame.myTeamIsBatting == false && 
            <PitcherView 
              onPitcherChange = {this.onPitcherClick} 
              onMachineChange = {this.onMachineChange} 
              isMachinePitch={this.mGame.isMachinePitching} 
              pitcher = {this.mGame.fieldingTeam.playerByPos(0)} 
            />
          }
          { this.mGame.myTeamIsBatting == true && 
            <BatterView 
              battingTeam = {this.mGame.battingTeam}
              batterClick = {this.onBatterClick}
            />
          }
          </Row>

        </Grid>

        );
           
/*

        <Row size={0}>
          <GameStateView style={styles.gamestate}
              balls = {this.state.balls}
              strikes = {this.state.strikes}
              outs = {this.state.outs}
              game = {this.mGame}
            />
        </Row>

     
       */
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
    }
  });
