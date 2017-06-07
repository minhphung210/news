import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  TouchableHighlight,
  PanResponder,
  Animated
} from 'react-native';
var {height, width} = Dimensions.get('window');
import * as Animatable from 'react-native-animatable';
import NewsItem from '../common/NewsItem';
const cheerio = require('cheerio-without-node-native');

import { connect } from 'react-redux';
import { changeModalState } from '../actions';
import ViewPager from 'react-native-viewpager';
import { selectedPost2, selectedPost1, selectedPost0 } from '../actions';

class NewsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      left0: new Animated.Value(0),
      left1: new Animated.Value(width),
      left2: new Animated.Value(-width),
      index0: 2,
      index1: 1,
      index2: 3,
      dx: 0,
    }
  };
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: (event, gestureState) => {console.log(gestureState)},
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (event, gestureState) => {},
      onPanResponderMove: (event, gestureState) => {
          switch (this.state.index0) {
            case 2:
                if (gestureState.dx > 30) {
                  if (this.props.dataSlot0 >0) {
                    this.state.left2.setValue(-width+gestureState.dx-30)
                    this.state.left0.setValue(gestureState.dx-30)
                  }
                } else {
                  if (gestureState.dx < -30) {
                    this.state.left0.setValue(gestureState.dx+30)
                    this.state.left1.setValue(width+gestureState.dx+30)
                  }
                }
                break;
            case 3:
                if (gestureState.dx > 30) {
                  this.state.left0.setValue(-width+gestureState.dx-30)
                  this.state.left1.setValue(gestureState.dx-30)
                } else {
                  if (gestureState.dx < -30) {
                    this.state.left1.setValue(gestureState.dx+30)
                    this.state.left2.setValue(width+gestureState.dx+30)
                  }
                }
                break;
            case 1:
                if (gestureState.dx > 30) {
                  this.state.left1.setValue(-width+gestureState.dx-30)
                  this.state.left2.setValue(gestureState.dx-30)
                } else {
                  if (gestureState.dx < -30) {
                    this.state.left0.setValue(width+gestureState.dx+30)
                    this.state.left2.setValue(gestureState.dx+30)
                  }
                }
                break;
          }
          this.setState({ dx: gestureState.dx})
      },
      onPanResponderRelease: (event, gestureState) => {
        switch (this.state.index0) {
          case 2:
              if(this.state.dx > 0) {
                if ((this.state.dx > width/3)||(gestureState.vx > 1.5)) {
                  if (this.props.dataSlot0 >0) {
                    this.setState({index2: 2,index1: 3,index0: 1},() => {
                      if(this.props.dataSlot1>3) {
                        setTimeout(()=>{this.props.dispatch(selectedPost1(this.props.dataSlot1-3))},310)
                      }
                    })
                    Animated.timing(
                      this.state.left2,
                      {toValue: 0, duration: 300}
                    ).start();
                    Animated.timing(
                      this.state.left0,
                      {toValue: width, duration: 300}
                    ).start();
                    this.state.left1.setValue(-width)
                  }
                } else {
                  Animated.timing(
                    this.state.left2,
                    {toValue: -width, duration: 300}
                  ).start();
                  Animated.timing(
                    this.state.left0,
                    {toValue: 0, duration: 300}
                  ).start();
                }
              } else {
                if ((this.state.dx < -width/3)||(gestureState.vx< -1.5)) {
                  this.setState({index2: 1,index1: 2,index0: 3},() => {
                    setTimeout(()=>{this.props.dispatch(selectedPost2(this.props.dataSlot2 + 3))},310)
                  })
                  Animated.timing(
                    this.state.left0,
                    {toValue: -width, duration: 300}
                  ).start();
                  Animated.timing(
                    this.state.left1,
                    {toValue: 0, duration: 300}
                  ).start();
                  this.state.left2.setValue(width)
                } else {
                  Animated.timing(
                    this.state.left0,
                    {toValue: 0, duration: 300}
                  ).start();
                  Animated.timing(
                    this.state.left1,
                    {toValue: width, duration: 300}
                  ).start();
                }
              }
              break;
          case 3:
              if(this.state.dx > 0) {
                if ((this.state.dx > width/3)||(gestureState.vx > 1.5)) {
                  this.setState({index0: 2,index2: 3,index1: 1},() => {
                    if(this.props.dataSlot2>2) {
                      setTimeout(()=>{this.props.dispatch(selectedPost2(this.props.dataSlot2 - 3))},310)

                    }
                  })
                  Animated.timing(
                    this.state.left0,
                    {toValue: 0, duration: 300}
                  ).start();
                  Animated.timing(
                    this.state.left1,
                    {toValue: width, duration: 300}
                  ).start();
                  this.state.left2.setValue(-width)
                } else {
                  Animated.timing(
                    this.state.left0,
                    {toValue: -width, duration: 300}
                  ).start();
                  Animated.timing(
                    this.state.left1,
                    {toValue: 0, duration: 300}
                  ).start();
                }
              } else {
                if ((this.state.dx < -width/3)||(gestureState.vx< -1.5)) {
                  this.setState({index0: 1,index2: 2,index1: 3},() => {
                    setTimeout(()=>{this.props.dispatch(selectedPost0(this.props.dataSlot0 + 3))},310)

                  })
                  Animated.timing(
                    this.state.left1,
                    {toValue: -width, duration: 300}
                  ).start();
                  Animated.timing(
                    this.state.left2,
                    {toValue: 0, duration: 300}
                  ).start();
                  this.state.left0.setValue(width)
                } else {
                  Animated.timing(
                    this.state.left1,
                    {toValue: 0, duration: 300}
                  ).start();
                  Animated.timing(
                    this.state.left2,
                    {toValue: width, duration: 300}
                  ).start();
                }
              }
              break;
          case 1:
              if(this.state.dx > 0) {
                if ((this.state.dx > width/3)||(gestureState.vx > 1.5)) {
                  this.setState({index1: 2,index0: 3,index2: 1},() => {
                    if(this.props.dataSlot0>2) {
                      setTimeout(()=>{this.props.dispatch(selectedPost0(this.props.dataSlot0 - 3))},310)

                    }
                  })
                  Animated.timing(
                    this.state.left2,
                    {toValue: width, duration: 300}
                  ).start();
                  Animated.timing(
                    this.state.left1,
                    {toValue: 0, duration: 300}
                  ).start();
                  this.state.left0.setValue(-width)
                } else {
                  Animated.timing(
                    this.state.left1,
                    {toValue: -width, duration: 300}
                  ).start();
                  Animated.timing(
                    this.state.left2,
                    {toValue: 0, duration: 300}
                  ).start();
                }
              } else {
                if ((this.state.dx < -width/3)||(gestureState.vx< -1.5)) {
                  this.setState({index1: 1,index0: 2,index2: 3},() => {
                    setTimeout(()=>{this.props.dispatch(selectedPost1(this.props.dataSlot1 + 3))},310)

                  })
                  Animated.timing(
                    this.state.left2,
                    {toValue: -width, duration: 300}
                  ).start();
                  Animated.timing(
                    this.state.left0,
                    {toValue: 0, duration: 300}
                  ).start();
                  this.state.left1.setValue(width)
                } else {
                  Animated.timing(
                    this.state.left2,
                    {toValue: 0, duration: 300}
                  ).start();
                  Animated.timing(
                    this.state.left0,
                    {toValue: width, duration: 300}
                  ).start();
                }
              }
              break;
          default:

        }
      }
    });
  }

  render() {
    if (this.props.listData != 0) {
      return (
        <View style={{flex:1}}>
        <View style={styles.navBar}>
            <TouchableHighlight
            onPress={()=>this.props.navigation.goBack()}
            style={styles.navBarButton}>
              <Text style={styles.navBarButtonText}>Back
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
            onPress={()=>this.props.dispatch(changeModalState(!this.props.openMenu))}
            style={styles.navBarButton}>
              <Text style={styles.navBarButtonText}>Menu
              </Text>
            </TouchableHighlight>
        </View>

        <View style={{flex:1}}>

          <Animated.View
          ref={ (view) => topView = view }
          style={{position: 'absolute', left: this.state.left0, zIndex: this.state.index0, backgroundColor: 'transparent'}}
          {...this._panResponder.panHandlers}>
              <NewsItem
              row={this.props.listData[this.props.dataSlot0]}/>
          </Animated.View>

          <Animated.View
          ref={ (view) => topView = view }
          style={{position: 'absolute', left: this.state.left1, zIndex: this.state.index1, backgroundColor: 'transparent'}}
          {...this._panResponder.panHandlers}>
              <NewsItem
              row={this.props.listData[this.props.dataSlot1]}/>
          </Animated.View>

          {(this.props.dataSlot2>-1) &&
            <Animated.View
            ref={ (view) => topView = view }
            style={{position: 'absolute', left: this.state.left2, zIndex: this.state.index2, backgroundColor: 'transparent'}}
            {...this._panResponder.panHandlers}>
                <NewsItem
                row={this.props.listData[this.props.dataSlot2]}/>
            </Animated.View>
          }

        </View>

        </View>
      );
    } else {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text>Loading...
          </Text>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    width: width,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'grey',
    ...Platform.select({
      ios: {
        height: 65,
        paddingTop: 15
      },
      android: {
        height: 50
      }
    }),
  },
  navBarButton: {
    backgroundColor: 'transparent',
    width: 80,
    height: 40,
    justifyContent: 'flex-end',
    paddingBottom: 10
  },
  navBarButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});
const mapStateToProps = state => {
   return {
     listData: state.loadListDataReducer.list,
     dataSlot0: state.loadListDataReducer.selectedPost0,
     dataSlot1: state.loadListDataReducer.selectedPost1,
     dataSlot2: state.loadListDataReducer.selectedPost2,
     openMenu: state.readerModalReducer.modalState
   }
}
export default connect(mapStateToProps)(NewsDetail);
