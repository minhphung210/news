import React from 'react';
import { View, Text, Dimensions, Platform, TouchableOpacity } from 'react-native';
var {height, width} = Dimensions.get('window');

const RunsItem = ({ title, date, numOfPack, distance }) => {
    return (
      <View style={styles.container}>
        <View style={styles.leftBox}>
          <Text style={styles.title}>{title}
          </Text>
          <Text style={styles.date}>{date}
          </Text>
        </View>
        <View style={styles.rightBox}>
          <View style={styles.info1}>
              <Text>p
              </Text>
              <Text>{numOfPack}
              </Text>
          </View>
          <View style={styles.info1}>
              <Text>d
              </Text>
              <Text>{distance}km
              </Text>
          </View>
          <View style={styles.info1}>
              <Text>>
              </Text>
          </View>
        </View>
      </View>
    )
}
const styles={
  container: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'rgba(199, 199, 199, 0.84)',
    marginLeft: 50,
    flexDirection: 'row'
  },
  leftBox: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 25,
    paddingBottom: 25
  },
  rightBox: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16
  },
  date: {
    fontSize: 15,
    color: 'grey'
  },
  info1: {
    flexDirection: 'row'
  }
}
export { RunsItem }
