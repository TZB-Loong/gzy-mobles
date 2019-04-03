import React, { Component } from "react";
import {
  SearchBar,
  PullToRefresh,
  WhiteSpace,
  List,
  Flex,
  Toast,
  Result,
  Icon
} from "antd-mobile";
import { connect } from "dva";
import { Link } from "dva/router";
import styles from "./style.less";
import { isfalse, timestampToTime } from "../../utils/utils";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";
const Item = List.Item;
const Brief = Item.Brief;

class MaterialList extends Component {
  state = {
    refreshing: false,
    down: false,
    height: document.documentElement.clientHeight,
    dataSource: [],
    show: false,
    params: {
      current: "1",
      size: "10"
    },
    total: 0,
    current: 0,
    changeInput: "",
    materialCategoryData: [],
    isSelectedAll: false,
    showTabs: 1,
    date: "",
    showResult: false,
    activeIcon: false,
  };

  componentDidMount() {
    this.queryMaterialSupplierList();
    this.getMaterialCategoryData();
  }
  componentWillReceiveProps(nextProps) {
    //监听this.props的改变
    if (nextProps.loading) {
      Toast.loading("Loading...", 30, () => { });
    } else {
      Toast.hide();
    }
  }
  componentWillUnmount(){
    // console.log('90900')
    Toast.hide();
  }

  queryMaterialSupplierList = type => {
    //查询数据(列表)
    const { dispatch } = this.props;
    dispatch({
      type: "supplier/queryMaterialSupplierList",
      payload: this.state.params
    }).then(() => {
      const { materialList } = this.props;
      this.setState({
        showResult: isfalse(materialList.records)
      });
      if (type == "refresh") {
        this.setState({
          dataSource: this.state.dataSource.concat(materialList.records)
        });
      } else {
        this.setState({
          dataSource: materialList.records,
          total: materialList.total
        });
      }
    });
  };

  getMaterialCategoryData = () => {
    //查询数据(主营材料的数据)
    const { dispatch } = this.props;
    dispatch({
      type: "supplier/getMaterialCategoryData",
      payload: {}
    }).then(() => {
      const { materialCategoryData } = this.props;
      let categorrData = [];
      materialCategoryData.map(item => {
        categorrData.push({
          ...item,
          isActive: false
        });
      });
      this.setState({
        materialCategoryData: categorrData
      });
      // console.log(materialCategoryData,'materialCategoryData')
    });
  };

  refresh = () => {
    //刷新重新请求
    let params = this.state.params;
    if (this.state.total - params.current * 10 > 0) {
      this.setState(
        {
          params: Object.assign({}, params, { current: params.current * 1 + 1 })
        },
        () => {
          this.queryMaterialSupplierList("refresh");
          this.setState({ refreshing: true });
          setTimeout(() => {
            this.setState({ refreshing: false });
          }, 1000);
        }
      );
    } else {
      this.setState({
        refreshing: false
      });
    }
  };

  queryConditions = params => {
    //筛选
    //需要筛选的值(data)
    console.log(params, '--0--params')
    let oldParams = this.state.params;
    let newParams = {};
    if (isfalse(oldParams.queryConditions)) {
      //第一次进行筛选
      newParams = Object.assign({}, this.state.params, {
        queryConditions: JSON.stringify([params])
      });
    } else {
      //第二次进行筛选
      let firstQueryConditions = JSON.parse(oldParams.queryConditions);

      firstQueryConditions.map((item, index) => {
        if (item.fieldName == params.fieldName) {
          firstQueryConditions.splice(index, 1);
        }
      });
      firstQueryConditions.push(params);
      newParams = Object.assign({}, this.state.params, {
        queryConditions: JSON.stringify(firstQueryConditions)
      });
    }

    this.setState(
      //筛选调用
      {
        params: newParams
      },
      () => {
        console.log(this.state.params);
        this.queryMaterialSupplierList();
      }
    );
  };

  onChange = value => {
    //在输入框变化时(在之前进行过查询之后,回退到没值时,发出数据查询请求)
    this.setState(
      {
        changeInput: value.target.value
      },
      () => {
        const { changeInput, params } = this.state;
        if (isfalse(changeInput)) {
          if (!isfalse(params.queryConditions)) {
            let newParams = JSON.parse(params.queryConditions);
            newParams.map(item => {
              if (item.fieldName == "keyword") {
                if (!isfalse(item.fieldValue)) {
                  let params = {
                    fieldName: "keyword",
                    fielType: 5,
                    fieldValue: ""
                  };
                  this.queryConditions(params);
                }
              }
            });
          }
        }
      }
    );
  };

  creatItem = data => {
    //创建列表
    return data.map((item, index) => {
      return (
        <Item key={index} arrow="horizontal" multipleLine onClick={() => { }}>
          <Link to={"/materialDetails?materialTenderId=" + item.id}>
            <span style={{ color: "#4B85F8" }}>{item.name}</span>
            <Brief>
              <div>
                联系人:
                {isfalse(item.supplierContactList)
                  ? null
                  : JSON.parse(item.supplierContactList)[0].contactName}
              </div>
              <div>
                联系人手机:
                {isfalse(item.supplierContactList)
                  ? null
                  : JSON.parse(item.supplierContactList)[0].phone}
              </div>
              <div className={styles.List}>
                <span className={styles.listTitleSpan}>主营材料类别:</span>
                {isfalse(item.materialClassOneText)
                  ? null
                  : item.materialClassOneText.split(",").map((item, index) => {
                    return (
                      <span key={index} className={styles.litsSpan}>
                        {item}
                      </span>
                    );
                  })
                  // item.materialType
                }
              </div>
              <div>最后编辑: {timestampToTime(item.modifyTime, "HM")} </div>
            </Brief>
          </Link>
        </Item>
      );
    });
  };

  totalSelection = () => {
    //全选
    let materialCategoryData = this.state.materialCategoryData;
    materialCategoryData.map(item => {
      item.isActive = false;
    });
    this.setState({
      isSelectedAll: !this.state.isSelectedAll,
      materialCategoryData
    });
  };

  selectedClick = index => {
    //单选
    let materialCategoryData = this.state.materialCategoryData;
    materialCategoryData[index].isActive = !materialCategoryData[index]
      .isActive;
    this.setState({
      materialCategoryData,
      isSelectedAll: false
    });
  };

  visableChange = type => {
    this.setState({
      show: true,
      showTabs: type
    });
  };

  handleClick = (data, type) => {
    //点击主营材料时触发以及回车
    // e.preventDefault();
    let { materialCategoryData, isSelectedAll } = this.state;
    let params = {};
    if (type == 1) {
      //重置时
      materialCategoryData.map(item => {
        item.isActive = false;
      });
      isSelectedAll = false;
      params = {
        fieldName: "materialType",
        fieldValue: "",
        fielType: 5
      };
      this.queryConditions(params);
    } else if (type == 2) {
      //确定时
      let value = [];
      materialCategoryData.map(item => {
        if (item.isActive) {
          value.push(item.id);
        }
      });
      params = {
        fieldName: "materialType",
        fieldValue: value.toString(),
        fielType: 5
      };
      this.queryConditions(params);
    }
    this.setState({
      show: data,
      activeIcon: !isfalse(params.fieldValue), //筛选时,图标的变化
      materialCategoryData,
      isSelectedAll
    });
  };

  mainMaterial = data => {
    return (
      <div style={{ height: "70vh" }}>
        <Flex direction="column" style={{ width: "100%", height: "100%" }}>
          <div
            style={{
              width: "100%",
              flex: "1",
              padding: "10px 10px",
              overflow: "auto"
            }}
          >
            <span
              className={
                this.state.isSelectedAll
                  ? styles.pullSelected
                  : styles.pullItemText
              }
              onClick={this.totalSelection}
            >
              全部
            </span>
            {data.map((item, index) => {
              return (
                <span
                  key={index}
                  className={
                    item.isActive ? styles.pullSelected : styles.pullItemText
                  }
                  onClick={this.selectedClick.bind(this, index)}
                >
                  {item.name}
                </span>
              );
            })}
          </div>
          <Flex style={{ width: "100%", borderTop: "1px solid #E0E0E0" }}>
            <div style={{ height: "45px", width: "40vw" }}>
              <div
                style={{ textAlign: "center", lineHeight: "45px" }}
                onClick={this.handleClick.bind(this, false, 1)}
              >
                重置
              </div>
            </div>
            <div style={{ height: "45px", width: "60vw" }}>
              <div
                style={{
                  textAlign: "center",
                  lineHeight: "45px",
                  backgroundColor: "#4B85F8",
                  color: "#fff"
                }}
                onClick={this.handleClick.bind(this, false, 2)}
              >
                完成
              </div>
            </div>
          </Flex>
        </Flex>
      </div>
    );
  };

  searchClick = () => {
    //点击搜索时响应的函数

    const { changeInput } = this.state;
    if (!isfalse(changeInput)) {
      let params = {
        fieldName: "keyword",
        fielType: 5,
        fieldValue: changeInput
      };
      this.queryConditions(params);
    }
  };

  eliminateClick = () => {
    //清除点击响应函数(当没有发送过请求时,点击清除是不需要进行数据请求)
    const { changeInput, params } = this.state;
    if (!isfalse(changeInput)) {
      if (!isfalse(params.queryConditions)) {
        let newParams = JSON.parse(params.queryConditions);
        newParams.map(item => {
          if (item.fieldName == "keyword") {
            if (!isfalse(item.fieldValue)) {
              let params = {
                fieldName: "keyword",
                fielType: 5,
                fieldValue: ""
              };
              this.queryConditions(params);
            }
          }
        });
      }
    }
  };

  sortClick = type => {
    //点击排序
    let params = this.state.params;
    this.setState(
      {
        params: Object.assign({}, params, {
          orderBy: "createTime",
          orderType: type
        })
      },
      () => {
        this.queryMaterialSupplierList();
      }
    );
  };

  render() {
    const { dataSource, showResult } = this.state;
    return (
      <ReactDocumentTitle title="材料商列表">
      <div>
        <List className={styles.listExtra}>
          <div
            className={styles.searchList}
            style={{ borderBottom: "1px solid #ddd" }}
          >
            <Item className={this.state.show ? styles.listTitlePull : ""}>
              <span className={styles.addIcon}>
                <Link to={"/addSupplier?tenderType=1"}>+</Link>
              </span>
              <Flex className={styles.searchDiv}>
                <span onClick={this.searchClick}>
                  <img src={require("../../image/Search.png")} />
                </span>
                <input
                  placeholder="搜索公司名称/联系人/手机号"
                  onChange={this.onChange}
                  value={this.state.changeInput}
                />
              </Flex>
              {/* <SearchBar
                placeholder="搜索公司名称/联系人/手机号"
                onChange={this.onChange}
                style={{ width: "90%" }}
                onClear={this.eliminateClick}
                onCancel={this.searchClick}
                onSubmit={this.searchClick}
                cancelText="搜索"
                showCancelButton={true}
              /> */}
            </Item>
          </div>
          <div>
            <div className={this.state.show ? styles.listPull : ""} />
            <div
              style={{
                zIndex: this.state.show ? "999" : "",
                position: "absolute",
                width: "100%"
              }}
              className={styles.searchList}
            >
              <Item>
                <Flex justify="around">
                  <div style={{ width: "40vw" }}>
                    <span style={{ color: "#4B85F8" }}>
                      {this.state.total}
                      个商家
                      </span>
                  </div>
                  <Flex.Item>
                    <Flex justify="around">
                      <Flex style={{ marginRight: "20px" }}>
                        <span>创建日期</span>
                        <div style={{ marginLeft: "5px" }}>
                          <div
                            style={{ position: "absolute", top: "2px" }}
                            onClick={this.sortClick.bind(this, "ASC")}
                          >
                            {this.state.params.orderType == "ASC" ? (
                              <img
                                src={require("../../image/up_action.png")}
                                style={{ width: "13px", height: "7px" }}
                              />
                            ) : (
                                <img
                                  src={require("../../image/up.png")}
                                  style={{ width: "13px", height: "7px" }}
                                />
                              )}
                          </div>
                          <div
                            style={{ position: "absolute", top: "14px" }}
                            onClick={this.sortClick.bind(this, "DESC")}
                          >
                            {this.state.params.orderType == "DESC" ? (
                              <img
                                src={require("../../image/down_action.png")}
                                style={{ width: "14px", height: "7px" }}
                              />
                            ) : (
                                <img
                                  src={require("../../image/down.png")}
                                  style={{ width: "14px", height: "7px" }}
                                />
                              )}
                          </div>
                        </div>
                        {/* </Flex> */}
                      </Flex>
                      <Flex>
                        <span onClick={this.visableChange.bind(this, 2)}>
                          主营材料
                          </span>
                        <span style={{ marginLeft: "5px" }}>
                          {this.state.activeIcon ? <img
                            src={require("../../image/filter_action.png")}
                            style={{ width: "12px", height: "15px" }}
                          /> : <img
                              src={require("../../image/filter.png")}
                              style={{ width: "12px", height: "15px" }}
                            />}
                        </span>
                      </Flex>
                    </Flex>
                  </Flex.Item>
                </Flex>
              </Item>
              <div
                style={{
                  height: "100%",
                  display: this.state.show ? null : "none",
                  background: "#fff"
                }}
              >
                {this.mainMaterial(this.state.materialCategoryData)}
              </div>
            </div>
          </div>
        </List>
        <PullToRefresh
          distanceToRefresh={25}
          style={{
            paddingTop: "100px",
            height: this.state.height,
            overflow: "auto",
            paddingTop: "95px"
          }}
          direction={this.state.down ? "down" : "up"}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.refresh();
          }}
        >
          <WhiteSpace size="lg" />
          <List className="my-list">
            {showResult ? <Result
              imgUrl={require("../../assets/null.png")}
              message={<div>暂无数据</div>}
            /> : this.creatItem(dataSource)}
          </List>
        </PullToRefresh>
      </div>
      </ReactDocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.effects["supplier/queryMaterialSupplierList"],
    materialList: state.supplier.materialList,
    materialCategoryData: state.supplier.materialCategoryData
  };
}

export default connect(mapStateToProps)(MaterialList);
