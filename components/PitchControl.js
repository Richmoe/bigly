
import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  TouchableOpacity,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class PitchControl extends Component {

  render() {

    return (
      <Grid>
        {this.props.isHitting && 
        <Row>

          <Col style={styles.container}>
            <TouchableOpacity onPress={() => this.props.clickHandler("done")}>
              <Text style={styles.buttonish}>Done</Text>
            </TouchableOpacity>
          </Col>
            <Col style={styles.container}>
              <TouchableOpacity onPress={() => this.props.clickHandler("reset")}>
                <Text style={styles.buttonish}>Reset</Text>
              </TouchableOpacity>
          </Col>
        </Row>
        }
        {!this.props.isHitting &&
        <Row>
          <Col style={styles.container}>
              <TouchableOpacity onPress={() => this.props.clickHandler("strike")}>
                <Text style={styles.buttonish}>Strike</Text>
              </TouchableOpacity>
          </Col>
          <Col style={styles.container}>
              <TouchableOpacity onPress={() => this.props.clickHandler("ball")}>
                <Text style={styles.buttonish}>Ball</Text>
              </TouchableOpacity>
          </Col>
          <Col style={styles.container}>
              <TouchableOpacity onPress={() => this.props.clickHandler("foul")}>
                <Text style={styles.buttonish}>Foul</Text>
              </TouchableOpacity>
          </Col>
          <Col style={styles.container}>
              <TouchableOpacity onPress={() => this.props.clickHandler("hbp")}>
                <Text style={styles.buttonish}>HBP</Text>
              </TouchableOpacity>
          </Col>
        </Row>
         }
      </Grid>
    );
  }
}

const styles = StyleSheet.create({

  container: {

    margin: 5,

  },
  buttonish: {
    backgroundColor: 'cyan',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
  },
})