import { stringify } from "qs";
import request from "../utils/request";
import {purchaseUrl} from '../confingPath'
let pathBid = purchaseUrl;
// let pathBid= 'http://192.168.1.134:8081/wechat'

// 定标审批详情
export async function queryBidList(params) {
  return request(pathBid + `/wechat/calibration/queryBidList?${stringify(params)}`);
}
//提交定标审批
export async function reportCalibration(params) {
  return request(pathBid + `/wechat/calibration/reportCalibration?${stringify(params)}`, {
    method: 'POST',
  });
}
//批准定标审批
export async function sendCalibration(params){
  return request(pathBid + `/wechat/calibration/sendCalibration?${stringify(params)}`)
}

//驳回定标审批
export async function backCalibration(params){
  return request(pathBid + `/wechat/calibration/backCalibration?${stringify(params)}`)
}
//  撤回定标审批
export async function withdrawCalibration(params) {
  return request(pathBid + `/wechat/calibration/withdrawCalibration?${stringify(params)}`);
}
//上传合同列表
export async function getBidList(params) {
  return request(pathBid + `/wechat/agreement/getBidList?${stringify(params)}`);
}
//查询合同列表
export async function getAgreements(params) {
  return request(pathBid + `/wechat/agreement/getAgreements?${stringify(params)}`);
}
//上传合同
export async function batchUploadAgreement(params) {
  return request(pathBid + '/wechat/agreement/batchUploadAgreement', {
    method: 'POST',
    body: params,
  });
}
//查询中标方案
export async function getTenderCaseList(params) {
  return request(pathBid + `/wechat/materialtender/getTenderCaseList?${stringify(params)}`);
}