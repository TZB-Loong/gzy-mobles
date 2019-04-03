import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import {
  List,
  ListView,
  Flex,
  PullToRefresh,
  Accordion,
  Card,
  Button,
  TextareaItem,
  Result
} from "antd-mobile";

import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";
import styles from "./style.less";

const Item = List.Item;
const Brief = Item.Brief;

class ProjectStatistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    console.log(this.props);
    const { dispatch } = this.props;
    dispatch({
      type: "projectStatisticsModel/getThisYearProjectStatistics"
    }).then(() => {
      console.log(this.props.projectStatisticsModel.thisYearProjectStatistics);
    });
  }

  render() {
    let { projectStatisticsModel } = this.props;
    let { thisYearProjectStatistics } = projectStatisticsModel;
    return (
      <ReactDocumentTitle title="项目统计">
        <div className={styles.projectStatistics}>
          {thisYearProjectStatistics && thisYearProjectStatistics.length > 0 ? (
            <Accordion accordion defaultActiveKey="0">
              {(thisYearProjectStatistics
                ? thisYearProjectStatistics
                : []).map(function(item, index) {
                return (
                  <Accordion.Panel
                    header={
                      <div>
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {item.projectName}
                        </div>
                        <div style={{ color: "#666", fontSize: 14 }}>
                          <span style={{ paddingRight: 10 }}>
                            共计发标数：{item.tenderCount}
                          </span>
                          <span style={{ paddingRight: 10 }}>
                            签订合同数：{item.agreementCount}
                          </span>
                          <span>
                            合同总额：{item.sumMoney ? item.sumMoney.toFixed(2) : 0}
                          </span>
                        </div>
                      </div>
                    }
                    key={index}
                  >
                    <div>
                      <div
                        style={{
                          color: "#333333",
                          fontWeight: "bold",
                          marginLeft: 15,
                          marginTop: 10
                        }}
                      >
                        合同数据统计
                      </div>
                      {item.tenderAgreementList &&
                      item.tenderAgreementList.length > 0 ? (
                        <table cellSpacing="0" className={styles.theTable}>
                          <thead>
                            <tr>
                              <th>招标材料</th>
                              <th>签订合同金额</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(item.tenderAgreementList
                              ? item.tenderAgreementList
                              : []).map(function(items, i) {
                              return (
                                <tr key={i}>
                                  <td>{items.tenderCategory}</td>
                                  <td>
                                    {items.sumMoney ? (
                                      items.sumMoney.toFixed(2)
                                    ) : (
                                      0
                                    )}元
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "5px 0 15px 0",
                            color: "#9a9a9a"
                          }}
                        >
                          暂无数据
                        </div>
                      )}
                    </div>
                  </Accordion.Panel>
                );
              })}
            </Accordion>
          ) : (
            <Result
              imgUrl={require("../../assets/null.png")}
              message={<div>暂无数据</div>}
            />
          )}
        </div>
      </ReactDocumentTitle>
    );
  }
}
function mapStateToProps() {
  return {};
}

export default connect(({ projectStatisticsModel }) => ({
  projectStatisticsModel
}))(ProjectStatistics, mapStateToProps);
