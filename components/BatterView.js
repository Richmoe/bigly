import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  TouchableOpacity,
  Image,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class BatterView extends Component {
    constructor(props) {
        console.log("BatterState!");
        super(props);

        //props:
        // battingTeam = Team object
        // batterClick CB
       
    }

    batterNameAndOrder = (batterNum) => {
      
      var num = batterNum % this.props.battingTeam.battingOrder.length;
      var batterIx = this.props.battingTeam.battingOrder[num];
      name = this.props.battingTeam.roster[batterIx].name;
      if (batterNum != this.props.battingTeam.currentBatterIx) {
        //first name
        name = name.split(" ")[0];
      }

      return (num+1) + ". " + name;
 
    }
 
    render() {
      return (
        <Row style={styles.container}>
   
            <Col size={15}>
                <Image style={styles.batImage} source={require("../assets/images/baseball-bat.png")} />
            </Col>
            <Col size={55}>
                <TouchableOpacity onPress={() => this.props.batterClick()}>   
                  <Text style={styles.batter}>{this.batterNameAndOrder(this.props.battingTeam.currentBatterIx)}</Text>
                </TouchableOpacity>
            </Col>
            <Col size={30} >
                <Row >
                    <Text style={styles.onDeck}>{this.batterNameAndOrder(this.props.battingTeam.currentBatterIx + 1)}</Text>
                </Row>
                <Row>
                    <Text style={styles.onDeck}>{this.batterNameAndOrder(this.props.battingTeam.currentBatterIx + 2)}</Text>
                </Row>
            </Col>

        </Row>
      );
   
    }
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    batImage: {
        marginTop: 2, 
        marginLeft: 2, 
        width: 30, 
        height: 30,
        resizeMode: 'contain',
    },
    batter: {
      fontSize: 20,
      textAlign: 'left',
      textAlignVertical: 'center',
      margin: 10,
      height: '100%',
    },
    onDeck: {
        fontSize: 16,
        textAlign: 'left',
        textAlignVertical: 'center',
    },
  });

  