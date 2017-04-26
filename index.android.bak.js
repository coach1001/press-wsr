/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,  
  View,
  Text,
  StatusBar,
  processColor
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import BackgroundTimer from 'react-native-background-timer';
import {LineChart} from 'react-native-charts-wrapper';


const colors = [processColor('red'), processColor('blue'), processColor('green'), processColor('yellow'), processColor('purple'), processColor('pink')];

let Orientation = require('react-native-orientation');

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  return Number(hrs).pad() + ':' + Number(mins).pad() + ':' + Number(secs).pad() + '.' + Number(ms).pad(3);
}

export default class PressWSR extends Component {
  static displayName = 'LiveUpdating';

  constructor(props){
    super(props);    

    this.state = {
      elapsedMilli: 0,
      start: new Date(),
      elapsed: 0,
      values: [],
      colorIndex: 0,
    }
  
    this.intervalId = BackgroundTimer.setInterval(() => {
      let timeNow = new Date();
      this.setState({ 
        elapsed : timeNow-this.state.start,

      });
    }, 10);

    this.interval = setInterval(() => {
      if (this.state.values.length >= 20) {
        this.setState({values: [], colorIndex: 0});
      } else {
        this.setState({
          values: this.state.values.concat([Math.floor((Math.random() * 100) + 1)]),
          colorIndex: (this.state.colorIndex + 1) % colors.length
        });
      }
    }, 500);

  }

  next(values, colorIndex) {
    return {
      data: {
        dataSets: [{
          values: values,
          label: 'Sine function',

          config: {
            drawValues: false,
            color: colors[colorIndex],
            mode: "CUBIC_BEZIER",
            drawCircles: false,
            lineWidth: 2
          }
        }]
      },
      xAxis: {
        axisLineWidth: 0,
        drawLabels: false,
        position: 'BOTTOM',
        drawGridLines: false
      }
    }
  }


  componentDidMount(){
    Orientation.lockToPortrait();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
      const {values, colorIndex} = this.state;
      const config = this.next(values, colorIndex);
      return (
          
      <View style={styles.container}>
        
        <StatusBar hidden={true}/>
        
        <KeepAwake />
        <View style={styles.readings}>        
        
          <View style={styles.sectionHead}>
            <Text style={styles.blackText}>Readings</Text>            
          </View>
          
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.neonText}>Elapsed Time</Text>
            <Text style={styles.neonText}>{ msToTime(this.state.elapsed) }</Text>
          </View>

        </View>
        
        <View style={styles.graph}>        
        
          <View style={styles.sectionHead}>
            <Text style={styles.blackText}>Graph</Text>
          </View>
                    
          <View>
            <LineChart data={config.data} xAxis={config.xAxis} style={styles.chartContainer}/>
          </View>

        </View>

        <View style={styles.controlsAndData}>          
        
          <View style={styles.data}>
          
            <View style={styles.sectionHead}>
              <Text style={styles.blackText}>Data</Text>          
            </View>
 
          </View>

          <View style={styles.controls}>          
            <View style={styles.sectionHead}>
              <Text style={styles.blackText}>Controls</Text>
            </View>          
          </View>          
        
        </View>  

      </View>      
    );
  }
}

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',    
  },  
  sectionHead:{
    borderStyle: 'solid',
    borderBottomColor: '#66FF00',
    backgroundColor: '#66FF00',
    borderBottomWidth: 1,
    borderTopLeftRadius: 4,  
    borderTopRightRadius: 4,  
  },
  dataHeader:{

  },
  readings: {
    flex: 2,
    backgroundColor: 'black',
    borderStyle: 'solid',
    borderColor: '#66FF00',
    borderWidth: 1,    
    borderRadius: 5,    
    margin: 5,
  },
  graph: {
    flex: 4,
    backgroundColor: 'black',    
    borderStyle: 'solid',
    borderColor: '#66FF00',
    borderWidth: 1,      
    margin: 5,
    borderRadius: 5,
  },
  controlsAndData:{
    flex: 4,
    flexDirection: 'row',
    backgroundColor: 'black',    
  },
  data:{
    flex: 2,
    backgroundColor: 'black',
    borderStyle: 'solid',
    borderColor: '#66FF00',
    borderWidth: 1,    
    borderRadius: 5,    
    margin: 5,
  },
  controls:{
    flex: 1,
    backgroundColor: 'black',
    borderStyle: 'solid',
    borderColor: '#66FF00',
    borderWidth: 1,    
    borderRadius: 5,        
    margin: 5,
  },
  blackText:{
    color: 'black',    
    margin: 5,
    fontWeight: 'bold',
  },
  neonText:{
    color: '#66FF00',    
    margin: 5,
  },

});

AppRegistry.registerComponent('PressWSR', () => PressWSR);
