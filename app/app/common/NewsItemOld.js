import React from 'react';
import { View, Text, Dimensions, Platform, TouchableOpacity, Image } from 'react-native';
var {height, width} = Dimensions.get('window');

const NewsItem = ({ title, description, thumb, onPress }) => {
    return (
      <TouchableOpacity
      onPress={onPress}
      style={styles.container}>
        <View style={styles.leftBox}>
          <Image
          style={{width: 150, height: 80}}
          source={{ uri: thumb }}/>
        </View>
        <View style={styles.rightBox}>
          <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={styles.title}>{title}
          </Text>
          <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          style={styles.date}>{description}
          </Text>
        </View>
      </TouchableOpacity>
    )
}
const styles={
  container: {
    width: '100%',
    height: 90,
    borderBottomWidth: 1,
    borderColor: 'rgba(199, 199, 199, 0.84)',
    paddingLeft: 5,
    flexDirection: 'row'
  },
  leftBox: {
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    width: '40%'
  },
  rightBox: {
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    padding: 5,
    width: '60%'
  },
  title: {
    fontWeight: '500',
    fontSize: 15,
    marginRight: 10
  },
  date: {
    fontSize: 13,
    color: 'grey'
  },
  info1: {
    flexDirection: 'row'
  }
}
export { NewsItem }
