import React, { Component } from 'react';

import { getUrlParamBySearch, isfalse } from '../../utils/utils'
import {
  List,
  Toast,
  Flex
} from "antd-mobile";
import { connect } from "dva";
import styles from './style.less';
import wx from "weixin-js-sdk";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";
const Item = List.Item;


class MaterialDetails extends Component {
  state = {
    id: '',
    materialDetails: {},
    attachmentVOList: []
  }

  componentDidMount() { //获取投标信息
    this.setState({
      id: getUrlParamBySearch(this.props.location.search, 'materialTenderId')
    }, () => {
      this.queryMaterialSupplierById()
      this.queryAttachList({ bizCode: 'SUPPLIER_MATERIAL', bizId: this.state.id })
    });
  }

  componentWillReceiveProps(nextProps) { //监听this.props的改变(loading图标显示)
    if (nextProps.loading) {
      Toast.loading('Loading...', 30, () => {
      });
    } else {
      Toast.hide();
    }
  }
  componentWillUnmount() {
    // console.log('90900')
    Toast.hide();
  }

  queryMaterialSupplierById = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/queryMaterialSupplierById',
      payload: { id: this.state.id }
    }).then(() => {
      const { materialDetails } = this.props;
      this.setState({ materialDetails })
      // console.log(materialDetails,'materialDetails')
    })
  }

  queryAttachList = (params) => { //查询附件
    const { dispatch } = this.props;
    dispatch({
      type: 'common/queryAttachList',
      payload: params
    }).then(() => {
      const { attachList } = this.props;
      if (!isfalse(attachList)) {
        this.setState({
          attachmentVOList: attachList.attachmentVOList
        })
      }
      console.log(attachList, 'attachList')
    })
  }

  previewImage(img) {
    //图片预览
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    });
  }

  render() {
    const { materialDetails } = this.state;
    // console.log(materialDetails.supplierContactList,'materialDetails')
    return (
      <ReactDocumentTitle title="材料商详情">
        <div className={styles.myList}>
          <List
            renderHeader={() => '联系人信息'}
          >
            <Item
              multipleLine
              wrap={true}
            >
              <div className={styles.textOverflow}><span className={styles.textColor}>供应商名称：</span>{materialDetails.name}</div>
              {isfalse(materialDetails.supplierContactList) ? null :
                (JSON.parse(materialDetails.supplierContactList).map((item, index) => {
                  return <div key={index} className={styles.textStyle}>
                    <div className={styles.textOverflow}><span className={styles.textColor}>联系人{index == 0 ? null : index}：{item.contactName}</span></div>
                    <div className={styles.textOverflow}><span className={styles.textColor}>联系人手机</span> {index == 0 ? null : index}：<a href={'tel:'+item.phone}>{item.phone}</a></div>
                  </div>
                }))
              }
            </Item>
          </List>
          <List
            renderHeader={() => '经营信息'}
          >
            <Item
              multipleLine={true}
              wrap={true}
            >
              <span className={styles.textStyle}>
                <div className={styles.List}>
                  <span className={styles.listTitleSpan} style={{ color: "#323232" }}> 主营材料类别:</span>
                  {
                    isfalse(materialDetails.materialClassOneText) ? null : materialDetails.materialClassOneText.split(',').map((item, index) => {
                      return <span key={index}
                        className={styles.litsSpan}
                      >{item}</span>
                    })
                  }
                </div>
                <Flex style={{ alignItems: 'baseline' }}>
                  <div className={styles.textColor}>经营品牌：</div>
                  <div style={{ flex: '1', textAlign: 'left' }}>{materialDetails.brand}</div>
                </Flex>
                <div><span className={styles.textColor}>承包类型：</span> {materialDetails.contractType}</div>
                <Flex style={{ alignItems: 'baseline' }}>
                  <div className={styles.textColor}>供货区域：</div>
                  <div style={{ flex: '1', textAlign: 'left' }}>{materialDetails.supplyArea}</div>
                </Flex>
                <Flex style={{ alignItems: 'baseline' }}>
                  <div className={styles.textColor}>厂家地址：</div>
                  <div style={{ flex: '1', textAlign: 'left' }}>
                    {materialDetails.provinceName}{materialDetails.cityName}{materialDetails.districtName}{materialDetails.address}
                  </div>
                </Flex>
                <Flex style={{ alignItems: 'baseline' }}>
                  <div className={styles.textColor}>邮箱：</div>
                  <div style={{ flex: '1', textAlign: 'left' }}>{materialDetails.email}</div>
                </Flex>
                <Flex style={{ alignItems: 'baseline' }}>
                  <div className={styles.textColor}>付款方式：</div>
                  <div style={{ flex: '1', textAlign: 'left' }}>{materialDetails.payWays}</div>
                </Flex>
                <Flex style={{ alignItems: 'baseline' }}>
                  <div className={styles.textColor}>评价等级：</div>
                  <div style={{ flex: '1', textAlign: 'left' }}>{materialDetails.evaluateLevel}</div>
                </Flex>
                <Flex style={{ alignItems: 'baseline' }}>
                  <div className={styles.textColor}>合作项目：</div>
                  <div style={{ flex: '1', textAlign: 'left' }} ><span dangerouslySetInnerHTML={{ __html: materialDetails.jointProject }} /></div>
                </Flex>
                <Flex style={{ alignItems: 'stretch' }} >
                  <div className={styles.textColor}>考察报告：</div>
                  <Flex style={{ flex: '1', textAlign: 'left', flexWrap: "wrap" }} >
                    {this.state.attachmentVOList.map((item, index) => {
                      if (item.ctrlName == "REPORT_INCESTIGATION") {
                        return <div
                          style={{ margin: '0px 10px 10px 10px' }}
                          key={index} onClick={() => {
                            this.previewImage(item.fullFilename);
                          }}><img src={item.fullFilename} style={{ width: '100px', height: "60px" }} /></div>
                      }
                    })}
                  </Flex>
                </Flex>
                <Flex style={{ alignItems: 'stretch' }} >
                  <div className={styles.textColor}>历史合同：</div>
                  <Flex style={{ textAlign: 'left', flexWrap: "wrap", flexDirection: "column", flex: "1" ,alignItems:'baseline'}} >
                    {this.state.attachmentVOList.map((item, index) => {
                      if (item.ctrlName == "HISTORICAL_CONTRACT") {
                        return <div key={index}
                          style={{width:'100%'}}
                          className={styles.textOverflow}
                        >

                           <img src={require('../../image/fu.png')} style={{ margin: "0px 5px" }} />
                            {item.originalFilename + '.' + item.extention}
                          {/* <div style={{width:'250px'}} className={styles.textOverflow}>

                          </div> */}
                        </div>
                      }
                    })}
                  </Flex>
                </Flex>
                <Flex style={{ alignItems: 'baseline' }}>
                  <div className={styles.textColor}>备注：</div>
                  <div style={{ flex: '1', textAlign: 'left' }}><span dangerouslySetInnerHTML={{ __html: materialDetails.remark }} /></div>
                </Flex>
                <Flex style={{ alignItems: 'stretch' }} >
                  <div className={styles.textColor}>其他附件：</div>
                  <Flex style={{ textAlign: 'left', flexWrap: "wrap", flexDirection: "column" ,flex: "1" ,alignItems:'baseline'}} >
                    {this.state.attachmentVOList.map((item, index) => {
                      if (item.ctrlName == "OTHER_ACCESSORIES") {
                        return <div key={index}
                        style={{width:'100%'}}
                        className={styles.textOverflow}
                        >
                        <img src={require('../../image/fu.png')} style={{ margin: "0px 5px" }} />
                          {item.originalFilename + '.' + item.extention}
                        </div>
                      }
                    })}
                  </Flex>
                </Flex>
                {/* <span>
                <ImagePicker
                  files={[{
                    url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
                    id: '2121'
                  }]}
                  // onChange={this.onChange}
                  // onImageClick={(index, fs) => console.log(index, fs)}
                  multiple={false}
                  selectable={false}
                />
              </span> */}
                {isfalse(materialDetails.customerFields) ? null : (
                  JSON.parse(materialDetails.customerFields).map((item, index) => {
                    return (
                      <Flex style={{ alignItems: 'baseline' }} key={index}>
                        <div className={styles.textColor}>{item.fieldname}：</div>
                        <div style={{ flex: '1', textAlign: 'left' }}>{item.value}</div>
                      </Flex>
                    )
                  }
                  ))
                }
              </span>
            </Item>
          </List>
        </div>
      </ReactDocumentTitle>
    );
  }
}
function mapStateToProps(state) { //连接redux
  return {
    materialDetails: state.supplier.materialDetails,
    attachList: state.common.attachList,
    loading: state.loading.effects['supplier/queryMaterialSupplierById']
  };
}

export default connect(mapStateToProps)(MaterialDetails);
