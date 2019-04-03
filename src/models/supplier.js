
/**
 * 供应商
 */
import {
  queryMaterialSupplierList,
  queryMaterialSupplierById,
  getMaterialCategoryData,
  querySupplierLabourByPage,
  querySupplierLabourById,
  multipleType,
  saveMaterialSupplier,
  saveSupplierLabour,
  bizObjectMetadataList
} from '../services/wechatApi';
import {Toast} from 'antd-mobile'
export default {

  namespace: 'supplier',

  state: {
    materialList:[],
    materialDetails:[],
    materialCategoryData:[],
    supplierLabourList:[],
    labourDetails:[],
    multipleType:[],
    metadataList:[],
    isJump:false
  },

  effects: {
    *queryMaterialSupplierList({ payload }, { call, put }) {  // eslint-disable-line
      //材料供应商列表
      const response = yield call(queryMaterialSupplierList, payload);
      // console.log(response,'response')
     if(response.status == 200){
       yield put({
         type: 'materialListSave',
         payload:response.data
        });
     }else{
      Toast.offline(response.msg, 1)
     }
    },
    *queryMaterialSupplierById({payload},{call,put}){
      //材料供应商详情
      const response = yield call(queryMaterialSupplierById,payload);
      if(response.status==200){
        yield put({
          type:"materialDetailsSave",
          payload:response.data
        })
      }else{
        Toast.offline(response.msg, 1)
      }
    },
    *getMaterialCategoryData({payload},{call,put}){
      //材料主营类别
      const response = yield call (getMaterialCategoryData,payload);
      if(response.status ==200){
        yield put({
          type:"materialCategorySave",
          payload:response.data
        })
      }else{
        Toast.offline(response.msg,1)
      }
    },
    *querySupplierLabourByPage({payload},{call,put}){
      //劳务供应商列表
      const response = yield call(querySupplierLabourByPage,payload);
      if(response.status==200){
        yield put({
          type:"supplierLabourListSave",
          payload:response.data
        })
      }else{
        Toast.offline(response.msg)
      }
    },
    *querySupplierLabourById({payload},{call,put}){
      //劳务供应商详情
      const response = yield call(querySupplierLabourById,payload);
      if(response.status==200){
        yield put({
          type:'labourDetailsSave',
          payload:response.data
        })
      }else{
        Toast.offline(response.msg)
      }
    },
    *multipleType({payload},{call,put}){
      //工种查询
      const response = yield call(multipleType,payload);
      if(response.status==200){
        yield put({
          type:"multipleTypeSave",
          payload:response.data
        })
      }else{
        Toast.offline(response.msg)
      }
    },
    *saveMaterialSupplier({payload},{call,put}){
      //添加材料供应商
      const response = yield call(saveMaterialSupplier,payload);
      if(response.status == 200){
        yield put({
          type:"isJumpSave",
        })
        Toast.success('添加成功')
      }else{
        Toast.offline(response.msg)
      }
    },
    *saveSupplierLabour({payload},{call,put}){
      //添加劳务供应商
      const response = yield call(saveSupplierLabour,payload);
      if(response.status==200){
        Toast.success('添加成功')
        yield put({
          type:"isJumpSave",
        })
      }else{
        Toast.offline(response.msg)
      }
    },
    *bizObjectMetadataList({payload},{call,put}){
      //自定义字段列表查询
      const response = yield call(bizObjectMetadataList,payload);
      if(response.status == 200){
        // Toast.success()
        yield put({
          type:'bizObjectMetadataListSave',
          payload:response.data
        })
      }else{
        Toast.offline(response.msg)
      }
    },
  },

  reducers: {
    materialListSave(state,{payload}){
      return {
        ...state,
        materialList:payload
      }
    },
    materialDetailsSave(state,{payload}){
      return {
        ...state,
        materialDetails:payload
      }
    },
    materialCategorySave(state,{payload}){
      return {
        ...state,
        materialCategoryData:payload
      }
    },
    supplierLabourListSave(state,{payload}){
      return {
        ...state,
        supplierLabourList:payload
      }
    },
    labourDetailsSave(state,{payload}){
      return {
        ...state,
        labourDetails:payload
      }
    },
    multipleTypeSave(state,{payload}){
      return {
        ...state,
        multipleType:payload
      }
    },
    bizObjectMetadataListSave(state,{payload}){
      return {
        ...state,
        metadataList:payload
      }
    },
    isJumpSave(state){
      // console.log('opop')
      return {
        ...state,
        isJump:true
      }
    },
    isJumpChangeSave(state){
      // console.log('opop-0-0-')
      return {
        ...state,
        isJump:false
      }
    }
  }

};
