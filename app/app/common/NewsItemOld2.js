import React, { Component } from 'react';
import { View, Text, Dimensions, Platform, TouchableOpacity, Image,
  TouchableHighlight,
  TextInput,
  WebView,
  Share,
  Linking,
  Clipboard,
  ScrollView,
  AsyncStorage } from 'react-native';
var {height, width} = Dimensions.get('window');
import Child from '../child';

import { RunsItem, Button1 } from '../common';
const cheerio = require('cheerio-without-node-native');
import * as Animatable from 'react-native-animatable';
var Toast = require('react-native-toast');

import { connect } from 'react-redux';
import { changeFontSize, changeModalState } from '../actions';
var WEBVIEW_REF = 'webview';

class NewsItem extends Child {
  state = {
    html: '',
    openMenu: false,
    bookMark: [],
    baseHTML: '',
    isSaved: false,
    textSelected: ''
  };
  componentWillMount() {
    this.fetchContent()
  }
  _share() {
    Share.share({
      message: this.props.title,
      url: this.props.url,
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
    Linking.canOpenURL(this.props.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.url);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.url);
      }
    });
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
        max-height:400px;
        max-width:${width}px;
      }
      * {
        -webkit-touch-callout: none !important;
      }
      h3, p, .block_timer_share{
        margin-left: ${this.context.appState("webView").paddingLeft}px;
        line-height: 1.3em;
        margin-right: 10px;
        font-size: ${this.props.fontSize}
      }
      .relative_new, .title_news, .block_share.right, .Image,.section0.width_common,.txt_coppy_right,.txt_lienhe,
      script, i , iframe, #SexyAlertBox-Box, .block_tag.width_common.space_bottom_20,.start.have_cap2,.cap2,
      #header_web, #col_300, #myvne_taskbar, #block_col_160 right,#block_search,#wrapper_footer,#box_tinlienquan,
      .input_comment,.block_tag.width_common.space_bottom_20,.title_box_category.width_common,.block_more_info,
      .xemthem_new_ver.width_common,.header_logo.width_common,.mid_header.width_common,noscript,.block_more_info,
      #wrapper_header,.box_tinkhac.width_common,.footer.width_common,.button_chiase.line_3px.width_common,
      .list_location_left.width_common.sticky_info_st.down,#topbar,.logo,.tt_2,.back_tt,.list_news,.width_common.list_10tinkhac,
      #box_xemnhieunhat,.social_share.right,.minutes,.icon_live.icon_dot_live{
        display: none
      }
      html, body{
        width: ${width}px;
        overflow-x:hidden;
        font-family: 'Nunito', sans-serif;
        margin-left: 0px;
        margin-right: 5px;
        margin-top: 0px;
        background-color: ${this.context.appState("webView").postBackground}
      }
    </style>
    <script>
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
      }

      document.onmouseup = document.onkeyup = document.onselectionchange = function() {
        window.postMessage(getSelectionText());
      };
    </script>
    `;
    return htmlPlus
  }

  fetchContent() {
    let url = this.props.url
    fetch(this.props.url)
      .then((response) => response.text())
      .then((responseData) => {
        $ = cheerio.load(responseData)
        // phân biệt các thể loại url
        if (url.includes('http://vnexpress.net/projects/') == true) {
          this.setState({ baseHTML: $('.mobile.visible-xs').html() }, () => {
            this.updateWebview()
          })
        }
        else if (url.includes('http://thethao.vnexpress.net/tuong-thuat/ban-tin-the-thao-toi')== true) {
          this.setState({ baseHTML: $('#container_tab_live').html() }, () => {
            this.updateWebview()
          })
        }
        else if ($('#article_content').html() !== null) {
          this.setState({ baseHTML: $('#article_content').html() }, () => {
            this.updateWebview()
          })
        }
        else if ($('.block_content_slide_showdetail').html() !== null) {
          this.setState({ baseHTML: $('.block_content_slide_showdetail').html() }, () => {
            this.updateWebview()
          })
        }
        else if ($('.fck_detail.width_common').html() !== null) {
          this.setState({ baseHTML: $('.fck_detail.width_common').html() }, () => {
            this.updateWebview()
          })
        }
        else {
          this.setState({ baseHTML: $('.fck_detail.width_common.block_ads_connect').html() }, () => {
            this.updateWebview()
          })
        }
      })
  }
  reloadWebview = () => {
    this.refs[WEBVIEW_REF].reload();
  };
  loading() {
    console.log(this.state.html)
    if (true) {
      return (
        <View>
          <WebView
            ref={WEBVIEW_REF}
            style={{ width: width }}
            javaScriptEnabled={true}
            onMessage={(event) => { this.setState({ textSelected: event.nativeEvent.data }) }}
            source={{ html: this.state.html }} />
        </View>
      )
    } else {
      return (
        <Text style={{ textAlign: 'center', alignSelf: 'center' }}>Loading...
        </Text>
      )
    }
  }
  updateWebview() {
    this.setState({
      html:
      `<body>
          <img class="cover" src=${this.props.thumb}/>
          <h1 class="title">${this.props.title}</h1>
          ${this.state.baseHTML + this.returnHtml()}
          </body>
        `})
  }
  render() {
    return (
      <View style={{ alignItems: 'center', flex:1}}>
        {this.loading()}
        {this.props.openMenu &&
          <Animatable.View animation="slideInDown" duration={300} style={styles.menuModal}>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => {
                this.props.dispatch(changeFontSize(this.props.fontSize + 2));
                setTimeout(()=>{
                  this.updateWebview()
                  this.props.dispatch(changeModalState(!this.props.openMenu))
                },100)
                if (Platform.OS === 'android') {
                  setTimeout(()=>this.reloadWebview(),200)
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
                setTimeout(()=>{
                  this.updateWebview()
                  this.props.dispatch(changeModalState(!this.props.openMenu))
                },100)
                if (Platform.OS === 'android') {
                  setTimeout(()=>this.reloadWebview(),200)
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
              onPress={() => {this._saveBookmark(); this.props.dispatch(changeModalState(!this.props.openMenu))}}
              style={styles.modalItem}>
              <View>
                <Text style={styles.modalText}>Lưu
                      </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => {
                Clipboard.setString(this.props.url);
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
                  url: this.props.url,
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

const styles={
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
    top: 40,
    right: 0,
    width: 100,
    elevation: 5,
    shadowOpacity: 0.3
  },
}
const mapStateToProps = state => {
   return {
     openMenu: state.readerModalReducer.modalState,
     fontSize: state.readerModalReducer.fontSize
   }
}
export default connect(mapStateToProps)(NewsItem);
