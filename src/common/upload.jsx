import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'dva/fetch';
import { Card, WingBlank, WhiteSpace,Toast,Icon,List } from 'antd-mobile';
import {isfalse} from '../utils/utils'
import {
  connect
} from 'dva';
import {
  routerRedux
} from 'dva/router';

import wx from 'weixin-js-sdk';
import styles from '../layouts/upload.less';
import {requestUrl} from '../confingPath';
class Upload extends Component{
  constructor(props){
    super(props);
    this.state={
      msg:'msg',
      showText:'msg',
      showLoading:false,
      arrayImg: [],
      serverId: [],
    }
    this.initWeixinAPI = this.initWeixinAPI.bind(this);
  }

  // componentWillMount(){
  //   this.initWeixinAPI();
  // }

  componentDidMount() {
    this.setState({
      msg:this.props.msg,
    });
   console.log('componentDidMount')
    // this.initWeixinAPI();
  }
  // componentWillReceiveProps(nextProps){
  //   if(nextProps.parentIds!=this.props.parentIds){
  //     console.log('componentWillReceiveProps')
  //     this.initWeixinAPI();
  //   }
  // }

  initWeixinAPI=()=> {
    // alert('3')
    console.log('initWeixinAPI--initWeixinAPI')
    let jsApi = requestUrl + "/wechat/api/jsapiTicket?accessUrl=" + encodeURIComponent(window.location.href.split('#')[0]);
    // let jsApi ="http://tmall.gzy360.com:8123/wechat/api/jsapiTicket?accessUrl=" + encodeURIComponent(window.location.href.split('#')[0]);
    let _this = this;
    fetch(jsApi, {
      method: 'post',
      Accept: "*/*",
      mode: 'cors',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(
        (data) => {
          console.log(data,'data')
          if (data.respCode === 0) {
            wx.config({
              debug: false, // 开启调试模式
              appId: data.respResult.appId,
              timestamp: data.respResult.timestamp,
              nonceStr: data.respResult.nonceStr,
              signature: data.respResult.signature,
              jsApiList: [
                'chooseImage',
                'uploadImage',
                'previewImage',
              ] // 必填，需要使用的JS接口列表
            });
            wx.ready(function (res) {
              _this.wxChooseImage();
              // alert('初始化成功')
            });
            wx.error(function (res) {
              // alert('初始化失败')
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
          } else {
            //console.log(result.respResult.errMsg);
          }
        },
        (error) => {
          // alert(error)
          console.log(error)
        }
      )
  }
  //图片上传
  wxChooseImage(index) {
    const _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let localIds = res.localIds;
        Toast.loading('图片上传中...');
        wx.uploadImage({
          localId: localIds.toString(),
          isShowProgressTips: 0,
          success: function (res) {
            console.log(res)
            _this.wxImgCallback(res.serverId, localIds)
          },
          fail: function (res) {
            // alert(res.errMsg)
          }
        });
      }, fail: function (res) {
        // alert(res.errMsg)
      }
    });
  }
  wxImgCallback(serverId,localIds) {
    //附件上传,本地调试需要修改host为gzy360.com才能测试
    let _this = this,serverIds=this.state.serverId,arrayImg=this.state.arrayImg;
    serverIds.push(serverId);
    console.log(serverId)
    arrayImg.push(localIds);
    this.setState({
      serverId:serverIds,
      arrayImg:arrayImg,
    },()=>{_this.props.parentIds(serverIds)})
    setTimeout(()=>{
      Toast.hide();
    },1000)
  }
  //图片预览
  previewImage(img) {
    console.log(img)
    wx.previewImage({
      current: img[0], 　　// 当前显示图片的http链接
      urls: [img]     　// 需要预览的图片http链接列表
    })
  }

  //删除图片
  delImage(childer){
    let serverIds = this.state.serverId;
    let arrayImgs = this.state.arrayImg;
    serverIds.splice(childer,1);
    arrayImgs.splice(childer,1);
    this.setState({
      serverId:serverIds,
      arrayImg:arrayImgs,
    },()=>{this.props.parentIds(serverIds)})
  }
  render() {
    // alert('render')
    const {arrayImg,serverId} = this.state;let _this = this;
    console.log(arrayImg)
    return <div className={styles.uploadImage}>
      <div>
        <Card full>
          <Card.Header
            title={isfalse(this.props.msg)? "附件":this.props.msg}
          />
          <Card.Body>
            <ul className={styles.imgList}>
              {serverId.length>0?arrayImg.map(function (image,index) {
                return<li key={index} style={index==1?{margin:'0 5%'}:{}}>
                  <div className="placeholder delImg">
                    <Icon type="cross-circle" onClick={()=>_this.delImage(index)}/>
                    <img src={image} style={{width:'100%'}} alt="" onClick={() => _this.previewImage(image)}/>
                  </div>
                </li>
              }):''}
              {serverId.length==0?
                <li className="am-image-picker">
                  <div className="am-image-picker-list" onClick={() => _this.initWeixinAPI()}>
                    <div className="am-flexbox am-flexbox-align-center">
                      <div className="am-flexbox-item">
                        <div className="am-image-picker-item am-image-picker-upload-btn">
                        </div>
                      </div>
                    </div></div>
                </li>:null}
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  }
}
function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Upload);
