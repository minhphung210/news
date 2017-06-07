import React, { Component } from 'react';
import { View, Text, Dimensions, Platform, TouchableOpacity, Image} from 'react-native';
var {height, width} = Dimensions.get('window');

import { connect } from 'react-redux';

class NewsItem2 extends Component {
  render() {
    if (this.props.data) {
      var date = new Date(this.props.data.date)
      return (
        <TouchableOpacity
        onPress={this.props.onPress}
        activeOpacity={1}
        style={[{ flex:1, height: height-50 },this.props.style]}>
            <Image
            source={{uri: this.props.data.thumb}}
            resizeMode="cover"
            style={{height: 255, width: width}}/>
            <Text style={styles.title}>{this.props.data.title}
            </Text>
            <Text style={styles.date}>{date.toLocaleString()}
            </Text>
            <Text style={styles.description}>{this.props.data.des}
            </Text>
        </TouchableOpacity>
      )
    } else { return <View></View>}
  }
}

const styles={
  title: {
    paddingLeft: 15,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    lineHeight: 30
  },
  date: {
    fontSize: 14,
    color: 'grey',
    paddingLeft: 15,
    marginTop: 15,

  },
  description: {
    fontSize: 16,
    paddingLeft: 15,
    marginTop: 15,
    lineHeight: 30
  }
}
const mapStateToProps = state => {
   return {
     openMenu: state.readerModalReducer.modalState,
   }
}
export default connect(mapStateToProps)(NewsItem2);
