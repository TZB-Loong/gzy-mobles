import React, { Component } from 'react';
import { Flex, Button } from 'antd-mobile';
import { onTrialUrl } from '../../confingPath'

export default class BootPage extends Component {

  jumpUrl =()=>{
    window.location.href=onTrialUrl
  }

  render() {
    return (
      <Flex direction="column" style={{ backgroundColor: '#fff', height: "100vh", color: "#666", fontSize: '15px' }}>
        <div style={{ height: '20vh', lineHeight: '20vh', fontWeight: '700', fontSize: "16px" }}>暂无权限</div >
        <div style={{ height: '20vh', marginTop: '20px', lineHeight: '20px' }}>&nbsp;&nbsp;您还未购买采购云，暂无<br />登录权限。您可以点击“申请试<br />用”或联系客服 400-101-1718<br />进行购买产品。谢谢!</div>
        <div style={{ height: '40vh' }}>
          <Button type="primary" style={{ width: '120px' }}  onClick={this.jumpUrl}>
              申请试用
          </Button></div>
        <div style={{ textAlign: 'center', height: '20vh', display: 'flex', flexDirection: 'column-reverse', paddingBottom: '20px' }}>
          <span>
            Copyright©<br />2018 深圳建科网络科技有限公司 2015-2018<br />all rights resreved
        </span>
        </div>
      </Flex>
    )
  }
}
