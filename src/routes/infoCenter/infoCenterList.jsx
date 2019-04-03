import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import { routerRedux, Link } from 'dva/router';
import { List, Flex, PullToRefresh, Badge } from "antd-mobile";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";

import styles from "./style.less";

const Item = List.Item;
const Brief = Item.Brief;

class infoCenterList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      params: {
        type: '',
        current: 1, // 当前页数
        size: 10, // 每页显示记录条数
      },
    };
  }

  componentDidMount() {
    console.log(this.props);
    const { dispatch } = this.props;
    dispatch({
      type: "infoCenterModel/queryMessagePreview"
    }).then(() => {
      console.log(this.props.infoCenterModel.messagePreview);
    });

    dispatch({
      type: "infoCenterModel/messageList",
      payload: this.state.params,
    }).then(() => {
      console.log(this.props.infoCenterModel.messagePreview);
    });
  }

  render() {
    let { messagePreview } = this.props.infoCenterModel;
    return (
      <ReactDocumentTitle title="消息中心">
        <div className={styles.infoCenterList}>
            <List>
              <Item
                thumb={require('../../image/info.png')}
                //extra={<Badge text={77} overflowCount={55} />}
                onClick={()=>{return (window.location.href = "#/infoCenter/infoCenterView?type=1");}}
              >
                <span>系统消息</span>
                <Brief style={{marginTop: 0}}>
                  <Flex justify="between">
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {messagePreview.systemMessage ? (
                        messagePreview.systemMessage.content
                      ) : (
                        "暂无系统消息"
                      )}
                    </div>
                  </Flex>
                </Brief>
              </Item>
              <Item
                thumb={require('../../image/bidInfo.png')}
              // extra={<Badge text={77} overflowCount={55} />}
                onClick={()=>{return (window.location.href = "#/infoCenter/infoCenterView?type=3");}}
              >
                <span style={{ fontWidth: 600 }}>审批消息</span>
                <Brief style={{marginTop: 0}}>
                  <Flex justify="between">
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {messagePreview.approvalMessage ? (
                        messagePreview.approvalMessage.content
                      ) : (
                        "暂无审批消息"
                      )}
                    </div>
                  </Flex>
                </Brief>
              </Item>
            </List>
        </div>
      </ReactDocumentTitle>
    );
  }
}
infoCenterList.propTypes = {
  location: PropTypes.object.isRequired
};

function mapStateToProps() {
  return {};
}

export default connect(({ infoCenterModel }) => ({
  infoCenterModel
}))(infoCenterList, mapStateToProps);
