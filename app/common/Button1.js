import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Button1 = ({ onPress, text, width, height }) => {
  return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, { width, height: height || 50 }]}>
        <Text style={styles.text}>{text}
        </Text>
      </TouchableOpacity>
  );
};

const styles = {
  button: {
    backgroundColor: '#FF3366',
    // borderRadius: 25,
    // borderWidth: 2,
    // borderColor: '#FF3366',
    // margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  }
};

export { Button1 } ;
