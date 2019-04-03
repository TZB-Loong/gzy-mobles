import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {
  connect
} from 'dva';

import styles from './page02.less';

import Main from '../layouts/main.jsx';

class Page02 extends Component {

  componentDidMount() {
    console.log(this)
    const {dispatch} = this.props;
    dispatch({type: 'wechatinit/clear'});
  };
  changeData=()=>{
    console.log(this)
    const {dispatch} = this.props;
    dispatch(mapStateToProps());
  }
  render() {
    const {wechatinit} = this.props
    return (
      <Main location={this.props.location}>
        <div>
          <div className={styles.normal} onClick={this.changeData}>
            <div>Route Component: Page03 <br/>
              点击我{wechatinit.message}</div>
          </div>
          <div>{console.log(wechatinit)}</div>
        </div>
    </Main>)
  }
}

function mapStateToProps(text) {
  return {type: 'wechatinit/getMsg',text};
}
export default connect(({ wechatinit }) => ({wechatinit}))(Page02,mapStateToProps);
