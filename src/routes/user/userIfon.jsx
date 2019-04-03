import React, { Component } from 'react';
import {
  SearchBar,
  PullToRefresh,
  ListView,
  Card,
  WhiteSpace,
  List,
  Flex
} from "antd-mobile";
import { connect } from "dva";
import { Link } from 'dva/router'
import styles from './index.less';
const Item = List.Item;
const Brief = Item.Brief;

class UserCenter2 extends Component {
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
  creatItem = (data) => {
    return data.map((Item, index) => {
      return <Item
        key={index}
        arrow="horizontal"
        multipleLine
        onClick={() => { }}
      >
        广东马克菠萝材料有限公司222
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
      <div>
        <List className={styles.listExtra}>
          <Item extra={<Link to={'/addSupplier?tenderType=1'}>+</Link>}>
            <SearchBar
              placeholder="搜索公司名称/联系人/手机号"
              onFocus={() => console.log('onFocus')}
              onChange={this.onChange}
              style={{width:'90%'}}
            />
          </Item>
        </List>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(UserCenter2);
