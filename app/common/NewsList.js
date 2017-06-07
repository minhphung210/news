import React, { Component } from 'react';
import { View, Text, Dimensions, Platform, TouchableOpacity, Image} from 'react-native';
var {height, width} = Dimensions.get('window');
import NewsListItem from './NewsListItem';
import { loadListData, selectedPost0, selectedPost1, selectedPost2 } from '../actions';
import { connect } from 'react-redux';

class NewsList extends Component {
  toDetail(postId) {
    this.props.dispatch(selectedPost0(postId))
    this.props.dispatch(selectedPost1(postId+1))
    this.props.dispatch(selectedPost2(postId-1))
    setTimeout(()=>{this.props.navigation.navigate('Detail_Screen')},300)
  }
  render() {
    if (this.props.data) {
      return (
        <View style={[{ flex:1, height: height-50 },this.props.style]}>
            {this.props.data.map((row,index)=>{
              return(
                <NewsListItem
                  key={index}
                  title={row.title}
                  thumb={row.thumb}
                  description={row.des}
                  onPress={()=>this.toDetail(this.props.dataIndex+index)}
                />
              )
            })}
        </View>
      )
    } else { return <View></View> }
  }
}
// this.props.dataIndex+index
const mapStateToProps = state => {
   return {
   }
}
export default connect(mapStateToProps)(NewsList);
