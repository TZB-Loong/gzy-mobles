import request from '../utils/request';
import { purchaseUrl } from '../confingPath'
import { stringify } from 'qs';
export async function query() {
  return request('/api/wechat/banner/bannerInfo?uniqueName=wechat_inquiry');
}
export async function getThisYearProjectStatistics() {
  return request(purchaseUrl+'/wechat/project/getProjectStatistics');
}

// 待办流程列表
export async function queryProcessByPage(params) {
  return request(purchaseUrl+`/wechat/workflow/queryTodoTaskList?${stringify(params)}`);
}

// 我发起流程列表
export async function queryMyProcessByPage(params) {
  return request(purchaseUrl+`/wechat/workflow/queryLaunchedTaskList?${stringify(params)}`);
}

// 已审批流程列表
export async function queryDoneProcessByPage(params) {
  return request(purchaseUrl+`/wechat/workflow/queryDoneTaskList?${stringify(params)}`);
}
export async function getCurrentUserCorpProjectList (params){
  return request(purchaseUrl+`/wechat/project/getCurrentUserCorpProjectList?${stringify(params)}`)
}

export async function queryAwaitOpenTenderList(params){
  return request(purchaseUrl+`/wechat/calibration/queryAwaitOpenTenderList?${stringify(params)}`);
}

//材料供应商
export async function queryMaterialSupplierList(params){
  return request(purchaseUrl+`/wechat/supplier/queryMaterialSupplierList?${stringify(params)}`);
}

//材料供应商详情
export async function queryMaterialSupplierById(params){
  return request(purchaseUrl+`/wechat/supplier/queryMaterialSupplierById?${stringify(params)}`);
}
//材料供应商主营类别
export async function getMaterialCategoryData(params){
  return request(purchaseUrl+`/wechat/base/materialCategory/getMaterialCategoryData?${stringify(params)}`)
}

//首页统计数据
export async function getQuantityStatistics(params){
  return request(purchaseUrl+`/wechat/user/getQuantityStatistics?${stringify(params)}`)
}


//劳务供应商列表
export async function querySupplierLabourByPage(params){
  return request(purchaseUrl+`/wechat/supplier/querySupplierLabourByPage?${stringify(params)}`)
}

//劳务供应商详情
export async function querySupplierLabourById(params){
  return request(purchaseUrl+`/wechat/supplier/querySupplierLabourById?${stringify(params)}`)
}

//获取工种
export async function multipleType(params){
  return request(purchaseUrl+`/wechat/base/dictionary/dictionaryList/multipleType?${stringify(params)}`)
}

//添加材料供应商
export async function saveMaterialSupplier(params){
  return request(purchaseUrl+`/wechat/supplier/saveMaterialSupplier?${stringify(params)}`)
}

//添加劳务供应商
export async function saveSupplierLabour(params){
  return request(purchaseUrl+`/wechat/supplier/saveSupplierLabour?${stringify(params)}`)
}

//自定义字段列表
export async function bizObjectMetadataList (params){
  return request(purchaseUrl+`/wechat/base/bizObject/bizObjectMetadataList?${stringify(params)}`)
}
// 审批记录
export async function queryProcessTracking(params) {
  return request(purchaseUrl + `/wechat/workflow/queryProcessTracking?${stringify(params)}`);
}
//项目审批发起人检测
export async function initiatorCheck(params){
  return request(purchaseUrl + `/wechat/project/initiatorCheck?${stringify(params)}`);
}
//附件图片查询
export async function queryAttachList(params){
  return request(purchaseUrl+ `/wechat/base/attach/queryAttachList?${stringify(params)}`)
}
//获取子账号列表
export async function showCorpMembers() {
  return request(purchaseUrl + `/wechat/ucenter/corpMember/showCorpMembers`);
}
//获取子账号详情
export async function showCorpMemberDetails(params) {
  return request(purchaseUrl + `/wechat/ucenter/corpMember/showCorpMemberDetails?${stringify(params)}`);
}