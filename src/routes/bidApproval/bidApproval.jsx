import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "dva";
import { createForm } from "rc-form";
import {
  List,
  ListView,
  Flex,
  PullToRefresh,
  Accordion,
  Card,
  Button,
  TextareaItem,
  Icon,
  Modal,
  InputItem,
  Toast
} from "antd-mobile";

import { isfalse, url2params } from "../../utils/utils";
import styles from "./style.less";
import BidProjectList from "../../common/bidProjecList"; //选择项目组件
import Upload from "../../common/upload"; // 附件
import ApprovalProgress from "../../components/ApprovalProgress.jsx"; // 审批流程
import { requestUrl } from "../../confingPath";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";

var newDate = new Date();
const Item = List.Item;
const Brief = Item.Brief;

class BidApproval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      modal: false,
      params: {
        calibrationId: url2params(this.props.location.search).calibrationId,
        tenderId: url2params(this.props.location.search).tenderId,
        tenderType: url2params(this.props.location.search).tenderType
      },
      parameters: {
        //提交的参数集合
        calibrationId: url2params(this.props.location.search).calibrationId, //定标Id
        tenderId: "", //招标id
        remark: "", //总的备注
        tenderType: url2params(this.props.location.search).tenderType, //招标类型 1： 材料 2：劳务
        saveType: url2params(this.props.location.search).saveType, //存储类型： 1：提交审批走流程 2：直接确认中标
        taskId: url2params(this.props.location.search).taskId, //流程ID
        orderId: url2params(this.props.location.search).orderId, //流程实例ID
        bidDatas: "" //platform为平台供应商，extra为自定义供应商
      },
      dataSource: [],
      examineListData: {},
      addStatus: false,
      addStatusText: "",
      projectId: url2params(this.props.location.search).projectId,
      btnStatus: false
    };
  }
  queryBidList() {
    console.log(this.state.params);
    const { dispatch } = this.props;
    dispatch({
      type: "bidApproval/queryBidList",
      payload: this.state.params
    }).then(() => {
      let { examineList } = this.props.bidApproval;
      console.log(examineList);
      let source = [];
      if (!isfalse(examineList) && !isfalse(examineList.bidList)) {
        (examineList.bidList ? examineList.bidList : []).map((item, index) => {
          source.push({
            companyName: item.companyName, //公司名
            address:
              item.provinceText +
              item.cityText +
              item.districtText +
              item.address, //地址
            typeSellText: item.typeSellText, //类别
            cyle: item.cyle, //供货周期
            price: item.price, //投标金额
            ranking: item.ranking, //价格排名
            totalScore: item.totalScore, //综合得分
            totalRanking: item.totalRanking, //综合排名
            labourBidId: item.labourBidId,
            materialBidId: item.materialBidId,
            key: index,
            proposal: isfalse(item.bidApproval) ? 0 : item.bidApproval.proposal, //'是否建议中标：0不建议 1建议',
            remark: isfalse(item.bidApproval) ? null : item.bidApproval.remark,
            // bidId:
            //   this.state.queryBidListParams.tenderType == 1
            //     ? item.materialBidId
            //     : item.labourBidId,
            enclosure: isfalse(item.attachmentPojos)
              ? []
              : [
                  {
                    url: item.attachmentPojos[0].fullFilename,
                    uid: item.attachmentPojos[0].id,
                    name: item.attachmentPojos[0].originalFilename,
                    status: "done"
                  }
                ], //附件
            bidAuthbusinessId: item.bidAuthbusinessId
          });
        });
      }
      this.setState({
        examineListData: examineList ? examineList : {},
        dataSource: isfalse(source) ? [] : source,
        parametersRemark: isfalse(examineList.calibration)
          ? null
          : examineList.calibration.remark,
        parameters: Object.assign({}, this.state.parameters, {
          tenderId: isfalse(this.state.parameters.tenderId)
            ? isfalse(examineList.calibration)
              ? null
              : examineList.calibration.tenderId
            : this.state.parameters.tenderId,
          calibrationId: isfalse(examineList.calibration)
            ? null
            : examineList.calibration.calibrationId
        })
      });
      console.log(source);
    });
  }
  componentDidMount() {
    if (this.state.params.calibrationId || this.state.params.tenderId) {
      this.queryBidList();
    }
  }

  showModal() {
    // e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      modal: true,
      companyName: "",
      cyle: "",
      price: "",
      fileIds: "",
      addStatus: false
    });
  }

  modifyingData(index, type, value) {
    //列表里面的内容修改

    let dataSource = this.state.dataSource;
    if (type == "proposal") {
      //修改是否建议中标
      dataSource[index][type] = dataSource[index][type] == 0 ? 1 : 0; //是1就改成0,0就改成1
    } else {
      if (typeof value == "object") {
        dataSource[index][type] = value.target.value;
      } else {
        dataSource[index][type] = value;
      }
    }

    this.setState({
      dataSource: dataSource
    });
  }

  deleteRow(index) {
    //删除指定的一行
    let dataSource = this.state.dataSource;
    dataSource.splice(index, 1);

    this.setState({
      dataSource: dataSource
    });
  }
  // 加一行
  onSubmit = () => {
    console.log(values);

    let values = {};
    console.log(values);
    if (isfalse(this.state.companyName)) {
      this.setState({ addStatus: true, addStatusText: "请输入收款单位名称" });
      return;
    }
    if (isfalse(this.state.price)) {
      this.setState({ addStatus: true, addStatusText: "请输入金额" });
      return;
    }
    // if (isfalse(this.state.cyle)) {
    //   this.setState({ addStatus: true, addStatusText: "请输入供货周期" });
    //   return;
    // }
    values.companyName = this.state.companyName;
    values.cyle = this.state.cyle;
    values.fileIds = this.state.fileIds;
    values.price = this.state.price;
    values.bidAuthbusinessId = -1;
    values.proposal = 0;
    values.enclosure = null;

    let dataSource = this.state.dataSource;
    console.log(values);
    dataSource.push(values);
    this.setState({ dataSource });
    this.setState({
      modal: false
    });
  };

  // 提交审批
  bidApproval(saveType) {
    let dataSource = this.state.dataSource;
    console.log(dataSource);
    let platformData = [],
      extraData = [];
    if (!isfalse(dataSource)) {
      dataSource.map((item, index) => {
        if (item.bidAuthbusinessId == -1) {
          extraData.push({
            bidCompany: item.companyName,
            supplyCycle: item.cyle,
            bidPrice: item.price,
            proposal: item.proposal,
            // remark: item.remark,
            fileIds: item.fileIds
          });
        } else {
          platformData.push({
            bidId:
              this.state.parameters.tenderType == 1
                ? item.materialBidId
                : item.labourBidId,
            proposal: item.proposal
            // remark: item.remark
            // fileIds: isfalse(item.enclosure) ? null : item.enclosure[0].uid.toString(),
          });
        }
      });
    }
    if (isfalse(platformData) && isfalse(extraData)) {
      Toast.info("请选择或者添加中标单位");
      return;
    }
    let newParams = {
      platform: platformData,
      extra: extraData
    };
    let oldParams = Object.assign({}, this.state.parameters, {
      bidDatas: JSON.stringify(newParams),
      remark: this.state.parametersRemark ? this.state.parametersRemark : "",
      saveType: saveType
    });
    console.log(oldParams);
    this.reportCalibration(oldParams);
  }

  reportCalibration(data) {
    //提交定标审批
    const { dispatch } = this.props;
    this.setState({ btnStatus: true });
    dispatch({
      type: "bidApproval/reportCalibration",
      payload: data
    }).then(() => {
      const { saveBid } = this.props.bidApproval;
      if (saveBid.status == "200") {
        Toast.success("提交成功");
        if (url2params(this.props.location.search).source == "mall") {
          window.history.back();
        } else {
          this.props.history.replace("/processCenter/startProcess");
        }
      } else {
        // Toast.fail(saveBid.msg);
      }
      this.setState({ btnStatus: false });
    });
  }

  ProjectSelectionOK = data => {
    console.log(data, "123");
    this.setState(
      {
        parameters: Object.assign({}, this.state.parameters, {
          tenderId: data.tenderId
        }),
        params: Object.assign({}, this.state.params, {
          tenderId: data.tenderId
        }),
        projectId: data.projectId
        // tenderCategory:data.tenderCategory,
        // projectName:data.projectName
      },
      () => this.queryBidList()
    );
  };

  parentIds = serverIds => {
    console.log(serverIds, "123");
    let Ids = serverIds.toString();
    let payFile = [{ attachCode: "", serverIds: Ids, attachIds: "" }];
    let payOtherFile = JSON.stringify(payFile);
    this.setState({
      fileIds: payOtherFile
    });
  };
  // 投标详情
  goView(item) {
    console.log(item);
    if (url2params(this.props.location.search).tenderType == 1) {
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
    let { examineList } = this.props.bidApproval;
    const { getFieldProps, getFieldError } = this.props.form;
    let { dataSource, examineListData } = this.state;
    let _this = this;

    return (
      <ReactDocumentTitle title="定标审批">
        <div className={styles.bidApproval}>
          <BidProjectList
            onOK={this.ProjectSelectionOK}
            tenderType={this.state.params.tenderType}
            projectName={examineListData ? examineListData.projectName : ""}
          />
          {this.state.projectId ? (
            <div>
              <div className={styles.title}>
                <div style={{ color: "#3685FC" }}>
                  {examineList ? examineList.projectName : ""}
                </div>
                <div style={{ color: "#3685FC" }}>
                  招：{examineList ? (
                    examineList.materialCategoryNames ||
                    examineList.labourWorkType
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <span style={{ color: "#666666" }}>截止时间：</span>
                  <span>{examineList ? examineList.endDate : ""}</span>
                </div>
                <div>
                  <span style={{ color: "#666666" }}>开标剩余时间：</span>
                  <span>
                    {examineList ? examineList.leftTime : 0}天
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
                  <span>
                    {examineList && examineList.priceLimitation ? (
                      examineList.priceLimitation + "元"
                    ) : (
                      "未填写"
                    )}
                  </span>
                </div>
              </div>
              {url2params(this.props.location.search).saveType == 2 ? null : (
                <Accordion>
                  <Accordion.Panel header="审批流程">
                    <div>
                      <ApprovalProgress
                        processCode={
                          url2params(this.props.location.search).processCode ||
                          "approval"
                        }
                        orderId={url2params(this.props.location.search).orderId}
                        projectId={this.state.projectId}
                        start={
                          url2params(this.props.location.search)
                            .projectId ? url2params(this.props.location.search)
                            .list == "list" ? (
                            "start"
                          ) : (
                            ""
                          ) : (
                            "start"
                          )
                        }
                      />
                    </div>
                  </Accordion.Panel>
                </Accordion>
              )}
              <List
                renderHeader={() => {
                  return "投标单位（" + this.state.dataSource.length + "家）";
                }}
                style={{ color: "#333" }}
              >
                {(dataSource ? dataSource : []).map(function(item, index) {
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
                                display: item.proposal == 0 ? "none" : null
                              }}
                            >
                              建议中标
                            </div>
                          </Flex>
                          <div style={{ textAlign: "right", padding: 15 }}>
                            {item.materialBidId || item.labourBidId ? null : (
                              <Button
                                inline
                                size="small"
                                onClick={() => {
                                  _this.deleteRow(index);
                                }}
                                style={{ marginRight: 10 }}
                              >
                                删除
                              </Button>
                            )}
                            {item.proposal == 0 ? (
                              <Button
                                inline
                                size="small"
                                type="primary"
                                onClick={() => {
                                  _this.modifyingData(index, "proposal");
                                }}
                              >
                                建议中标
                              </Button>
                            ) : (
                              <Button
                                inline
                                size="small"
                                style={{ backgroundColor: "#EEEEEE" }}
                                onClick={() => {
                                  _this.modifyingData(index, "proposal");
                                }}
                              >
                                取消选中
                              </Button>
                            )}
                          </div>
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
                              <div style={{ color: "#333" }}>
                                {item.address}
                              </div>
                            </div>
                            <div
                              className={styles.suggestion}
                              style={{
                                display: item.proposal == 0 ? "none" : null
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
                            {item.proposal == 0 ? (
                              <Button
                                inline
                                size="small"
                                type="primary"
                                onClick={() => {
                                  _this.modifyingData(index, "proposal");
                                }}
                              >
                                建议中标
                              </Button>
                            ) : (
                              <Button
                                inline
                                size="small"
                                style={{ backgroundColor: "#EEEEEE" }}
                                onClick={() => {
                                  _this.modifyingData(index, "proposal");
                                }}
                              >
                                取消选中
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div
                  onClick={() => {
                    this.showModal();
                  }}
                  style={{
                    textAlign: "center",
                    color: "#3685FC",
                    fontSize: 16,
                    borderBottom: "1px solid #D0D0D0",
                    padding: 10
                  }}
                >
                  <Icon
                    style={{ marginRight: 5, paddingTop: 4 }}
                    size="xs"
                    type="plus"
                    theme="outlined"
                  />线下投标单位
                </div>
                <TextareaItem
                  onChange={value => {
                    _this.setState({ parametersRemark: value });
                  }}
                  rows={4}
                  placeholder="请输入评标意见"
                  value={this.state.parametersRemark}
                />
              </List>
              <div style={{ textAlign: "center", padding: 15 }}>
                {url2params(this.props.location.search).saveType == 2 ? (
                  <Button
                    inline
                    type="primary"
                    onClick={() => {
                      _this.bidApproval(2);
                    }}
                    style={{ marginRight: 10 }}
                    disabled={this.state.btnStatus}
                  >
                    确认中标
                  </Button>
                ) : (
                  <Button
                    inline
                    type="primary"
                    onClick={() => {
                      _this.bidApproval(1);
                    }}
                    style={{ marginRight: 10 }}
                    disabled={this.state.btnStatus}
                  >
                    提交审批
                  </Button>
                )}
              </div>
            </div>
          ) : null}

          <Modal visible={this.state.modal}>
            <List className={styles.bidModal}>
              <InputItem
                clear
                labelNumber={7}
                placeholder="请输入投标单位名称"
                onChange={value => {
                  _this.setState({ companyName: value });
                }}
              >
                <span className={styles.requiredMark}>*</span>投标单位名称
              </InputItem>
              <InputItem
                style={{ textAlign: "right" }}
                clear
                type="digit"
                placeholder="请输入金额"
                extra="元"
                onChange={value => {
                  let valuePrice = "";
                  let reg = /([0-9]+\.[0-9]{2})[0-9]*/;
                  valuePrice = value.replace(reg, "$1");
                  _this.setState({ price: valuePrice });
                }}
                value={this.state.price}
              >
                <span className={styles.requiredMark}>*</span>投标报价
              </InputItem>
              {url2params(this.props.location.search).tenderType == 2 ? null : (
                <InputItem
                  clear
                  placeholder="请输入供货周期(不超过180天)"
                  type="number"
                  extra="天"
                  onChange={value => {
                    let valueNumber = value;
                    if (valueNumber > 180) {
                      valueNumber = 180;
                    }
                    _this.setState({ cyle: valueNumber });
                  }}
                  value={this.state.cyle}
                >
                  &nbsp;&nbsp;供货周期
                </InputItem>
              )}

              <Upload parentIds={this.parentIds} />
            </List>
            <div style={{ color: "red", textAlign: "left" }}>
              {this.state.addStatus ? this.state.addStatusText : null}
            </div>
            <div
              style={{
                position: "fixed",
                bottom: "10px",
                width: "100%",
                padding: 10
              }}
            >
              <Button
                onClick={() => {
                  _this.onSubmit();
                }}
                type="primary"
              >
                确定添加
              </Button>
            </div>
          </Modal>
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
}))(createForm()(BidApproval), mapStateToProps);
