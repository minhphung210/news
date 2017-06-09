import React, { Component } from 'react';
import {
  View, Text, Dimensions, Platform, TouchableOpacity, Image,
  TouchableHighlight,
  TextInput,
  WebView,
  Share,
  Linking,
  Clipboard,
  ScrollView,
  AsyncStorage,
  Alert
} from 'react-native';
var { height, width } = Dimensions.get('window');
import _ from 'lodash';
import { RunsItem, Button1 } from '../common';
const cheerio = require('cheerio-without-node-native');
import * as Animatable from 'react-native-animatable';
var Toast = require('react-native-toast');

import RNHTMLtoPDF from 'react-native-html-to-pdf';

import { connect } from 'react-redux';
import { changeFontSize, changeModalState } from '../actions';
var WEBVIEW_REF = 'webview';

class NewsItem extends Component {
  state = {
    html: '',
    openMenu: false,
    bookMark: [],
    bodyHTML: '',
    headHTML: '',
    isSaved: false,
    textSelected: '',
    loading: false,
    videoUrl: null,
    list:[],
  };
  componentWillMount() {
    if(this.props.row){
      this.setState({thisUrl: this.props.row.url},()=>{this.fetchContent(this.props.row)})
    }
  }
  componentDidMount() {
    let list = this.state.list
    AsyncStorage.getItem(`listOffline`, (err, result) => {
      if (result !== null) {
        list = JSON.parse(result)
        this.setState({
          list: list
        })
        console.log(list)
      }
    })
  }
  componentWillReceiveProps(props) {
    if((props.row != this.props.row)&&(props.row)) {
      this.setState({ thisUrl: props.row.url},()=>{this.fetchContent(this.props.row)})
    }
  }
  createPDF() {
      let date = new Date()
      let fileName = date.getTime()
      let time = date.toString()
      let list = this.state.list
      var options = {
        html: this.state.html, // HTML String

        // **************** OPTIONS BELOW WILL NOT WORK ON ANDROID ************
        fileName: fileName.toString(),
        directory: 'docs',
        base64: true,
        height: 2200,
        width: width,
        padding: 24,
      };

      RNHTMLtoPDF.convert(options).then((data) => {
        console.log(data.filePath)
        list.push({
          path: data.filePath,
          time: time,
          title: this.props.row.title,
        })
        this.setState({
          list: list
        })

        AsyncStorage.setItem(`listOffline`, JSON.stringify(this.state.list))
      });
    }
  _share() {
    Share.share({
      message: this.props.row.title,
      url: this.props.row.url,
      title: 'From News App'
    }, {
        dialogTitle: 'From News App',
        // excludedActivityTypes: [
        //   'com.apple.UIKit.activity.PostToTwitter'
        // ],
        tintColor: 'green'
      })
      .then(this._showResult)
      .catch((error) => this.setState({ result: 'error: ' + error.message }));
  }
  _showResult(result) {
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        this.setState({ result: 'shared with an activityType: ' + result.activityType });
      } else {
        this.setState({ result: 'shared' });
      }
      alert(this.state.result)
    } else if (result.action === Share.dismissedAction) {
      this.setState({ result: 'dismissed' });
      alert(this.state.result)
    }
  }
  _openLink() {
    Linking.canOpenURL(this.props.row.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.row.url);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.row.url);
      }
    });
  }
  fetchContent(row) {
    this.setState({ loading: true })
    let url = row.url
    let other = []
    fetch(row.url)
      .then((response) => response.text())
      .then((responseData) => {
        $ = cheerio.load(responseData)
        this.setState({ bodyHTML: $('body').html() }, () => {
          this.setState({ headHTML: $('head').html() },()=>{
            this.updateWebview(row)
          })
        })
        // $('#box_tinkhac_detail> div>ul> li').each(function () {
        //   other.push({
        //     url: $(this).find('h2').find('a').attr('href'),
        //     title: $(this).find('h2').find('a').text(),
        //     thumb: $(this).find('div').find('a').find('img').attr('src')
        //
        //   })
        // })
      })
  }

  updateWebview(row) {
    this.setState({
      html:
          `<html>
          ${this.state.headHTML}
          ${this.state.bodyHTML + this.returnHtml()}
          </html>
        `},()=>this.setState({loading:false}))
  }
  returnHtml = () => {
    let htmlPlus = `
    <style>
      .cover{
        width: ${width}px;
        max-height: 400px
      }
      .title{
        padding-left: 20px
      }
      a{
        text-decoration: none;
        color: black
      }
      img{
        max-width:${width}px;
      }
      * {
        -webkit-touch-callout: none !important;
      }
      h3, p, .block_timer_share{
        margin-left: ${this.props.paddingLeft}px;
        line-height: 1.3em;
        margin-right: 10px;
        font-size: ${this.props.fontSize}
      }
      .minutes {
        width: 0!important
      }
      ul {
        padding: 0;
      }
      #container_tab_live ul li {
        list-style: none;
        width: 100%!important;
        margin-left: 0!important;
      }
      #container_tab_live div.text_live {
        float: right!important;
        width: 100%;
        display: block;
      }
      li{
        list-style-type:none;
      }
      script,a,#wrapper_footer,#box_tinkhac_detail,.box_tintaitro,
       .main_show_comment.width_common,.title_show.txt_666,#box_xemnhieunhat,#col_300{
        display: none
      }
      h1{
        margin-left: 10px;
      }
      html, body{
        width: ${width}px;
        overflow-x:hidden;
        font-family: 'Nunito', sans-serif;
        margin-left: 0px;
        margin-right: 5px;
        margin-top: 0px;
        padding-top: 0px;
        background-color: ${this.props.postBackground}
      }
    </style>
    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
    <script>
    $(document).ready(function() {
      var messageHeight = {key:"heightContent",value:$(document).height()};
      window.postMessageNative(JSON.stringify(messageHeight));
    });

    $(".block_filter_live,.detail_top_live.width_common,.block_breakumb_left,#menu-box,.bi-related,head,#result_other_news,#social_like,noscript,#myvne_taskbar,.block_more_info,#wrapper_header,#header_web,#wrapper_footer,.breakumb_timer.width_common,.banner_980x60,.right,#box_comment,.nativeade,#box_tinkhac_detail,#box_tinlienquan,.block_tag.width_common.space_bottom_20,#ads_endpage,.block_timer_share,.div-fbook.width_common.title_div_fbook,.xemthem_new_ver.width_common,.relative_new,#topbar,#topbar-scroll,.text_xemthem,#box_col_left,.form-control.change_gmt,.tt_2,.back_tt,.box_tinkhac.width_common,#sticky_info_st,.col_fillter.box_sticky_left,.start.have_cap2,.cap2,.list_news_dot_3x3,.minutes,.div-fbook.width_common.title_div_fbook,#live-updates-wrapper,.block_share.right,.block_goithutoasoan,.xemthem_new_ver.width_common,meta,link,.menu_main,.top_3,.number_bgs,.filter_right,#headmass,.box_category.width_common,.banner_468.width_common,.adsbyeclick,.block_col_160.right,#ArticleBanner2,#ad_wrapper_protection").remove();
    var link = document.querySelectorAll("a");
      for(var i = 0; i < link.length; i++){
        link[i].setAttribute("href", "javascript:void(0)");
    };
    function getSelectionText() {
        var text = "";
        var activeEl = document.activeElement;
        var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
        if (
          (activeElTagName == "textarea") || (activeElTagName == "input" &&
          /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
          (typeof activeEl.selectionStart == "number")
        ) {
            text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
        } else if (window.getSelection) {
            text = window.getSelection().toString();
        }
        return text;
    };
    document.onmouseup = document.onkeyup = document.onselectionchange = function() {
      var text = getSelectionText();
      var messageText = {key:"textSelected",value:text};
      window.postMessageNative(JSON.stringify(messageText));
    };

    // $(document).scroll(function() {
    //   scrollPos = $(document).scrollTop();
    //   var messageScroll = {key:"messageScroll",value:scrollPos};
    //   window.postMessageNative(JSON.stringify(messageScroll));
    // });
    // var scrollPos;
    // setInterval(function(){
    //   scrollPos = $(document).scrollTop();
    //   var messageScroll = {key:"messageScroll",value:scrollPos};
    //   window.postMessageNative(JSON.stringify(messageScroll));
    // }, 20);
    </script>
    `;
    return htmlPlus
  }
  reloadWebview = () => {
    this.refs[WEBVIEW_REF].reload();
  };
  handleMessageFromWebview(event) {
    let message = JSON.parse(event.nativeEvent.data);
    if(message.key == 'heightContent') {
      this.setState({ heightContent: message.value})
    } else {
      if(message.key == 'messageScroll') {
        this.setState({ scrollTop: message.value },()=>console.log(this.state.scrollTop))
      }else{
        this.setState({ textSelected: message.value })
      }
    }
  }
  loading() {
    if (!this.state.loading) {
      return (
          <WebView
            ref={WEBVIEW_REF}
            style={{ width: width, height: height-50, backgroundColor: 'grey' }}
            javaScriptEnabled={true}
            injectedJavaScript=''
            onMessage={(event) => this.handleMessageFromWebview(event)}
            source={{ html: this.state.html }} />
      )
    } else {
      return (
        <Text style={{ textAlign: 'center', alignSelf: 'center' }}>Loading...
        </Text>
      )
    }
  }

  render() {
    return (
      <View style={{ alignItems: 'center', flex: 1 }}>
        <Image
        style={{ height: 300, width: width}}
        source={{ uri: this.props.row.thumb }}/>
        {this.loading()}
        {this.props.openMenu &&
          <Animatable.View animation="slideInDown" duration={300} style={styles.menuModal}>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => {
                this.props.dispatch(changeFontSize(this.props.fontSize + 2));
                setTimeout(() => {
                  this.updateWebview(this.props.row)
                  this.props.dispatch(changeModalState(!this.props.openMenu))
                }, 100)
                if (Platform.OS === 'android') {
                  setTimeout(() => this.reloadWebview(), 200)
                }
              }}
              style={styles.modalItem}>
              <View>
                <Text style={styles.modalText}>A+</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => {
                this.props.dispatch(changeFontSize(this.props.fontSize - 2));
                setTimeout(() => {
                  this.updateWebview(this.props.row)
                  this.props.dispatch(changeModalState(!this.props.openMenu))
                }, 100)
                if (Platform.OS === 'android') {
                  setTimeout(() => this.reloadWebview(), 200)
                }
              }}
              style={styles.modalItem}>
              <View>
                <Text style={styles.modalText}>A-</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => {
                this._share();
                this.props.dispatch(changeModalState(!this.props.openMenu))
              }}
              style={styles.modalItem}>
              <View>
                <Text style={styles.modalText}>Share
                      </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => this._openLink()}
              style={styles.modalItem}>
              <View>
                <Text style={styles.modalText}>Mở trình duyệt
                      </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => { this._saveBookmark(); this.props.dispatch(changeModalState(!this.props.openMenu)) }}
              style={styles.modalItem}>
              <View>
                <Text style={styles.modalText}>Lưu
                      </Text>
              </View>
            </TouchableHighlight>
            <TouchableOpacity
              underlayColor="white"
              onPress={() => this.createPDF()}
              style={styles.modalItem}>
              <View>
                <Text style={styles.modalText}>Lưu offline
                      </Text>
              </View>
            </TouchableOpacity>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => {
                Clipboard.setString(this.props.row.url);
                Toast.show('Đã sao chép link');
                this.props.dispatch(changeModalState(!this.props.openMenu))
              }}
              style={styles.modalItem}>
              <View>
                <Text style={styles.modalText}>Sao chép
                      </Text>
              </View>
            </TouchableHighlight>
          </Animatable.View>
        }
        {(this.state.textSelected != '') &&
          <Animatable.View animation="slideInUp" duration={300} style={styles.shareModal}>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => {
                Share.share({
                  message: this.state.textSelected,
                  url: this.props.row.url,
                  title: 'From News App'
                }, {
                    dialogTitle: 'From News App',
                    // excludedActivityTypes: [
                    //   'com.apple.UIKit.activity.PostToTwitter'
                    // ],
                    tintColor: 'green'
                  })
                  .then(this._showResult)
                  .catch((error) => this.setState({ result: 'error: ' + error.message }));
              }}
              style={styles.modalItem}>
              <View>
                <Text style={styles.modalText}>Share link kèm trích dẫn
                      </Text>
              </View>
            </TouchableHighlight>
          </Animatable.View>
        }
      </View >

    )
  }
}

const styles = {
  container: {

  },
  cover: {
    justifyContent: 'center',
    height: 200,
    width: width
  },
  content: {
    justifyContent: 'flex-start',
    padding: 10,
    width: width
  },
  title: {
    fontWeight: '500',
    fontSize: 15,
    marginRight: 10
  },
  date: {
    fontSize: 13,
    color: 'grey'
  },
  info1: {
    flexDirection: 'row'
  },
  shareModal: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        zIndex: 3,
      },
      android: {
        borderColor: 'rgb(217, 217, 217)',
        borderLeftWidth: 0.5,
        zIndex: 4
      }
    }),
    bottom: 0,
    elevation: 5,
    shadowOpacity: 0.3,
    width: '100%'
  },
  modalItem: {
    height: 35,
    width: '100%',
    backgroundColor: 'white',
    borderColor: 'rgb(217, 217, 217)',
    borderBottomWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuModal: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        zIndex: 3,
      },
      android: {
        borderColor: 'rgb(217, 217, 217)',
        borderLeftWidth: 0.5,
      }
    }),
    top: 5,
    right: 0,
    width: 100,
    elevation: 5,
    shadowOpacity: 0.3
  },
}
const mapStateToProps = state => {
  return {
    openMenu: state.readerModalReducer.modalState,
    fontSize: state.readerModalReducer.fontSize,
    postBackground: state.readerModalReducer.postBackground,
    paddingLeft: state.readerModalReducer.paddingLeft
  }
}
export default connect(mapStateToProps)(NewsItem);
