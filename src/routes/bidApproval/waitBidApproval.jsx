import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "dva";
import {
  List,
  ListView,
  Flex,
  PullToRefresh,
  Accordion,
  Card,
  Button,
  TextareaItem,
  Toast
} from "antd-mobile";

import Opinion from "../../common/opinion.jsx"; // 审批
import ApprovalProgress from "../../components/ApprovalProgress.jsx"; // 审批流程
import { isfalse, url2params } from "../../utils/utils";
import styles from "./style.less";
import { requestUrl } from '../../confingPath'
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";

var newDate = new Date();
const Item = List.Item;
const Brief = Item.Brief;

class WaitBidApproval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      params: {
        calibrationId:
          url2params(this.props.location.search).calibrationId || "",
        tenderId: url2params(this.props.location.search).tenderId || "",
        tenderType: url2params(this.props.location.search).tenderType || ""
      },
      // parameters: {
      //   taskId: "8c7c898565514b45b8d18fac12fa4e66", //流程ID
      //   content: "", //审批意见
      //   calibrationId: "186", //定标表主键ID
      //   orderId: "64b054d5ccf845f7882ebd5646a2cc4f"
      // },
      approvalParams: {
        taskId: url2params(this.props.location.search).taskId, //流程ID
        content: "", //审批意见
        calibrationId: url2params(this.props.location.search).calibrationId, //定标表主键ID
        orderId: url2params(this.props.location.search).orderId
      }
    };
  }

  componentDidMount() {
    let propsData = url2params(this.props.location.search);
    console.log(propsData);
    const { dispatch } = this.props;
    dispatch({
      type: "bidApproval/queryBidList",
      payload: this.state.params
    }).then(() => {
      console.log(this.props.bidApproval.examineList);
    });
  }

  // sendCalibration() {
  //   //批准定标审批
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: "bidApproval/sendCalibration",
  //     payload: this.state.parameters
  //   }).then(() => {});
  // };

  // backCalibration() {
  //   console.log(this.state.parameters)
  //   //驳回定标审批
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: "bidApproval/backCalibration",
  //     payload: this.state.parameters
  //   });
  // };
  // calibrationChange(value) {
  //   //总的备注的内容修改
  //   this.setState({
  //     parameters: Object.assign({}, this.state.parameters, { content: value }),
  //     content: value
  //   });
  // }
  // onSubmit(type) {
  //   console.log(this.state.content);
  //   if (isfalse(this.state.content)) {
  //     Toast.info("请填写审批意见!");
  //     return;
  //   }
  //   if (type == "0") {
  //     this.sendCalibration();
  //   } else {
  //     this.backCalibration();
  //   }
  // }
  // 投标详情
  goView(item) {
    console.log(item);
    if (url2params(this.props.location.search).tenderType == 1) {
      //材料
      if (item.bidAuthbusinessId != -1) {
        window.location.href = requestUrl + "/wechat-page/index.html#/bid_detail/" + item.materialBidId;
        return;
      }
    } else {
      //劳务
      if (item.bidCompanyId != -1) {
        window.location.href = requestUrl + "/wuser/center/" + item.labourBidId + "/toultbview";
        return;
      }
    }
  }
  render() {
    let { examineList } = this.props.bidApproval;
    let _this  = this;

    return (
      <ReactDocumentTitle title="定标审批">
      <div className={styles.bidApproval}>
        {examineList ? (
          <div>
            <div className={styles.title}>
              <div style={{ color: "#3685FC" }}>{examineList.projectName}</div>
              <div style={{ color: "#3685FC" }}>
                招：{examineList ? (
                  examineList.materialCategoryNames || examineList.labourWorkType
                ) : (
                  ""
                )}
              </div>
              <div>
                <span style={{ color: "#666666" }}>截止时间：</span>
                <span>{examineList.endDate}</span>
              </div>
              <div>
                <span style={{ color: "#666666" }}>开标剩余时间：</span>
                <span>{examineList ? examineList.leftTime : 0}天
                  {/*{newDate.valueOf() < moment(examineList.endDate).valueOf() ? (
                    Math.floor(
                      (newDate.valueOf() -
                        moment(examineList.endDate).valueOf()) /
                        (24 * 3600 * 1000)
                    )
                  ) : null}*/}
                </span>
              </div>
              <div>
                <span style={{ color: "#666666" }}>最高限价：</span>
                <span>{(examineList && examineList.priceLimitation) ? (examineList.priceLimitation + '元') : '未填写'}</span>
              </div>
            </div>
            <Accordion>
              <Accordion.Panel header="审批流程">
                <div>
                  <ApprovalProgress
                    processCode={
                      url2params(this.props.location.search).processCode
                    }
                    orderId={url2params(this.props.location.search).orderId}
                    projectId={url2params(this.props.location.search).projectId}
                    bizObjId={
                      isfalse(examineList.calibration) ? null : (
                        examineList.calibration.calibrationId
                      )
                    }
                    bizObjCode={
                      isfalse(examineList.calibration) ? null : (
                        examineList.calibration.bizObjCode
                      )
                    }
                  />
                </div>
              </Accordion.Panel>
            </Accordion>
            <List renderHeader={() => "投标单位（" + ((examineList.bidList && examineList.bidList.length > 0) ? examineList.bidList.length : 0 )+ "家）"} style={{ color: "#333" }}>
              {(examineList.bidList ? examineList.bidList : []).map(function(
                item,
                index
              ) {
                return (
                  <div
                    key={index}
                    style={{
                      borderBottom: "1px dashed #D0D0D0",
                      padding: "15px 10px",
                      position: "relative"
                    }}
                  >
                    {item.bidAuthbusinessId == -1 ? (
                      <div>
                        <Flex>
                          <div style={{ marginRight: 15 }}>
                            <div
                              style={{
                                width: 50,
                                height: 50,
                                backgroundColor: "#57C49D",
                                textAlign: "center",
                                paddingTop: 10,
                                color: "#fff"
                              }}
                            >
                              <div>线下</div>
                              <div>投标</div>
                            </div>
                          </div>
                          <div style={{ width: "100%", minHeight: 50 }}>
                            <div style={{ color: "#333" }}>
                              {item.companyName}
                            </div>
                            <div style={{ color: "#333", paddingTop: 5 }}>
                              投标价格：{item.price}元
                            </div>
                          </div>
                          <div
                            className={styles.suggestion}
                            style={{
                              display:
                                item.bidApproval &&
                                item.bidApproval.proposal == 1
                                  ? null
                                  : "none"
                            }}
                          >
                            建议中标
                          </div>
                        </Flex>
                      </div>
                    ) : (
                      <div>
                        <Flex>
                          <div style={{ marginRight: 15 }}>
                            <img style={{ width: 50, height: 50 }} />
                          </div>
                          <div style={{ width: "100%", minHeight: 50 }}>
                            <div style={{ color: "#333" }}>
                              {item.companyName}
                            </div>
                            <div style={{ color: "#333" }}>{item.address}</div>
                          </div>
                          <div
                            className={styles.suggestion}
                            style={{
                              display:
                                item.bidApproval &&
                                item.bidApproval.proposal == 1
                                  ? null
                                  : "none"
                            }}
                          >
                            建议中标
                          </div>
                        </Flex>
                        <table cellSpacing="0" className={styles.bidTable}>
                          <tr>
                            <td>投标报价：{item.price}元</td>
                            <td>价格排名：第{item.ranking}名</td>
                          </tr>
                          <tr>
                            <td>综合得分：{item.totalScore}分</td>
                            <td>综合排名：第{item.totalRanking}名</td>
                          </tr>
                        </table>
                        <div style={{ textAlign: "right", padding: 15 }}>
                          <Button
                            inline
                            size="small"
                            style={{ marginRight: 10 }}
                            onClick={() => {
                              _this.goView(item);
                            }}
                          >
                            查看投标详情
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div
                style={{
                  padding: "20px 10px",
                  color: "#333",
                  borderBottom: "1px solid #D0D0D0"
                }}
              >
                评标意见：{examineList.calibration ? (
                  examineList.calibration.remark
                ) : (
                  ""
                )}
              </div>
            </List>
            <div style={{ paddingBottom: 60 }} />
          </div>
        ) : null}

        <Opinion params={this.state.approvalParams} typeApproval={"bid"} />
      </div>
      </ReactDocumentTitle>
    );
  }
}
function mapStateToProps() {
  return {};
}

export default connect(({ bidApproval }) => ({
  bidApproval
}))(WaitBidApproval, mapStateToProps);
