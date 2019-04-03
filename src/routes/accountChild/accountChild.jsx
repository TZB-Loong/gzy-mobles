import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import { List, Flex } from "antd-mobile";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";

import styles from "./style.less";

const Item = List.Item;
const Brief = Item.Brief;

class AccountChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      datasource: []
    };
  }

  showCorpMembersList() {
    const { dispatch } = this.props;
    dispatch({
      type: "AccountChildModel/showCorpMembers"
    }).then(() => {
      let { membersList } = this.props.AccountChildModel;
      console.log(membersList);
      this.setState({
        datasource: membersList ? membersList : []
      });
    });
  }
  componentDidMount() {
    console.log(this.props);
    this.showCorpMembersList();
  }

  jumpClick=(data)=>{ //路径跳转
    window.location.href="#/accountChild/accountChildView?userId=" + data
  }

  render() {
    let { datasource } = this.state;
    let { membersList } = this.props.AccountChildModel;
    return (
      <ReactDocumentTitle title="子账号管理">
        <div className={styles.accountChild}>
          <List>
            {(membersList ? membersList : []).map((item, index) => {
              return (
                <Item key={index}
                  arrow="horizontal"
                  extra={item.mobile}
                  onClick={()=>this.jumpClick(item.userId)}
                  >
                    {item.nickName}
                </Item>
              );
            })}
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
}))(AccountChild, mapStateToProps);
