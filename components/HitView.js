"use strict";

import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet,
  Image,
  ImageBackground,
  View,
  Text, 
  TouchableOpacity,

} from 'react-native';

import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";

const OUTOFFSET=8;
const REF_XSCALER = 443;   //These are the default values for which the stylesPos #s are set
const REF_YSCALER = 443;

export default class HitView extends Component {

    fieldX;
    fieldY;
    fieldWidth;
    fieldHeight;
    stylesPos;

    constructor(props){
        console.log("Construct HitView");
  
        super(props);
        //props
        //baseRunner array - an array of uids for players on base 0 = hitter, 1-3 base
        //battingLineUp - LineUp object
        //resolve - resolveCB

        //update positions of bases:
        this.stylesPos = JSON.parse(JSON.stringify(stylesPosBase));

        for (var i = 0;i < this.stylesPos.length;i++)
        {
          this.stylesPos[i].left = posBases[i][0] * REF_YSCALER/400;
          this.stylesPos[i].top = posBases[i][1] * REF_XSCALER/400;
          console.log("i: " + i);
          console.log(this.stylesPos[i]);
          console.log(posBases[i]);
        }

        console.log(`HitView onBase: ${this.props.baseRunners}`);
    }

 
    advanceRunner = (ix) => {
      if (this.props.baseRunners[(ix)] != -1) {
        this.advanceRunner(ix+1);
      }
        
      this.props.baseRunners[(ix)] = this.props.baseRunners[ix-1];
      this.props.baseRunners[ix-1] = -1;
      
    }

    resolveRunners = (startingPos, endPos) => {

      //TODO Ugly refactor later
      console.log(`resolving pos ${startingPos} moving to ${endPos}`);
      var advance = (endPos - startingPos);
      var playerIX = this.props.baseRunners[startingPos];

      if (endPos > 4)
      {
        //OUT!
        //insert at end of list and shift the other run positions:
        for (var i = OUTOFFSET;i < this.props.baseRunners.length;i++)
        {
          if (this.props.baseRunners[i] == -1 || this.props.baseRunners[i] == playerIX)
          {
            this.props.baseRunners[startingPos] = -1;
            this.props.baseRunners[i] = playerIX;

            break;
          }
        }


      } else { 
        if (startingPos > endPos)
        {
          //move from out to run
          //insert at end of list and shift the other run positions:
          for (var i = 4;i < this.props.baseRunners.length;i++)
          {
            if (this.props.baseRunners[i] == -1 || this.props.baseRunners[i] == playerIX)
            {
              this.props.baseRunners[startingPos] = -1;
              this.props.baseRunners[i] = playerIX;
  
              break;
            }
          }

        } else {
          //Advance all base runners
          while (advance > 0) {
            this.advanceRunner(startingPos+1);
            --advance;
            ++startingPos;
          }
        }
      }

    }

    onPress = (position) => {
      this.props.clickCB(position);
    }

    onMenuSelect = (value) => {
      this.resolveRunners(this.props.clickPos, value);
      this.props.clickCB(-1);
    }

    getAbbrev = (positionIx) => {
      var battingOrderIx = this.props.baseRunners[positionIx];
      var player = this.props.battingLineUp.batterByOrder(battingOrderIx);
      return player.abbrev;

    }

    getFName = (positionIx) => {

      var battingOrderIx = this.props.baseRunners[positionIx];
      var player = this.props.battingLineUp.batterByOrder(battingOrderIx);
      if (positionIx == -1) {
        return "";
      } else {
        //For our team, just pull first naem
        if (this.props.battingLineUp.myTeam) {
          var names = player.name.split(" ");
          return names[0];
        } else {
          //return just the full name of the opponent team
          return player.name;
        }        
      }
    }

    renderBaserunners = () =>
    {
      var runnerJSX = [];
      var stylesColor;
      for (let i = 0;i < this.props.baseRunners.length;i++)
      {
        var baseRunnerIx = this.props.baseRunners[i];
        if (baseRunnerIx != -1)
        {

          if (i >= OUTOFFSET) /*out*/ stylesColor = {     backgroundColor: 'red'}
          else if (i >= 4) /*run*/ stylesColor = {     backgroundColor: '#00CC00'}
          else /*default*/ stylesColor = {     backgroundColor: 'yellow'};

          runnerJSX = [...runnerJSX,
              <TouchableOpacity key={i} style = {[styles.circleButton, stylesColor, this.stylesPos[i]]} onPress = {() => this.onPress(i)}> 
                  <Text style ={styles.buttonText}>{this.getAbbrev(i)}</Text>
              </TouchableOpacity >
          ];
        }
      }
      return runnerJSX;
    }

    renderMenuOptions = () => {
      if (this.props.clickPos == 0) { 
        return (
          <View >
            <MenuOption text='Single' value={1}/>
            <MenuOption text='Double' value={2} />
            <MenuOption text='Triple' value={3} />
            <MenuOption text='Home Run' value={4} />
            <MenuOption text='Out' value={5} />                  
          </View>
        );
      } else {
        var menuJSX = [];
        if (this.props.clickPos < 2) menuJSX.push(<MenuOption key={1} text="1st" value={1} />);  
        if (this.props.clickPos < 3) menuJSX.push(<MenuOption key={2} text="2nd" value={2} />);
        if (this.props.clickPos < 4) menuJSX.push(<MenuOption key={3} text="3rd" value={3} />);
        menuJSX.push(<MenuOption key={4} text="Run" value={4} />);
        menuJSX.push(<MenuOption key={5} text="Out" value={5} />);

        return (<View>{menuJSX}</View>);
      }
    }

    render() {

         return (
          <MenuProvider>
            <View style={styles.container} >

              <ImageBackground 
                source={require('../assets/images/baseballDiamond.png')} 
                style={styles.image} >

                {this.renderBaserunners()}
               
                <Menu opened={this.props.showMenu} onSelect={(value) => this.onMenuSelect(value)}>
                  <MenuTrigger customStyles={trigStyles} disabled={true}/>
                  <MenuOptions customStyles={optionStyles}>
                    <MenuOption disabled={true}><Text style={{fontSize: 28, fontWeight: 'bold'}}>{this.getFName(this.props.clickPos)}</Text></MenuOption>
                    {this.renderMenuOptions()}
                  </MenuOptions>
                </Menu>
              </ImageBackground>
            </View>
          </MenuProvider>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButton: {
    //backgroundColor: 'yellow',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderColor: 'black',
    width: 35,
    height: 35,
    borderWidth: 2,
    borderRadius: 64,
  },
  resetButton: {
    backgroundColor: 'gray',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderColor: 'black',
    width: 100,
    height: 60,
    borderWidth: 4,
    borderRadius: 64,
    left: 463,
    top: 600,
  },
  image: {
      //flex:1,
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
  },
  buttonText: {
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,  
  }
});

const posBases = Platform.select({
  ios:  [
    [153,319],
    [276,192],
    [153,68],
    [30,192],
    [100,355],
    [69,355],
    [38,355],
    [7,355],
    [7,320],
    [38,320],
    [69,320]
  ],
  android: [
    [168,330],
    [294,194],
    [168,68],
    [40,194],
    [111,360],
    [74,360],
    [37,360],
    [0,360],
    [0,320],
    [38,320],
    [76,320]
  ]
})



const stylesPosBase = [
  {
    //Home:
    position: 'absolute',
    left: 168,
    top: 330
  },
    {
    //1st:
    position: 'absolute',
    left: 294,
    top: 194,
  },
  {
    //2nd:
    position: 'absolute',
    left: 168,
    top: 68,
  },
  {
    //3rd:
    position: 'absolute',
    left: 40,
    top: 194
  },
  {
    //Run 0:
    position: 'absolute',
    left: 111,
    top: 360
  },
  {
    //Run 1:
    position: 'absolute',
    left: 74,
    top: 360,
  },
  {
    //Run 2:
    position: 'absolute',
    left: 37,
    top: 360,
  },
  {
    //Run 3:
    position: 'absolute',
    left: 0,
    top: 360,
  },
  {
    //Out 1:
    position: 'absolute',
    left: 0,
    top: 320,
  },
  {
    //Out 2:
    position: 'absolute',
    left: 38,
    top: 320,
  },
  {
    //Out 3:
    position: 'absolute',
    left: 76,
    top: 320,
  },
];

const trigStyles = {
  triggerText: {
    fontSize: 40,
    alignItems: 'center',

  },
  triggerOuterWrapper: {
    left:100,
    //top:200,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
};

const optionStyles = {
  optionTouchable: {
    underlayColor: 'red',
    activeOpacity: 40,


  },
  optionText: {
    color: 'black',
    fontSize: 22,
  },
};

