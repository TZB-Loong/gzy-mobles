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
  Toast,
  Icon
} from "antd-mobile";
import { isfalse, url2params } from "../../utils/utils";
import Upload from "../../common/upload"; // 附件
import { requestUrl } from "../../confingPath";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";

import styles from "./style.less";

const Item = List.Item;
const Brief = Item.Brief;

class Programme extends Component {
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
      },
      dataSource: []
    };
  }
  //合同列表
  getTenderCaseList() {
    const { dispatch } = this.props;
    dispatch({
      type: "bidApproval/getTenderCaseList",
      payload: this.state.params
    }).then(() => {
      const { tenderCaseList } = this.props.bidApproval;
      if (!isfalse(tenderCaseList)) {
        // const source = [];
        // bidApproval.tenderCaseList.map(item => {
        //   source.push({
        //     ...item,
        //     id: isfalse(item.materialBidId) ? item.labourBidId : item.materialBidId,
        //     bidCompanyName: item.bidCompanyName,
        //   });
        // });
        this.setState({
          dataSource: tenderCaseList
        });
      }
    });
  }
  componentDidMount() {
    console.log(this.props);

    this.getTenderCaseList();
  }
  goView(item) {
    console.log(item);
    if (this.state.tenderType == 1) {
      //材料
      if (item.bidAuthbusinessId != -1) {
        window.location.href =
          requestUrl +
          "/wechat-page/index.html#/bid_detail/" +
          item.materialBidId;
        return;
      }
    } else {
      //劳务
      if (item.bidCompanyId != -1) {
        window.location.href =
          requestUrl + "/wuser/center/" + item.labourBidId + "/toultbview";
        return;
      }
    }
  }

  render() {
    let { dataSource, tenderType } = this.state;
    let _this = this;
    return (
      <ReactDocumentTitle title="中标方案">
        <div>
          {dataSource && dataSource.length > 0 ? (
            <List>
              <Item>
                <Icon style={{ color: "#3685FC" }} type="exclamation-circle" />
                <span>点击中标公司名称查看对应中标方案</span>
              </Item>
              {(dataSource ? dataSource : []).map((item, index) => {
                return (
                  <Item
                    key={index}
                    arrow={
                      (tenderType == 1 && item.bidAuthbusinessId != -1) ||
                      (tenderType == 2 && item.bidCompanyId != -1) ? (
                        "horizontal"
                      ) : (
                        ""
                      )
                    }
                    onClick={() => {
                      _this.goView(item);
                    }}
                  >
                    <span>{item.bidCompanyName}</span>

                    <Brief>
                      {tenderType == 1 ? item.price : item.projectPrice}元
                    </Brief>
                  </Item>
                );
              })}
            </List>
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
}))(Programme, mapStateToProps);
