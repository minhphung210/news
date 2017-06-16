import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Image,
    AsyncStorage,
    ScrollView
} from 'react-native'
import RenderItem from '../common/RenderItem.js'
const { height, width } = Dimensions.get('window')
const Item = [
    {
        name: 'Thể thao',
        link: 'http://vnexpress.net/rss/the-thao.rss',
        source: "vnexpress.net",
        color: 'rgb(117, 198, 67)'
    },
    {
        name: 'Thế giới',
        link: 'http://vnexpress.net/rss/the-gioi.rss',
        source: "vnexpress.net",
        color: 'rgb(102, 142, 209)'
    },
    {
        name: 'Thời sự',
        link: 'http://vnexpress.net/rss/thoi-su.rss',
        source: "vnexpress.net",
        color: 'rgb(221, 85, 85)'
    },
    {
        name: 'Kinh doanh',
        link: 'http://vnexpress.net/rss/kinh-doanh.rss',
        source: "vnexpress.net",
        color: 'rgb(245, 228, 113)'
    },
    {
        name: 'Pháp luật',
        link: 'http://vnexpress.net/rss/phap-luat.rss',
        source: "vnexpress.net",
        color: 'rgb(134, 134, 134)'
    },
    {
        name: 'Xe',
        link: 'http://vnexpress.net/rss/oto-xe-may.rss',
        source: "vnexpress.net",
        color: 'rgb(2, 5, 17)'
    },
    {
        name: 'Khoa học',
        link: 'http://vnexpress.net/rss/khoa-hoc.rss',
        source: "vnexpress.net",
        color: 'rgb(187, 67, 198)'
    },
    {
        name: 'Du lịch',
        link: 'http://vnexpress.net/rss/du-lich.rss',
        source: "vnexpress.net",
        color: 'rgb(213, 181, 110)'
    },
    {
        name: 'Thời sự',
        link: 'http://tinmoi24.vn/thoi-su/1',
        source: "tinmoi24.vn",
        color: 'rgb(221, 85, 85)'
    },
    {
        name: 'giải trí',
        link: 'http://tinmoi24.vn/giai-tri/2',
        source: "tinmoi24.vn",
        color: 'rgb(105, 151, 200)'
    },
    {
        name: 'thể thao',
        link: 'http://tinmoi24.vn/the-thao/3',
        source: "tinmoi24.vn",
        color: 'rgb(105, 151, 200)'
    },
    {
        name: 'Kinh doanh',
        link: 'http://tinmoi24.vn/kinh-te/4',
        source: "tinmoi24.vn",
        color: 'rgb(245, 228, 113)'
    },
    {
        name: 'Pháp luật',
        link: 'http://tinmoi24.vn/phap-luat/5',
        source: "tinmoi24.vn",
        color: 'rgb(134, 134, 134)'
    },
    {
        name: 'Xe',
        link: 'http://tinmoi24.vn/xe/15',
        source: "tinmoi24.vn",
        color: 'rgb(2, 5, 17)'
    },
    {
        name: 'Khoa học',
        link: 'http://tinmoi24.vn/cong-nghe/6',
        source: "tinmoi24.vn",
        color: 'rgb(187, 67, 198)'
    },
    {
        name: 'Sức khoẻ',
        link: 'http://tinmoi24.vn/suc-khoe/10',
        source: "tinmoi24.vn",
        color: 'rgb(77, 205, 174)'
    },
]
import { connect } from 'react-redux';
import { addCate, replaceListCate, reload } from '../actions';

class Category extends Component {
    constructor() {
        super();
        state = {
            listCate: []
        }
    }
    componentWillMount() {
        this._get('listCate')
    }
    _get = async (key) => {
        try {
            var value = await AsyncStorage.getItem(key);
            if (value !== null) {
                switch (key) {
                    case 'listCate':
                        this.props.dispatch(replaceListCate(JSON.parse(value)))
                        break;
                }
            }
        } catch (error) { alert(error) }
    };
    _set = async (key, value) => {
        try { await AsyncStorage.setItem(key, value); }
        catch (error) { console.log(error.message) }
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
        setTimeout(() => { this.props.dispatch(reload(true)) }, 100)
    }
    render() {
        return (
            <View style={[styles.container,{backgroundColor: this.props.postBackground}]}>
                <View style={styles.topSmaillContainer}>
                    <Text style={[styles.titleText,{color: this.props.textColor}]}>TeaNews</Text>
                    <View>
                        <Text style={{color: this.props.textColor}}>Chọn nội dung bạn quan tâm </Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.smallContainer} horizontal={true}>
                    {this.renderItem()}
                </ScrollView>
                <View style={[styles.topSmaillContainer,{ backgroundColor: this.props.postBackground }]}>
                    <TouchableOpacity
                        onPress={() => this.saveCate()} style={styles.loginButton}>
                        <Text style={{color: this.props.textColor}}>Lưu</Text>
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
    },
    smallContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    topSmaillContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        listCate: state.listCateReducer.list,
        postBackground: state.readerModalReducer.postBackground,
        textColor: state.readerModalReducer.textColor
    }
}
export default connect(mapStateToProps)(Category);
