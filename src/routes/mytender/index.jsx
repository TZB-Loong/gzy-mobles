import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

import {
  connect
} from 'dva';

import styles from './index.less';

import Main from '../../layouts/main.jsx';
import Mytender from './mytenter'
import Detail from './detail'
class Index extends Component {

  componentDidMount() {
    console.log(this)
  };
  render() {
    const {tender,match} = this.props
    return (
        <div>
          <Switch>
            <Route exact path={`${match.url}`} component={Mytender} />
            <Route exact path={`${match.url}/detail`} component={Detail} />
          </Switch>
        </div>
    );
  }
}
function mapStateToProps(state) {
  console.log(state)
  return {};
}

export default connect(({ tender }) => ({tender}))(Index,mapStateToProps);
