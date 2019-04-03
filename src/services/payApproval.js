import { stringify } from 'qs';
import request from '../utils/request';
import {purchaseUrl} from '../confingPath'
let pathBid= purchaseUrl;
// 发起支付审批
export async function savePay(params) {
  return request(pathBid + '/wechat/payment/reportPayment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: {
      ...params,
    },
  });
}
// 支付审批详情
export async function queryPaymentDetails(params) {
  return request(pathBid + `/wechat/payment/queryPayment?${stringify(params)}`);
}
//  审批支付(同意)
export async function sendApproval(params) {
  return request(pathBid + `/wechat/payment/sendPayment?${stringify(params)}`);
}

//  审批支付(不同意)
export async function sendApprovalNo(params) {
  return request(pathBid + `/wechat/payment/backPayment?${stringify(params)}`);
}
//  撤回支付审批
export async function withdrawPayment(params) {
  return request(pathBid + `/wechat/payment/withdrawPayment?${stringify(params)}`);
}
