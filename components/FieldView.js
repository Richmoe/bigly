
import React, {Component} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Text, 
  TouchableOpacity,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

//baseball image: 400x400
//bottom corner of Home place: 200,370
//Top corner of 1st base: 327, 190 (303) (235)
//top crner of 3rd base, 73, 190 (50) (235)
//top corner of 2nd base, 200, 64 (110)


export default class FieldView extends Component {

    fieldX;
    fieldY;
    fieldWidth;
    fieldHeight;

    constructor(props){
        console.log("Construct FieldView");
  
        super(props);
        //props should be current baserunner array where 0 elem = batter=
    }

    onLayout = (event) => {
        this.fieldX = Math.floor(event.nativeEvent.layout.x);
        this.fieldY = Math.floor(event.nativeEvent.layout.y);
        this.fieldWidth = Math.floor(event.nativeEvent.layout.width);
        this.fieldHeight = Math.floor(event.nativeEvent.layout.height);
        console.log(`Field Dims: ${this.fieldWidth} x ${this.fieldHeight} at ${this.fieldX},${this.fieldY}`);
    }

    getPos = (pos) => {
      //test seed:
      this.fieldWidth = 443;
      this.fieldHeight = 443;
      console.log(stylesPos[pos]);
      left = stylesPos[pos].left;
      top = stylesPos[pos].top;
      
      console.log(`Ratio: ${this.fieldWidth} / 400 = ${(this.fieldWidth / 400)}`);
      left *= this.fieldWidth / 400;
      top *= this.fieldHeight / 400;
      console.log(stylesPos[pos]);
      return { left: {left}, top: {top}}
    }


    renderBaserunners = () =>
    {
        runnerJSX = [];
        for (var i = 1;i < this.props.baseRunners.length;i++)
        {
            if (this.props.baseRunners[i] >= 0)
            {

                runnerJSX = [...runnerJSX,
                    <TouchableOpacity key={i}> 
                        <Text style = {[styles.circleButton, this.getPos(i-1)]}>LS</Text>
                    </TouchableOpacity >
                ];

            }
        }

        return runnerJSX;
    }




    render() {
        return (

            <Grid style={styles.container}> 
            <Row onLayout = {(event) => this.onLayout(event)}>
                <ImageBackground  onLayout = {(event) => this.onLayout(event)} source={require('../assets/images/baseballDiamond.png')} style={styles.image}>

                    {this.renderBaserunners()}

                </ImageBackground>
            </Row>
            </Grid>

        );
    }
}


const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    justifyContent: 'center' 

  },
  circleButton: {
    backgroundColor: 'yellow',
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    borderStyle: 'solid',
    borderColor: 'black',
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 64,
  },
  image: {
    //flex: 1,
    aspectRatio: 1,
    resizeMode: 'contain',
  }
});

stylesPos = [
    {
    //1st:
    position: 'absolute',
    left: 305,
    top: 192,
  },
  {
    //2nd:
    position: 'absolute',
    left: 180,
    top: 65,
  },
  {
    //3rd:
    position: 'absolute',
    left: 50,
    top: 192
  },
  {
    //Home:
    position: 'absolute',
    left: 180,
    top: 370
  },
  {
    //Run 1:
    position: 'absolute',
    left: -50,
    top: 400,
  },
  {
    //Run 2:
    position: 'absolute',
    left: 10,
    top: 400,
  },
  {
    //Run 3:
    position: 'absolute',
    left: 70,
    top: 400,
  }
];
