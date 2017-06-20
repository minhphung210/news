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
  Animated,
  StatusBar,
  Share
} from 'react-native';
var {height, width} = Dimensions.get('window');
import * as Animatable from 'react-native-animatable';
import NewsItem from '../common/NewsItem';
const cheerio = require('cheerio-without-node-native');

import { connect } from 'react-redux';
import { changeModalState } from '../actions';
import ViewPager from 'react-native-viewpager';
import { selectedPost2, selectedPost1, selectedPost0, disableScrollWebview } from '../actions';

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
      toTop: 1
    }
  };
  componentWillMount() {
    let listLength = this.props.listData.length;
    var foo;
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: (event, gestureState) => {
        console.log(event.nativeEvent.locationX)
        return (event.nativeEvent.locationX < 35 || event.nativeEvent.locationX > width-35)
      },
      onStartShouldSetPanResponder: (event, gestureState) => {
        console.log(event.nativeEvent.locationX)
        return (event.nativeEvent.locationX < 35 || event.nativeEvent.locationX > width-35)
      },
      // onMoveShouldSetPanResponderCapture: (event, gestureState) => console.log(gestureState),
      onPanResponderGrant: (event, gestureState) => {
        if (this.state.toTop >0) {
          foo = this.state.toTop;
        } else {
          foo = 0;
        }
      },
      onPanResponderMove: (event, gestureState) => {
        this.setState({ toTop: foo - gestureState.dy },()=>{
          if(150> this.state.toTop > 0) {
            this.setState({ navBarBackground: "rgba(0, 0, 0, 0." + Math.floor(this.state.toTop/150*10)+ ")"})
          }
        });

        if((gestureState.x0<35)||(gestureState.x0>width-35)) {
          this.props.dispatch(disableScrollWebview(false));
          switch (this.state.index0) {
            case 2:
                if (gestureState.dx > 30) {
                  if (this.props.dataSlot0 >0) {
                    this.state.left2.setValue(-width+gestureState.dx-30)
                    this.state.left0.setValue(gestureState.dx-30)
                  }
                } else {
                  if (gestureState.dx < -30) {
                    if (this.props.dataSlot0 +1 < listLength) {
                      this.state.left0.setValue(gestureState.dx+30)
                      this.state.left1.setValue(width+gestureState.dx+30)
                    }
                  }
                }
                break;
            case 3:
                if (gestureState.dx > 30) {
                  this.state.left0.setValue(-width+gestureState.dx-30)
                  this.state.left1.setValue(gestureState.dx-30)
                } else {
                  if (gestureState.dx < -30) {
                    if (this.props.dataSlot0 +2 < listLength) {
                      this.state.left1.setValue(gestureState.dx+30)
                      this.state.left2.setValue(width+gestureState.dx+30)
                    }
                  }
                }
                break;
            case 1:
                if (gestureState.dx > 30) {
                  this.state.left1.setValue(-width+gestureState.dx-30)
                  this.state.left2.setValue(gestureState.dx-30)
                } else {
                  if (gestureState.dx < -30) {
                    if (this.props.dataSlot0 < listLength) {
                      this.state.left0.setValue(width+gestureState.dx+30)
                      this.state.left2.setValue(gestureState.dx+30)
                    }
                  }
                }
                break;
          }
          this.setState({ dx: gestureState.dx, canScrollPage: true})
        } else {
          this.setState({ canScrollPage: false})
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if(this.state.toTop < 0) {
          this.setState({ toTop: 0 })
        }
        if (this.state.canScrollPage) {
          this.props.dispatch(disableScrollWebview(true));
          this.setState({ canScrollPage: false })
          switch (this.state.index0) {
            case 2:
                if(this.state.dx > 0) {
                  if ((this.state.dx > width/3)||(gestureState.vx > 1.2)) {
                    if (this.props.dataSlot0 >0) {
                      this.setState({index2: 2,index1: 3,index0: 1, toTop: 0, navBarBackground: "rgba(0, 0, 0, 0)"},() => {
                        setTimeout(()=>{this.props.dispatch(selectedPost1(this.props.dataSlot1-3))},310)
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
                  if ((this.state.dx < -width/3)||(gestureState.vy < -1.2)) {
                    if (this.props.dataSlot0 +1 < listLength) {
                      this.setState({index2: 1,index1: 2,index0: 3, toTop: 0,navBarBackground: "rgba(0, 0, 0, 0)"},() => {
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
                    }
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
                  if ((this.state.dx > width/3)||(gestureState.vy > 1.2)) {
                    this.setState({index0: 2,index2: 3,index1: 1, toTop: 0, navBarBackground: "rgba(0, 0, 0, 0)"},() => {
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
                  if ((this.state.dx < -width/3)||(gestureState.vy < -1.2)) {
                    if (this.props.dataSlot0 +2 < listLength) {
                      this.setState({index0: 1,index2: 2,index1: 3, toTop: 0, navBarBackground: "rgba(0, 0, 0, 0)"},() => {
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
                    }
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
                  if ((this.state.dx > width/3)||(gestureState.vy > 1.2)) {
                    this.setState({index1: 2,index0: 3,index2: 1, toTop: 0, navBarBackground: "rgba(0, 0, 0, 0)"},() => {
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
                  if ((this.state.dx < -width/3)||(gestureState.vy < -1.2)) {
                    if (this.props.dataSlot0 < listLength) {
                      this.setState({index1: 1,index0: 2,index2: 3, toTop: 0, navBarBackground: "rgba(0, 0, 0, 0)"},() => {
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
                    }
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
      }
    });
  }
  shareLink() {
    var page;
    if (this.state.index0 == 2) {
      page = this.props.listData[this.props.dataSlot0];
    } else if (this.state.index1 == 2) {
      page = this.props.listData[this.props.dataSlot1];
    } else {
      page = this.props.listData[this.props.dataSlot2];
    }
    Share.share({
      message: page.title,
      url: page.url,
      title: 'From News App'
    }, {
        dialogTitle: 'From News App',
        // excludedActivityTypes: [
        //   'com.apple.UIKit.activity.PostToTwitter'
        // ],
        tintColor: 'green'
      })
      .then(this._showResult)
      .catch((error) => this.setState({ result: 'error: ' + error.message }));
  }
  render() {
    if (this.props.listData != 0) {
      return (
        <View style={{flex:1}}>
        <StatusBar
         barStyle="light-content"
        />
        <View style={[styles.navBar,{backgroundColor: this.state.navBarBackground}]}>
            <TouchableHighlight
            onPress={()=>this.props.navigation.goBack()}
            style={[styles.navBarButton,{marginLeft: 0}]}>
              <Image
              style={styles.iconNavBar}
              source={require('../../img/ic_back.png')}/>
            </TouchableHighlight>
            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                <TouchableHighlight
                onPress={()=>this.shareLink()}
                style={styles.navBarButton}>
                  <Image
                  style={styles.iconNavBar}
                  source={require('../../img/ic_share.png')}/>
                </TouchableHighlight>
                <TouchableHighlight
                onPress={()=>{}}
                style={styles.navBarButton}>
                  <Image
                  style={styles.iconNavBar}
                  source={require('../../img/ic_bookmark.png')}/>
                </TouchableHighlight>
                <TouchableHighlight
                onPress={()=>this.props.dispatch(changeModalState(!this.props.openMenu))}
                style={styles.navBarButton}>
                  <Image
                  style={styles.iconNavBar}
                  source={require('../../img/ic_more-vertical.png')}/>
                </TouchableHighlight>
            </View>
        </View>

        <View style={{flex:1}}>

          <Animated.View
          ref={ (view) => topView = view }
          style={{position: 'absolute', left: this.state.left0, zIndex: this.state.index0, backgroundColor: 'white', flex:1}}
          {...this._panResponder.panHandlers}>
              <NewsItem
              row={this.props.listData[this.props.dataSlot0]}/>
          </Animated.View>

          <Animated.View
          ref={ (view) => topView = view }
          style={{position: 'absolute', left: this.state.left1, zIndex: this.state.index1, backgroundColor: 'white', flex:1}}
          {...this._panResponder.panHandlers}>
              <NewsItem
              row={this.props.listData[this.props.dataSlot1]}/>
          </Animated.View>

          {(this.props.dataSlot2>-1) &&
            <Animated.View
            ref={ (view) => topView = view }
            style={{position: 'absolute', left: this.state.left2, zIndex: this.state.index2, backgroundColor: 'white'}}
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
    position: 'absolute',
    top:0,
    backgroundColor: 'transparent',
    zIndex: 3,
    paddingLeft: 10,
    paddingRight: 10,
    width: width,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    ...Platform.select({
      ios: {
        height: 55,
        paddingTop: 15
      },
      android: {
        height: 50
      }
    }),
  },
  navBarButton: {
    backgroundColor: 'transparent',
    width: 40,
    height: 40,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    marginLeft: 15,
    alignItems: 'center'
  },
  navBarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  iconNavBar: {
    height: 25,
    width: 25,
  }
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
