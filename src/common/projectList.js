
/**
 * 需求分析
 * 1,默认都没有选择
 * 2,支持单选(不支持多选)
 * 3,点击时开始请求数据
 * 4,点击按钮永远在最后
 */

 /**
  * onOk: 接收数据的回调函数
  */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {getUrlParamBySearch} from '../../utils/utils'
import { List, Modal, Button, Flex, Radio, PullToRefresh,Toast,Result } from 'antd-mobile';
import { connect } from "dva";
import { isfalse } from '../utils/utils';
// import { createForm } from 'rc-form';
// import { district, provinceLite } from 'antd-mobile-demo-data';

const Item = List.Item;
const RadioItem = Radio.RadioItem;


class ProjectList extends Component {
  state = {
    visible: false,
    value: '',
    params: {
      current: '1',
      size: '10'
    },
    data: [],
    refreshing: false,
    total: 0,
    checkedValue:'',
    showResult:false,
  }


  getCurrentUserCorpProjectList = (type) => {
    console.log(this.props, 'this.props')
    const { dispatch } = this.props;
    dispatch({
      type: 'common/getCurrentUserCorpProjectList',
      payload: this.state.params
    }).then(() => {
      const { common } = this.props;
      let source = []
      if (!isfalse(common)) {
        if (!isfalse(common.projectList.records)) {
          common.projectList.records.map((item, index) => {
            source.push({
              ...item,
              value: item.projectName,
              label: item.projectName,
              extra: 'extra',
              key: index
            })
          })
        }
        this.setState({
          total: common.total,
          showResult:isfalse(source)
        })
      }
      if (type == "refresh") {
        this.setState({
          data: this.state.data.concat(source)
        })
      } else {
        this.setState({
          data: source
        })
      }
    })
  }


  handleClick = (data, e) => {
    if (data) {
      this.getCurrentUserCorpProjectList();
    }
    this.setState({
      show: data,
    });

  }

  onChange = (data) => { //单选中时
    this.setState({
      value:data.id,
      checkedValue:data
    });
  }
  initiatorCheck(checkedValue, projectId){ //审批发起人检测
    let _this = this;
    const {dispatch} = this.props;
    dispatch({
      type:'common/initiatorCheck',
      payload:{
        projectId: projectId,
        processType:'payment'
      }
    }).then(()=>{
      const {common} = this.props;
      if(!isfalse(common.initiatorCheck)){
        if(common.initiatorCheck.flag==1){
          _this.props.onOK(checkedValue)
          _this.setState((state, props) => {
            return {
              show: false,
            }
          });
        }else if(common.initiatorCheck.flag==0){
          Toast.offline('您没有该项目的支付审批发起权限')
          return
        }
      }
    })
  }
  sumbit = () => { //确定
    if(isfalse(this.state.checkedValue)){
      Toast.info('请选择一个项目',1)
      return
    }
    const {checkedValue} = this.state;
    this.initiatorCheck(checkedValue, checkedValue.id)
    console.log('000',checkedValue)
  }

  refresh = () => { //刷新重新请求
    let params = this.state.params;
    if (this.state.total - params.current * 10 > 0) {
      this.setState({
        params: Object.assign({}, params, { current: params.current * 1 + 1 })
      }, () => {
        this.getCurrentUserCorpProjectList('refresh')
      })
    } else {
      this.setState({
        refreshing: false
      })
    }
  }

  render() {
    const {showResult} = this.state;
    return (<div>
      <List>
        <Item extra={this.state.checkedValue.projectName ? this.state.checkedValue.projectName : this.props.projectName ? this.props.projectName : ''} arrow="horizontal" multipleLine onClick={this.handleClick.bind(this, true)}>
          <span style={{ color: '#EE7356', fontSize: 15, paddingRight: 4, fontWeight: '900' }}>*</span>选择项目
          </Item>
      </List>
      <Modal popup visible={this.state.show} onClose={this.handleClick.bind(this, false)} animationType="slide-up">
        <Flex style={{ background: "#fff", height: "100vh" }} direction="column">
          <div
            style={{ width: '100vw', flex: '1', overflow: 'auto',}}
          >
            {showResult?(
              <Result
                imgUrl={require("../assets/null.png")}
                message={<div>暂无数据</div>}
              />
            ) :
              <PullToRefresh
                distanceToRefresh={25}
                // damping={60}
                // ref={el => this.ptr = el}
                style={{
                  height: '100%',
                  overflow: 'auto',
                }}
                direction={this.state.down ? 'down' : 'up'}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.refresh()
                  this.setState({ refreshing: true });
                  setTimeout(() => {
                    this.setState({ refreshing: false });
                  }, 1000);
                }}
              >
                <List style={{ paddingBottom: '20px'}}>
                  {this.state.data.map(i => (
                    <RadioItem
                      key={i.id}
                      checked={this.state.value == i.id}
                      onChange={(e) => this.onChange(i)}
                    >
                      {i.label}
                      {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                    </RadioItem>
                  ))}
                </List>
              </PullToRefresh>
            }
          </div>
          <div style={{ width: '100vw' }}>
          <Flex style={{ width: "100%", borderTop: "1px solid #E0E0E0" }}>
            <div style={{ height: "45px", width: "40vw" }}>
              <div
                style={{ textAlign: "center", lineHeight: "45px" }}
                onClick={()=>{this.setState({show: false})}}
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
    </div>)
  }

}

function mapStateToProps(state) { //连接redux
  return {
    // common: state.common.projectList
  }
}

// export default connect(mapStateToProps)(ProjectList);
export default connect(({ common }) => ({
  common
}))(ProjectList, mapStateToProps);
