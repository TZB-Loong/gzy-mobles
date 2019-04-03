import React, { Component } from 'react';
import {
  Flex,
  List,
} from "antd-mobile";
import { connect } from "dva";
import { Link } from 'dva/router'
import styles from './index.less';
const Item = List.Item;
const Brief = Item.Brief;

class UserCenter extends Component {
  state = {
    refreshing: false,
    down: false,
    height: document.documentElement.clientHeight,
    data: [],
  };

  componentDidMount() {

  }
  onChange = (value) => {
    this.setState({ value });
  };
  clear = () => {
    this.setState({ value: '' });
  };

  creatItem = (data) => {

    return data.map((Item, index) => {

      return <Item
        key={index}
        arrow="horizontal"
        multipleLine
        onClick={() => { }}
      >
        广东马克菠萝材料有限公司
        <Brief>
          <div>联系人:马化腾</div>
          <div>联系人手机:138000091</div>
          <div>主营材料类别:木工</div>
          <div>最后编辑: 2018-10-12 10:29:22</div>
        </Brief>
      </Item>
    })
  }

  render() {

    return (
      <div className={styles.userCenter}>
        <div className={styles.userBanner}>
          <Flex>
            <Flex.Item style={{flex:.25}}><img src={require("../../assets/icon_nav_noti.png")}/></Flex.Item>
            <Flex.Item>
              <h3>深圳市建科网络科技有限公司</h3>
              <p>大龙猫 <small>13066668888</small></p>
            </Flex.Item>
          </Flex>
        </div>
        <div className={styles.userConst}>
          <div className="flex-container">
          <Flex>
            <Flex.Item>
                <p className="text-center">进行中</p>
              <Flex>
                <Flex.Item>招标：</Flex.Item>
                <Flex.Item>询价：</Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <p className="text-center">供应商</p>
              <Flex>
                <Flex.Item>材料：10</Flex.Item>
                <Flex.Item>劳务：10</Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
          </div>
        </div>
        <div className="separ"> 
          <Link to={'/processCenter/startProcess'}>
            发起审批
          </Link>
          <br />
          <Link to={'/processCenter/myProcessList'}>
            我发起的
          </Link>
          <br />
          <Link to={'/processCenter/waitProcessList'}>
            待审批
          </Link>
          <br />
          <Link to={'/processCenter/doneProcessList'}>
            已审批
          </Link>
        </div>
      </div>

    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(UserCenter);
