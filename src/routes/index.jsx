import React, {Component} from 'react';
import {
  connect
} from 'dva';

import styles from './index.less';
import Main from '../layouts/main.jsx';
import ApprovalProgress from '../components/ApprovalProgress.jsx';
import Upload from '../common/upload.jsx';
import {Route, Switch, Redirect} from 'react-router-dom';

class Index extends Component {

  componentDidMount() {
    console.log(this)
  };
  getServerid =(id)=>{
    console.log(id)
  }
  render() {
    return (
      <Main  location={this.props.location}>
        <div className={styles.normal}>
        </div>
        <ApprovalProgress />
        <Upload parentIds={(id)=>this.getServerid(id)}/>
      </Main>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Index);
