import React, { Component } from 'react';
export default class Empty extends Component {
  state = {
    msg:'',
  };
  componentDidMount() {
    this.setState({
      msg:this.props.msg,
    })
  }
  render() {
    return (
        <div className="emptyData">
          <img src={require('../image/empty.png')} alt="" />
          {"暂无"+this.state.msg+"数据..."}
        </div>
    );
  }
}
