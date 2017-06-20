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
  Alert,
  Switch,
  Animated,
  Easing,
  StyleSheet
} from 'react-native';
var { height, width } = Dimensions.get('window');
import _ from 'lodash';
import { RunsItem, Button1 } from '../common';
const cheerio = require('cheerio-without-node-native');
import * as Animatable from 'react-native-animatable';
var Toast = require('react-native-toast');

// import RNHTMLtoPDF from 'react-native-html-to-pdf';

import { connect } from 'react-redux';
import { changeFontSize, changeModalState, changeBackgroundColor, changeTextColor, changeNightMode } from '../actions';
var WEBVIEW_REF = 'webview';

import HTMLView from 'react-native-htmlview';
import Video from 'react-native-video';

class NewsItem extends Component {
  constructor(props) {
    super(props)
    this.spinValue = new Animated.Value(0)
  }
  state = {
    html: '',
    openMenu: false,
    bookMark: [],
    bodyHTML: '',
    headHTML: '',
    isSaved: false,
    textSelected: '',
    loading: true,
    videoUrl: null,
    list: [],
    switcher: false
  };
  componentWillMount() {
    if (this.props.row) {
      this.fetchContent(this.props.row)
    }
  }
  componentWillReceiveProps(props) {
    if ((props.row != this.props.row) && (props.row)) {
      this.setState({ loading: true }, () => { this.fetchContent(this.props.row) })
    } else if (props.textColor) {
      this.updateWebview(props.row)
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
    this.spinLoading()
  }
  spinLoading() {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 2500,
        easing: Easing.ease,
      }
    ).start(() => this.spinLoading())
  }
  // createPDF() {
  //     let date = new Date()
  //     let fileName = date.getTime()
  //     let time = date.toString()
  //     let list = this.state.list
  //     var options = {
  //       html: this.state.html, // HTML String
  //       // **************** OPTIONS BELOW WILL NOT WORK ON ANDROID ************
  //       fileName: fileName.toString(),
  //       directory: 'docs',
  //       height: height-60,
  //       width: width-20,
  //       padding: 1
  //     };
  //
  //     RNHTMLtoPDF.convert(options).then((data) => {
  //       console.log(data.filePath)
  //       list.push({
  //         path: data.filePath,
  //         time: time,
  //         title: this.props.row.title,
  //       })
  //       this.setState({
  //         list: list
  //       })
  //       console.log(list)
  //       AsyncStorage.setItem(`listOffline`, JSON.stringify(this.state.list))
  //     });
  //   }
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
    this.setState({ loading: true });
    setTimeout(() => this.setState({ loading: false }), 5000);
    let url = row.url
    let other = []
    fetch(url)
      .then((response) => response.text())
      .then((responseData) => {
        $ = cheerio.load(responseData);
        $("[data-component-type=video]").replaceWith("<strong>Bài viết chứa video, vui lòng mở link bằng trình duyệt để xem video</strong>");
       $(".image,iframe,.block_filter_live,.detail_top_live.width_common,.block_breakumb_left,#menu-box,.bi-related,head,#result_other_news,#social_like,noscript,#myvne_taskbar,.block_more_info,#wrapper_header,#header_web,#wrapper_footer,.breakumb_timer.width_common,.banner_980x60,.right,#box_comment,.nativeade,#box_tinkhac_detail,#box_tinlienquan,.block_tag.width_common.space_bottom_20,#ads_endpage,.block_timer_share,.title_news,.div-fbook.width_common.title_div_fbook,.xemthem_new_ver.width_common,.relative_new,#topbar,#topbar-scroll,.text_xemthem,#box_col_left,.form-control.change_gmt,.tt_2,.back_tt,.box_tinkhac.width_common,#sticky_info_st,.col_fillter.box_sticky_left,.start.have_cap2,.cap2,.list_news_dot_3x3,.minutes,#live-updates-wrapper,.block_share.right,.block_goithutoasoan,.xemthem_new_ver.width_common,meta,link,.menu_main,.top_3,.number_bgs,.filter_right,#headmass,.box_category.width_common,.banner_468.width_common,.adsbyeclick,.block_col_160.right,#ArticleBanner2,#ad_wrapper_protection,#WIDGET").remove();
        if (url.includes("http://tinmoi24.vn/") == false) {
          this.setState({ bodyHTML: $('.main_content_detail.width_common').html() }, () => {
            this.updateWebview(row)
          })
        }
        else {
          this.setState({ bodyHTML: $('.newbody').html() }, () => {
            this.updateWebview(row)
          })
        }
      })
  }
  // injectedJavaScript='
  // if(!quackKhanh){
  //   var quackKhanh = true;
  //   $("body").prepend("<img src=`http://img.f31.vnecdn.net/2017/06/06/ransanchuot-1496740480.jpg`/>");
  // }
  // $(".block_filter_live,.detail_top_live.width_common,.block_breakumb_left,#menu-box,.bi-related,head,#result_other_news,#social_like,noscript,#myvne_taskbar,.block_more_info,#wrapper_header,#header_web,#wrapper_footer,
  // .breakumb_timer.width_common,.banner_980x60,.right,#box_comment,.nativeade,#box_tinkhac_detail,
  // #box_tinlienquan,.block_tag.width_common.space_bottom_20,#ads_endpage,.block_timer_share,
  // .div-fbook.width_common.title_div_fbook,.xemthem_new_ver.width_common,.relative_new,#topbar,#topbar-scroll,
  // #headmass,.box_category.width_common,.banner_468.width_common,.adsbyeclick,.block_col_160.right,#ArticleBanner2,#ad_wrapper_protection").remove();
  // var link = document.querySelectorAll("a");
  // for(var i = 0; i < link.length; i++){
  //   link[i].setAttribute("href", "javascript:void(0)");
  // };
  //
  // function getSelectionText() {
  //     var text = "";
  //     var activeEl = document.activeElement;
  //     var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
  //     if (
  //       (activeElTagName == "textarea") || (activeElTagName == "input" &&
  //       /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
  //       (typeof activeEl.selectionStart == "number")
  //     ) {
  //         text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
  //     } else if (window.getSelection) {
  //         text = window.getSelection().toString();
  //     }
  //     return text;
  // }
  //
  // document.onmouseup = document.onkeyup = document.onselectionchange = function() {
  //   window.postMessageNative(getSelectionText());
  // };
  // '
  updateWebview(row) {
    // var link = row.url;
    // var location1 = link.lastIndexOf("/");
    // var location2 = link.lastIndexOf("-");
    // var CoverImg = link.substr(location1+1 , location2-location1-1);
    // this.setState({ coverImg: CoverImg},()=>{
    var source = "";
    if (row.url.includes("vnexpress")) {
      source = "Vnexpress.net";
    } else {
      source = "Tinmoi24.vn"
    }
    console.log(row.thumb)
    this.setState({
      html:
      `<html>
              <body>
              <div style="position: relative">
                <div style="position:absolute; background-color: black; width: 100%; height: 100%; opacity: 0.3">
                </div>
                <img class="cover" src='${row.thumb}' style="max-width: ${width}px;max-height: 400px"/>
                <div style="position:absolute; background-color: ${row.cateColor}; bottom: 30; left: 20; border-radius: 4px">
                  <p style="color:white; text-align:center; margin-left:10; padding-left:0; line-height:1em; font-size:14; margin: 5; border-radius: 4px">${row.cate}</p>
                </div>
                <div style="position:absolute; bottom: 10; left: 20; border-radius: 5">
                  <p style="color:white; text-align:center; margin-left:10; padding-left:0; line-height:1em; font-size:14; margin: 0; border-radius: 10">${source}</p>
                </div>
              </div>
              <h1 class="title">${row.title}</h1>
              ${this.state.bodyHTML + this.returnHtml()}

              </body>
            </html>
          `})
    // })
  }
  returnHtml = () => {
    let htmlPlus = `
    <style>
      .title{
        padding-left: 20px
      }
      a{
        text-decoration: none;
        color: black
      }
      img{
        max-width:${width-5}px;
      }
      * {
        -webkit-touch-callout: none !important;
      }
      h1 {
        margin-left: 20px;
        margin-right: 10px;
        font-size: ${this.props.fontSize + 3};
        color: ${this.props.textColor};
      }
      h3, h2, p, h1, td {
        margin-left: 20px;
        line-height: 1.3em;
        margin-right: 10px;
        font-size: ${this.props.fontSize};
        color: ${this.props.textColor};
      }
      span, em {
        font-size: ${this.props.fontSize};
        color: ${this.props.textColor};
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
      iframe {
        max-width:${width}px;
        max-height:${width / 16 * 9}px;
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
    $(document).ready(function(){
      setTimeout(function(){
        var messageHeight = {key:"heightContent",value:$(document).height()};
        // alert($(document).height().toString())
        window.postMessageNative(JSON.stringify(messageHeight));
      },200)
    });
    $('span').removeAttr('style');
    $('em').removeAttr('style');
    $("[data-component-type=video]").replaceWith("<h1>Bài viết chứa video, vui lòng mở link bằng trình duyệt để xem video</h1>");
   $("iframe,.block_filter_live,.detail_top_live.width_common,.block_breakumb_left,#menu-box,.bi-related,head,#result_other_news,#social_like,noscript,#myvne_taskbar,.block_more_info,#wrapper_header,#header_web,#wrapper_footer,.breakumb_timer.width_common,.banner_980x60,.right,#box_comment,.nativeade,#box_tinkhac_detail,#box_tinlienquan,.block_tag.width_common.space_bottom_20,#ads_endpage,.block_timer_share,.title_news,.div-fbook.width_common.title_div_fbook,.xemthem_new_ver.width_common,.relative_new,#topbar,#topbar-scroll,.text_xemthem,#box_col_left,.form-control.change_gmt,.tt_2,.back_tt,.box_tinkhac.width_common,#sticky_info_st,.col_fillter.box_sticky_left,.start.have_cap2,.cap2,.list_news_dot_3x3,.minutes,.div-fbook.width_common.title_div_fbook,#live-updates-wrapper,.block_share.right,.block_goithutoasoan,.xemthem_new_ver.width_common,meta,link,.menu_main,.top_3,.number_bgs,.filter_right,#headmass,.box_category.width_common,.banner_468.width_common,.adsbyeclick,.block_col_160.right,#ArticleBanner2,#ad_wrapper_protection,#WIDGET").remove();

    var link = document.querySelectorAll("a");
      for(var i = 0; i < link.length; i++){
        link[i].setAttribute("href", "javascript:void(0)");
    };
    $("header,.relative,.footer").remove();
    var text = $("p").last().text();
    if(text.includes(">>> Đọc thêm:")==true){
      $("p").last().remove();
    }
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
    </script>
    `;
    return htmlPlus
  }
  reloadWebview = () => {
    this.refs[WEBVIEW_REF].reload();
  };
  handleMessageFromWebview(event) {
    let message = JSON.parse(event.nativeEvent.data);
    switch (message.key) {
      case 'heightContent':
        this.setState({ heightContent: message.value }, () => this.setState({ loading: false }))
        break;
      case 'textSelected':
        this.setState({ textSelected: message.value })
        break;
    }
  }
  loading() {
    if (this.state.loading) {
      const spin = this.spinValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '360deg', '720deg']
      })
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 4, backgroundColor: this.props.postBackground, width: width, height: height }}>
          <Animated.Image
            source={require('../../img/load-icon.png')}
            style={{
              height: 40,
              width: 40,
              transform: [{ rotate: spin }]
            }}
          />
          <Text style={{ color: this.props.textColor }}>Loading...
          </Text>
        </View>
      )
    }
  }
  // {(true)&&
  // <WebView
  // style={{ width: width, height: 200 }}
  // source={{ url: this.state.videoUrl }}/>
  // }
  // <WebView
  // style={{ height: 0, width: 0 }}
  // injectedJavaScript='
  // var x = $(".parser_player_vnexpress").attr("src");
  // window.postMessageNative(x)
  // '
  // onMessage={(event) => {
  //   if((this.state.videoUrl == null)&&(event.nativeEvent.data != null)){
  //     this.setState({videoUrl: event.nativeEvent.data},()=>console.log('update url '+ this.state.videoUrl))
  //   }
  // }}
  // source={{ url: this.state.thisUrl }} />
  switcherPressed() {
    if (this.props.postBackground == 'white') {
      this.props.dispatch(changeTextColor('white'));
      this.props.dispatch(changeBackgroundColor('black'));
      this.props.dispatch(changeNightMode(true));
    } else {
      this.props.dispatch(changeTextColor('black'));
      this.props.dispatch(changeBackgroundColor('white'));
      this.props.dispatch(changeNightMode(false));
    }
    setTimeout(() => {
      this.updateWebview(this.props.row)
    }, 100)
    if (Platform.OS === 'android') {
      setTimeout(() => this.reloadWebview(), 200)
    }
  }

  render() {
    return (
        <ScrollView style={{ height: height }}>
        {this.props.openMenu &&
          <TouchableOpacity style={styles.modalContainer} onPress={() => this.props.dispatch(changeModalState(!this.props.openMenu))}>
            <Animatable.View animation="slideInDown" duration={300} style={[styles.menuModal,{backgroundColor: this.props.postBackground}]}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <TouchableHighlight
                  underlayColor="white"
                  onPress={() => {
                    if (this.props.fontSize < 30) {
                      this.props.dispatch(changeFontSize(this.props.fontSize + 2));
                      setTimeout(() => {
                        this.updateWebview(this.props.row)
                        this.props.dispatch(changeModalState(!this.props.openMenu))
                      }, 100)
                    } else {
                      Toast.show('Cỡ chữ đã tăng tối đa');
                    }
                    if (Platform.OS === 'android') {
                      setTimeout(() => this.reloadWebview(), 200)
                    }
                  }}
                  style={[styles.modalItem, { borderRightWidth: 1, borderTopLeftRadius: 10 }]}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: this.props.textColor }}>A</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="white"
                  onPress={() => {
                    if (this.props.fontSize > 7) {
                      this.props.dispatch(changeFontSize(this.props.fontSize - 2));
                      setTimeout(() => {
                        this.updateWebview(this.props.row)
                        this.props.dispatch(changeModalState(!this.props.openMenu))
                      }, 100)
                    } else {
                      Toast.show('Cỡ chữ đã thu nhỏ tối đa');
                    }
                    if (Platform.OS === 'android') {
                      setTimeout(() => this.reloadWebview(), 200)
                    }
                  }}
                  style={[styles.modalItem, { borderTopRightRadius: 10 }]}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: this.props.textColor }}>A</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <TouchableHighlight
                underlayColor="white"
                onPress={() => this.switcherPressed()}
                style={styles.modalItem}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 }}>
                  <Text style={[styles.modalText,{ color: this.props.textColor }]}>Chế độ đọc ban đêm
                        </Text>
                  <Switch
                    value={this.props.nightMode}
                    onValueChange={() => {
                      this.switcherPressed()
                    }} />
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="white"
                onPress={() => this._openLink()}
                style={styles.modalItem}>
                <View>
                  <Text style={[styles.modalText,{ color: this.props.textColor }]}>Mở trong trình duyệt
                        </Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="white"
                onPress={() => {
                  Clipboard.setString(this.props.row.url);
                  Toast.show('Đã sao chép link');
                  this.props.dispatch(changeModalState(!this.props.openMenu))
                }}
                style={[styles.modalItem, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderBottomWidth: 0 }]}
              >
                <View>
                  <Text style={[styles.modalText,{  color: this.props.textColor }]}>Sao chép link
                        </Text>
                </View>
              </TouchableHighlight>

            </Animatable.View>
          </TouchableOpacity>
        }

          <Image
          style={{width: width, height: width *9/16}}
          source={{uri: this.props.row.thumb }}/>
          <Text style={{marginLeft: 20, fontSize: 17, fontWeight: 'bold', marginTop: 10, marginBottom: 10}}>{this.props.row.title}
          </Text>
          <HTMLView
            value={this.state.bodyHTML}
            stylesheet={styles2}
          />
        </ScrollView>
    )
  }
}
// function renderNode(node, index, siblings, parent, defaultRenderer) {
//   if (node.name == 'figure') {
//     const a = node.attribs["data-video-src"];
//     console.log(a)
//     return (
//       <View key={index} style={{width: width, height: 300}}>
//         <Video source={{uri: a}}   // Can be a URL or a local file.
//          ref={(ref) => {
//            this.player = ref
//          }}                                      // Store reference
//          rate={1.0}                              // 0 is paused, 1 is normal.
//          muted={false}
//          paused={false}
//          resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
//          repeat={true}                           // Repeat forever.
//          playInBackground={false}                // Audio continues to play when app entering background.
//          playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
//          style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             bottom: 0,
//             right: 0,
//           }} />
//       </View>
//     );
//   }
// }
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
        borderLeftWidth: 1,
        zIndex: 4
      }
    }),
    bottom: 0,
    elevation: 5,
    shadowOpacity: 0.3,
    width: '100%'
  },
  modalItem: {
    borderColor: 'rgb(217, 217, 217)',
    borderBottomWidth: 1,
    justifyContent: 'center',
    flex: 1
  },
  modalText: {
    paddingLeft: 20
  },
  menuModal: {
    elevation: 5,
    top: 60,
    right: 20,
    marginLeft: width / 3,
    shadowOpacity: 0.3,
    borderRadius: 30,
    height: 200,
    borderColor: 'white',
    borderWidth: 1
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.39)',
    position: 'absolute',
    zIndex: 3,

  }
}
const styles2 = StyleSheet.create({
  h1: {
    marginLeft: 20,
    marginRight: 10,
    fontSize: 15,
    color: 'black',
  },
  h2: {
    marginLeft: 20,
    marginRight: 10,
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
  },
  h3: {
    marginLeft: 20,
    marginRight: 10,
    fontWeight: '400',
    fontSize: 15,
    color: 'black',
  },
  p: {
    marginLeft: 20,
    marginRight: 10,
    fontSize: 15,
    color: 'black',
  },
  td: {
    marginLeft: 20,
    marginRight: 10,
    fontSize: 15,
    color: 'black'
  },
  ul: {
    padding: 0,
  }
});
const mapStateToProps = state => {
  return {
    openMenu: state.readerModalReducer.modalState,
    fontSize: state.readerModalReducer.fontSize,
    postBackground: state.readerModalReducer.postBackground,
    textColor: state.readerModalReducer.textColor,
    disableScroll: state.readerModalReducer.disableScroll,
    nightMode: state.readerModalReducer.nightMode
  }
}
export default connect(mapStateToProps)(NewsItem);
