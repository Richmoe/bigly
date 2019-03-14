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
    //pitcher - pitcher Player
    //isMachinePitch - flag
    //onMachineChange - CB if users clicks on machine/baseball
    //onPitcherChange - CB if user clicks on pitcher
 
    render() {
      return (
          <Row size={1} style={styles.container}>
            <Col size={15}>
                <TouchableOpacity onPress={() => this.props.onMachineChange()}>  
                    {true && <Image 
                        style={{marginTop: 20, marginLeft: 5, width: 75, height: 75}} 
                        source={this.props.isMachinePitch ? require("../assets/images/pitchingMachine.png") : require("../assets/images/small-baseball.png")} 
                    />
                    }
                </TouchableOpacity>
            </Col>
            <Col size={60}>
                <TouchableOpacity onPress={() => this.props.onPitcherChange()}>       
                    <Text style={styles.pitcherName}>{this.props.pitcher.name}</Text>
                </TouchableOpacity>   
            </Col>
            {this.props.isMachinePitch && <Col size={25} />}
            {!this.props.isMachinePitch && <Col size={25} >
                <Row >
                    <Col>
                        <Text style={styles.pitchdata}>Balls:</Text>
                    </Col>
                    <Col>
                        <Text style={styles.pitchdata}>{this.props.pitcher.pitcherStats.balls}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Text style={styles.pitchdata}>Strikes:</Text>
                    </Col>
                    <Col>
                        <Text style={styles.pitchdata}>{this.props.pitcher.pitcherStats.strikes}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Text style={styles.totaldata}>Total:</Text>
                    </Col>
                    <Col>
                        <Text style={styles.totaldata}>{(this.props.pitcher.pitcherStats.balls + this.props.pitcher.pitcherStats.strikes)}</Text>
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


    },
    pitcherName: {

      fontSize: 32,
      textAlign: 'left',
      textAlignVertical: 'center',
      margin: 10,
      height: '100%',
    },
    pitchdata: {
        fontSize: 24,
    },
    totaldata: {
        fontSize: 28,
        fontWeight: 'bold',
    },
  });

  