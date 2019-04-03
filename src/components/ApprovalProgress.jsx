import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import { Steps, WingBlank, WhiteSpace, Icon } from "antd-mobile";
import { isfalse, timestampToTime } from "./../utils/utils";
const Step = Steps.Step;
import styles from "./approval.less";

class Approval extends Component {
  state = {
    approvals: [],
    projectId: this.props.projectId
  };
  queryProcessTracking() {
    const { dispatch } = this.props;
    dispatch({
      type: "common/queryProcessTracking",
      payload: {
        processCode: this.props.processCode,
        orderId: this.props.orderId,
        projectId: this.props.projectId,
        bizObjId: this.props.bizObjId,
        bizObjCode: this.props.bizObjCode
      }
      // payload: this.state.params,
    }).then(() => {
      let { flowRecordList } = this.props.common;
      console.log(flowRecordList);
      let source = [];
      (flowRecordList.approvals ? flowRecordList.approvals : []).map(item => {
        source.push({
          userDisplayName: item.operator, //审批人
          portrait: item.portrait, //审批人头像
          operateTime: item.operateTime, //审批时间
          result: item.result == 0 ? "同意" : "", //审批结果 0同意 1不同意
          resultNo: item.result == 1 ? "不同意" : "", //审批结果 0同意 1不同意
          resultsInt: item.result,
          content: item.content, //审批意见
          taskName: item.taskName, //节点显示名称
          taskCode: item.taskCode, //节点名称 (manager,boss)
          isStart: item.isStart
        });
      });
      source = source.concat(
        flowRecordList.lstTaskNodeLeave ? flowRecordList.lstTaskNodeLeave : []
      );
      if (this.props.start == "start") {
        source = flowRecordList.nodes ? flowRecordList.nodes : [];
      }
      this.setState({
        approvals: source
      });
    });
  }
  // 选择项目时
  componentWillReceiveProps(nextProps) {
    if (nextProps.projectId != this.state.projectId) {
      this.setState({ projectId: nextProps.projectId }, () => {
        this.queryProcessTracking();
      });
    }
  }
  componentDidMount() {
    console.log(this);
    this.queryProcessTracking();
  }
  status(resultsInt, index, isStart, operateTime) {
    let dom = "";
    if (resultsInt == 0 && index > 0) {
      console.log(isStart);
      if (isStart == 1) {
        return <span className={styles.flowStart}>重新发起</span>;
      } else {
        return <span className={styles.agree}>同意</span>;
      }
    }
    if (resultsInt == 0 && index == 0) {
      return <span className={styles.flowStart}>发起</span>;
    }
    if (resultsInt == 1 && index > 0) {
      return <span className={styles.disagree}>不同意</span>;
    }
    if (isfalse(operateTime)) {
      return <span className={styles.flowStart}>待审批</span>;
    }
  }
  render() {
    let _this = this;
    const { approvals } = this.state;

    return (
      <Steps current={1} className={styles.stepsCon}>
        {approvals.map((item, index) => {
          return (
            <Step
              key={index}
              title={
                <div style={{ color: isfalse(item.operateTime) ? "#999" : "" }}>
                  {item.taskName +
                    (item.taskCode == "end"
                      ? ""
                      : ":" + item.userDisplayName)}{" "}
                  {item.taskCode == "end" || this.props.start == "start" ? (
                    ""
                  ) : (
                    _this.status(
                      item.resultsInt,
                      index,
                      item.isStart,
                      item.operateTime
                    )
                  )}
                </div>
              }
              description={
                <div>
                  <small className={styles.time}>{item.operateTime}</small>
                  {isfalse(item.operateTime) ||
                  (index > 0 && item.isStart == 1) ? null : (
                    index > 0 ? <div className={styles.opinion}>意见：{item.content}</div> : ''
                  )}
                </div>
              }
              status={isfalse(item.operateTime) ? "wait" : "finish"}
              icon={
                item.taskCode == "end" ? (
                  <img
                    style={{ width: 22, height: 22 }}
                    src={require("../image/jianhao.png")}
                  />
                ) : (
                  <Icon type="check-circle" />
                )
              }
            />
          );
        })}
      </Steps>
    );
  }
}
function mapStateToProps() {
  return {};
}
export default connect(({ common }) => ({
  common
}))(Approval, mapStateToProps);
