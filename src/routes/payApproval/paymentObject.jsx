import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import { List, ListView, Flex, Radio, Button } from "antd-mobile";

import styles from "./style.less";

const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;

class PaymentObject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {}

  render() {
    const data = [
      {
        projectName: "苏州上东区项目售楼处样板房精装工程项装工程项",
        id: 0
      },
      {
        projectName: "苏州上东区项目售楼处样板房精装工程项装工程项",
        id: 1
      },
      {
        projectName: "苏州上东区项目售楼处样板房精装工程项装工程项",
        id: 2
      },
      {
        projectName: "苏州上东区项目售楼处样板房精装工程项装工程项",
        id: 3
      },
      {
        projectName: "苏州上东区项目售楼处样板房精装工程项装工程项",
        id: 4
      }
    ];
    return (
      <div className={styles.waitProcess}>
        <List style={{ paddingBottom: 80 }}>
          {data.map(function(item, index) {
            return (
              <RadioItem
                key={item.id}
                onChange={e => console.log("checkbox", e, item.id)}
              >
                {item.projectName}
              </RadioItem>
            );
          })}
        </List>
        <Button
          style={{ position: "fixed", bottom: 0, width: "100%" }}
          type="primary"
        >
          确定
        </Button>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(PaymentObject);
