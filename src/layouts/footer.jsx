import PropTypes from 'prop-types';
import {
  TabBar
} from 'antd-mobile';
import {
  connect
} from 'dva';
import {
  routerRedux
} from 'dva/router';
import styles from './footer.less';
import React, {Component} from 'react';
import {requestUrl} from '../confingPath'
class Footer extends Component {
  state = {};
  componentDidMount() {
    // console.log(this.props)
  }

  render() {
    const {childrens, dispatch, location} = this.props;
    return (
      <div className={styles.normal}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={false}
        >
          <TabBar.Item
            title="找材料"
            key="找材料"
            icon={
              <div style={{
                width: '26px',
                height: '20px',
                background: 'url('+require('../image/navicon/jk_bar1-1.png')+') center center / contain  no-repeat'
              }}
              />
            }
            selectedIcon={
              <div style={{
                width: '26px',
                height: '20px',
                background: 'url('+require('../image/navicon/jk_bar1.png')+') center center / contain  no-repeat'
              }}
              />
            }
            // selected={location.pathname === '/'}
            // onPress={() => dispatch(routerRedux.push('/'))}
            onPress={() => window.location.href=requestUrl+'/wechat/material/index'}
            data-seed="cailiao"
          >
            {childrens}
          </TabBar.Item>
          <TabBar.Item
            title="找劳务"
            key="找劳务"
            icon={
              <div style={{
                width: '26px',
                height: '20px',
                background: 'url('+require('../image/navicon/jk_bar2-1.png')+') center center / contain  no-repeat'
              }}
              />
            }
            selectedIcon={
              <div style={{
                width: '26px',
                height: '20px',
                background: 'url('+require('../image/navicon/jk_bar2.png')+') center center / contain  no-repeat'
              }}
              />
            }
            // selected={location.pathname.indexOf('/index') > -1}
            // onPress={() => dispatch(routerRedux.push('/index'))}
            onPress={() => window.location.href=requestUrl+'/wechatlabour/index'}
            data-seed="laowu"
          >
            {childrens}
          </TabBar.Item>
          <TabBar.Item
            title="招投标"
            key="招投标"
            icon={
              <div style={{
                width: '26px',
                height: '20px',
                background: 'url('+require('../image/navicon/jk_bar3-1.png')+') center center / contain  no-repeat'
              }}
              />
            }
            selectedIcon={
              <div style={{
                width: '26px',
                height: '20px',
                background: 'url('+require('../image/navicon/jk_bar3.png')+') center center / contain  no-repeat'
              }}
              />
            }
            // selected={location.pathname.indexOf('/page02') > -1}
            // onPress={() => dispatch(routerRedux.push('/page02'))}
            onPress={() => window.location.href=requestUrl+'/wmtender/index'}
            data-seed="zhaotoubiao"
          >
            {childrens}
          </TabBar.Item>
          <TabBar.Item
            title="询价宝"
            key="询价宝"
            icon={
              <div style={{
                width: '26px',
                height: '20px',
                background: 'url('+require('../image/navicon/jk_bar4-1.png')+') center center / contain  no-repeat'
              }}
              />
            }
            selectedIcon={
              <div style={{
                width: '26px',
                height: '20px',
                background: 'url('+require('../image/navicon/jk_bar4.png')+') center center / contain  no-repeat'
              }}
              />
            }
            // selected={location.pathname.indexOf('/user') > -1}
            onPress={() => window.location.href=requestUrl+'/wechat-page/index.html#/enquiry_list'}
            data-seed="xunjia"
          >
            {childrens}
          </TabBar.Item>

          <TabBar.Item
            title="会员中心"
            key="会员中心"
            icon={
              <div style={{
                width: '26px',
                height: '20px',
                background: 'url('+require('../image/navicon/jk_bar5-1.png')+') center center / contain  no-repeat'
              }}
              />
            }
            selectedIcon={
              <div style={{
                width: '26px',
                height: '20px',
                background: 'url('+require('../image/navicon/jk_bar5.png')+') center center / contain  no-repeat'
              }}
              />
            }
            selected={location.pathname.indexOf('/') > -1}
            onPress={() => dispatch(routerRedux.push('/index'))}
            data-seed="wode"
          >
          {/* {console.log(location,'location')} */}
            {childrens}
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Footer);
