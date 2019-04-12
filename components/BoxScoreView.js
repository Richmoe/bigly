import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 

} from 'react-native';
import { Col, Row, Grid  } from 'react-native-easy-grid';

export default class BoxScoreView extends Component {
    constructor(props) {
        console.log("BoxScore!");
        super(props);


        console.log(this.props.game.innings);
        //props:
        // battingTeam = Team object
        this.awayBox = [];
        this.homeBox =  [];
        this.awayRuns = 0;
        this.awayHits = 0;
        this.homeRuns = this.homeHits = 0;
        //build box score:
        for (let i = 0;i < this.props.game.innings.length; i++ ) {
          if (i % 2 == 0) {
            //away
            this.awayBox.push(this.props.game.innings[i].runs);
            this.awayRuns += this.props.game.innings[i].runs;
            this.awayHits += this.props.game.innings[i].hits;
          } else {
            //home
            this.homeBox.push(this.props.game.innings[i].runs);
            this.homeRuns += this.props.game.innings[i].runs;
            this.homeHits += this.props.game.innings[i].hits;
          }
        }
        /*
        //fakeData:
        this.awayBox = [0,5,0,1,2,0];
        this.homeBox = [2,1,0,4,2,2];

        this.awayRuns = 8;
        this.awayHits = 12;
        
        this.homeRuns = 11;
        this.homeHits = 13;
        */

        //Accommodate for home team winning at 9th.
        //Fill in box score to accomodate max innings:
        while (this.awayBox.length < this.props.game.gameSettings.innings) this.awayBox.push("");
        while (this.homeBox.length < this.props.game.gameSettings.innings) this.homeBox.push("");
       
        console.log(this.awayBox);
       
    }

    makeHeader = () => {
      let jsx = [<Col key={99} size={5}></Col>];
      
      for (var i = 0; i < 6; i++) {
          jsx = [...jsx, <Col key={i} size={1}><Text >{i+1}</Text></Col>];
      }
      jsx = [...jsx, <Col key={100} size={1}><Text >R</Text></Col>];
      jsx = [...jsx, <Col key={101} size={1}><Text >H</Text></Col>]; 
      return jsx;
    };

    makeRow = (isAway) => {
      let jsx = [<Col key= {99} size={5}><Text>{isAway ? this.props.game.awayLineUp.teamName : this.props.game.homeLineUp.teamName}</Text></Col>];
      

      var boxScore = (isAway ? this.awayBox : this.homeBox);

      //We're going to walk the whole box score array, but
      for (let i = 0; i < boxScore.length; i++) {
        jsx = [...jsx, <Col key={i} size={1}><Text >{boxScore[i]}</Text></Col>];   
      }
      jsx = [...jsx, <Col key={98} size={1}><Text >{isAway ? this.awayRuns : this.homeRuns}</Text></Col>]; //Runs
      jsx = [...jsx, <Col key={97} size={1}><Text >{isAway ? this.awayHits : this.homeHits}</Text></Col>]; //Hits
      return jsx;
    };

    render() {
      return (
        <Grid>
          <Row style={{height: 30}}>
            {this.makeHeader()}
          </Row>
          <Row style={{height: 1, backgroundColor: "black"}}></Row>
          <Row style={{height: 30}}>
            {this.makeRow(true)}
          </Row>
          <Row style={{height:30}}>
            {this.makeRow(false)}  
          </Row>
        </Grid>
      );
   
    }
  }

  const styles = StyleSheet.create({
    container: {
    }
  });