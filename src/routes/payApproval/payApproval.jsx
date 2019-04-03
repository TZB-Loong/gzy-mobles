import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import {
  List,
  ListView,
  Flex,
  InputItem,
  Switch,
  Button,
  Picker,
  TextareaItem,
  Toast,
  Accordion
} from "antd-mobile";
import { createForm } from "rc-form";
import ProjectList from "../../common/projectList.js";
import Upload from "../../common/upload";
import { isfalse, url2params } from "../../utils/utils";
import ApprovalProgress from "../../components/ApprovalProgress.jsx"; // 审批流程
import wx from "weixin-js-sdk";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";

import styles from "./style.less";

const Item = List.Item;
const Brief = Item.Brief;

class PayApproval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      value: 1,
      payCertificateStatus: "",
      params: {
        aprvId: url2params(this.props.location.search).aprvId,
        orderId: ""
      },
      detail: {},
      projectId: url2params(this.props.location.search).projectId,
      btnStatus: false,
      isShow: false
    };
  }
  queryPayment() {
    const { dispatch } = this.props;
    dispatch({
      type: "payApproval/queryPayment",
      payload: this.state.params
    }).then(() => {
      console.log(this.props.payApproval.payDetails);
      let payDetails = this.props.payApproval.payDetails;
      this.setState({
        detail: payDetails.payment ? payDetails.payment : {}
      });
      if (
        payDetails.payment &&
        payDetails.payment.payCertificate &&
        (payDetails.payment.payCertificate == 1 ||
          payDetails.payment.payCertificate == 2)
      ) {
        this.setState({
          isShow: true
        });
      }
    });
  }
  selectCertificate(e) {
    console.log(e);
    if (e == "1" || e == "2") {
      this.setState({
        isShow: true
      });
    } else {
      this.setState({
        isShow: false
      });
    }
  }
  componentDidMount() {
    // 被驳回的重新提交审批
    if (url2params(this.props.location.search).aprvId) {
      this.queryPayment();
      this.getReportAttachIds();
    }
    console.log(this.props);
  }
  onSubmit = () => {
    const { form, dispatch } = this.props;
    this.props.form.validateFields({ force: true }, (error, values) => {
      // values.adValorem = (Number(values.priceAssessment) +
      //   Number(values.taxAssessment)).toFixed(2);
      console.log(values);
      if (!error) {
        delete values.type1;
        if (isfalse(this.state.projectId)) {
          Toast.fail("请选择项目");
        }
        values.projectId =
          this.state.projectId ||
          (this.state.detail ? this.state.detail.projectId : null);
        values.projectName =
          this.state.projectName ||
          (this.state.detail ? this.state.detail.projectName : null);
        console.log(this.props.form.getFieldsValue());
        if (values.bizType) {
          values.bizType = values.bizType[0];
        }
        if (values.moneyType) {
          values.moneyType = values.moneyType[0];
        }
        if (values.payCertificate) {
          values.payCertificate = values.payCertificate[0];
        }
        if (this.state.otherFile) {
          values.otherFile = this.state.otherFile;
        }
        // 价税总额
        if (values.priceAssessment && values.taxAssessment) {
          values.adValorem = (Number(values.priceAssessment) +
            Number(values.taxAssessment)).toFixed(2);
        }

        if (url2params(this.props.location.search).aprvId) {
          values.aprvId = url2params(this.props.location.search).aprvId;
        }
        if (url2params(this.props.location.search).orderId) {
          values.orderId = url2params(this.props.location.search).orderId;
        }
        if (url2params(this.props.location.search).taskId) {
          values.taskId = url2params(this.props.location.search).taskId;
        }
        console.log(values);
        this.setState({ btnStatus: true });
        dispatch({
          type: "payApproval/addPay",
          payload: values,
          callback: () => {
            console.log(this.props.payApproval.savePay.status);
            if (this.props.payApproval.savePay.status == "200") {
              Toast.success("提交成功");
              this.props.history.replace("/processCenter/startProcess");
            } else {
              Toast.fail(this.props.payApproval.savePay.msg);
            }
            this.setState({ btnStatus: false });
          }
        });
      }
    });
  };

  ProjectSelectionOK = data => {
    console.log(data, "123");
    this.setState({
      projectId: data.id,
      projectName: data.projectName
    });
  };
  parentIds = serverIds => {
    console.log(serverIds, "123");
    let Ids = serverIds.toString();
    let payFile = [
      { attachCode: "PAYMENT_OTHER_FILE", serverIds: Ids, attachIds: "" }
    ];
    let payOtherFile = JSON.stringify(payFile);
    this.setState({
      otherFile: payOtherFile
    });
  };

  // 查询附件
  getReportAttachIds() {
    this.props
      .dispatch({
        type: "common/queryAttachList",
        payload: {
          bizCode: "PAYMENT_FILE",
          bizId: url2params(this.props.location.search).aprvId
        }
      })
      .then(() => {
        let fileList = [],
          otherfileList = [];
        (this.props.common.attachList
          ? this.props.common.attachList.attachmentVOList
          : []).map((item, i) => {
          if (item.ctrlName == "PAYMENT_OTHER_FILE") {
            // 其它附件
            otherfileList.push({
              uid: item.id,
              fileType: item.fileType,
              name: item.originalFilename + "." + item.extention,
              url: item.fullFilename
            });
          }
        });
        this.setState({
          imgFile: otherfileList
        });
        console.log(otherfileList);
      });
  }
  // 显示图片样式
  seeImg(imgFile) {
    let _this = this;
    return imgFile.map(function(item, i) {
      return (
        <div
          key={i}
          onClick={() => {
            _this.previewImage(item.url);
          }}
          style={{
            width: 80,
            height: 100,
            overflow: "hidden",
            float: "left",
            cursor: "pointer",
            marginRight: 20
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
    let { payCertificateStatus, detail } = this.state;
    let { payDetails } = this.props.payApproval;
    const district = [
      {
        label: "1",
        value: 1
      }
    ];
    const bizTypeData = [
      {
        label: "材料支出",
        value: 1
      },
      {
        label: "劳务支出",
        value: 2
      },
      {
        label: "其它",
        value: 3
      }
    ];
    const moneyTypeData = [
      {
        label: "预付款",
        value: 1
      },
      {
        label: "进度款",
        value: 2
      },
      {
        label: "结算款",
        value: 3
      },
      {
        label: "质保金",
        value: 4
      },
      {
        label: "完工款",
        value: 5
      },
      {
        label: "零星费用",
        value: 6
      },
      {
        label: "其它",
        value: 7
      }
    ];
    const payCertificateData = [
      {
        label: "增值税专用发票",
        value: 1
      },
      {
        label: "增值税普通发票",
        value: 2
      },
      {
        label: "收据",
        value: 3
      },
      {
        label: "其它",
        value: 4
      }
    ];
    const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
    return (
      <ReactDocumentTitle title="支付审批">
        <div className={styles.payApproval}>
          <form>
            <List style={{ backgroundColor: "white" }}>
              <ProjectList
                onOK={this.ProjectSelectionOK}
                projectName={detail ? detail.projectName : ""}
              />

              {this.state.projectId ? (
                <Accordion>
                  <Accordion.Panel
                    header={
                      <span
                        style={{ fontSize: 15, color: "#666", paddingLeft: 5 }}
                      >
                        审批流程
                      </span>
                    }
                  >
                    <div>
                      <ApprovalProgress
                        processCode={
                          url2params(this.props.location.search).processCode ||
                          "payment"
                        }
                        orderId={url2params(this.props.location.search).orderId}
                        projectId={this.state.projectId}
                        start={
                          url2params(this.props.location.search).projectId ? (
                            ""
                          ) : (
                            "start"
                          )
                        }
                      />
                    </div>
                  </Accordion.Panel>
                </Accordion>
              ) : null}

              <Picker
                {...getFieldProps("bizType", {
                  initialValue: detail ? [detail.bizType] : "",
                  rules: [{ required: true, message: "请选择支出类型" }]
                })}
                data={bizTypeData}
                cols={1}
                error={!!getFieldError("bizType")}
                onErrorClick={() => {
                  alert(getFieldError("bizType").join("、"));
                }}
              >
                <List.Item arrow="horizontal">
                  <span className={styles.requiredMark}>*</span>支出类型
                </List.Item>
              </Picker>
              <div className={styles.error}>
                {getFieldError("bizType") && getFieldError("bizType").join(",")}
              </div>
              <Picker
                {...getFieldProps("moneyType", {
                  initialValue: detail ? [detail.moneyType] : "",
                  rules: [{ required: true, message: "请选择费用类型" }]
                })}
                data={moneyTypeData}
                cols={1}
                error={!!getFieldError("moneyType")}
                onErrorClick={() => {
                  alert(getFieldError("moneyType").join("、"));
                }}
              >
                <List.Item arrow="horizontal">
                  <span className={styles.requiredMark}>*</span>费用类型
                </List.Item>
              </Picker>
              <div className={styles.error}>
                {getFieldError("moneyType") &&
                  getFieldError("moneyType").join(",")}
              </div>
              <InputItem
                {...getFieldProps("payMoney", {
                  initialValue: detail ? detail.payMoney : "",
                  rules: [
                    { required: true, message: "请输入金额" },
                    {
                      pattern: /^(\d{0,8})(\d{0,8}\.\d{1,2})?$/,
                      message: "请输入亿位以下数字金额,精确到两位小数"
                    }
                  ]
                })}
                clear
                type="money"
                error={!!getFieldError("payMoney")}
                onErrorClick={() => {
                  alert(getFieldError("payMoney").join("、"));
                }}
                placeholder="请输入金额"
                extra="元"
              >
                <span className={styles.requiredMark}>*</span>支付金额
              </InputItem>
              <div className={styles.error}>
                {getFieldError("payMoney") &&
                  getFieldError("payMoney").join(",")}
              </div>

              <Picker
                {...getFieldProps("payCertificate", {
                  initialValue: detail ? [detail.payCertificate] : "",
                  rules: [{ required: true, message: "请选择付款凭证" }]
                })}
                data={payCertificateData}
                cols={1}
                error={!!getFieldError("payCertificate")}
                onErrorClick={() => {
                  alert(getFieldError("payCertificate").join("、"));
                }}
                onOk={value => {
                  this.setState({ payCertificateStatus: value });
                  this.selectCertificate(value ? value[0] : "");
                }}
              >
                <List.Item arrow="horizontal">
                  <span className={styles.requiredMark}>*</span>付款凭证
                </List.Item>
              </Picker>
              <div className={styles.error}>
                {payCertificateStatus ? null : (
                  getFieldError("payCertificate") &&
                  getFieldError("payCertificate").join(",")
                )}
              </div>
            </List>

            <List renderHeader={() => "本次收到发票情况"} className={styles.w_105}>
              {this.state.isShow ? (
                <div>
                  <InputItem
                    {...getFieldProps("taxRate", {
                      initialValue: detail ? detail.taxRate : "",
                      rules: [
                        { required: true, message: "请输入比例" },
                        {
                          pattern: /^(\d{0,3})(\d{0,3}\.\d{1,2})?$/,
                          message: "请输入合法数字"
                        }
                      ]
                    })}
                    clear
                    type="number"
                    error={!!getFieldError("taxRate")}
                    onErrorClick={() => {
                      alert(getFieldError("taxRate").join("、"));
                    }}
                    placeholder="请输入比例"
                    extra="%"
                  >
                    <span className={styles.requiredMark}>*</span>税率
                  </InputItem>
                  <div className={styles.error}>
                    {getFieldError("taxRate") &&
                      getFieldError("taxRate").join(",")}
                  </div>

                  <InputItem
                    {...getFieldProps("priceAssessment", {
                      initialValue: detail ? detail.priceAssessment : "",
                      rules: [
                        { required: true, message: "请输入金额" },
                        {
                          pattern: /^(\d{0,8})(\d{0,8}\.\d{1,2})?$/,
                          message: "请输入亿位以下数字金额,精确到两位小数"
                        }
                      ]
                    })}
                    type="money"
                    clear
                    error={!!getFieldError("priceAssessment")}
                    onErrorClick={() => {
                      alert(getFieldError("priceAssessment").join("、"));
                    }}
                    placeholder="请输入金额"
                    extra="元"
                  >
                    <span className={styles.requiredMark}>*</span>价额
                  </InputItem>
                  <div className={styles.error}>
                    {getFieldError("priceAssessment") &&
                      getFieldError("priceAssessment").join(",")}
                  </div>

                  <InputItem
                    {...getFieldProps("taxAssessment", {
                      initialValue: detail ? detail.taxAssessment : "",
                      rules: [
                        { required: true, message: "请输入金额" },
                        {
                          pattern: /^(\d{0,8})(\d{0,8}\.\d{1,2})?$/,
                          message: "请输入亿位以下数字金额,精确到两位小数"
                        }
                      ]
                    })}
                    type="money"
                    clear
                    error={!!getFieldError("taxAssessment")}
                    onErrorClick={() => {
                      alert(getFieldError("taxAssessment").join("、"));
                    }}
                    placeholder="请输入金额"
                    extra="元"
                  >
                    <span className={styles.requiredMark}>*</span>税额
                  </InputItem>
                  <div className={styles.error}>
                    {getFieldError("taxAssessment") &&
                      getFieldError("taxAssessment").join(",")}
                  </div>

                  <InputItem
                    {...getFieldProps("adValorem", {
                      initialValue: (Number(
                        getFieldValue("priceAssessment") || 0
                      ) + Number(getFieldValue("taxAssessment") || 0)).toFixed(
                        2
                      ),
                      rules: [{ required: true, message: "请输入金额" }]
                    })}
                    clear
                    type="money"
                    error={!!getFieldError("adValorem")}
                    onErrorClick={() => {
                      alert(getFieldError("adValorem").join("、"));
                    }}
                    placeholder="请输入金额"
                    extra="元"
                    disabled={true}
                    value={(Number(getFieldValue("priceAssessment") || 0) +
                      Number(getFieldValue("taxAssessment") || 0)).toFixed(2)}
                  >
                    <span className={styles.requiredMark}>*</span>价税合计
                  </InputItem>
                  <div className={styles.error}>
                    {getFieldError("adValorem") &&
                      getFieldError("adValorem").join(",")}
                  </div>
                </div>
              ) : null}

              <InputItem
                {...getFieldProps("companyName", {
                  initialValue: detail ? detail.companyName : "",
                  rules: [{ required: true, message: "请输入收款单位名称" }]
                })}
                clear
                error={!!getFieldError("companyName")}
                onErrorClick={() => {
                  alert(getFieldError("companyName").join("、"));
                }}
                placeholder="请输入收款单位名称"
              >
                <span className={styles.requiredMark}>*</span>收款单位名称
              </InputItem>
              <div className={styles.error}>
                {getFieldError("companyName") &&
                  getFieldError("companyName").join(",")}
              </div>

              <InputItem
                {...getFieldProps("bankName", {
                  initialValue: detail ? detail.bankName : "",
                  rules: [{ required: true, message: "请输入开户行名称" }]
                })}
                clear
                error={!!getFieldError("bankName")}
                onErrorClick={() => {
                  alert(getFieldError("bankName").join("、"));
                }}
                placeholder="请输入开户行名称"
              >
                <span className={styles.requiredMark}>*</span>开户行名称
              </InputItem>
              <div className={styles.error}>
                {getFieldError("bankName") &&
                  getFieldError("bankName").join(",")}
              </div>

              <InputItem
                {...getFieldProps("bankAccount", {
                  initialValue: detail ? detail.bankAccount : "",
                  rules: [{ required: true, message: "请输入账号" }]
                })}
                clear
                error={!!getFieldError("bankAccount")}
                onErrorClick={() => {
                  alert(getFieldError("bankAccount").join("、"));
                }}
                placeholder="请输入账号"
                type="bankCard"
              >
                <span className={styles.requiredMark}>*</span>账号
              </InputItem>
              <div className={styles.error}>
                {getFieldError("bankAccount") &&
                  getFieldError("bankAccount").join(",")}
              </div>
              {this.state.imgFile && this.state.imgFile.length > 0 ? (
                <Item>
                  <div style={{ paddingBottom: 10 }}>附件</div>
                  {this.seeImg(this.state.imgFile ? this.state.imgFile : [])}
                </Item>
              ) : (
                <Upload parentIds={this.parentIds} />
              )}
              <TextareaItem
                {...getFieldProps("remark",{
                  initialValue: detail ? detail.remark : ""
                })}
                labelNumber={3}
                title="备注："
                rows={3}
              />

              <Item>
                <Button
                  disabled={this.state.btnStatus}
                  type="primary"
                  onClick={this.onSubmit}
                >
                  提交审批
                </Button>
              </Item>
            </List>
          </form>
        </div>
      </ReactDocumentTitle>
    );
  }
}
function mapStateToProps() {
  return {};
}

export default connect(({ payApproval, common }) => ({
  payApproval,
  common
}))(createForm()(PayApproval), mapStateToProps);
