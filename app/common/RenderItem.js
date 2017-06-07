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
var Toast = require('react-native-toast');
import { connect } from 'react-redux';
import { addCate, replaceListCate } from '../actions';
const {height, width} = Dimensions.get('window')
class RenderItem extends Component {
    constructor(props) {
      super(props);
      this.state={
        selected: false,
        loading: false
      }
    }
    componentWillMount() {
      let list = this.props.listCate;
      for(var i=0; i<list.length; i++) {
        if (list[i].name == this.props.item.name) {
          this.setState({ selected: true })
          break;
        }
      }
    }

    saveCateToAsync() {
      if (!this.state.loading) {
        this.setState({ loading: true })
          let list = this.props.listCate;
          if(this.state.selected == true) {
              //delete from Async
              for (var i = list.length - 1; i>=0; i--) {
                if (list[i].name == this.props.item.name) {
                  list.splice(i,1);
                  Toast.show('Đã loại khỏi danh sách')
                }
              }
              this.props.dispatch(replaceListCate(list))
              this.setState({ selected: false, loading: false })
          } else {
            var cateInfo = {
              name: this.props.item.name,
              link: this.props.item.link
            }
            console.log(cateInfo)
            list.push(cateInfo)
            this.props.dispatch(replaceListCate(list))
            this.setState({ selected: true, loading: false })
            Toast.show('Đã lưu vào danh mục yêu thích')
          }
    }
  }
    render() {
        return (
                <TouchableOpacity onPress={()=>this.saveCateToAsync()} >
                    <View style={[styles.item, { opacity: this.state.selected ? 0.2 : 1 }]}  >
                        <Text>{this.props.item.name}</Text>
                    </View>
                </TouchableOpacity>

        )
    }
}
const styles = StyleSheet.create({
    item: {
        height: 30,
        width: width/5+10,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
})
const mapStateToProps = state => {
  console.log(state.listCateReducer.list)
  return {
    listCate: state.listCateReducer.list,
  }
}
export default connect(mapStateToProps)(RenderItem);
