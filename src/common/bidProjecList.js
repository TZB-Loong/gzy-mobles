/**
 * 参数说明:
 * tenderType: 1 为材料 2为劳务
 * onOk: 接收数据的回调函数
 *
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
// import {getUrlParamBySearch} from '../../utils/utils'
import {
  List,
  Modal,
  Button,
  Flex,
  Radio,
  PullToRefresh,
  Toast,
  Result
} from "antd-mobile";
import { connect } from "dva";
import { isfalse } from "../utils/utils";
// import { createForm } from 'rc-form';
// import { district, provinceLite } from 'antd-mobile-demo-data';

const Item = List.Item;
const RadioItem = Radio.RadioItem;

class BidProjectList extends Component {
  state = {
    value: 1,
    visible: false,
    value: "",
    params: {
      tenderType: this.props.tenderType
    },
    data: [],
    refreshing: false,
    tenderList: [],
    checkedObject: [],
    showResult: false
  };

  getCurrentUserCorpProjectList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "common/queryAwaitOpenTenderList",
      payload: this.state.params
    }).then(() => {
      const { common } = this.props;
      let source = [];
      if (!isfalse(common.tenderList)) {
        common.tenderList.map((item, index) => {
          source.push({
            ...item
          });
        });
      }
      this.setState({
        tenderList: source,
        showResult: isfalse(source)
      });
    });
  };

  handleClick = (data, e) => {
    e.preventDefault(); // Fix event propagation on Android
    this.setState({
      show: data
    });
    if (data) {
      this.getCurrentUserCorpProjectList();
    }
  };

  onChange = (data, e) => {
    console.log("checkbox", data, e);
    this.setState({
      value: data.tenderId,
      checkedObject: data
    });
  };

  initiatorCheck(checkedObject, projectId) {
    //审批发起人检测
    let _this = this;
    const { dispatch } = this.props;
    dispatch({
      type: "common/initiatorCheck",
      payload: {
        projectId: projectId,
        processType: "approval"
      }
    }).then(() => {
      const { common } = this.props;
      if (!isfalse(common.initiatorCheck)) {
        if (common.initiatorCheck.flag == 1) {
          _this.props.onOK(checkedObject);
          _this.setState((state, props) => {
            return {
              show: false
            };
          });
        } else if (common.initiatorCheck.flag == 0) {
          Toast.offline("您没有该标的定标审批发起权限");
          return;
        }
      }
    });
  }
  sumbit = () => {
    //可能出现点击穿透
    let checkedObject = this.state.checkedObject;
    console.log(this.state.checkedObject);
    if (isfalse(this.state.checkedObject)) {
      Toast.info("请选择一个定标对象");
      return;
    }
    this.initiatorCheck(checkedObject, checkedObject.projectId);
  };

  render() {
    const { showResult } = this.state;
    return (
      <div>
        <List>
          <Item
            extra={
              this.state.checkedObject.projectName ? (
                this.state.checkedObject.projectName
              ) : this.props.projectName ? (
                this.props.projectName
              ) : (
                ""
              )
            }
            arrow="horizontal"
            multipleLine
            onClick={this.handleClick.bind(this, true)}
          >
            定标对象
          </Item>
        </List>
        <Modal
          popup
          visible={this.state.show}
          onClose={this.handleClick.bind(this, false)}
          animationType="slide-up"
        >
          <Flex
            style={{ background: "#fff", height: "100vh" }}
            direction="column"
          >
            <div style={{ width: "100vw", flex: "1", overflow: "auto" }}>
              {showResult ? (
                <Result
                  imgUrl={require("../assets/null.png")}
                  message={<div>暂无数据</div>}
                />
              ) : (
                <List
                  style={{
                    paddingBottom: "30px",
                    height: "100%",
                    overflow: "auto"
                  }}
                >
                  {this.state.tenderList.map(i => (
                    <RadioItem
                      key={i.tenderId}
                      checked={this.state.value == i.tenderId}
                      onChange={e => this.onChange(i)}
                    >
                      {i.projectName}
                      <List.Item.Brief>
                        招：
                        {i.tenderCategory}
                      </List.Item.Brief>
                    </RadioItem>
                  ))}
                </List>
              )}
            </div>
            <div style={{ width: "100vw" }}>
              <Flex style={{ width: "100%", borderTop: "1px solid #E0E0E0" }}>
                <div style={{ height: "45px", width: "40vw" }}>
                  <div
                    style={{ textAlign: "center", lineHeight: "45px" }}
                    onClick={() => {
                      this.setState({ show: false });
                    }}
                  >
                    取消
                  </div>
                </div>
                <div style={{ height: "45px", width: "60vw" }}>
                  <div
                    style={{
                      textAlign: "center",
                      lineHeight: "45px",
                      backgroundColor: "#4B85F8",
                      color: "#fff"
                    }}
                    onClick={this.sumbit}
                  >
                    确定
                  </div>
                </div>
              </Flex>
            </div>
          </Flex>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  //连接redux
  return {
    // common: state.common.tenderList
  };
}

// export default connect(mapStateToProps)(BidProjectList);
export default connect(({ common }) => ({
  common
}))(BidProjectList, mapStateToProps);
