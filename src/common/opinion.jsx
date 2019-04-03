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
  Modal
} from "antd-mobile";
import { createForm } from "rc-form";

import styles from "./opinion.less";

const Item = List.Item;
const Brief = Item.Brief;

class Opinion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      params: this.props.params,
      content: "",
      modal: false,
      type: "0",
      btnStatus: false
    };
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    console.log(this.props.params);
  }
  onSubmit() {
    console.log(this.state.type);
    if (this.state.content == "") {
      Toast.info("审批意见不能为空");
      return;
    }
    let paramsData = Object.assign({}, this.state.params, {
      content: this.state.content
    });
    console.log(paramsData);
    if (this.props.typeApproval == "pay") {
      // 支付审批
      this.payApproval(paramsData);
    }
    if (this.props.typeApproval == "bid") {
      // 定标审批
      this.bidApproval(paramsData);
    }
  }

  // 支付审批
  payApproval(paramsData) {
    const { dispatch } = this.props;
    this.setState({ btnStatus: true });
    let api =
      this.state.type == 0
        ? "payApproval/sendApproval"
        : "payApproval/sendApprovalNo";
    dispatch({
      type: api,
      payload: paramsData
    }).then(() => {
      const { payApproval: { sendStatus } } = this.props;
      if (sendStatus) {
        Toast.success("提交成功");
        window.history.back();
      }
      this.setState({ btnStatus: false });
    });
  }
  // 定标审批
  bidApproval(paramsData) {
    const { dispatch } = this.props;
    this.setState({ btnStatus: true });
    let api =
      this.state.type == 0
        ? "bidApproval/sendCalibration"
        : "bidApproval/backCalibration";
    dispatch({
      type: api,
      payload: paramsData
    }).then(() => {
      const { bidApproval: { sendStatus } } = this.props;
      if (sendStatus) {
        Toast.success("提交成功");
        window.history.back();
      }
      this.setState({ btnStatus: false });
    });
  }

  onClose() {
    this.setState({ modal: false });
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div className={styles.opinion}>
        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            zIndex: 9,
            backgroundColor: "#f5f5f9"
          }}
        >
          {/*<Flex>
            <Flex.Item>
              <Button
                onClick={() => {
                  this.setState({ modal: true, type: "1" });
                }}
              >
                不同意
              </Button>
            </Flex.Item>
            <Flex.Item>
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ modal: true, type: "0" });
                }}
              >
                同意
              </Button>
            </Flex.Item>
          </Flex>*/}
          <Flex>
            <div style={{ width: "40vw" }}>
              <Button
                onClick={() => {
                  this.setState({ modal: true, type: "1" });
                }}
              >
                不同意
              </Button>
            </div>
            <div style={{ width: "60vw" }}>
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ modal: true, type: "0" });
                }}
              >
                同意
              </Button>
            </div>
          </Flex>
        </div>
        <Modal
          popup
          visible={this.state.modal}
          onClose={() => {
            this.onClose();
          }}
          animationType="slide-up"
        >
          <TextareaItem
            onChange={value => {
              this.setState({ content: value });
            }}
            title="审批意见："
            rows={5}
          />
          <Button
            disabled={this.state.btnStatus}
            style={{borderRadius: "0px"}}
            type="primary"
            onClick={() => {
              this.onSubmit();
            }}
          >
            提交
          </Button>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps() {
  return {};
}

export default connect(({ payApproval, bidApproval }) => ({
  payApproval,
  bidApproval
}))(createForm()(Opinion), mapStateToProps);
