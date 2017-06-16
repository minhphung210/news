import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  RefreshControl,
  FlatList,
  ListView,
  Platform,
  TouchableHighlight
} from 'react-native';
import Child from '../child';
var {height, width} = Dimensions.get('window');
import * as Animatable from 'react-native-animatable';
import { Button1 } from '../common';
import NewsItem from '../common/NewsItem';
const cheerio = require('cheerio-without-node-native');

import { connect } from 'react-redux';
import { changeModalState } from '../actions';
import ViewPager from 'react-native-viewpager';

class News extends Child {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: [],
      refreshing: false,
      isLoadMore: false,
      dataSource: new ViewPager.DataSource({
        pageHasChanged: (p1, p2) => p1 !== p2,
      })
    }
  };
  componentDidMount() {
    this.fetchData()
  }
  fetchData() {
        let data = this.state.data
        fetch(`http://vnexpress.net/rss/the-thao.rss`)
            .then((response) => response.text())
            .then((responseData) => {
                $ = cheerio.load(responseData, {
                    xmlMode: true,
                    decodeEntities: true
                })
                $('channel>item').each(function(){
                CDATA =$(this).find('description').text()
                let vitribatdau = CDATA.search('src=')
                let vitriketthuc = CDATA.search(' ></a>')
                let vitribatdauDes = CDATA.search('</br>')
                let vitriketthucDes = CDATA.search(']]>')
                    data.push({
                        title:$(this).find('title').text(),
                        thumb : CDATA.slice(vitribatdau +5 , vitriketthuc-1).replace("_180x108",""),
                        des: CDATA.slice(vitribatdauDes+5 , vitriketthucDes),
                        url:$(this).find('link').text(),
                        date: $(this).find('pubDate').text()
                    })
                })
                this.setState({
                  data:data,
                  refreshing:false,
                  dataSource: this.state.dataSource.cloneWithPages(data),
                })
            })
    }
  loadMore() {
    this.setState({
      page: this.state.page + 1,
      isLoadMore: true,
    }, () => this.fetchData())
  }
  onScroll(e) {
    var windowHeight = Dimensions.get('window').height;
    var height = e.nativeEvent.contentSize.height;
    var offset = e.nativeEvent.contentOffset.y;

    if (windowHeight + offset > height + 30) {
      if (!this.state.isLoadMore) {
        this.loadMore();
      }
    }
  }
  onRefresh() {
    this.setState({
      refreshing: true
    }, () => this.fetchData())
  }

  _renderPage = (item) => {
    return (
      <NewsItem
      title = {item.title}
      thumb = {item.thumb}
      url = {item.url}
      description = {item.description}/>
    )
  }

  render() {
    if (this.state.data != 0) {
      return (
        <View style={{flex:1}}>
        <View style={styles.navBar}>
            <TouchableHighlight
            onPress={()=>this.context.appState({ scene: 'home' })}
            style={styles.navBarButton}>
              <Text style={styles.navBarButtonText}>Back
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
            onPress={()=>this.props.dispatch(changeModalState(!this.props.openMenu))}
            style={styles.navBarButton}>
              <Text style={styles.navBarButtonText}>Menu
              </Text>
            </TouchableHighlight>
        </View>

        <ViewPager
        style={{flex:1}}
        dataSource={this.state.dataSource}
        renderPage={this._renderPage}
        />

        </View>
      );
    } else {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text>Loading...
          </Text>
        </View>
      )
    }
  }
}
// <ListView
//   showsVerticalScrollIndicator={false}
//   pagingEnabled={true}
//   horizontal={true}
//   initialListSize={1}
//   dataSource={this.state.dataSource}
//   enableEmptySections={true}
//   renderRow={this._renderItem.bind(this)}
// />
const styles = StyleSheet.create({
  searchBoxContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: 'rgba(199, 199, 199, 0.84)',
    flexDirection: 'row',
    width: '100%'
  },
  searchBox: {
    width: '80%',
    paddingLeft: 10
  },
  navBar: {
    position: 'absolute',
    top: 0,
    zIndex: 4,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    width: width,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'grey'
  },
  navBarButton: {
    backgroundColor: 'transparent',
    width: 80,
    height: 40,
    justifyContent: 'flex-end',
    paddingBottom: 10
  },
  navBarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});
const mapStateToProps = state => {
   return {
     openMenu: state.readerModalReducer.modalState,
   }
}
export default connect(mapStateToProps)(News);
