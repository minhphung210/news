import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  TextInput
} from 'react-native';
var {height, width} = Dimensions.get('window');

class TextInput1 extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <View style={[styles.container,{height: this.props.height || 50 }]}>
        <TextInput
          placeholderTextColor="grey"
          value={this.props.value}
          multiline={this.props.multiline}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={this.props.secureTextEntry}
          placeholder={this.props.placeholder}
          onChangeText={this.props.onChangeText}
          style={styles.textInput}/>
      </View>
    )
  }
}

const styles={
  container:{
    width: width-40,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    margin: 5,
    borderBottomWidth: 1,
    borderColor: 'rgba(199, 199, 199, 0.84)'
  },
  textInput:{
    flex: 5,
    color: 'grey',
    fontSize: 15
  }
}

export { TextInput1 }
