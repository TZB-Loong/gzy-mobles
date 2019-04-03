/**
 * 首页
 */

import { Flex, Card, List, WhiteSpace, Grid, Badge } from 'antd-mobile';
import React, { Component } from 'react'
import { connect } from "dva";
import { routerRedux, Link } from 'dva/router';
import { isfalse, timestampToTime } from '../../utils/utils';
import { requestUrl } from '../../confingPath'
import styles from './style.less';
import Main from '../../layouts/main.jsx';
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";
class MemberIndex extends Component {

  state = {
    dataSource: {}
  }

  componentDidMount = () => {
    this.getQuantityStatistics();
  }


  getQuantityStatistics = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "common/getQuantityStatistics",
      payload: {}
    }).then(() => {
      const { indexData } = this.props;
      this.setState({
        dataSource: indexData
      })
      // console.log(indexData,'this.props')
    })
  }
  creatData = () => {

    let data = [{
      icon: require('../../image/shuju.png'),
      text: <span>数据统计</span>,
      url: '/projectStatistics'
    }, {
      icon: require('../../image/gunli.png'),
      text: <span>子账号管理</span>,
      url: '/accountChild/accountChild'
    },
    {
      icon: require('../../image/xinxi.png'),
      text: <span>消息中心</span>,
      url: '/infoCenter/infoCenterList'
    },
    {
      icon: require('../../image/zhao.png'),
      text: <span>我的招标</span>,
      url: '/mytender'
    }, {
      icon: require('../../image/xunjia.png'),
      text: <span>我的询价</span>,
      url: requestUrl + '/wechat-page/index.html#/purchaseList'
    }, {
      icon: require('../../image/dayi.png'),
      text: <span>招标答疑</span>,
      url: '/answer/answerList'
    }, {
      icon: require('../../image/03x.png'),
      text: <span>材料商管理</span>,
      url: '/materialList'
    }, {
      icon: require('../../image/rengong.png'),
      text: <span>劳务商管理</span>,
      url: '/labourList'
    }, {
      icon: require('../../image/shenpi.png'),
      text: <span>待审批</span>,
      url: '/processCenter/waitProcessList'
    }, {
      icon: require('../../image/dierzhu.png'),
      text: <span>发起审批</span>,
      url: '/processCenter/startProcess'
    }, {
      icon: require('../../image/shen.png'),
      text: <span>已审批</span>,
      url: '/processCenter/doneProcessList'
    },{
      icon:require('../../image/faqi.png'),
      text:<span>我发起</span>,
      url:'/processCenter/myProcessList'
    }
  ]

    return data;
  }

  render() {
    const { dataSource } = this.state;
    return (
      <ReactDocumentTitle title="会员中心">
      <Main location={this.props.location}>
      <div style={{color:'#666'}}>
        {
          // isfalse(dataSource) ? null :
            <div>
              <Card full style={{ backgroundColor: "#343755" }}>
                <Card.Body style={{ paddingTop: 20}}>
                  <Flex>
                    <Flex.Item style={{ color: '#fff', flex: '0.3', textAlign: 'center' }}>
                    <img src={(isfalse(dataSource.user)?null:dataSource.user.userPic)||require('../../image/pic.png')} width="40" /></Flex.Item>
                    <Flex.Item style={{ color: '#fff' }}>
                      <div style={{marginBottom:5}}>{dataSource.user?dataSource.user.purchaseCompanyName:null}</div>
                      <div>{dataSource.user?dataSource.user.displayName:null} &nbsp;&nbsp;{dataSource.user?dataSource.user.userPhone:null}</div>
                    </Flex.Item>
                  </Flex>
                </Card.Body>
              </Card>
              <List className={styles.hiddenBorder}>
                <List.Item style={{padding:'15px 0'}}>
                  <Flex>
                    <Flex.Item style={{ textAlign: 'center'}}>
                      <div style={{ textAlign: 'center',fontSize:15 }}>
                        <div>进行中</div>
                        <Flex style={{ marginTop: '7px' }}>
                          <Flex.Item style={{ textAlign: 'center' }}>招标：
                            <Link to="/mytender?status=0">{dataSource.underWayTenderCount}</Link>
                          </Flex.Item>
                          <Flex.Item style={{ textAlign: 'center' }}>询价：
                          <a href={requestUrl + '/wechat-page/index.html#/purchaseList'}>{dataSource.underWayInquiryCount}</a>
                          </Flex.Item>
                        </Flex>
                      </div>
                    </Flex.Item>
                    <Flex.Item style={{ textAlign: 'center',fontSize:15 }}>
                      <div style={{ textAlign: 'center',borderLeft:'1px solid rgba(238, 238, 238, 0.77)'  }}>
                        <div>供应商</div>
                        <Flex style={{ marginTop: '7px' }}>
                          <Flex.Item style={{ textAlign: 'center' }}>材料：
                            <Link to="/materialList">{dataSource.materialSupplierCount}</Link>
                          </Flex.Item>
                          <Flex.Item style={{ textAlign: 'center' }}>劳务：
                            <Link to="/labourList">{dataSource.labourSupplierCount}</Link>
                          </Flex.Item>
                        </Flex>
                      </div>
                    </Flex.Item>
                  </Flex>
                </List.Item>
              </List>
              <WhiteSpace size='md' />
              <List className={styles.hiddenBorder}>
                <List.Item>
                  <Flex style={{ padding: '10px 0px',fontSize:15 }}>
                    <Flex.Item style={{ textAlign: 'center' }}>
                      <img src={require('../../image/zu.png')} />
                      <Link to="/processCenter/waitProcessList">&nbsp;&nbsp;待审批
                        <span className={styles.icontext}>
                          {/* {console.log(dataSource.todoTaskCount,'dataSource.todoTaskCount')} */}
                          <Badge text={dataSource.todoTaskCount} overflowCount="99"></Badge>
                          {/* {dataSource.todoTaskCount >= 99 ? '99+' : dataSource.todoTaskCount} */}
                        </span>
                      </Link>
                    </Flex.Item>
                    <Flex.Item style={{ textAlign: 'center' }}>
                      <img src={require('../../image/123x.png')} />
                      <Link to="/mytender?status=1">&nbsp;&nbsp;待开标
                        <span className={styles.icontext}>
                          <Badge text={dataSource.waitOpenTenderCount} overflowCount="99"></Badge>
                          {/* {dataSource.waitOpenTenderCount >= 99 ? '99+' : dataSource.waitOpenTenderCount} */}
                        </span>
                      </Link>
                    </Flex.Item>
                  </Flex>
                </List.Item>
              </List>
              <WhiteSpace size='md' />
              <div><Grid data={this.creatData()} className={styles.pagesPath} onClick={_el => {
                _el.url.indexOf('http') > -1 ? window.location.href = _el.url : this.props.dispatch(
                  routerRedux.push({
                    pathname: _el.url,
                  })
                );
              }
              } activeStyle={false} hasLine={false} /></div>
            </div>
        }
      </div>
      </Main>
      </ReactDocumentTitle>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state,'material')
  return {
    indexData: state.common.indexData
  };
}

export default connect(mapStateToProps)(MemberIndex)

