import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import {
  List,
  ListView,
  Flex,
  PullToRefresh,
  Button,
  Toast,
  Result
} from "antd-mobile";
import { isfalse } from "../../utils/utils";
import styles from "./style.less";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";
const Item = List.Item;
const Brief = Item.Brief;

class WaitProcessList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: true,
      height: document.documentElement.clientHeight,
      loading: false,
      totalPages: 0,
      params: {
        current: 1, // 当前页数
        size: 10 // 每页显示记录条数
      }
    };
  }
  componentDidMount() {
    this.querydata();
  }
  componentWillUnmount() {
    Toast.hide();
  }
  querydata = () => {
    const { dispatch } = this.props;
    console.log(this.props);
    this.setState({ loading: true });
    dispatch({
      type: "waitProcessModel/fetch",
      payload: this.state.params
    }).then(() => {
      const { waitProcessModel } = this.props;
      this.setState({ loading: false });
      if (!isfalse(waitProcessModel.TodoTaskList)) {
        let TodoTaskList = waitProcessModel.TodoTaskList;
        console.log(TodoTaskList);
        this.setState({
          totalPages: TodoTaskList.total ? TodoTaskList.total : 1,
          data: this.state.data.concat(TodoTaskList.records)
        });
      }
    });
  };

  refresh = () => {
    //刷新重新请求
    let params = this.state.params;
    if (this.state.totalPages - params.current * 10 > 0) {
      this.setState(
        {
          params: Object.assign({}, params, { current: params.current * 1 + 1 })
        },
        () => {
          this.querydata();
          this.setState({ refreshing: true });
          setTimeout(() => {
            this.setState({ refreshing: false });
          }, 1000);
        }
      );
    } else {
      this.setState({
        refreshing: false
      });
    }
  };

  callback(key) {
    console.log(key);
  }
  goApproval(item, content) {
    let bizCode;
    let goUrl = "";
    let bidurl =
      (item.bizObjCode == "material" ? (bizCode = 1) : (bizCode = 2)) +
      "&saveType=1" +
      "&orderId=" +
      item.processInstId +
      "&taskId=" +
      item.currentTaskId +
      "&projectId=" +
      item.projectId +
      "&processCode=" +
      item.processCode +
      "&calibrationId=" +
      item.bizObjId;
    let payUrl =
      item.bizObjId +
      "&orderId=" +
      item.processInstId +
      "&taskId=" +
      item.currentTaskId +
      "&projectId=" +
      item.projectId +
      "&processCode=" +
      item.processCode +
      (item.bizObjCode == "material" ? "&tenderType=1" : "&tenderType=2");
      
    if (item.isTurnDown == 1 && item.processName == "定标审批") {
      if (item.firstTask == true) {
        goUrl = "#/bidApproval/bidApproval?tenderType=" + bidurl;
      } else {
        goUrl = "#/bidApproval/waitBidApproval?tenderType=" + bidurl;
      }
    } else if (item.isTurnDown != 1 && item.processName == "定标审批") {
      goUrl = "#/bidApproval/waitBidApproval?tenderType=" + bidurl;
    } else if (item.isTurnDown == 1 && item.processName == "支付审批") {
      if (item.firstTask == true) {
        goUrl = "#/payApproval?aprvId=" + payUrl;
      } else {
        goUrl = "#/payApproval/waitProcess?aprvId=" + payUrl;
      }
    } else if (item.isTurnDown != 1 && item.processName == "支付审批") {
      goUrl = "#/payApproval/waitProcess?aprvId=" + payUrl;
    } else {
      return;
    }
    return (window.location.href = goUrl);
  }
  render() {
    let _this = this;
    const { waitProcessModel, loading } = this.props;
    let { data } = this.state;
    let bizCode;
    return (
      <ReactDocumentTitle title="待审批">
        <div className={styles.waitProcessList}>
          <div>
            {data.length > 0 ? (
              <PullToRefresh
                damping={60}
                ref={el => (this.ptr = el)}
                style={{
                  height: this.state.height,
                  overflow: "auto"
                }}
                direction={"up"}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.refresh();
                }}
              >
                <List>
                  {data.map(function(item, index) {
                    return (
                      <Item
                        key={index}
                        thumb={
                          <div
                            className={styles.itemAvatar}
                            style={{
                              backgroundColor:
                                item.processName == "支付审批"
                                  ? "#F29D39"
                                  : "#4B85F8"
                            }}
                          >
                            {item.processName == "支付审批" ? "支" : "定"}
                          </div>
                        }
                        onClick={() => {
                          _this.goApproval(item, item.projectName);
                        }}
                        //arrow="horizontal"
                      >
                        <Flex justify="between">
                          <div style={{ color: "#1890ff" }}>
                            {item.processName}
                          </div>
                          <span>
                            <div style={{ textAlign: "left" }}>
                              {item.isTurnDown == 1 ? (
                                <span className={styles.flowError}>被驳回</span>
                              ) : item.processState == 1 ? (
                                <span className={styles.flowProceed}>审批中</span>
                              ) : item.processState == 2 ? (
                                <span className={styles.flowSucceed}>已完成</span>
                              ) : (
                                ""
                              )}
                            </div>
                          </span>
                        </Flex>
                        <span style={{ color: "#333" }}>
                          {item.projectName}
                        </span>
                        <Brief style={{ marginTop: 0 }}>
                          <Flex justify="between">
                            <div
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}
                            >
                              {item.title}
                            </div>
                          </Flex>
                        </Brief>
                      </Item>
                    );
                  })}
                </List>
              </PullToRefresh>
            ) : (
              <Result
                style={{ display: _this.state.loading ? "none" : null }}
                imgUrl={require("../../assets/null.png")}
                message={<div>暂无数据</div>}
              />
            )}
          </div>
        </div>
      </ReactDocumentTitle>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(({ waitProcessModel }) => ({ waitProcessModel }))(
  WaitProcessList,
  mapStateToProps
);
