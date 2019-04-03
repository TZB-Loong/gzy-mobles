import React, { Component } from "react";
import { connect } from "dva";
import { List } from "antd-mobile";
import { Link } from "dva/router";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";
const Item = List.Item;
const Brief = Item.Brief;

class startProcess extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {}

  render() {
    let _this = this;
    const data = [];
    return (
      <ReactDocumentTitle title="发起审批">
        <List className="my-list">
          <Item
            arrow="horizontal"
            thumb={
              <img
                src={require("../../image/material.png")}
                style={{ width: "50px", height: "50px" }}
              />
            }
            multipleLine
            onClick={() => {
              _this.props.history.push("/bidApproval/bidApproval?tenderType=1");
            }}
          >
            <div>
              材料定标审批 <Brief>适用于材料员向管理上级汇报投标情况并定标</Brief>
            </div>
          </Item>
          <Item
            arrow="horizontal"
            thumb={
              <img
                src={require("../../image/labour.png")}
                style={{ width: "50px", height: "50px" }}
              />
            }
            multipleLine
            onClick={() => {
              _this.props.history.push("/bidApproval/bidApproval?tenderType=2");
            }}
          >
            <div>
              劳务定标审批 <Brief>适用于材料员向管理上级汇报投标情况并定标</Brief>
            </div>
          </Item>
          <Item
            arrow="horizontal"
            thumb={
              <img
                src={require("../../image/pay.png")}
                style={{ width: "50px", height: "50px" }}
              />
            }
            multipleLine
            onClick={() => {
              _this.props.history.push("/payApproval");
            }}
          >
            <div>
              支付审批 <Brief>适用于项目各种支出的费用申请</Brief>
            </div>
          </Item>
        </List>
      </ReactDocumentTitle>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(startProcess);
