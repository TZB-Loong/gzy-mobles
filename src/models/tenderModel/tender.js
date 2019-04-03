/*eslint-disable*/
import {queryMaterialTenderList,queryLabourTenderList} from '../../services/tender';
import {Toast} from 'antd-mobile'
export default {
  namespace: 'tender',
  state: {
    data: '',
    loading: false,
    queryStatus: false,
    MaterialTenderList: [],
    LabourTenderList: [],
  },
  effects: {
    *queryMaterial({ payload }, { call, put }) {
      const response = yield call(queryMaterialTenderList, payload);
      console.log(response)
      if (response.status === '200') {
        yield put({
          type: 'saveMaterial',
          payload: {
            tenderList: response.data,
          },
        });
      } else {
        Toast.info(response.msg);
      }
    },
    *queryLabour({ payload }, { call, put }) {
      const response = yield call(queryLabourTenderList, payload);
      if (response.status === '200') {
        yield put({
          type: 'saveLabour',
          payload: {
            tenderList: response.data,
          },
        });
      } else {
        yield put({
          type: 'queryStatus',
          payload: false,
        });
        Toast.info(response.msg);
      }
    },
  },

  reducers: {
    saveMaterial(state, {payload: { tenderList },}) {
      return {
        ...state,
        MaterialTenderList: tenderList!=null?tenderList.records:[],
        total: tenderList!=null?tenderList.pages:0,
        queryStatus:true,
      };
    },
    saveLabour(state, {payload: { tenderList },}) {
      return {
        ...state,
        LabourTenderList: tenderList!=null?tenderList.records:[],
        total: tenderList!=null?tenderList.pages:0,
        queryStatus:true,
      };
    },
    queryStatus(state, {payload}) {
      return {
        queryStatus: false,
      };
    },
    // save(state, { payload }) {
    //   return {
    //     ...state,
    //     ...payload,
    //   };
    // },
    // clear() {
    //   return {
    //     data: '',
    //   };
    // },
  },
};
