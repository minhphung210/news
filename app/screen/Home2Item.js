import React, {Component} from 'react';
import Child from '../child';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  PanResponder,
  Animated
} from 'react-native';
var {height, width} = Dimensions.get('window');
import { Button1 } from '../common';
import NewsItem2 from '../common/NewsItem2';
const cheerio = require('cheerio-without-node-native');

export default class Home extends Child {
  constructor(props) {
    super(props);
    topView = null;
    paddingTop = 0;
    this.state = {
      data: [],
      top0: new Animated.Value(0),
      top1: new Animated.Value(0),
      index0: 2,
      index1: 1,
      dataSlot0: 0,
      dataSlot1: 1,
      dy: 0,
    }
    topViewStyle = {
      style:{
        top: paddingTop
      }
    }
  }
  _updateStyle() {
    topView && topView.setNativeProps(topViewStyle)
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => true,
      onPanResponderGrant: (event, gestureState) => {
        switch (this.state.index0) {
          case 2:
              if (gestureState.dy > 0) {
                this.state.top1.setValue(-height)
                setTimeout(()=>{this.setState({ index0: 1, index1: 2})},10)
              } else {

              }
              break;
          case 1:
              if (gestureState.dy > 0) {
                this.state.top0.setValue(-height)
                setTimeout(()=>{this.setState({ index0: 2, index1: 1})},10)
              } else {

              }
              break;
        }
      },
      onPanResponderMove: (event, gestureState) => {
        switch (this.state.index0) {
          case 2:
              if (gestureState.dy > 0) {
                this.state.top1.setValue(-height+gestureState.dy)  
              } else {
                this.state.top0.setValue(gestureState.dy)
              }
              break;
          case 1:
              if (gestureState.dy > 0) {
                this.state.top0.setValue(-height+gestureState.dy)
              } else {
                this.state.top1.setValue(gestureState.dy)
              }
              break;
        }
        this.setState({ dy: gestureState.dy})
      },
      onPanResponderRelease: (event, gestureState) => {
        switch (this.state.index0) {
          case 2:
              if(this.state.dy > 0) {
                if (this.state.dy > height/3) {
                    Animated.timing(
                      this.state.top1,
                      {toValue: 0, duration: 300}
                    ).start();
                } else {
                  Animated.timing(
                    this.state.top1,
                    {toValue: -height, duration: 300}
                  ).start();
                }
              } else {
                if (this.state.dy < -height/3) {
                  Animated.timing(
                    this.state.top0,
                    {toValue: -height, duration: 300}
                  ).start();
                } else {
                  Animated.timing(
                    this.state.top0,
                    {toValue: 0, duration: 300}
                  ).start();
                }
              }
              break;
          case 1:
              if(this.state.dy > 0) {
                if (this.state.dy > height/3) {
                  Animated.timing(
                    this.state.top0,
                    {toValue: 0, duration: 300}
                  ).start();
                } else {
                  Animated.timing(
                    this.state.top0,
                    {toValue: -height, duration: 300}
                  ).start();
                }
              } else {
                if (this.state.dy < -height/3) {
                  Animated.timing(
                    this.state.top1,
                    {toValue: -height, duration: 300}
                  ).start();
                } else {
                  Animated.timing(
                    this.state.top1,
                    {toValue: 0, duration: 300}
                  ).start();
                }
              }
              break;
        }
      }
    });
  }
  componentDidMount() {
    this.fetchData()
  }
  fetchData() {
        let data = this.state.data
        fetch(`http://vnexpress.net/rss/the-thao.rss`)
            .then((response) => response.text())
            .then((responseData) => {
                $ = cheerio.load(responseData, {
                    xmlMode: true,
                    decodeEntities: true
                })
                $('channel>item').each(function(){
                CDATA =$(this).find('description').text()
                let vitribatdau = CDATA.search('src=')
                let vitriketthuc = CDATA.search(' ></a>')
                let vitribatdauDes = CDATA.search('</br>')
                let vitriketthucDes = CDATA.search(']]>')
                    data.push({
                        title:$(this).find('title').text(),
                        thumb : CDATA.slice(vitribatdau +5 , vitriketthuc-1).replace("_180x108",""),
                        des: CDATA.slice(vitribatdauDes+5 , vitriketthucDes),
                        url:$(this).find('link').text(),
                        date: $(this).find('pubDate').text()
                    })
                })
                this.setState({
                  data:data,
                  refreshing:false,
                })
            })
    }
  render() {
    return (
      <View style={{flex:1}}>
        <View style={styles.navBarContainer} {...this._panResponder.panHandlers}>
            <Image
            style={{width: 25, height: 25, marginLeft: 20}}
            source={require('../../img/navicon_menu.png')}/>
        </View>
        <View>
          <Animated.View
          ref={ (view) => topView = view }
          style={{position: 'absolute', top: this.state.top0, zIndex: this.state.index0, backgroundColor: (this.state.index0==1)? 'rgba(232, 232, 232, 0.43)' : 'white'}}
          {...this._panResponder.panHandlers}>
            <NewsItem2
            data={this.state.data[this.state.dataSlot0]}/>
          </Animated.View>

          <Animated.View
          ref={ (view) => topView = view }
          style={{position: 'absolute', top: this.state.top1, zIndex: this.state.index1, backgroundColor: (this.state.index1==1)? 'rgba(232, 232, 232, 0.43)' : 'white'}}
          {...this._panResponder.panHandlers}>
            <NewsItem2
            data={this.state.data[this.state.dataSlot1]}/>
          </Animated.View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  navBarContainer: {
    ...Platform.select({
      ios: {
        height: 65,
        paddingTop: 15
      },
      android: {
        height: 50
      }
    }),
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10
  }
});
