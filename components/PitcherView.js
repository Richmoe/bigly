import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class PitcherView extends Component {
    //Props:
    //lineUp - fieldingTeam
    //isMachinePitch - flag
    //onMachineChange - CB if users clicks on machine/baseball
    //onPitcherChange - CB if user clicks on pitcher
 
    render() {
        var pitcher = this.props.lineUp.currentPitcher;

        return (
            <Row size={1} style={styles.container}>
                <Col size={15}>
                    <TouchableOpacity onPress={() => this.props.onMachineChange()} disabled = {this.props.disabled} style = {styles.container}>  
                        <Image 
                            style={{marginTop: 2, marginLeft: 2, width: 30, height: 30, resizeMode: 'contain'}} 
                            source={this.props.isMachinePitch ? require("../assets/images/pitchingMachine.png") : require("../assets/images/small-baseball.png")} 
                        />
                    </TouchableOpacity>
                </Col>
                <Col size={55}>
                    <TouchableOpacity onPress={() => this.props.onMachineChange()} disabled = {this.props.disabled} style = {styles.container}>       
                        <Text style={styles.pitcherName}>{this.props.isMachinePitch ? "Machine Pitch" : pitcher.name}</Text>
                    </TouchableOpacity>   
                </Col>
                {this.props.isMachinePitch && <Col size={30} />}
                {!this.props.isMachinePitch && <Col size={30} >
                    <Row >
                        <Col>
                            <Text style={styles.pitchdata}>Balls:</Text>
                        </Col>
                        <Col>
                            <Text style={styles.pitchdata}>{this.props.lineUp.playerStats[pitcher.uid].pitcherStats.balls}</Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={styles.pitchdata}>Strikes:</Text>
                        </Col>
                        <Col>
                            <Text style={styles.pitchdata}>{this.props.lineUp.playerStats[pitcher.uid].pitcherStats.strikes}</Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={styles.totaldata}>Total:</Text>
                        </Col>
                        <Col>
                            <Text style={styles.totaldata}>{(this.props.lineUp.playerStats[pitcher.uid].pitcherStats.balls + this.props.lineUp.playerStats[pitcher.uid].pitcherStats.strikes)}</Text>
                        </Col>                   
                    </Row>       
                </Col>
                }
            </Row>
        );
    
    }
}


  const styles = StyleSheet.create({
    container: {
        alignItems: 'center',

    },
    pitcherName: {

      fontSize: 20,
      textAlign: 'left',
      //textAlignVertical: 'center',
      margin: 10,
      //height: '100%',
    },
    pitchdata: {
        fontSize: 14,
    },
    totaldata: {
        fontSize: 16,
        fontWeight: 'bold',
    },
  });

  