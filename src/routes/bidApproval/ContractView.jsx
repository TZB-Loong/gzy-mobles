import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "dva";
import wx from "weixin-js-sdk";
import {
  List,
  Flex,
  Badge,
  Result,
  InputItem,
  Button,
  Toast
} from "antd-mobile";
import { isfalse, url2params } from "../../utils/utils";
import Upload from "../../common/upload"; // 附件
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";

import styles from "./style.less";

const Item = List.Item;
const Brief = Item.Brief;

class ContractView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tenderType: url2params(this.props.location.search).tenderType
        ? url2params(this.props.location.search).tenderType
        : "", // 1材料 2/ 劳务
      params: {
        tenderId: url2params(this.props.location.search).tenderId
          ? url2params(this.props.location.search).tenderId
          : "",
        tenderType: url2params(this.props.location.search).tenderType
          ? url2params(this.props.location.search).tenderType
          : ""
      }
    };
  }
  //合同列表
  getAgreements() {
    const { dispatch } = this.props;
    dispatch({
      type: "bidApproval/getAgreements",
      payload: this.state.params
    }).then(() => {
      let { Agreements } = this.props.bidApproval;
      console.log(Agreements);

      this.setState({
        BidList: Agreements ? Agreements : []
      });
    });
  }
  componentDidMount() {
    console.log(this.props);

    this.getAgreements();
  }
  previewImage(img) {
    //图片预览
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    });
  }
  // 显示图片样式
  seeImg(seeImg, typeName) {
    return (
      <div
        style={{
          float: "left",
          marginRight: 20
        }}
      >
        <div
          onClick={() => {
            this.previewImage(seeImg);
          }}
          style={{
            width: 100,
            height: 125,
            overflow: "hidden",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <span style={{ display: "block" }}>
            <img
              style={{ width: "100%", height: "100%" }}
              src={seeImg + "?x-oss-process=image/resize,w_100"}
            />
          </span>
        </div>
        <div style={{ textAlign: "center", fontSize: 14, paddingTop: 5 }}>
          {typeName}
        </div>
      </div>
    );
  }
  render() {
    let { BidList } = this.state;
    let _this = this;
    return (
      <ReactDocumentTitle title="合同详情">
        <div className={styles.uploadContract}>
          {BidList && BidList.length > 0 ? (
            <div>
              <div>
                {BidList.map((item, index) => {
                  return (
                    <List key={index} style={{ marginBottom: 5 }}>
                      <Item>{item.agreementWinbidName}</Item>
                      <Item extra={item.sumMoney + "元"}>中标金额</Item>
                      <Item>
                        <div style={{ paddingBottom: 5 }}>合同金额及签章页</div>
                        <div>{this.seeImg(item.pictureFile, "合同金额页面")}</div>
                        <div>{this.seeImg(item.pictureSignFile, "合同签章页面")}</div>
                      </Item>
                    </List>
                  );
                })}
              </div>
            </div>
          ) : (
            <Result
              imgUrl={require("../../assets/null.png")}
              message={<div>暂无数据</div>}
            />
          )}
        </div>
      </ReactDocumentTitle>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(({ bidApproval, common }) => ({
  bidApproval,
  common
}))(ContractView, mapStateToProps);
