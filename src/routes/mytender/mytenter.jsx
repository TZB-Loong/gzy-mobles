import React, { Component } from 'react';
import {
  Flex,
  List,
  Tabs,
  Popover,
  Calendar,
  Result,
  PullToRefresh,
  Toast
} from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import { connect } from 'dva';
import { Link } from 'dva/router'
import styles from './index.less';
import {timestampToTime,format} from '../../utils/dateFormat'
import {requestUrl} from '../../confingPath'
import {getUrlParamBySearch, isfalse} from '../../utils/utils'
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";
const Item = List.Item;
const Brief = Item.Brief;
const PopoverItem = Popover.Item;

class TenderList extends Component {
  state = {
    refreshing: false,
    down: false,
    tabActive: 1,
    materialList: [],
    labourList: [],
    selectType: '',
    show: false,
    visible: false,
    currentStatus: '全部',
    total: 1,
    pages: 1,
    params:{
      current:1,
      size:10,
    },
    queryConditions:[
      {'fieldName':'releaseBeginDate','fieldValue':null},
      {'fieldName':'releaseEndDate','fieldValue':null},
      {'fieldName':'closeBeginDate','fieldValue':null},
      {'fieldName':'closeEndDate','fieldValue':null},
      {'fieldName':'state','fieldValue':''},
      ]
  };
  componentDidMount() {
  /*  const {tender: { MaterialTenderList }} = this.props;
    console.log(MaterialTenderList)
    this.setState({
      materialList: MaterialTenderList || [],
    });*/
    window.addEventListener('scroll', this.onScrollHandle.bind(this));
    let _this = this;
    if(getUrlParamBySearch(window.location.href,'status')){
      let status =  getUrlParamBySearch(window.location.href,'status')
      let queryConditions = this.state.queryConditions;
      //0：进行中，1：待开标，2：已定标，3：流标，4：待发布，5：已二次招标
      let statusTex = status==0?'进行中':status==1?'待开标':status==2?'已定标':status==3?'流标':status==4?'待发布':status==5?'已二次招标':'全部';
      queryConditions.map(item=>{
        if(item.fieldName=='state'){
          item.fieldValue = getUrlParamBySearch(window.location.href,'status');
        }
      });
      _this.setState({...queryConditions,currentStatus:statusTex},()=>{_this.initMaterialData('screen')})
    }else {
      this.initMaterialData('')
    }
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScrollHandle.bind(this));
  }
  onScrollHandle(event) {
    const clientHeight = event.srcElement.scrollingElement.clientHeight;
    const scrollHeight = event.srcElement.scrollingElement.scrollHeight;
    const scrollTop = event.srcElement.scrollingElement.scrollTop;
    const isBottom = (clientHeight + scrollTop  === scrollHeight);
    let page = this.state.pages,_this= this;
    if(isBottom){
      if(this.state.total!=this.state.params.current){
        page++;
        let params = Object.assign({}, _this.state.params, {
          current:page
        });
        _this.setState({
          pages:page,
          params:params,
        },()=>_this.state.tabActive==1?_this.initMaterialData():_this.initLabourData('screen'))
      }else {
        return
      }
    }else {
      return;
    }
  }
  onTabClick=(e)=>{
    let queryConditions = this.state.queryConditions;
      queryConditions.map(item=>{
       item.fieldValue = null
    });
    let params = Object.assign({}, this.state.params, {
      current:1
    });
    if(e.key==2){
      this.setState({params,tabActive:e.key,labourList:[],...queryConditions},()=>this.initLabourData())
    }if(e.key==1) {
      this.setState({params,tabActive:e.key,materialList:[],...queryConditions},()=>this.initMaterialData())
    }
  };
  initLabourData = (type)=>{
    const {params} = this.state;
    const {dispatch} = this.props;
    let bodyData = params;
    if(type=='screen'){
      bodyData = Object.assign({}, this.state.params, {
        queryConditions: JSON.stringify(this.state.queryConditions),
      });
    }
    dispatch({
      type: 'tender/queryLabour',
      payload: bodyData,
    }).then(() => {
      const {tender: { LabourTenderList,total,queryStatus }} = this.props;
     if(queryStatus){
       this.setState({
         total:total,
         labourList: this.state.labourList.concat(LabourTenderList || []),
       });
     }
    });
  }
  initMaterialData = (type)=>{
    const {params} = this.state;
    const {dispatch} = this.props;
    let bodyData = params;
      bodyData = Object.assign({}, this.state.params, {
        queryConditions: JSON.stringify(this.state.queryConditions),
      });
    dispatch({
      type: 'tender/queryMaterial',
      payload: bodyData,
    }).then(() => {
      const {tender: { MaterialTenderList,total,queryStatus }} = this.props;
      if(queryStatus){
        this.setState({
          total:total,
          materialList: this.state.materialList.concat(MaterialTenderList),
        });
      }
    });
  };
  onSelect = (opt) => {
    let queryConditions = this.state.queryConditions;
    let bodyData = this.state.params;
    queryConditions.map((item,index)=>{
      item.fieldName == 'state'?queryConditions[index].fieldValue=opt.props.children.key:null
    });
    bodyData = Object.assign({}, this.state.params, {
      current: 1,
    });
    this.setState({
      visible: false,
      params:bodyData,
      materialList:[],
      labourList:[],
      pages:1,
      currentStatus: opt.props.value,
      queryConditions:queryConditions
    },()=>this.state.tabActive==1?this.initMaterialData():this.initLabourData('screen'));
  };
  renderBtn(type) {

    return (
      <span onClick={() => {
        let EndDate='',BeginDate='',queryConditions = this.state.queryConditions;
        if(type=='截止时间'){
          EndDate = 'closeEndDate';
          BeginDate = 'closeBeginDate';
        }if(type=='开标时间'){
          EndDate = 'releaseEndDate';
          BeginDate = 'releaseBeginDate'
        }
        queryConditions.map((item,index)=>{
          if(item.fieldName == EndDate) {queryConditions[index].fieldValue=null}
        })
        queryConditions.map((_item,_index)=>{
          if(_item.fieldName == BeginDate) {queryConditions[_index].fieldValue=null}
        });
        this.setState({
          queryConditions:queryConditions
        })
           document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
           this.setState({
             show: true,
             selectType:type
           });
         }}
      >
        {type}
      </span>
    );
  }
  renderTabBar=(props)=> {
      return (<Sticky>
        {({ style }) =>
          <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} />
            <Flex className={styles.condition}>
              <Flex.Item><div>
                <Popover mask
                         overlayClassName="fortest"
                         visible={this.state.visible}
                         overlay={[
                           (<PopoverItem value='全部'><span key={''} className={styles.selectCondition}>全部 </span></PopoverItem>),
                           (<PopoverItem value='进行中'><span key={0} className={styles.selectCondition}>进行中 </span></PopoverItem>),
                           (<PopoverItem value='待开标'><span key={1} className={styles.selectCondition}>待开标 </span></PopoverItem>),
                           (<PopoverItem value='已定标'><span key={2} className={styles.selectCondition}>已定标 </span></PopoverItem>),
                           (<PopoverItem value='流标 '><span key={3} className={styles.selectCondition}>流标 </span></PopoverItem>),
                         ]}
                         align={{
                           overflow: { adjustY: 0, adjustX: 0 },
                           offset: [-10, 0],
                         }}
                         onVisibleChange={(visible)=>this.setState({visible})}
                         onSelect={this.onSelect}
                ><div>{this.state.currentStatus}</div>
                </Popover>
              </div></Flex.Item>
              <Flex.Item>{this.renderBtn('截止时间')}</Flex.Item>
              <Flex.Item>{this.renderBtn('开标时间')}</Flex.Item>
            </Flex>
        </div>}
      </Sticky>);
    }


  onConfirm = (startTime, endTime) => {
    let queryConditions = this.state.queryConditions,EndDate='',BeginDate='';
    const {selectType} = this.state;
    if(selectType=='截止时间'){
      EndDate = 'closeEndDate';
      BeginDate = 'closeBeginDate';
    }if(selectType=='开标时间'){
      EndDate = 'releaseEndDate';
      BeginDate = 'releaseBeginDate'
    }
    queryConditions.map((item,index)=>{
      item.fieldName == EndDate?queryConditions[index].fieldValue=format(endTime,'YYYY-MM-DD'):null;
    });
    queryConditions.map((_item,_index)=>{
      _item.fieldName == BeginDate?queryConditions[_index].fieldValue=format(startTime,'YYYY-MM-DD'):null;
    });
    this.setState({
      show: false,
      visible: false,
      materialList:[],
      labourList:[],
      queryConditions:queryConditions
    },()=>{
      this.state.tabActive==1?this.initMaterialData('screen'):this.initLabourData('screen');
      document.getElementsByTagName('body')[0].style.overflowY = 'auto';
    });
  }

  onCancel = () => {
    let queryConditions = this.state.queryConditions,EndDate='',BeginDate='';
    const {selectType} = this.state;
    if(selectType=='截止时间'){
      EndDate = 'closeEndDate';
      BeginDate = 'closeBeginDate';
    }if(selectType=='开标时间'){
      EndDate = 'releaseEndDate';
      BeginDate = 'releaseBeginDate'
    }
    queryConditions.map((item,index)=>{
      item.fieldName == EndDate?queryConditions[index].fieldValue=null:null;
    });
    queryConditions.map((_item,_index)=>{
      _item.fieldName == BeginDate?queryConditions[_index].fieldValue=null:null;
    });
    this.setState({
      show: false,
      visible: false,
      queryConditions:queryConditions
    },()=>{
      this.state.tabActive==1?this.initMaterialData('screen'):this.initLabourData('screen');
      document.getElementsByTagName('body')[0].style.overflowY = 'auto';
    });
  }
  status = (type)=>{
    let text = ''
    switch (type) {
      case 0:
        text = <span style={{color:'#00C687'}}>进行中</span>;
        break;
      case 1:
        text = <span style={{color:'#00C687'}}>待开标</span>;
        break;
      case 2:
        text = <span style={{color:'#00C687'}}>已定标</span>;
        break;
      case 3:
        text = <span style={{color:'#00C687'}}>流标</span>;
        break;
      case 4:
        text = <span style={{color:'#00C687'}}>待发布</span>;
        break;
      case 5:
        text = <span style={{color:'#00C687'}}>已二次招标</span>;
        break;
      default: text;
    }
    return text;
  }

  initiatorCheck(item, tenderType, saveType){ //审批发起人检测
    let _this = this;
    const {dispatch} = this.props;
    dispatch({
      type:'common/initiatorCheck',
      payload:{
        projectId: item.projectId,
        processType:'approval'
      }
    }).then(()=>{
      const {common} = this.props;
      if(!isfalse(common.initiatorCheck)){
        if(common.initiatorCheck.flag==1){
           window.location.href ="#/bidApproval/bidApproval?list=list&tenderType=" +
           tenderType + "&saveType=" + saveType + "&tenderId="+(tenderType == '1' ? item.materialTenderId : item.labourTenderId)+"&projectId="+item.projectId
        }else if(common.initiatorCheck.flag==0){
          Toast.offline('您没有该标的定标审批发起权限')
          return
        }
      }
    })
  }
  render() {
    const tabs = [
      { title: '材料/分包',key:1 },
      { title: '劳务',key:2 },
    ];
    const {labourList,materialList} = this.state;
    return (
      <ReactDocumentTitle title="我的招标">
      <div className={styles.userCenter}>

        <div className={styles.userConst}>
          <div className="flex-container" >
            <StickyContainer>
              <div >
            <Tabs tabs={tabs}
                    initalPage={'t2'}
                    usePaged={true}
                    onTabClick={this.onTabClick}
                    renderTabBar={this.renderTabBar}
              >
                <div key='1' style={{ backgroundColor: '#fff',}} >

                  {materialList.length>0?materialList.map((item,index)=>{
                    return <div key={index} className={styles.tenderlist}>
                      <a href={requestUrl +"/wechat-page/index.html#/detail_material?tenderId="+item.materialTenderId+"&tenderType=1"}>
                      <h4><span><em>招</em></span><div>{item.materialCategoryNames}</div>{this.status(item.state)}</h4>
                      <div className={styles.items}>
                        <p>项目：{item.projectName}</p>
                        <p>截止日期：{timestampToTime(item.endDate)}&nbsp;{item.endHour}时</p>
                        <p>开标日期：{timestampToTime(item.openDate)}</p>
                        <p>参与投标单位：{item.bidCount}</p>
                        <div className={styles.btn}>
                          {item.isShowUploadAgreement?
                            <a href={'#/bidApproval/UploadContract?tenderType=1&tenderId=' + item.materialTenderId}>上传合同</a>: item.isShowAgreementView?
                              <a href={'#/bidApproval/ContractView?tenderType=1&tenderId=' + item.materialTenderId}>查看合同</a>: item.isShowOpenTenderAudit?
                                <a onClick={(e)=>{e.preventDefault();this.initiatorCheck(item, '1', '1')}}>定标审批</a>: item.isShowOpenTenderView?
                                  <a href={"#/bidApproval/bidApprovalView?list=list&tenderType=1&tenderId="+item.materialTenderId+"&projectId="+item.projectId}>查看定标</a>: null}
                            {
                              item.isShowOpenTenderAudit?<a href={"#/bidApproval/bidApproval?list=list&tenderType=1&saveType=2&tenderId="+item.materialTenderId+"&projectId="+item.projectId}>定标</a>:null
                            }
                            {
                              (item.isShowUploadAgreement || item.isShowAgreementView)?
                                <a href={'#/bidApproval/programme?tenderType=1&tenderId=' + item.materialTenderId}>中标方案</a>:null
                            }
                        </div>
                      </div>
                    </a>
                    </div>
                  }):<Result imgUrl={require('../../assets/null.png')}
                             message={<div>暂无数据</div>}
                  />}
                </div>
                <div key='2' style={{ backgroundColor: '#fff' }}>
                 {labourList.length>0?labourList.map((item,index)=>{
                      return <div key={index} className={styles.tenderlist}>
                        <a href={requestUrl +"/wechat-page/index.html#/detail_labour?tenderId="+item.labourTenderId+"&tenderType=0"}>
                        <h4><span><em>招</em></span><div>{item.workTypeName}</div>{this.status(item.state)}</h4>
                        <div className={styles.items}>
                          <p>项目：{item.projectName}</p>
                          <p>开标日期：{timestampToTime(item.openDate)}</p>
                          <p>参与投标单位：{item.bidCount}</p>
                          <div className={styles.btn}>
                            {item.isShowUploadAgreement?<a href={'#/bidApproval/UploadContract?tenderType=2&tenderId=' + item.labourTenderId}>上传合同</a>:
                              item.isShowAgreementView?<a href={'#/bidApproval/ContractView?tenderType=2&tenderId=' + item.labourTenderId}>查看合同</a>:
                                item.isShowOpenTenderAudit?<a onClick={(e)=>{e.preventDefault();this.initiatorCheck(item, '2', '1')}}>定标审批</a>:
                                  item.isShowOpenTenderView?<a href={"#/bidApproval/bidApprovalView?list=list&tenderType=2&tenderId="+item.labourTenderId+"&projectId="+item.projectId}>查看定标</a>:
                                    null}
                            {
                              item.isShowOpenTenderAudit?<a href={"#/bidApproval/bidApproval?list=list&tenderType=2&saveType=2&tenderId="+item.labourTenderId+"&projectId="+item.projectId}>定标</a>:null
                            }
                            {
                              (item.isShowUploadAgreement || item.isShowAgreementView)?
                                <a href={'#/bidApproval/programme?tenderType=2&tenderId=' + item.labourTenderId}>中标方案</a>:null
                            }
                          </div>
                        </div>
                        </a>
                      </div>
                 }):<Result imgUrl={require('../../assets/null.png')}
                            message={<div>暂无数据</div>}
                 />}
                </div>
              </Tabs>
              </div>
            </StickyContainer>
            <Calendar
              visible={this.state.show}
              onCancel={this.onCancel}
              pickTime={false}
              onConfirm={this.onConfirm}
              defaultDate={new Date()}
              minDate={new Date(+new Date() - 9184000000)}
              maxDate={new Date(+new Date() + 31536000000)}
            />
          </div>
        </div>
      </div>
      </ReactDocumentTitle>
    );
  }
}

function mapStateToProps() {
  return {};
}
export default connect(({ tender, common }) => ({tender, common}))(TenderList,mapStateToProps);
