import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import {
  List,
  ListView,
  Flex,
  Button,
  TextareaItem,
  Toast,
  Accordion
} from "antd-mobile";
import { createForm } from "rc-form";
import Opinion from "../../common/opinion.jsx";
import ViewResult from "../../common/viewFiles.js";
import ApprovalProgress from "../../components/ApprovalProgress.jsx"; // 审批流程
import { isfalse, url2params } from "../../utils/utils";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";

import styles from "./style.less";

const Item = List.Item;
const Brief = Item.Brief;

class WaitProcess extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      params: {
        aprvId: url2params(this.props.location.search).aprvId,
        orderId: ""
      },
      approvalParams: {
        aprvId: url2params(this.props.location.search).aprvId,
        orderId: url2params(this.props.location.search).orderId,
        projectId: url2params(this.props.location.search).projectId,
        taskId: url2params(this.props.location.search).taskId,
        content: ""
      }
    };
  }

  componentDidMount() {
    let propsData = url2params(this.props.location.search);
    console.log(propsData);
    const { dispatch } = this.props;
    dispatch({
      type: "payApproval/queryPayment",
      payload: this.state.params
    }).then(() => {
      console.log(this.props.payApproval.payDetails);
    });
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    let { payApproval } = this.props;
    let { payDetails } = payApproval;
    let { approvalParams } = this.state;
    return (
      <ReactDocumentTitle title="支付审批">
        <div className={styles.waitProcess}>
          {payDetails && payDetails.payment ? (
            <div>
              <List style={{ color: "#333" }}>
                <Item>{payDetails.payment.projectName}</Item>
                <Accordion>
                  <Accordion.Panel header="审批流程">
                    <div>
                      <ApprovalProgress
                        processCode={
                          url2params(this.props.location.search).processCode
                        }
                        orderId={url2params(this.props.location.search).orderId}
                        projectId={
                          url2params(this.props.location.search).projectId
                        }
                      />
                    </div>
                  </Accordion.Panel>
                </Accordion>
                <Item
                  extra={
                    <label>
                      {payDetails.payment.bizType == 1 ? "材料支出" : ""}
                      {payDetails.payment.bizType == 2 ? "劳务支出" : ""}
                      {payDetails.payment.bizType == 3 ? "其它" : ""}
                    </label>
                  }
                >
                  支出类型
                </Item>
                <Item
                  extra={
                    <label>
                      {payDetails.payment.moneyType == 1 ? "预付款" : ""}
                      {payDetails.payment.moneyType == 2 ? "进度款" : ""}
                      {payDetails.payment.moneyType == 3 ? "结算款" : ""}
                      {payDetails.payment.moneyType == 4 ? "质保金" : ""}
                      {payDetails.payment.moneyType == 5 ? "完工款" : ""}
                      {payDetails.payment.moneyType == 6 ? "零星费用" : ""}
                      {payDetails.payment.moneyType == 7 ? "其它" : ""}
                    </label>
                  }
                >
                  费用类型
                </Item>
                <Item extra={payDetails.payment.payMoney + "元"}>支付金额</Item>
                <Item
                  extra={
                    <label>
                      {payDetails.payment.payCertificate == 1 ? "增值税专用发票" : ""}
                      {payDetails.payment.payCertificate == 2 ? "增值税普通发票" : ""}
                      {payDetails.payment.payCertificate == 3 ? "收据" : ""}
                      {payDetails.payment.payCertificate == 4 ? "其它" : ""}
                    </label>
                  }
                >
                  付款凭证
                </Item>
              </List>
              <List renderHeader={() => "本次收到发票情况"} style={{ color: "#333" }}>
                {payDetails.payment.payCertificate == 1 ||
                payDetails.payment.payCertificate == 2 ? (
                  <div>
                    <Item
                      extra={
                        (payDetails.payment.taxRate
                          ? payDetails.payment.taxRate
                          : 0) + "%"
                      }
                    >
                      税率
                    </Item>
                    <Item
                      extra={
                        (payDetails.payment.priceAssessment
                          ? payDetails.payment.priceAssessment
                          : 0) + "元"
                      }
                    >
                      价额
                    </Item>
                    <Item
                      extra={
                        (payDetails.payment.taxAssessment
                          ? payDetails.payment.taxAssessment
                          : 0) + "元"
                      }
                    >
                      税额
                    </Item>
                    <Item
                      extra={
                        (payDetails.payment.adValorem
                          ? payDetails.payment.adValorem
                          : 0) + "元"
                      }
                    >
                      价税合计
                    </Item>
                  </div>
                ) : null}

                <Item extra={payDetails.payment.companyName}>收款单位名称</Item>
                <Item extra={payDetails.payment.bankName}>开户行名称</Item>
                <Item extra={payDetails.payment.bankAccount}>账号</Item>
                <TextareaItem
                  labelNumber={3}
                  disabled={true}
                  title={<span style={{ color: "#000" }}>备注：</span>}
                  value={payDetails.payment.remark}
                  rows={3}
                  style={{color: '#666'}}
                />
                <Item>
                  <div style={{ paddingBottom: 10 }}>附件</div>
                  <ViewResult
                    type={"PAYMENT_OTHER_FILE"}
                    sourceData={{
                      bizCode: "PAYMENT_FILE",
                      bizId: this.state.params.aprvId
                    }}
                  />
                </Item>
              </List>
              <div style={{ paddingBottom: 60 }} />
            </div>
          ) : null}
          <Opinion params={this.state.approvalParams} typeApproval={"pay"} />
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
}))(createForm()(WaitProcess), mapStateToProps);
