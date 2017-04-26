import React, {Component} from 'react';
import {StyleSheet, processColor, AppRegistry, View, Text} from 'react-native';

import {LineChart} from 'react-native-charts-wrapper';
import BackgroundTimer from 'react-native-background-timer';

const colors = [processColor('red'), processColor('blue'), processColor('green'), processColor('yellow'), processColor('purple'), processColor('pink')];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    flexDirection: 'column'
  },
  chart: {
    flex: 1
  },
  altContainer: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent'
  }
});

export default class PressWSR extends Component {

  constructor(props) {
    super(props);
    this.state = {
      values: [],
      colorIndex: 0
    }
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
        drawGridLines: true
      }
    }

  }

  componentDidMount() {
    this.interval = BackgroundTimer.setInterval(() => {
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

  componentWillUnmount() {
    this.interval.stop();    
  }

  render() {
    const {values, colorIndex} = this.state;
    const config = this.next(values, colorIndex);    
    console.log(values,colorIndex,config.data.dataSets[0])
    return (
      <View style={styles.container}>
        <Text style={{flex: 1}} >Top</Text>        
        <LineChart data={config.data} xAxis={config.xAxis} styles={styles.altContainer}/>
        <Text style={{flex: 1}}>Bottom</Text>
      </View>
    );
  }
}


AppRegistry.registerComponent('PressWSR', () => PressWSR);