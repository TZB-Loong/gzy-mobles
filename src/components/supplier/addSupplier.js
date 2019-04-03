/**
 * 添加供应商模块
 */
/**
 *参数说明
  @param {string} tenderType 为1时添加材料供应商 为2时添加劳务供应商
 */
import React, { Component } from 'react';

import { getUrlParamBySearch, isfalse } from '../../utils/utils'
import { List, InputItem, Modal, Button, Flex, Picker, ImagePicker, Toast, TextareaItem } from 'antd-mobile';
import { connect } from "dva";
import { createForm } from 'rc-form';
import cnCity from '../../utils/area.json';
import area from '../../utils/areaAll.json';
import styles from './style.less';
import Upload from '../../common/upload'; //附件
import ReactDocumentTitle from "../../common/ReactDocumentTitle.js";
const Item = List.Item;

class AddSupplier extends Component {
  state = {
    value: 1,
    type: '', //1为材料2为劳务
    params: {}, //提交上去的数据(参数)
    typeCodes: ['contractType', 'evaluateLevel', 'workType', 'scale'],
    materialCategoryData: [], //材料类别
    multipleType: [], //工种
    scaleData: [], //规模
    evaluateLevelData: [], //评价等级
    contractType: [],
    visible: false, //工种显示的model
    contactList: [{ contactName: '', phone: "" }], //联系人信息
    multipleTypeChecked: [], //选中的主营材料 id
    multipleTypeShowValue: [], //要显示的值
    isSelectedAll: false,
    i: 0,
    metadataList: [],
    hasError: false,
    regionVisible: false, //控制供货区域model显示
    regionChecked: [],//选中显示的值
    regionSelect: false, //不限区域选中
    areaAll: [],
    supplyAreaId: [],
    reportAttachIds: [],
    otherAttachIds: []
  }

  componentDidMount() {
    let type = getUrlParamBySearch(this.props.location.search, 'tenderType');

    area.map(areaData => {
      areaData.sub.map(subData => {
        subData.isActive = false
      })
    })

    this.multipleType(); //工种数据
    if (type == 1) {
      this.getMaterialCategoryData(); //获取主营材料类别数据
      this.bizObjectMetadataList('materialSuppliersObject'); //自定义字段数据
    } else {
      this.bizObjectMetadataList('labourSuppliersObject');
    }
    this.setState({
      type,
      areaAll: area
    })
  }

  bizObjectMetadataList = (data) => { //获取自定义字段列表
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/bizObjectMetadataList',
      payload: { bizId: 1, bizCode: data }
    }).then(() => {
      const { metadataList } = this.props
      this.setState({
        metadataList
      })
    })

  }

  getMaterialCategoryData = () => { //查询数据(主营材料的数据)
    const { dispatch } = this.props;
    dispatch({
      type: "supplier/getMaterialCategoryData",
      payload: {}
    }).then(() => {
      const { materialCategoryData } = this.props;
      let categorrData = []
      materialCategoryData.map(item => {
        categorrData.push({
          ...item,
          isActive: false
        })
      })
      this.setState({
        materialCategoryData: categorrData
      })
      // console.log(this.state.materialCategoryData, 'materialCategoryData')
    })
  }

  multipleType = () => { //查询数据(工种)
    const { dispatch } = this.props;
    dispatch({
      type: "supplier/multipleType",
      payload: { typeCodes: this.state.typeCodes.toString() }
    }).then(() => {
      const { multipleType } = this.props;
      let categorrData = [], scaleData = [], evaluateLevelData = [], contractType = [];
      if (!isfalse(multipleType)) {
        multipleType.workType.map(item => {
          categorrData.push({
            ...item,
            isActive: false
          })
        })
        multipleType.scale.map(item => {
          scaleData.push({
            label: item.dkey,
            value: item.dvalue
          })
        })
        multipleType.evaluateLevel.map(item => {
          evaluateLevelData.push({
            label: item.dkey,
            value: item.dvalue
          })
        })

        multipleType.contractType.map(item => {
          contractType.push({
            label: item.dkey,
            value: item.dvalue
          })
        })
      }

      this.setState({
        multipleType: categorrData,
        scaleData,
        evaluateLevelData,
        contractType
      })
    })

  }

  saveMaterialSupplier = () => {
    //添加材料供应商
    const { dispatch } = this.props;
    dispatch({
      type: "supplier/saveMaterialSupplier",
      payload: this.state.params
    }).then(() => {
      // console.log('0-0-')
      const { isJump, dispatch } = this.props;
      if (isJump) {
        window.location.href = "#/materialList";
        dispatch({
          type: "supplier/isJumpChangeSave",
          payload: {}
        })
      }
    })
  }

  saveSupplierLabour = () => {
    //添加劳务供应商
    const { dispatch } = this.props;
    dispatch({
      type: 'supplier/saveSupplierLabour',
      payload: this.state.params
    }).then(() => {
      // console.log('添加劳务供应商')
      const { isJump } = this.props;
      if (isJump) {
        window.location.href = '#/labourList';
        dispatch({
          type: 'supplier/isJumpChangeSave'
        })
      }
    })
  }

  totalSelection = () => { //全选
    if (this.state.type == 1) {
      let materialCategoryData = this.state.materialCategoryData;
      materialCategoryData.map(item => {
        item.isActive = false
      })
      this.setState({
        isSelectedAll: !this.state.isSelectedAll,
        materialCategoryData
      })
    } else {
      let multipleType = this.state.multipleType;
      multipleType.map(item => {
        item.isActive = false
      })
      this.setState({
        isSelectedAll: !this.state.isSelectedAll,
        multipleType
      })
    }

  }

  selectedClick = (index) => {  //单选
    if (this.state.type == 1) {
      let materialCategoryData = this.state.materialCategoryData;
      materialCategoryData[index].isActive = !materialCategoryData[index].isActive
      this.setState({
        materialCategoryData,
        isSelectedAll: false
      })
    } else {
      let multipleType = this.state.multipleType;
      multipleType[index].isActive = !multipleType[index].isActive
      this.setState({
        multipleType,
        isSelectedAll: false
      })
    }

  }

  mainMaterial = (data, type) => { //工种显示(材料类别)

    return <div style={{ height: '70vh' }}>
      <Flex direction="column" style={{ width: '100%', height: "100%" }}>
        <div style={{ width: '100%', flex: "1", padding: '10px 10px', overflow: 'auto', textAlign: 'center' }}>
          <span
            className={this.state.isSelectedAll ? styles.pullSelected : styles.pullItemText}
            onClick={this.totalSelection}
            style={{ display: type == 'workType' ? null : "none" }}
          >全部</span>
          {data.map((item, index) => {
            return <span
              key={index}
              className={item.isActive ? styles.pullSelected : styles.pullItemText}
              onClick={this.selectedClick.bind(this, index)}>
              {this.state.type == 1 ? item.name : item.dkey}
            </span>
          })}
        </div>
      </Flex>

    </div>

  }


  onSubmit = () => { //确认添加
    let { type, params, metadataList } = this.state;
    this.props.form.validateFields({ force: true }, (error, value) => {
      if (!error) {
        let customerFields = [];//自定义字段
        metadataList.map(item => {
          let ctrlName = item.ctrlName
          customerFields.push({
            fieldname: ctrlName,
            value: value[ctrlName]
          })
        });
        let contactList = this.state.contactList;
        contactList.map((item, index) => { //联系人
          item.contactName = value['contactName' + index]
          item.phone = value['phone' + index]
        })
        // console.log(value, '0000')

        let provinceName = '', cityName = '', districtName = ''; //省市区的名称
        if (!isfalse(value.city)) {
          cnCity.map(province => {
            if (province.value == value.city[0]) {
              provinceName = province.label;
            }
            province.children.map(city => {
              if (city.value == value.city[1]) {
                cityName = city.label;
              }
              if (!isfalse(city.children)) {
                city.children.map(district => {
                  if (district.value == value.city[2]) {
                    districtName = district.label
                  }
                })
              }
            })
          })
        }
        // console.log(provinceName, cityName, districtName)

        let reportAttachIds = [], otherAttachIds = [];

        if (!isfalse(value.reportAttachIds)) { //考察报的附件提交的数据格式
          value.reportAttachIds.map(item => {
            reportAttachIds.push({ serverIds: item, attachIds: "", attachCode: type == 1 ? "REPORT_INCESTIGATION" : "REPORT_INCESTIGATION_LABOUR" })
          })
        }
        if (!isfalse(value.otherAttachIds)) { // 其他附件提价的数据格式
          value.otherAttachIds.map(item => {
            otherAttachIds.push({ serverIds: item, attachIds: "", attachCode: type == 1 ? "OTHER_ACCESSORIES" : "OTHER_ACCESSORIES_LABOUR" })
          })
        }

        if (type == 1) { //添加材料供应商
          params = {
            ...value,
            // materialTypeId: value.materialTypeId.toString(),
            contractTypeId: value.contractTypeId.toString(),
            supplyAreaId: value.supplyAreaId.toString(),
            evaluateLevelId: value.evaluateLevelId.toString(),
            otherAttachIds: JSON.stringify(otherAttachIds),
            reportAttachIds: JSON.stringify(reportAttachIds),
            // otherAttachIds: value.otherAttachIds.toString(),
            // reportAttachIds: value.reportAttachIds.toString(),
            customerFields: JSON.stringify(customerFields),
            provinceId: isfalse(value.city) ? '' : value.city[0],
            cityId: isfalse(value.city) ? '' : value.city[1],
            districtId: isfalse(value.city) ? '' : value.city[2],
            provinceName: provinceName,
            cityName: cityName,
            districtName: districtName,
            supplierContactList: JSON.stringify(this.state.contactList)
          }
          console.log(params, 'params-params')
          this.setState({
            params
          },
            () => this.saveMaterialSupplier()
          )

        } else { //添加劳务供应商
          params = {
            ...value,
            scaleId: value.scaleId.toString(),
            workTypeId: value.workTypeId.toString(),
            // serviceAreaId: value.serviceAreaId.toString(),
            serviceAreaId: value.serviceAreaId.toString(),
            evaluateLevelId: value.evaluateLevelId.toString(),
            // otherAttachIds: value.otherAttachIds.toString(),
            // reportAttachIds: value.reportAttachIds.toString(),
            otherAttachIds: JSON.stringify(otherAttachIds),
            reportAttachIds: JSON.stringify(reportAttachIds),
            customerFields: JSON.stringify(customerFields),
            supplierContactList: JSON.stringify(this.state.contactList)
          }
          console.log(params, '090')
          this.setState({
            params
          }, () => this.saveSupplierLabour())
        }
      } else {
        console.log(value, 'value')
        if (isfalse(value.name)) {
          this.inputRef.focus()
          this.setState({
            hasError: true
          })
          Toast.info('名字不能为空 !!!', 2, null, false);
        }

      }
    });
  }
  onReset = () => {
    this.props.form.resetFields();
  }
  validateAccount = (rule, value, callback) => { //验证规则

    if (isfalse(value)) { //必填验证
      callback(new Error('At least four characters for account'));
    } else {
      callback();
    }
  }

  visibleChange = (data, type) => { //弹框的显示(控制以及相对应的数据显示)
    let { isSelectedAll, multipleType, multipleTypeChecked, multipleTypeShowValue, materialCategoryData } = this.state;
    if (type == 'Yes') {

      if (isSelectedAll) {
        if (this.state.type == 1) {
          materialCategoryData.map(item => {
            multipleTypeChecked.push(item.id);
            multipleTypeShowValue.push(item.name)
          })
        } else {
          multipleType.map(item => {
            multipleTypeChecked.push(this.state.type == 1 ? item.id : item.dvalue);
            multipleTypeShowValue.push(item.dkey)
          })
        }
      } else {
        if (this.state.type == 1) {

          materialCategoryData.map(item => {
            if (item.isActive) {
              console.log(item, '---item')
              // let children = [];
              if (!isfalse(item.childrenList)) {
                item.childrenList.map(children => {
                  // children.push(item.id,children.)
                  multipleTypeChecked.push([item.id, children.id].toString());
                })
              } else {
                multipleTypeChecked.push(item.id);
              }
              // console.log(multipleTypeChecked,'multipleTypeChecked')
              multipleTypeShowValue.push(item.name);
            }
          })
        } else {
          multipleType.map(item => {
            if (item.isActive) {
              multipleTypeChecked.push(this.state.type == 1 ? item.id : item.dvalue);
              multipleTypeShowValue.push(item.dkey)
            }
          })
        }

      }

    } else if (type == 'No') {
      /* isSelectedAll = false
      multipleType.map(item=>{
        item.isActive=false;
      }) */
    }

    this.setState({
      visible: data,
      isSelectedAll,
      multipleType,
      multipleTypeChecked,
      multipleTypeShowValue
    })
  }

  regionVisibleChange = (data, type) => { //供货区域model 控制

    let { regionSelect, areaAll } = this.state;
    let supplyAreaId = [], regionChecked = [];

    if (type == "Yes") { //确定时
      if (regionSelect) {
        regionChecked = '不限地区',
          supplyAreaId = [0]
      } else {
        areaAll.map(item => {
          item.sub.map(subItem => {
            if (subItem.isActive) {
              supplyAreaId.push(subItem.code)
              regionChecked.push(subItem.name)
            }
          })
        })
      }
      this.setState({
        regionChecked,
        supplyAreaId
      })
    }

    this.setState({
      regionVisible: data
    })
  }

  regionContent = () => { //供货区域的全部处理
    let { areaAll } = this.state;
    let _this = this;
    function totalSelection() { //不限区域选中
      areaAll.map(areaData => {
        areaData.sub.map(subData => {
          subData.isActive = false
        })
      })
      _this.setState({
        regionSelect: !_this.state.regionSelect,
        areaAll
      })
    }

    function selectedClick(index, subIndex) { //单选时
      areaAll[index].sub[subIndex].isActive = !areaAll[index].sub[subIndex].isActive
      _this.setState({
        areaAll,
        regionSelect: false
      })
    }

    return <div style={{ height: '70vh' }}>
      <Flex direction="column" style={{ width: '100%', height: "100%" }}>
        <div style={{ width: '100%', flex: "1", padding: '10px 10px', overflow: 'auto' }}>
          <span
            className={_this.state.regionSelect ? styles.pullSelected : styles.pullItemText}
            onClick={totalSelection}
          >不限地区</span>
          {areaAll.map((item, index) => {
            return <div key={index}>
              <div>{item.name}</div>
              {item.sub.map((sub, subIndex) => {
                return <span
                  className={sub.isActive ? styles.pullSelected : styles.pullItemText}
                  key={subIndex}
                  onClick={selectedClick.bind(_this, index, subIndex)}
                >
                  {sub.name}
                </span>
              })}
            </div>
          })}
        </div>
      </Flex>
    </div>
  }


  contactList = (data) => { //动态创建联系人
    const { getFieldProps, getFieldError } = this.props.form;
    return <div>
      {data.map((item, index) => {
        return <div key={index}>
          <InputItem
            {...getFieldProps('contactName' + index, {
              rules: [
                { required: true },
              ],
              initialValue: item.contactName,
            })}
            error={!!getFieldError('contactName' + index)}
            placeholder="请输入"
            type="text"
            extra={index == 0 ? "" : <span className={styles.deleteIcon} onClick={this.deleteContact.bind(this, index)}>
              <img src={require('../../image/delete.png')} style={{ width: '12px', height: '12px' }} /></span>}>
            <span style={{ color: "red" }}>*</span>联系人{index == 0 ? '' : (index)}
          </InputItem>
          <InputItem
            {...getFieldProps('phone' + index, {
              rules: [
                { required: true },
                {
                  pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                  // message: "请输入合法数字"
                }
              ],
              initialValue: item.phone
            })}
            error={!!getFieldError('phone' + index)}
            placeholder="请输入"
            type="text"
            extra={index == 0 ? "" : <span className={styles.deleteIcon} onClick={this.deleteContact.bind(this, index)}>
              <img src={require('../../image/delete.png')} style={{ width: '12px', height: '12px' }} /></span>}>
            <span style={{ color: "red" }}>*</span>联系人手机{index == 0 ? '' : (index)}
          </InputItem>
        </div>
      })}
    </div>
  }

  addContact = () => {
    //添加联系人
    let contactList = this.state.contactList;
    if (contactList.length <= 2) {
      contactList.push({
        contactName: '',
        phone: ''
      })
    }
    this.setState({
      contactList
    })
  }

  //删除添加的联系人
  deleteContact = (data) => {
    let contactList = this.state.contactList
    contactList.splice(data, 1);
    this.setState({
      contactList
    })
  }

  reportAttachIds = (id) => { //考察报告severIds
    this.setState({
      reportAttachIds: id
    })
  }

  otherAttachIds = (id) => { //其他附件severIds
    this.setState({
      otherAttachIds: id
    })
  }


  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const {materialLoading,labourLoading} = this.props;
    const { type } = this.state;
    return (
      <ReactDocumentTitle title="添加供应商">
      <div className={styles.payApproval}>
        <form>
          <List
            renderHeader={() => '联系人信息'}
          >

            <InputItem
              {...getFieldProps('name', {
                rules: [
                  { required: true },
                ],
              })}
              error={!!getFieldError("name")}
              ref={el => this.inputRef = el}
              placeholder="请输入"

            ><span style={{ color: "red" }}>*</span> {type == 1 ? "供应商名称" : "公司/队伍名称"}</InputItem>
            {this.contactList(this.state.contactList)}
            <Item onClick={this.addContact} style={{ display: this.state.contactList.length >= 3 ? 'none' : null }}>
              <Flex justify='center'>
                <span style={{
                  color: '#4B85F8',
                  textAlign: 'center',
                }} >+添加联系人</span>
              </Flex>
            </Item>
          </List>
          <List renderHeader={() => { type == 1 ? '经营信息' : ' 服务信息' }}>

            {type == 1 ?

              <Item {...getFieldProps('category', {
                initialValue: this.state.multipleTypeChecked,
              })}
                arrow="horizontal"
                extra={
                  <span onClick={this.visibleChange.bind(this, true)}>
                    {isfalse(this.state.multipleTypeShowValue) ? '请选择(可选)' : this.state.multipleTypeShowValue}
                  </span>
                }
              >
                主营材料分类
              </Item> :
              <Item {...getFieldProps('workTypeId', {
                initialValue: this.state.multipleTypeChecked,
              })}
                arrow="horizontal"
                extra={
                  <span onClick={this.visibleChange.bind(this, true)}>
                    {isfalse(this.state.multipleTypeShowValue) ? '请选择(可选)' : this.state.multipleTypeShowValue}
                  </span>
                }>
                工种
              </Item>
            }

            {type == 1 ?
              <TextareaItem
                title="经营品牌"
                placeholder="请输入"
                {...getFieldProps('brand', {
                })}
                // data-seed="logId"
                // ref={el => this.autoFocusInst = el}
                autoHeight
              />
              : <Picker extra="请选择(可选)"
                cols="1"
                data={this.state.scaleData}
                {...getFieldProps('scaleId', {
                  initialValue: [],
                })}
              >
                <Item arrow="horizontal">规模</Item>
              </Picker>}
            {type == 1 ? <Picker extra="请选择(可选)"
              data={this.state.contractType}
              {...getFieldProps('contractTypeId', {
                initialValue: [],
              })}
              cols={1}
            >
              <Item arrow="horizontal">承包类型</Item>
            </Picker> : null}

            <Item  {...getFieldProps(type == 1 ? 'supplyAreaId' : 'serviceAreaId', {
              initialValue: this.state.supplyAreaId,
            })}
              arrow="horizontal"
              extra={
                <span onClick={this.regionVisibleChange.bind(this, true)}>
                  {isfalse(this.state.regionChecked) ? '请选择(可选)' : this.state.regionChecked}
                </span>
              }
            >
              {type == 1 ? '供货区域' : '服务区域'}
            </Item>
            {type == 1 ?
              <span>
                <Picker extra="请选择(可选)"
                  data={cnCity}
                  // title="Areas"
                  {...getFieldProps('city', {
                    // initialValue: [],
                  })}
                >
                  <Item arrow="horizontal">厂家地址</Item>
                </Picker>
                <TextareaItem
                  // title="经营品牌"
                  placeholder="请输入详细地址"
                  {...getFieldProps('address')}
                  // data-seed="logId"
                  // ref={el => this.autoFocusInst = el}
                  autoHeight
                />
                {/* <InputItem {...getFieldProps('address')} placeholder="请输入详细地址" type="text">
                </InputItem> */}
              </span> : <InputItem {...getFieldProps('workStrengths')} placeholder="请输入" type="text">
                施工强项
        </InputItem>}

            <InputItem {...getFieldProps('email', {
              rules: [
                {
                  pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                  // message: "请输入合法数字"
                }
              ],
            })}
              error={!!getFieldError('email')}
              placeholder="请输入"
              type="text">
              邮箱
        </InputItem>
            <InputItem {...getFieldProps('payWays')} placeholder="请输入" type="text">
              付款方式
        </InputItem>
            <Picker extra="请选择(可选)"
              data={this.state.evaluateLevelData}
              cols={1}
              {...getFieldProps('evaluateLevelId', {
                initialValue: [],
              })}
            >
              <Item arrow="horizontal">评价等级</Item>
            </Picker>
            <TextareaItem
              title="合作项目"
              placeholder="请输入"
              {...getFieldProps('jointProject')}
              // data-seed="logId"
              // ref={el => this.autoFocusInst = el}
              autoHeight
            />

            <div {...getFieldProps('reportAttachIds', { initialValue: this.state.reportAttachIds })}>
              <Upload parentIds={this.reportAttachIds} msg={<span className={styles.textStyle}>考察报告</span>} />
            </div>
            <TextareaItem
              // className={styles.textTarea}
              title="备注"
              placeholder="请输入"
              // rows={3}
              {...getFieldProps('remark')}
              // data-seed="logId"
              // ref={el => this.autoFocusInst = el}
              autoHeight
            />
            {/* <InputItem {...getFieldProps('remark')} placeholder="请输入" type="text">
              备注
        </InputItem> */}
            <div {...getFieldProps('otherAttachIds', { initialValue: this.state.otherAttachIds })}  >
              <Upload parentIds={this.otherAttachIds} msg={<span className={styles.textStyle}>其他附件</span>} />
            </div>
            {
              this.state.metadataList.map((item, index) => {
                return (
                  <InputItem {...getFieldProps(item.ctrlName)} placeholder="请输入" type="text" key={index}>
                    {item.chnName}
                  </InputItem>
                )
              })
            }
            <Flex justify="center" style={{ padding: "10px 0px" }}>
              <Button type="primary" inline onClick={this.onSubmit} style={{ width: '300px' }} disabled={labourLoading||materialLoading}>确认添加</Button>
            </Flex>
            <Modal
              popup
              visible={this.state.visible}
              onClose={this.visibleChange.bind(this, false)}
              animationType="slide-up"
            >
              <Flex justify="between" style={{ padding: "10px", color: "#4B85F8", borderBottom: "1px solid #CACACA" }}>
                <Flex.Item onClick={this.visibleChange.bind(this, false, 'No')}>取消</Flex.Item>
                <Flex.Item onClick={this.visibleChange.bind(this, false, 'Yes')} style={{ textAlign: "right" }}>确定</Flex.Item>
              </Flex>
              {type == 1 ? this.mainMaterial(this.state.materialCategoryData, 'material') : this.mainMaterial(this.state.multipleType, 'workType')}
            </Modal>
            {/* 供货区域 */}
            <Modal
              popup
              visible={this.state.regionVisible}
              onClose={this.regionVisibleChange.bind(this, false)}
              animationType="slide-up"
            >
              <Flex justify="between" style={{ padding: "10px", color: "#4B85F8", borderBottom: "1px solid #CACACA" }}>
                <Flex.Item onClick={this.regionVisibleChange.bind(this, false, 'No')}>取消</Flex.Item>
                <Flex.Item onClick={this.regionVisibleChange.bind(this, false, 'Yes')} style={{ textAlign: "right" }}>确定</Flex.Item>
              </Flex>
              {this.regionContent()}
            </Modal>
          </List>
        </form>
      </div>
      </ReactDocumentTitle>
    );
  }

}
function mapStateToProps(state) { //连接redux
  return {
    multipleType: state.supplier.multipleType, //劳务的工种
    materialCategoryData: state.supplier.materialCategoryData, //材料的主营类别
    metadataList: state.supplier.metadataList, //自定义字段
    isJump: state.supplier.isJump,
    materialLoading:state.loading.effects['supplier/saveMaterialSupplier'],
    labourLoading:state.loading.effects['supplier/saveSupplierLabour']
  };
}

export default connect(mapStateToProps)(createForm()(AddSupplier));
