
/**
 * 公共组件的 models
 */


import {
  getCurrentUserCorpProjectList,
  queryAwaitOpenTenderList,
  getQuantityStatistics,
  queryProcessTracking,
  initiatorCheck,
  queryAttachList
} from '../services/wechatApi';
import {Toast} from 'antd-mobile'
export default {

  namespace: 'common',

  state: {
    projectList:[],
    tenderList:[],
    indexData:{},
    flowRecordList: {},
    initiatorCheck: {},
    attachList:{}, //附件请求
  },

  // subscriptions: {
  //   setup({ dispatch, history }) {  // eslint-disable-line
  //   }
  // },

  effects: {
    *getCurrentUserCorpProjectList({ payload }, { call, put }) {  // eslint-disable-line
      //项目选择
      const response = yield call(getCurrentUserCorpProjectList, payload);
      console.log(response,'response')
     if(response.status == 200){

       yield put({
         type: 'projectListSave',
         payload:response.data
        });
     }else{
      Toast.offline(response.msg, 1);
     }
    },
    *queryAwaitOpenTenderList({payload},{call,put}){
      //投标选择
      const response = yield call(queryAwaitOpenTenderList,payload);
      if(response.status == 200){

        yield put({
          type:'TenderListSave',
          payload:response.data
        })
      }else{
        Toast.offline(response.msg, 1);
      }
    },
    *getQuantityStatistics({payload},{call,put}){
      //首页统计数据
      const response = yield call(getQuantityStatistics,payload);
      if(response.status==200){
        yield put ({
          type:"quantityStatisticsSave",
          payload:response.data
        })
      }else{
        Toast.offline(response.msg,1)
      }
    },
    *queryProcessTracking({ payload }, { call, put }) {
      const response = yield call(queryProcessTracking, payload);
      if (response.status == 200) {
        yield put({
          type: 'flowRecordList',
          payload: response,
        });
      } else {
        Toast.offline(response.msg)
      }
    },
    *initiatorCheck({payload},{call,put}){
      //审批发起人检测
      const response = yield call(initiatorCheck,payload);
      if(response.status==200){
        yield put({
          type:'initiatorCheckSave',
          payload:response
        })
      }else{
        Toast.offline(response.msg)
      }
    },
    *queryAttachList({payload},{call,put}){
      //附件查询
      const response = yield call(queryAttachList,payload);
      if(response.status==200){
        yield put({
          type:'queryAttachListSave',
          payload:response
        })
      }else{
        Toast.offline(response.msg)
      }
    }
  },

  reducers: {
    projectListSave(state,{payload}){
      return {
        ...state,
        projectList:payload
      }
    },
    TenderListSave(state,{payload}){
      return {
        ...state,
        tenderList:payload
      }
    },
    quantityStatisticsSave(state,{payload}){
      return {
        ...state,
        indexData:payload
      }
    },
    save(state, action) {
      console.log(action)
      return {...state, ...action.payload};
    },
    get(state, action) {
      return { msg:action.payload};
    },
    flowRecordList(state, { payload }) {
      return {
        ...state,
        flowRecordList: payload.data,
      };
    },
    initiatorCheckSave(state,{payload}){
      return {
        ...state,
        initiatorCheck:payload.data
      }
    },
    queryAttachListSave(state,{payload}){
      return {
        ...state,
        attachList:payload.data
      }
    }
  }

};
