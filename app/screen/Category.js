import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Image,
    AsyncStorage
} from 'react-native'
import RenderItem from '../common/RenderItem.js'
const { height, width } = Dimensions.get('window')
const Item = [
    { name: 'Thể thao', link: 'http://vnexpress.net/rss/the-thao.rss' },
    { name: 'Thế giới', link: 'http://vnexpress.net/rss/the-gioi.rss' },
    { name: 'Thời sự', link: 'http://vnexpress.net/rss/thoi-su.rss' },
    { name: 'Sức khoẻ', link: 'http://vnexpress.net/rss/suc-khoe.rss' },
    { name: 'Kinh doanh', link: 'http://vnexpress.net/rss/kinh-doanh.rss' },
    { name: 'Pháp luật', link: 'http://vnexpress.net/rss/phap-luat.rss' },
    { name: 'Xe', link: 'http://vnexpress.net/rss/oto-xe-may.rss' },
    { name: 'Khoa học', link: 'http://vnexpress.net/rss/khoa-hoc.rss' },
    { name: 'Du lịch', link: 'http://vnexpress.net/rss/du-lich.rss' },
]
import { connect } from 'react-redux';
import { addCate, replaceListCate, reload } from '../actions';

class Category extends Component {
    constructor() {
      super();
      state={
        listCate: []
      }
    }
    componentWillMount() {
      this._get('listCate')
    }
    _get = async (key) => {
      try {var value = await AsyncStorage.getItem(key);
        if (value !== null){
          switch (key) {
            case 'listCate':
              this.props.dispatch(replaceListCate(JSON.parse(value)))
              break;
          }}}catch (error) {alert(error)}
    };
    _set = async (key, value) => {
      try {await AsyncStorage.setItem(key, value);}
      catch (error) {console.log(error.message)}
    };
    renderItem() {
    // alert(JSON.stringify(this.state.listCate))
        return Item.map(function (item, index) {
            return (
                <RenderItem
                listCate={this.state.listCate}
                key={index}
                item={item}
                />
            )
        })
    }
    saveCate() {
      console.log(this.props.listCate)
      this._set('listCate', JSON.stringify(this.props.listCate));
      this.props.navigation.goBack();
      setTimeout(()=>{this.props.dispatch(reload(true))},100)
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.smallContainer}>
                    <Text style={styles.titleText}>TeaNews</Text>
                    <View style={styles.category}>
                        <Text>Chọn nội dung bạn quan tâm </Text>
                    </View>
                </View>
                <View style={styles.smallContainer}>
                    {this.renderItem()}
                </View>
                <View style={styles.smallContainer}>
                    <TouchableOpacity
                    onPress={()=>this.saveCate()} style={[styles.loginButton, { backgroundColor: 'white' }]}>
                        <Text>Lưu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
// <View style={styles.smallContainer}>
//     <View style={[styles.loginButton, { backgroundColor: 'white' }]}>
//         <Text>Login with Google+</Text>
//     </View>
//     <View style={[styles.loginButton, { backgroundColor: 'white' }]}>
//         <Text>Login with Facebook</Text>
//     </View>
// </View>
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    smallContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    titleText: {
        textAlign: 'auto',
        fontFamily: 'Cochin',
        fontSize: 25,
        margin: 25
    },
    category: {
        height: 30,
        width: (width - 100),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10
    },
    item: {
        height: 30,
        width: width/8,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 13,
    },
    loginButton: {
        width: width - 100,
        height: 30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        margin: 5
    },

})
const mapStateToProps = state => {
  return {
    listCate: state.listCateReducer.list
  }
}
export default connect(mapStateToProps)(Category);
