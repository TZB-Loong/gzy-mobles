import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "dva";
import { List, Flex, PullToRefresh, Badge, Result } from "antd-mobile";
import { isfalse, url2params } from "../../utils/utils";

import styles from "./style.less";

const Item = List.Item;
const Brief = Item.Brief;

class infoCenterView extends Component {
  constructor(props) {
    infoCenterView;
    super(props);

    this.state = {
      height: document.documentElement.clientHeight,
      isLoading: true,
      params: {
        type: url2params(this.props.location.search).type,
        current: 1, // 当前页数
        size: 10 // 每页显示记录条数
      },
      refreshing: false,
      dataSource: []
    };
  }
  messageList() {
    const { dispatch } = this.props;
    dispatch({
      type: "infoCenterModel/messageList",
      payload: this.state.params
    }).then(() => {
      let { messagePreview } = this.props.infoCenterModel;
      console.log(this.props.infoCenterModel.messagePreview);
      if (!isfalse(messagePreview)) {
        console.log(messagePreview);
        this.setState({
          dataSource: this.state.dataSource.concat(messagePreview.records ? messagePreview.records : []),
          totalPages: messagePreview.total ? messagePreview.total : 1
        });
      }
    });
  }
  componentDidMount() {
    console.log(this.props);
    this.messageList();
  }

  refresh = () => {
    //刷新重新请求
    let params = this.state.params;
    if (this.state.totalPages - params.current * 5 > 0) {
      this.setState(
        {
          params: Object.assign({}, params, { current: params.current * 1 + 1 })
        },
        () => {
          this.messageList();
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
  render() {
    let { messagePreview } = this.props.infoCenterModel;
    let { dataSource } = this.state;
    console.log(dataSource)
    return (
      <div className={styles.infoCenterView}>
        {dataSource && dataSource.length > 0 ? (
          <PullToRefresh
            direction="up"
            style={{
              height: this.state.height,
              overflow: "auto",
              backgroundColor: '#fff'
            }}
            onRefresh={() => {
              this.refresh();
            }}
            refreshing={this.state.refreshing}
          >
            <List>
              {dataSource.map((item, index) => {
                return (
                  <div key={index}>
                    <div style={{ textAlign: 'center' }}>
                      <span className={styles.timeStyle}>
                        {moment(item.createTime).format("YYYY.MM.DD HH:mm")}
                      </span>
                    </div>
                    <div className={styles.listItem}>
                      <div style={{ fontSize: 14, padding: "10px 0px" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 13 }}>{item.content}</div>
                    </div>
                  </div>
                );
              })}
            </List>
          </PullToRefresh>
        ) : (
          <Result
            imgUrl={require("../../assets/null.png")}
            message={<div>暂无数据</div>}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(({ infoCenterModel }) => ({
  infoCenterModel
}))(infoCenterView, mapStateToProps);
