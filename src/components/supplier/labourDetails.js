import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {getUrlParamBySearch, isfalse} from '../../utils/utils'
import {
   List,
   ImagePicker,
   Flex,
   Toast
  } from "antd-mobile";
import { connect } from "dva";
import styles from './style.less';
import wx from "weixin-js-sdk";
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";
const Item = List.Item;
const Brief = Item.Brief;

class LabourDetails extends Component {
  state={
    supplierLabourId:'',
    labourDetails:{},
    attachmentVOList: []
  }

  componentDidMount(){ //获取投标信息
    this.setState({
      supplierLabourId:getUrlParamBySearch(this.props.location.search,'labourTenderId')
    },()=>
    {
      this.querySupplierLabourById();
      this.queryAttachList({bizCode:'SUPPLIER_LABOUR',bizId:this.state.supplierLabourId})
    }
    );
  }
  componentWillReceiveProps(nextProps){ //监听this.props的改变(loading图标显示)
    if(nextProps.loading){
      Toast.loading('Loading...', 30, () => {
      });
    }else{
      Toast.hide();
    }
  }
  componentWillUnmount(){
    // console.log('90900')
    Toast.hide();
  }

  queryAttachList =(params)=>{ //查询附件
    const {dispatch} = this.props;
    dispatch({
      type:'common/queryAttachList',
      payload:params
    }).then(()=>{
      const {attachList} = this.props;
      if(!isfalse(attachList)){
        this.setState({
          attachmentVOList: attachList.attachmentVOList
        })
      }
      console.log(attachList,'attachList')
    })
  }



  querySupplierLabourById =()=>{
    const {dispatch} = this.props;
    dispatch({
      type:'supplier/querySupplierLabourById',
      payload:{supplierLabourId:this.state.supplierLabourId}
    }).then(()=>{
      const {labourDetails} = this.props;
      this.setState({labourDetails})
      // console.log(labourDetails,'labourDetails')
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
    const {labourDetails} = this.state;
    // console.log(labourDetails.supplierContactList,'labourDetails')
    return (
      <ReactDocumentTitle title="劳务商详情">
      <div className={styles.myList}>
        <List
          renderHeader={() => '联系人信息'}
          >
          <Item multipleLine   wrap={true}>
            <div className={styles.textOverflow}> <span className={styles.textColor}>公司/队伍名称：</span>{labourDetails.name}</div>
            {isfalse(labourDetails.supplierContactList)?null:
            ( JSON.parse(labourDetails.supplierContactList).map((item,index)=>{
              return <div key={index} className={styles.textStyle}>
                <div><span className={styles.textColor}>联系人</span> {index==0?null:index}：{item.contactName}</div>
                <div> <span className={styles.textColor}>联系人手机</span> {index==0?null:index}：<a href={'tel:'+item.phone}>{item.phone}</a></div>
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
          <div className={styles.List}><span className={styles.listTitleSpan} style={{color:"#323232"}}>工种:</span>{
              isfalse(labourDetails.workType)?null:labourDetails.workType.split(',').map((item,index)=>{
                return <span key={index}
                      className={styles.litsSpan}
                >{item}</span>
              })

              }</div>
            <div><span className={styles.textColor}>规模：</span> {labourDetails.scale}</div>
            <Flex  style={{alignItems:'baseline'}}>
                <div  className={styles.textColor}>服务区域：</div>
                <div style={{flex:'1',textAlign:'left'}}>{labourDetails.serviceArea}</div>
            </Flex>
            <Flex  style={{alignItems:'baseline'}}>
                <div  className={styles.textColor}>施工强项：</div>
                <div style={{flex:'1',textAlign:'left'}}>{labourDetails.workStrengths}</div>
            </Flex>
            <Flex style={{alignItems:'baseline'}}>
              <div className={styles.textColor}>邮箱：</div>
              <div  style={{flex:'1',textAlign:'left'}}>{labourDetails.email}</div>
            </Flex>

            <Flex style={{alignItems:'baseline'}}>
              <div className={styles.textColor}>付款方式：</div>
              <div  style={{flex:'1',textAlign:'left'}}>{labourDetails.payWays}</div>
            </Flex>

            <div><span className={styles.textColor}>评价等级：</span>{labourDetails.evaluateLevel}</div>
            <Flex style={{alignItems:'baseline'}}>
              <div className={styles.textColor}>合作项目：</div>
              <div  style={{flex:'1',textAlign:'left'}}><span dangerouslySetInnerHTML={{ __html:labourDetails.jointProject}}/></div>
            </Flex>

            <Flex style={{alignItems:'stretch'}} >
                <div className={styles.textColor}>考察报告：</div>
                <Flex style={{flex:'1',textAlign:'left',flexWrap:"wrap"}} >
                {this.state.attachmentVOList.map((item, index) => {
                    if (item.ctrlName == "REPORT_INCESTIGATION_LABOUR") {
                      return <div
                      style={{margin:'0px 10px 10px 10px'}}
                      key={index} onClick={() => {
                        this.previewImage(item.fullFilename);
                      }}><img src={item.fullFilename} style={{width:'100px',height:"60px"}}/></div>
                    }
                  })}
                </Flex>
              </Flex>
              <Flex style={{alignItems:'stretch'}} >
                <div className={styles.textColor}>历史合同：</div>
                <Flex style={{textAlign:'left',flexWrap:"wrap",flexDirection:"column", flex: "1" ,alignItems:'baseline'}} >
                    {this.state.attachmentVOList.map((item, index) => {
                    if (item.ctrlName == "LABOUR_HISTORICAL_CONTRACT") {
                      return <div key={index}
                      style={{width:'100%'}}
                          className={styles.textOverflow}
                      >
                        <img src={require('../../image/fu.png')} style={{margin:"0px 5px"}}/>
                        {item.originalFilename+'.'+item.extention}
                      </div>
                    }
                  })}
                </Flex>
              </Flex>

            <Flex style={{alignItems:'baseline'}}>
              <div className={styles.textColor}>备注：</div>
              <div  style={{flex:'1',textAlign:'left'}}><span dangerouslySetInnerHTML={{ __html:labourDetails.remark }}/></div>
            </Flex>
            <Flex style={{alignItems:'stretch'}} >
                <div className={styles.textColor}>其他附件：</div>
                <Flex style={{textAlign:'left',flexWrap:"wrap",flexDirection:"column"}} >
                    {this.state.attachmentVOList.map((item, index) => {
                    if (item.ctrlName == "OTHER_ACCESSORIES_LABOUR") {
                      return <div key={index}
                      style={{width:'100%'}}
                      className={styles.textOverflow}
                      >
                        <img src={require('../../image/fu.png')} style={{margin:"0px 5px"}}/>
                        {item.originalFilename+'.'+item.extention}
                      </div>
                    }
                  })}
                </Flex>
              </Flex>
              {isfalse(labourDetails.customerFields)?null:(
                JSON.parse(labourDetails.customerFields).map((item,index)=>{
                  return(
                    <Flex style={{alignItems:"baseline"}} key={index}>
                      <div className={styles.textColor}>{item.fieldname}</div>
                      <div style={{flex:"1",textAlign:'left'}}>{item.value}</div>
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
    labourDetails:state.supplier.labourDetails,
    attachList:state.common.attachList,
    loading:state.loading.effects['supplier/querySupplierLabourById']
  };
}

export default connect(mapStateToProps)(LabourDetails);
