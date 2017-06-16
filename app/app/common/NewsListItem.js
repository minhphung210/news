import React, { Component } from 'react';
import { View, Text, Dimensions, Platform, TouchableOpacity, Image } from 'react-native';
var {height, width} = Dimensions.get('window');
var source = "";

export default class NewsListItem extends Component {
    render() {
      if (this.props.url.includes("vnexpress")) {
        source = "Vnexpress.net";
      } else {
        source = "Tinmoi24.vn"
      }
      return (
        <TouchableOpacity
        onPress={this.props.onPress}
        style={{marginLeft: 15, marginTop: 15, backgroundColor: this.props.postBackground}}>
          <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.title,{color: this.props.textColor}]}>{this.props.title}
          </Text>
          <Text style={{color: 'grey', fontSize: 13, marginBottom: 5, color: this.props.textColor}}>{source}
          </Text>
          <View style={styles.container}>
            <View style={styles.leftBox}>
              <Image
              style={{width: 100, height: 70}}
              source={{ uri: this.props.thumb }}/>
            </View>
            <View style={styles.rightBox}>
              <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              style={[styles.description,{color: this.props.textColor}]}>{this.props.description}
              </Text>
              <View style={[styles.category,{backgroundColor:this.props.cateColor}]}>
                <Text style={styles.categoryText}>{this.props.cate}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    }
}
const styles={
  container: {
    width: '100%',
    flexDirection: 'row'
  },
  leftBox: {
    justifyContent: 'center',
  },
  rightBox: {
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    paddingLeft: 10,
    marginRight: 15,
    justifyContent: 'center',
    flex:1,
    width: width - 130
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 10,
    marginBottom: 5
  },
  description: {
    fontSize: 13,
    color: 'black'
  },
  info1: {
    flexDirection: 'row'
  },
  category: {
    borderRadius: 5,
    marginTop: 3,
  },
  categoryText: {
    padding: 3,
    fontSize:13,
    color: 'white',
    fontWeight: '500',
    borderRadius: 4
  }
}
