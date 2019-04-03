import React, { Component } from "react";
import { Modal, Button, Icon } from "antd-mobile";
import wx from "weixin-js-sdk";
import { connect } from "dva";

class ViewResult extends Component {
  state = {
    filesList: []
  };

  componentDidMount() {
    const { sourceData, dispatch, type } = this.props;
    let params = sourceData;
    console.log(sourceData, type);
    dispatch({
      type: "common/queryAttachList",
      payload: params
    }).then(() => {
      let fileList = [];
      (this.props.common.attachList
        ? this.props.common.attachList.attachmentVOList
        : []).map((item, i) => {
        if (item.ctrlName == type) {
          fileList.push({
            name: item.originalFilename + "." + item.extention,
            url: item.fullFilename,
            uid: item.id,
            fileType: item.fileType
          });
        }
      });
      this.setState({
        filesList: fileList
      });
    });
  }
  previewImage(img) {
    //图片预览
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    });
  }
  render() {
    const { filesList } = this.state;
    let that = this;
    return (
      <div>
        {filesList.map(function(item, i) {
          if (item.fileType && item.fileType.indexOf("image") > -1) {
            return (
              <div
                key={i}
                onClick={() => {
                  that.previewImage(item.url);
                }}
                style={{
                  width: 100,
                  height: 150,
                  marginLeft: 20,
                  marginTop: 5,
                  overflow: "hidden",
                  //float: "left",
                  cursor: "pointer",
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <span style={{ display: "block" }}>
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={item.url + "?x-oss-process=image/resize,w_100"}
                  />
                </span>
              </div>
            );
          } else {
            return (
              <div
                key={i}
                style={{
                  //marginRight: 20,
                  //overflow: "hidden",
                  //float: "left"
                }}
              >
                <a href={item.url} style={{ display: "block" }} target="_blank">
                  <img src={require('../image/fu.png')} style={{ margin: "0px 5px" }} />
                  {item.name}
                </a>
              </div>
            );
          }
        })}
      </div>
    );
  }
}
function mapStateToProps(state) {
  //连接redux
  return {};
}

export default connect(({ common }) => ({
  common
}))(ViewResult, mapStateToProps);
