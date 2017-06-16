import React, { Component } from 'react';
import Root from './root';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import Home from './screen/Home';
import News from './screen/News';
import NewsDetail from './screen/NewsDetail';
import Category from './screen/Category';
import ReadOffline from './screen/ReadOffline';
import { StackNavigator } from 'react-navigation';
import ListNewsOffline from './screen/ListNewsOffline';
import * as Animatable from 'react-native-animatable';
const {width, height} = Dimensions.get("window");
// import * as firebase from 'firebase';
// const firebaseConfig = {
//   apiKey: "AIzaSyCrbUWDKlBCJCOTlF_D17y4zB7BZFHi-6A",
//   authDomain: "apptele-78fed.firebaseapp.com",
//   databaseURL: "https://apptele-78fed.firebaseio.com",
//   projectId: "apptele-78fed",
//   storageBucket: "apptele-78fed.appspot.com",
//   messagingSenderId: "68342702073"
//   };
// const firebaseApp = firebase.initializeApp(firebaseConfig);

export const TeaNews = StackNavigator({
  Home_Screen: {
    screen: Home,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  Detail_Screen: {
    screen: NewsDetail,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  Category_Screen: {
    screen: Category,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  ReadOffline_Screen:{
    screen : ReadOffline
  },
  ListNewsOffline_Screen:{
    screen : ListNewsOffline
  }
})
// export default class TeaNews extends Root {
//     state = {
//         scene: 'home',
//         webView: {
//           postBackground: 'white',
//           paddingLeft: 15,
//           fontSize: 15,
//         },
//         textSelected: '',
//         openMenuReader: true
//     }
//     render() {
//         let Page;
//         const PageProps = {
//             style: {flex:1, backgroundColor: 'white'}
//         };
//         switch(this.state.scene) {
//             case 'home': Page = <Home {...PageProps} />; break;
//             case 'news': Page = <News {...PageProps} />; break;
//             case 'detail': Page = <NewsDetail {...PageProps} />; break;
//             default: Page = <Home {...PageProps} />;
//         }
//         return ( this.state.welcomeScreen === true ? <Welcome /> :
//         <View style={styles.container}>
//               {Page}
//         </View>
//         );
//     }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
});
// module.exports.firebaseApp = firebaseApp;
