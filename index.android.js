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
  processColor,
  ActivityIndicator,
} from 'react-native';
import _ from 'lodash';
import { Buffer } from 'buffer';
import KeepAwake from 'react-native-keep-awake';
import BackgroundTimer from 'react-native-background-timer';
import {LineChart} from 'react-native-charts-wrapper';
import BluetoothSerial from 'react-native-bluetooth-serial';

const devicePress = {id:'20:16:10:19:47:09', name: 'WSR Press'}
global.Buffer = Buffer;
const writeBuffer = new Buffer(13);
const readBuffer = new Buffer(26);


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

  constructor(){
    super();    

    this.state = {
      elapsedMilli: 0,          
      elapsed: 0,
      data: {        
        dataSets: [
        {
          values: [
            {x:0,y:0}            
          ],

          label: 'Current',
          config: {
            lineWidth: 1,                      
            highlightEnabled: true,            
            color: processColor('red'),
            drawCircles: false, 
            drawValues: false,           
          }
        },{
          values: [
            {x:0,y:0},
            {x:600,y:800}            
          ],

          label: 'Expected',
          config: {
            lineWidth: 1,                      
            highlightEnabled: true,            
            color: processColor('blue'),
            drawCircles: false, 
            drawValues: false,           
          }
        }],        
      },
      minX: 0,
      maxX: 10,
      graphWindow: 10,
    }
  }

  componentWillMount(){
    writeBuffer[0] = 99
    writeBuffer[1] = 0
    writeBuffer[2] = 0
    writeBuffer[3] = 0
    writeBuffer[4] = 0
    writeBuffer[5] = 0
    writeBuffer[6] = 0
    writeBuffer[7] = 0
    writeBuffer[8] = 0
    writeBuffer[9] = 0
    writeBuffer[10] = 0
    writeBuffer[11] = 0
    writeBuffer[12] = 0
  }

  componentDidMount(){
    Orientation.lockToPortrait();
    BluetoothSerial.requestEnable().then( (res)=>{      
      BluetoothSerial.connect(devicePress.id).then( (res)=>{
        
        this.setState({elapsed: 0, start: new Date()});  
        this.intervalId = BackgroundTimer.setInterval(() => {
          let timeNow = new Date();
          this.setState({ 
            elapsed : timeNow-this.state.start,
          });
        }, 10);
      
        this.graphTimer = BackgroundTimer.setInterval(() => {
          let oState = _.cloneDeep(this.state);
          let timeNow = new Date();
          let elapsed = (timeNow - this.state.start)/1000
          if(elapsed > this.state.maxX){
            oState.data.dataSets[0].values.shift();
            oState.minX = elapsed - this.state.graphWindow; 
            oState.maxX = elapsed;        
          }
          oState.data.dataSets[0].values.push({x: elapsed, y: elapsed });
          this.setState(oState);
        }, 20);
      
      })//CONNECT SERIAL
    })//BLUETOOTH
  }    
  
  componentWillUnmount() {
    this.intervalId.stop();
    this.graphTimer.stop();
  }

  render() {
      let borderColor = processColor("red");
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
                    
          <View style={{backgroundColor: 'white', flex: 1, margin: 5}}>            
            <LineChart 
              style={styles.chartContainer}               
              data={this.state.data}
              chartDescription={{text: ''}}              
              drawGridBackground={true}
              yAxis={{
                left: {axisMinimum: 0, axisMaximum:800},
                right: { drawLabels: false, drawGridLines: false}
              }}              
              xAxis={{position:'BOTTOM', axisMinimum: this.state.minX, axisMaximum: this.state.maxX, labelCount: 10}}
            />
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
