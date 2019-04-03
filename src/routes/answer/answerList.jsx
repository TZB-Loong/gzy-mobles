import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "dva";
import wx from "weixin-js-sdk";
import {
  List,
  ListView,
  Flex,
  PullToRefresh,
  Accordion,
  Card,
  Button,
  TextareaItem,
  Icon,
  Modal,
  InputItem,
  Checkbox,
  Toast,
  Result
} from "antd-mobile";
import { isfalse } from "../../utils/utils";
import Upload from "../../common/upload";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";

import styles from "./style.less";

var newDate = new Date();
const Item = List.Item;
const Brief = Item.Brief;

class AnswerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      height: document.documentElement.clientHeight,
      answerModal: false,
      totalPages: 0,
      params: {
        current: 1, // 当前页数
        size: 5, // 每页显示记录条数
        tenderId: "",
        tenderType: ""
      },
      previewVisible: false,
      previewImage: "",
      refreshing: false,
      dataSource: [],
      btnStatus: false,
      loading: false,
    };
  }
  // 请求列表数据
  queryTenderQuestionByPage() {
    const { dispatch } = this.props;
    Toast.loading('Loading...')
    this.setState({loading:true})
    dispatch({
      type: "answerModal/queryTenderQuestionByPage",
      payload: this.state.params
    }).then(() => {
      const { questionByPage, questionByPageList } = this.props.answerModal;
      Toast.hide()
      this.setState({loading:false})

      if (!isfalse(questionByPage) && !isfalse(questionByPageList)) {
        this.setState({
          dataSource: this.state.dataSource.concat(questionByPageList),
          totalPages: questionByPage.total ? questionByPage.total : 1
        });
      }
    });
  }
  componentDidMount() {
    this.queryTenderQuestionByPage();
  }
  componentWillUnmount(){
    Toast.hide();
  }

  //   项目块
  answerItem(item) {
    return (
      <div>
        <div
          style={{
            padding: 15,
            fontSize: 16,
            marginBottom: 15,
            backgroundColor: "#ECECEC"
          }}
        >
          <div style={{ color: "#333757", paddingBottom: 5 }}>
            项目名称：
            {item.projectName}
          </div>
          <span style={{ color: "#333757" }}>招：</span>
          <span style={{ color: "#666" }}>{item.tenderTitle}</span>
          <span style={{ color: "#6BBE39", marginLeft: 30 }}>
            {item.stateText}
          </span>
        </div>
        {item.questionRecords && item.questionRecords.length > 0 ? (
          this.questionRecords(item.questionRecords)
        ) : (
          <div>暂无数据</div>
        )}
      </div>
    );
  }

  //   问题块
  questionRecords(questionRecords) {
    let _this = this;
    return questionRecords.map(function(item, index) {
      return (
        <div
          key={index}
          style={{
            marginBottom: 30,
            borderBottom: "1px solid #E0E0E0",
            display: item.type == 0 ? null : "none"
          }}
        >
          <div style={{ padding: "0px 15px" }}>
            <div>
              <div style={{ marginBottom: 15 }}>
                <div>
                  <span style={{ fontSize: 16 }}>问：</span>
                  <span>{item.questionContent}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    color: "#666",
                    justifyContent: "space-between"
                  }}
                >
                  <div style={{ paddingTop: 5, fontSize: 15 }}>
                    <span style={{ marginRight: 10 }}>
                      {item.questionNickName}
                      {item.id}
                    </span>
                    <span>
                      {moment(item.questionTime).format("MM月DD日 HH:mm")}
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      _this.setState({
                        answerModal: true,
                        answerForId: item.id,
                        fileIds: ""
                      });
                    }}
                  >
                    回复
                  </div>
                </div>
              </div>
              {_this.records(item.records)}
            </div>
          </div>
        </div>
      );
    });
  }
  //   答复块
  records(records) {
    let _this = this;
    return records.map(function(item, index) {
      return (
        <div key={index} style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              borderBottom:
                records.length == index + 1 ? null : "1px dashed #dcdcdc",
              paddingBottom: 15
            }}
          >
            <div style={{ maxWidth: 35 }}>
              <span style={{ fontSize: 16 }}>答：</span>
            </div>
            <div style={{ flex: 1 }}>
              {/*<div
                style={{
                  padding: 10,
                  backgroundColor: "#E6F7FF",
                  marginBottom: 20
                }}
              >
                <span style={{ color: "#999999" }}>
                  {moment(item.answerTime).format("MM月DD日 HH:mm")}
                </span>
                <span style={{ color: "#4B85F8", marginLeft: 10 }}>
                  {item.nickName}
                </span>
              </div>*/}
              <div>{item.answerContent}</div>
              {item.answerPic ? (
                <div style={{ minHeight: 100, marginTop: 20 }}>
                  {_this.seeImg(item.answerPic)}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    });
  }

  // 显示图片样式
  seeImg(imgFile) {
    let _this = this;
    let answerPic = (imgFile ? imgFile : "").split(";");
    return answerPic.map(function(item, i) {
      return (
        <div
          key={i}
          onClick={() => {
            _this.previewImage(item);
          }}
          style={{
            width: 80,
            height: 100,
            overflow: "hidden",
            float: "left",
            cursor: "pointer",
            marginRight: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span style={{ display: "block" }}>
            <img
              style={{ width: "100%", height: "100%" }}
              src={item + "?x-oss-process=image/resize,w_100"}
            />
          </span>
        </div>
      );
    });
  }
  previewImage(img) {
    //图片预览
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    });
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
          this.queryTenderQuestionByPage();
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

  onSubmit() {
    let that = this;
    const { dispatch } = this.props;
    if (isfalse(this.state.TextAreaId)) {
      this.setState({ addStatus: true, addStatusText: "请填写回复" });
      return;
    }
    let bodyData = {
      answerForId: this.state.answerForId,
      answerContent: this.state.TextAreaId,
      answerPicAttachIds: this.state.fileIds,
      isOpen: this.state.isOpenId ? 1 : 0,
      answerPic: ""
    };
    this.setState({ btnStatus: true });
    dispatch({
      type: "answerModal/saveReply",
      payload: bodyData
    }).then(() => {
      const { saveAnswer } = this.props.answerModal;
      this.setState({ btnStatus: false });
      if (saveAnswer) {
        let params = that.state.params;
        that.setState(
          {
            params: Object.assign({}, params, { current: 1 }),
            answerModal: false
          },
          () => {
            that.queryTenderQuestionByPage();
            that.setState({ refreshing: true });
            setTimeout(() => {
              that.setState({ refreshing: false });
            }, 1000);
          }
        );
      }
    });
  }

  parentIds = serverIds => {
    this.setState({
      fileIds: serverIds.toString()
    });
  };
  render() {
    let _this = this;
    let { totalPages, previewVisible, previewImage, dataSource } = this.state;
    let { answerModal } = this.props;
    let { questionByPage, questionByPageList } = answerModal;
    return (
      <ReactDocumentTitle title="招标答疑">
        <div className={styles.answer}>
          {questionByPageList.length > 0 ? (
            <PullToRefresh
              direction="up"
              style={{
                height: this.state.height,
                overflow: "auto"
              }}
              onRefresh={() => {
                this.refresh();
              }}
              refreshing={this.state.refreshing}
            >
              <List>
                {(questionByPageList ? questionByPageList : []).map(function(
                  item,
                  index
                ) {
                  return (
                    <div style={{ fontSize: 15 }} key={index}>
                      {_this.answerItem(item)}
                    </div>
                  );
                })}
              </List>
            </PullToRefresh>
          ) : (
            <Result
              style={{display: _this.state.loading ? 'none' : null}}
              imgUrl={require("../../assets/null.png")}
              message={<div>暂无数据</div>}
            />
          )}
          <Modal visible={this.state.answerModal}>
            <div style={{ padding: 5, textAlign: "left" }}>
              <div style={{ marginBottom: 5 }}>
                <TextareaItem
                  onChange={value => {
                    _this.setState({ TextAreaId: value });
                  }}
                  placeholder="回复内容"
                  rows={5}
                />
              </div>
              <Upload parentIds={this.parentIds} />
              <div style={{ padding: 10 }}>
                <Checkbox
                  onChange={e => {
                    this.setState({ isOpenId: e.target.checked });
                  }}
                >
                  &nbsp; 在招标页面公开此问题及答复
                </Checkbox>
              </div>
            </div>
            <div style={{ color: "red", textAlign: "left" }}>
              {this.state.addStatus ? this.state.addStatusText : null}
            </div>
            <div
              style={{
                position: "fixed",
                bottom: "10px",
                width: "100%",
                padding: 10
              }}
            >
              <Button
                onClick={() => {
                  _this.onSubmit();
                }}
                type="primary"
                disabled={this.state.btnStatus}
              >
                回复
              </Button>
            </div>
          </Modal>
        </div>
      </ReactDocumentTitle>
    );
  }
}
function mapStateToProps() {
  return {};
}

export default connect(({ answerModal }) => ({
  answerModal
}))(AnswerList, mapStateToProps);
