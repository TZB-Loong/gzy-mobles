import React, {Component} from 'react';
import {
  connect
} from 'dva';

import styles from './index.less';

import Main from '../../layouts/main.jsx';
import UserCenter from './userCenter'
import UserInfo from './userIfon'
import {Route, Switch, Redirect} from 'react-router-dom';

class Index extends Component {

  componentDidMount() {
    console.log(this)
  };
  render() {
    const {example,match} = this.props
    return (
      <Main location={this.props.location}>
        <div className={styles.normal}>
          <Switch>
            <Route exact path={`${match.url}`} component={UserCenter} />
            <Route exact path={`${match.url}/products`} component={UserInfo} />
          </Switch>
        </div>
      </Main>
    );
  }
}
function mapStateToProps(state) {
  console.log(state)
  return {};
}

export default connect(({ example }) => ({example}))(Index,mapStateToProps);
