import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import { List, Flex } from "antd-mobile";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";

import styles from "./style.less";
import { isfalse, url2params } from "../../utils/utils";

const Item = List.Item;
const Brief = Item.Brief;

class AccountChildView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      datasource: {},
      params: {
        userId: url2params(this.props.location.search).userId
      }
    };
  }

  showCorpMemberDetails() {
    const { dispatch } = this.props;
    console.log(this.state.params);
    dispatch({
      type: "AccountChildModel/showCorpMemberDetails",
      payload: this.state.params
    }).then(() => {
      let { CorpMembersDetails } = this.props.AccountChildModel;
      console.log(CorpMembersDetails);
      this.setState({
        datasource: CorpMembersDetails ? CorpMembersDetails : {}
      });
    });
  }
  componentDidMount() {
    console.log(this.props);
    this.showCorpMemberDetails();
  }

  render() {
    let { datasource } = this.state;
    return (
      <ReactDocumentTitle title="子账号详情">
        <div className={styles.accountChild}>
          <List>
            <Item extra={datasource.userName ? datasource.userName : "暂无"}>登录账户名</Item>
            <Item extra={datasource.nickName ? datasource.nickName : "暂无"}>姓名</Item>
            <Item extra={datasource.email ? datasource.email : "暂无"}>邮箱</Item>
            <Item extra={datasource.mobile ? datasource.mobile : "暂无"}>手机</Item>
            <Item extra={datasource.roleName ? datasource.roleName : "暂无"}>身份</Item>
            <Item extra={datasource.remark ? datasource.remark : "暂无"}>备注</Item>
          </List>
        </div>
      </ReactDocumentTitle>
    );
  }
}
function mapStateToProps() {
  return {};
}

export default connect(({ AccountChildModel }) => ({
  AccountChildModel
}))(AccountChildView, mapStateToProps);
