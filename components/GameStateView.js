import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
} from 'react-native';

import { Col, Row, Grid } from 'react-native-easy-grid';

export default class GameStateView extends Component {

    //Props:
    //gameState: 
    // - currentInning
    // -homeLineUp
    // -awayLineUp

    /*inningState: = gameState = {
        awayScore: 0,
        homeScore: 0,
        outs: 0, 
        balls: 0,
        strikes: 0,
      };
    */
    
    getInningText = () => {
        var returnString = (this.props.gameState.isTop ? "Top " : "Bot " );
        returnString += (this.props.gameState.inning);
        return (returnString);
    }

    getPitchCount = () => {
        return `${this.props.inningState.balls}-${this.props.inningState.strikes} Outs: ${this.props.inningState.outs}`;
    }

    render() {
        return (
            <Grid>
                <Row style={{backgroundColor: "#d3d3d3"}}>
                    <Col>
                        <Row>
                            <Text style={styles.scores}>{this.props.gameState.awayLineUp.teamName} {this.props.inningState.awayScore}</Text>
                        </Row>
                        <Row>
                            <Text style={styles.scores}>{this.props.gameState.homeLineUp.teamName} {this.props.inningState.homeScore}</Text>
                        </Row>
                    </Col>
                    <Col>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.inningState}>{this.getInningText()}  {this.getPitchCount()}</Text>
                        </View>

                    </Col>

                </Row>

            </Grid>

        );
    }
};

const styles = StyleSheet.create({
    scores: {
        //padding: 10,
        marginLeft: 10,
        fontSize: 18,
        textAlign: 'center',
    } ,
    inningState: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    } ,
 
});
    

    
