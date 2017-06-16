import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  Image,
  KeyboardAvoidingView
} from 'react-native';
var {height, width} = Dimensions.get('window');

class LoginInput extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <View style={[styles.container,{height: this.props.height || 50 }]}>
        <Image
        style={styles.icon}
        source={this.props.icon}/>
        <TextInput
          placeholderTextColor="white"
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
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    margin: 5,
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  textInput:{
    flex: 5,
    color: 'white',
    fontSize: 15,
    paddingLeft: 20
  },
  icon: {
    width: 30,
    height: 30
  }
}

export { LoginInput }
