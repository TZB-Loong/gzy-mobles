import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "dva";
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

class UploadContract extends Component {
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
      contractList: [
        {
          agreementWinbidName: null,
          tenderId: null,
          bidId: null,
          sumMoney: null,
          pictureFile: null,
          pictureSignFile: null
        }
      ],
      btnStatus: false
    };
  }
  contractList(data) {
    let contractListData = [];
    data.map((item, i) => {
      contractListData.push({
        tenderId:
          this.state.tenderType == "1"
            ? item.materialTenderId
            : item.labourTenderId,
        bidId:
          this.state.tenderType == "1" ? item.materialBidId : item.labourBidId,
        agreementWinbidName:
          this.state.tenderType == "1"
            ? item.bidAuthbusinessName
            : item.bidCompanyName,
        aUserId:
          this.state.tenderType == "1"
            ? item.bidAuthbusinessId
            : item.bidCompanyId,
        sumMoney: null,
        pictureFile: null,
        pictureSignFile: null
      });
    });
    console.log(contractListData);
    this.setState({
      contractList: contractListData
    });
  }
  //上传合同列表
  getBidList() {
    const { dispatch } = this.props;
    this.setState({ btnStatus: true });
    dispatch({
      type: "bidApproval/getBidList",
      payload: this.state.params
    }).then(() => {
      let { BidList } = this.props.bidApproval;
      this.setState({ btnStatus: false });
      console.log(BidList);
      this.contractList(BidList ? BidList : []);
      this.setState({
        BidList: BidList ? BidList : []
      });
    });
  }

  componentDidMount() {
    console.log(this.props);
    this.getBidList();
  }

  // 上传合同
  batchUploadAgreement() {
    const { dispatch } = this.props;
    let agreements = this.state.contractList;

    console.log(agreements);
    for (var i in agreements) {
      if (isfalse(agreements[i].sumMoney)) {
        console.log("sumMoney" + i);
        this.setState({ ["sumMoney" + i]: true });
        Toast.info("中标金额不能为空!");
        return;
      } else {
        this.setState({ ["sumMoney" + i]: false });
      }
      if (isfalse(agreements[i].pictureFile)) {
        this.setState({ ["pictureFile" + i]: true });
        Toast.info("合同金额页不能为空!");
        return;
      } else {
        this.setState({ ["pictureFile" + i]: false });
      }
      if (isfalse(agreements[i].pictureSignFile)) {
        this.setState({ ["pictureSignFile" + i]: true });
        Toast.info("合同签章页不能为空!");
        return;
      } else {
        this.setState({ ["pictureSignFile" + i]: false });
      }
    }

    let bodyData = {
      tenderType: this.state.tenderType,
      agreements: agreements
    };
    dispatch({
      type: "bidApproval/batchUploadAgreement",
      payload: bodyData
    }).then(() => {
      let { saveStatus } = this.props.bidApproval;
      console.log(saveStatus);

      if (saveStatus) {
        Toast.success("上传成功");
        window.history.back();
      }
    });
  }

  fileIds(index, fileName) {
    console.log(index, fileName);
    let newObj = this.state.contractList;
    //let serverId = ['uujzLnHz_BfDgkBmY2fGf1R8y_GHB91HMeQu1Mo_YfYqmHRUmYKUYZrOVIikTTmU']
    let serverId = this.state.serverIds;
    if (fileName == "pictureFile") {
      newObj[index].pictureFile = serverId.toString();
    }
    if (fileName == "pictureSignFile") {
      newObj[index].pictureSignFile = serverId.toString();
    }
    this.setState({ contractList: newObj });
  }

  render() {
    let { BidList, contractList } = this.state;
    let _this = this;
    return (
      <ReactDocumentTitle title="上传合同">
      <div className={styles.uploadContract}>
        {BidList && BidList.length > 0 ? (
          <div>
            <div>
              {BidList.map((item, index) => {
                return (
                  <List key={index} style={{ marginBottom: 5 }}>
                    <Item>
                      {this.state.tenderType == "1" ? (
                        item.bidAuthbusinessName
                      ) : (
                        item.bidCompanyName
                      )}
                    </Item>
                    <InputItem
                      style={{ textAlign: "right" }}
                      clear
                      type="money"
                      placeholder="请输入金额"
                      extra="元"
                      onChange={value => {
                        let newObj = contractList;
                        let values = value;
                        {
                          /*let reg = /^\d+(\.\d{0,2})?$/;*/
                        }
                        let re = /([0-9]+\.[0-9]{2})[0-9]*/;
                        {
                          /*if (isfalse(reg.test(value))) {
                          console.log(value);
                        }*/
                        }
                        newObj[index].sumMoney = value.replace(re, "$1");
                        _this.setState({ contractList: newObj });
                      }}
                      value={contractList[index].sumMoney}
                    >
                      中标金额
                    </InputItem>
                    {this.state["sumMoney" + index] ? (
                      <div className={styles.error}>请输入中标金额!</div>
                    ) : null}
                    <div>
                      <Upload
                        parentIds={id => {
                          _this.setState({ serverIds: id }, () => {
                            _this.fileIds(index, "pictureFile");
                          });
                        }}
                        msg="合同金额页"
                      />
                      {this.state["pictureFile" + index] ? (
                        <div className={styles.error}>合同金额页不能为空!</div>
                      ) : null}
                      <Upload
                        parentIds={id => {
                          _this.setState({ serverIds: id }, () => {
                            _this.fileIds(index, "pictureSignFile");
                          });
                        }}
                        msg="合同签章页"
                      />
                      {this.state["pictureSignFile" + index] ? (
                        <div className={styles.error}>合同签章页不能为空!</div>
                      ) : null}
                    </div>
                  </List>
                );
              })}
            </div>
            <div style={{ paddingBottom: 60 }} />
            <Button
              className={styles.btn_b}
              type="primary"
              onClick={() => {
                _this.batchUploadAgreement();
              }}
              disabled={this.state.btnStatus}
            >
              确认上传
            </Button>
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
}))(UploadContract, mapStateToProps);
