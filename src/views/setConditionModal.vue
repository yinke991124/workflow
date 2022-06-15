<template>
  <a-modal
    title="设置条件分支"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :bodyStyle="{background: '#F0F2F5'}"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model :colon="false" ref="ruleForm" :model="form" :rules="rules">
        <div class="item">
          <h4>审批方式</h4>
          <div class="box">
            <div class="boxDis" v-for="(item, bigindex) in form.ruleArr" :key="bigindex">
              <div class="title">条件项</div>
              <div class="item_box">
                <a-form-model-item>
                  <a-select v-model="item.type" style="width: 140px;" @change="changeRuleType(item)">
                    <a-select-option v-for="(opt, index) in selectTypeArr" :key="index" :value="opt.key">{{ opt.name }}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <!-- 发起人 -->
                <template v-if="item.type == 'FLOW_NODE_CONDITION_TYPE_ONE'">
                  <a-form-model-item style="flex: 1;" :prop="'ruleArr.'+bigindex+'.launchUserIds'" :rules="[{ validator: launchUserIdsValidator, trigger: 'change' }]">
                    <a-select v-model="item.launchUserIds" mode="multiple" style="width: 100%">
                      <a-select-option v-for="item in userData" :key="item.id+''">{{ item.realName || item.username }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </template>
                <!-- 发起人、合同类型、付款方式、费用名称、调整类型、开票类型无此项 -->
                <template v-if="item.type != 'FLOW_NODE_CONDITION_TYPE_ONE' && item.type != 'FLOW_NODE_CONDITION_TYPE_FIVE' && item.type != 'FLOW_NODE_CONDITION_TYPE_TEN' && item.type != 'FLOW_NODE_CONDITION_TYPE_TWELVE' && item.type != 'FLOW_NODE_CONDITION_TYPE_FOURTEEN' && item.type != 'FLOW_NODE_CONDITION_TYPE_SEVENTEEN'">
                  <!-- 大于小于啥的 -->
                  <a-form-model-item>
                    <a-select v-model="item.judgeType" @change="contractTypeChange" style="width: 140px;">
                      <a-select-option v-for="(opt, index) in selectRangeArr" :key="index" :value="opt.key">{{ opt.name }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item :prop="'ruleArr.'+bigindex+'.judgeValue1'" :rules="[{ required: true, message: '请输入值', trigger: 'change' }]" style="flex: 1;">
                    <a-input-number v-model="item.judgeValue1" :min="1" style="width: 100%;" />
                  </a-form-model-item>
                  <template v-if="item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_FIVE'">
                    <span class="ccc" style="margin-right: 16px;margin-top: 10px;">-</span>
                    <a-form-model-item :prop="'ruleArr.'+bigindex+'.judgeValue2'" :rules="[{ required: true, message: '请输入值', trigger: 'change' }]" style="flex: 1;">
                      <a-input-number v-model="item.judgeValue2" :min="1" style="width: 100%;" />
                    </a-form-model-item>
                  </template>
                  <!-- :prop="'ruleArr.'+bigindex+'.unit'" -->
                  <a-form-model-item>
                    <a-select v-model="item.unit" @change="contractTypeChange" :style="{ width: item.type == 'FLOW_NODE_CONDITION_TYPE_SIX' || item.type == 'FLOW_NODE_CONDITION_TYPE_SEVEN' || item.type == 'FLOW_NODE_CONDITION_TYPE_NINE' ? '120px' : '60px' }">
                      <!-- 面积数 -->
                      <a-select-option v-if="item.type == 'FLOW_NODE_CONDITION_TYPE_TWO'" value="FLOW_NODE_CONDITION_UNIT_ONE">m²</a-select-option>
                      <!-- 合同总价、成交总价、匹配金额、调整金额、收据金额、开票金额、总发生额、开票总金额 -->
                      <a-select-option v-if="item.type == 'FLOW_NODE_CONDITION_TYPE_THREE' || item.type == 'FLOW_NODE_CONDITION_TYPE_EIGHT' || item.type == 'FLOW_NODE_CONDITION_TYPE_ELEVEN' || item.type == 'FLOW_NODE_CONDITION_TYPE_THIRTEEN' || item.type == 'FLOW_NODE_CONDITION_TYPE_FIFTEEN' || item.type == 'FLOW_NODE_CONDITION_TYPE_SIXTEEN' || item.type == 'FLOW_NODE_CONDITION_TYPE_EIGHTEEN' || item.type == 'FLOW_NODE_CONDITION_TYPE_NINETEEN'" value="FLOW_NODE_CONDITION_UNIT_TWO">元</a-select-option>
                      <!-- 合同时长 -->
                      <a-select-option v-if="item.type == 'FLOW_NODE_CONDITION_TYPE_FOUR'" value="FLOW_NODE_CONDITION_UNIT_THREE">天</a-select-option>
                      <!-- 成交单价 -->
                      <a-select-option v-if="item.type == 'FLOW_NODE_CONDITION_TYPE_NINE'" value="FLOW_NODE_CONDITION_UNIT_NINE">元/m²</a-select-option>
                      <!-- 租赁条款单价&物业条款单价 -->
                      <template v-if="item.type == 'FLOW_NODE_CONDITION_TYPE_SIX' || item.type == 'FLOW_NODE_CONDITION_TYPE_SEVEN'">
                        <a-select-option value="FLOW_NODE_CONDITION_UNIT_FOUR"> 元/m²·天</a-select-option>
                        <a-select-option value="FLOW_NODE_CONDITION_UNIT_FIVE">元/m²·月</a-select-option>
                        <a-select-option value="FLOW_NODE_CONDITION_UNIT_SIX">元/天</a-select-option>
                        <a-select-option value="FLOW_NODE_CONDITION_UNIT_SEVEN">元/月</a-select-option>
                        <a-select-option value="FLOW_NODE_CONDITION_UNIT_EIGHT">元/年</a-select-option>
                      </template>
                    </a-select>
                  </a-form-model-item>
                </template>
                <!-- 合同类型 -->
                <a-form-model-item v-if="item.type == 'FLOW_NODE_CONDITION_TYPE_FIVE'" style="flex: 1;">
                  <a-select v-model="item.judgeType" @change="contractTypeChange">
                    <a-select-option value="FLOW_NODE_CONDITION_JUDGE_TYPE_SIX">租赁合同</a-select-option>
                    <a-select-option value="FLOW_NODE_CONDITION_JUDGE_TYPE_SEVEN">物业合同</a-select-option>
                    <a-select-option value="FLOW_NODE_CONDITION_JUDGE_TYPE_EIGHT">租赁合同、物业合同</a-select-option>
                  </a-select>
                </a-form-model-item>
                <!-- 付款方式 -->
                <a-form-model-item v-if="item.type == 'FLOW_NODE_CONDITION_TYPE_TEN'" style="flex: 1;">
                  <a-select v-model="item.judgeType" @change="contractTypeChange">
                    <a-select-option value="FLOW_NODE_CONDITION_JUDGE_TYPE_NINE">全款支付</a-select-option>
                    <a-select-option value="FLOW_NODE_CONDITION_JUDGE_TYPE_TEN">按揭支付</a-select-option>
                  </a-select>
                </a-form-model-item>
                <!-- 费用名称 -->
                <a-form-model-item v-if="item.type == 'FLOW_NODE_CONDITION_TYPE_TWELVE'" :prop="'ruleArr.'+bigindex+'.judgeValue1'" :rules="[{ validator: judgeValue1Validator, trigger: 'change' }]" style="flex: 1;" placeholder="请选择费用名称">
                  <a-select v-model="item.judgeValue1">
                    <a-select-option v-for="item in costTypeList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <!-- 调整类型 -->
                <a-form-model-item v-if="item.type == 'FLOW_NODE_CONDITION_TYPE_FOURTEEN'" style="flex: 1;">
                  <a-select v-model="item.judgeType" @change="contractTypeChange">
                    <a-select-option value="FLOW_NODE_CONDITION_JUDGE_TYPE_ELEVEN">调增</a-select-option>
                    <a-select-option value="FLOW_NODE_CONDITION_JUDGE_TYPE_TWELVE">调减</a-select-option>
                    <a-select-option value="FLOW_NODE_CONDITION_JUDGE_TYPE_THIRTEEN">坏账</a-select-option>
                  </a-select>
                </a-form-model-item>
                <!-- 开票类型 -->
                <a-form-model-item v-if="item.type == 'FLOW_NODE_CONDITION_TYPE_SEVENTEEN'" style="flex: 1;">
                  <a-select v-model="item.judgeType" @change="contractTypeChange">
                    <a-select-option value="FLOW_NODE_CONDITION_JUDGE_TYPE_FIFTEEN">增值税专用发票</a-select-option>
                    <a-select-option value="FLOW_NODE_CONDITION_JUDGE_TYPE_FOURTEEN">增值税普通发票</a-select-option>
                    <a-select-option value="FLOW_NODE_CONDITION_JUDGE_TYPE_SIXTEEN">增值税电子普通发票</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-button v-if="!bigindex" icon="plus" @click="addData">添加</a-button>
                <a-button v-else type="link" @click="delData(bigindex)">删除</a-button>
              </div>
            </div>
          </div>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>


<script>
import _ from 'lodash'
export default {
  name: 'setConditionModal',
  props: {
    itemData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      selectRangeArr: [{
        name: '大于',
        key: 'FLOW_NODE_CONDITION_JUDGE_TYPE_ONE'
      },{
        name: '大于等于',
        key: 'FLOW_NODE_CONDITION_JUDGE_TYPE_TWO'
      },{
        name: '小于',
        key: 'FLOW_NODE_CONDITION_JUDGE_TYPE_THREE'
      },{
        name: '小于等于',
        key: 'FLOW_NODE_CONDITION_JUDGE_TYPE_FOUR'
      },{
        name: '介于(两数之间)',
        key: 'FLOW_NODE_CONDITION_JUDGE_TYPE_FIVE'
      }],
      form: {
        ruleArr: [{
          id: '',
          type: 'FLOW_NODE_CONDITION_TYPE_ONE',
          name: '发起人',
          launchUserIds: [],
          unit: '',//面积单位
          judgeType: '',//范围类型
          judgeValue1: null,//最小值
          judgeValue2: null,//最大值
        }]
      },
      rules: {
        'contractClause.rentNum': [{ required: true, message: '请输入租赁数量', trigger: 'blur' }],
        'rule.depositJson.depositAmount': [{ required: true, message: '请输入保证金金额', trigger: 'blur' }]
      },
      dataArr: [],
      userData: [
        { id: '1', realName: '张三' },
        { id: '2', realName: '李四' },
        { id: '3', realName: '王五' },
        { id: '4', realName: '赵六' },
        { id: '5', realName: '狗蛋' },
        { id: '6', realName: '狗剩' },
        { id: '7', realName: '狗娃' }
      ],
      costTypeList: [],//费用名称
      childIndex: null,
      currentIndex: null
    }
  },
  computed: {
    selectTypeArr() {
      return [{
        name: '发起人',
        key: 'FLOW_NODE_CONDITION_TYPE_ONE',
      },{
        name: '面积数',
        key: 'FLOW_NODE_CONDITION_TYPE_TWO',
      },{
        name: '合同总价',
        key: 'FLOW_NODE_CONDITION_TYPE_THREE',
      },{
        name: '合同时长',
        key: 'FLOW_NODE_CONDITION_TYPE_FOUR',
      },{
        name: '合同类型',
        key: 'FLOW_NODE_CONDITION_TYPE_FIVE',
      },{
        name: '租赁条款单价',
        key: 'FLOW_NODE_CONDITION_TYPE_SIX',
      },{
        name: '物业条款单价',
        key: 'FLOW_NODE_CONDITION_TYPE_SEVEN',
      }]
    },
  },
  methods: {
    showForm(dataArr, index, childIndex) {
      this.visible = true
      this.$nextTick(() => {
        this.dataArr = dataArr
        this.childIndex = childIndex
        this.currentIndex = index
        this.form.ruleArr = []
        // 处理已有的规则数据
        let editRuleArr = this.itemData && this.itemData.conditionArr && this.itemData.conditionArr.length && this.itemData.conditionArr[childIndex].rules && this.itemData.conditionArr[childIndex].rules.length ? _.cloneDeep(this.itemData.conditionArr[childIndex].rules) : [{
          id: '',
          type: 'FLOW_NODE_CONDITION_TYPE_ONE',
          name: '发起人',
          launchUserIds: [],
          unit: '',//面积单位
          judgeType: '',//范围类型
          judgeValue1: null,//最小值
          judgeValue2: null,//最大值
        }]
        if(editRuleArr && editRuleArr.length) {
          editRuleArr.forEach(item => {
            if(item.launchUserIds && typeof(item.launchUserIds) == 'string') {
              item.launchUserIds = item.launchUserIds.split(',')
            }
          });
        }
        console.log(editRuleArr, 'editRuleArr')
        this.$set(this.form, 'ruleArr', editRuleArr)
      })
    },
    addData() {
      this.form.ruleArr.push({
        id: '',
        type: 'FLOW_NODE_CONDITION_TYPE_ONE',
        name: '发起人',
        launchUserIds: []
      })
      this.$refs.ruleForm.clearValidate()
    },
    delData(index) {
      this.form.ruleArr.splice(index, 1)
      this.$refs.ruleForm.clearValidate()
    },
    contractTypeChange() {
      this.$forceUpdate()
    },
    launchUserIdsValidator(rule, value, callback) {
      if(!(value && value.length)) {
        callback(new Error('请选择发起人'))
      }else {
        const index = rule.field.split('.')[1]*1
        let arr = []
        if(value && value.length) {
          value.forEach(item => {
            this.userData.forEach(ele => {
              if(ele.id == item) {
                arr.push(ele.realName || ele.username)
              }
            })
          })
        }
        this.$set(this.form.ruleArr[index], 'ruleName', arr.join(','))
        this.$forceUpdate()
        callback()
      }
    },
    judgeValue1Validator(rule, value, callback) {
      if(!value) {
        callback(new Error('请选择费用名称'))
      }else {
        const index = rule.field.split('.')[1]*1
        // 费用明细
        this.costTypeList.forEach(ele => {
          if(ele.id == value) {
            this.form.ruleArr[index].ruleName = ele.name
          }
        })
        callback()
        this.$forceUpdate()
      }
    },
    changeRuleType(item) {
      // 清空数值
      item.launchUserIds = []
      this.$set(item, 'judgeValue1', null)
      this.$set(item, 'judgeValue2', null)
      item.judgeType = item.type == 'FLOW_NODE_CONDITION_TYPE_FIVE' ? 'FLOW_NODE_CONDITION_JUDGE_TYPE_SIX' : 
                       item.type == 'FLOW_NODE_CONDITION_TYPE_TEN' ? 'FLOW_NODE_CONDITION_JUDGE_TYPE_NINE' : 
                       item.type == 'FLOW_NODE_CONDITION_TYPE_FOURTEEN' ? 'FLOW_NODE_CONDITION_JUDGE_TYPE_ELEVEN' :
                       item.type == 'FLOW_NODE_CONDITION_TYPE_SEVENTEEN' ? 'FLOW_NODE_CONDITION_JUDGE_TYPE_FOURTEEN' : 
                       (item.type != 'FLOW_NODE_CONDITION_TYPE_ONE' && item.type != 'FLOW_NODE_CONDITION_TYPE_FIVE' && 
                       item.type != 'FLOW_NODE_CONDITION_TYPE_TEN' && item.type != 'FLOW_NODE_CONDITION_TYPE_TWELVE' &&
                       item.type != 'FLOW_NODE_CONDITION_TYPE_FOURTEEN' && item.type != 'FLOW_NODE_CONDITION_TYPE_SEVENTEEN') ? 'FLOW_NODE_CONDITION_JUDGE_TYPE_ONE' : ''
      item.unit = item.type == 'FLOW_NODE_CONDITION_TYPE_TWO' ? 'FLOW_NODE_CONDITION_UNIT_ONE' : 
                  (item.type == 'FLOW_NODE_CONDITION_TYPE_THREE' || item.type == 'FLOW_NODE_CONDITION_TYPE_EIGHT' ||
                  item.type == 'FLOW_NODE_CONDITION_TYPE_ELEVEN' || item.type == 'FLOW_NODE_CONDITION_TYPE_THIRTEEN' || 
                  item.type == 'FLOW_NODE_CONDITION_TYPE_FIFTEEN' || item.type == 'FLOW_NODE_CONDITION_TYPE_SIXTEEN' || 
                  item.type == 'FLOW_NODE_CONDITION_TYPE_EIGHTEEN' || item.type == 'FLOW_NODE_CONDITION_TYPE_NINETEEN') ? 'FLOW_NODE_CONDITION_UNIT_TWO' : 
                  item.type == 'FLOW_NODE_CONDITION_TYPE_FOUR' ? 'FLOW_NODE_CONDITION_UNIT_THREE' : 
                  item.type == 'FLOW_NODE_CONDITION_TYPE_SIX' || item.type == 'FLOW_NODE_CONDITION_TYPE_SEVEN' ? 'FLOW_NODE_CONDITION_UNIT_FOUR' : 
                  item.type == 'FLOW_NODE_CONDITION_TYPE_NINE' ? 'FLOW_NODE_CONDITION_UNIT_NINE' : ''
      this.selectTypeArr.forEach(ele => {
        if(ele.key == item.type) {
          item.name = ele.name
        }
      })
      this.$forceUpdate()
      this.$refs.ruleForm.clearValidate()
    },
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          this.confirmLoading = true
          let values = {
            ...this.itemData,
          }
          const ruleArr = _.cloneDeep(this.form.ruleArr)
          if(ruleArr && ruleArr.length) {
            ruleArr.forEach(item => {
              // 处理显示的规则文字
              // judgeType
              if(item.judgeType) {
                let judgeTypeName = ''
                this.selectRangeArr.forEach(ele => {
                  if(ele.key == item.judgeType) {
                    judgeTypeName = ele.name
                  }
                })
                judgeTypeName = item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_SIX' ? '租赁合同' : 
                                item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_SEVEN' ? '物业合同' : 
                                item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_EIGHT' ? '租赁合同、物业合同' :
                                item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_NINE' ? '全款支付' : 
                                item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_TEN' ? '按揭支付' :
                                item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_ELEVEN' ? '调增' :
                                item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_TWELVE' ? '调减' :
                                item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_THIRTEEN' ? '坏账' :
                                item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_FOURTEEN' ? '增值税普通发票' :
                                item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_FIFTEEN' ? '增值税专用发票' :
                                item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_SIXTEEN' ? '增值税电子普通发票' : judgeTypeName
                item.judgeTypeName = judgeTypeName
              }
              // 单位
              let unitName = ''
              unitName = item.unit ? item.unit == 'FLOW_NODE_CONDITION_UNIT_ONE' ? 'm²' :
                    item.unit == 'FLOW_NODE_CONDITION_UNIT_TWO' ? '元' :
                    item.unit == 'FLOW_NODE_CONDITION_UNIT_THREE' ? '天' :
                    item.unit == 'FLOW_NODE_CONDITION_UNIT_FOUR' ? '元/m²·天' :
                    item.unit == 'FLOW_NODE_CONDITION_UNIT_FIVE' ? '元/m²·月' :
                    item.unit == 'FLOW_NODE_CONDITION_UNIT_SIX' ? '元/天' :
                    item.unit == 'FLOW_NODE_CONDITION_UNIT_SEVEN' ? '元/月' :
                    item.unit == 'FLOW_NODE_CONDITION_UNIT_EIGHT' ? '元/年' :
                    item.unit == 'FLOW_NODE_CONDITION_UNIT_NINE' ? '元/m²' : '' : ''
              item.unitName = unitName
              // 发起人
              item.launchUserIds = item.launchUserIds && item.launchUserIds.length ? item.launchUserIds.join(',') : ''
              item.ruleName = item.type == 'FLOW_NODE_CONDITION_TYPE_TWELVE' || item.type == 'FLOW_NODE_CONDITION_TYPE_ONE' ? item.ruleName : 
                              item.judgeType == 'FLOW_NODE_CONDITION_JUDGE_TYPE_FIVE' ? item.judgeTypeName + item.judgeValue1 + '-' + item.judgeValue2 + item.unitName :
                              item.judgeValue1 ? item.judgeTypeName + item.judgeValue1 + item.unitName : 
                              item.judgeTypeName ? item.judgeTypeName : ''
            })
          }
          values.conditionArr[this.childIndex].rules = ruleArr
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('closeModal', this.dataArr, this.currentIndex, values, this.childIndex)
          }, 1000);
        }else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.$emit('closeModal')
    }
  }
}
</script>
<style lang="less" scoped>
.ccc {
  color: #999999;
}
.item {
  margin-bottom: 24px;
}
.table-box {
  width: 100%;
  border: 1px solid #e4e5e7;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  flex-direction: column;
  align-content: center;
  background: #fff;
  .title {
    padding: 10px 16px;
    color: #999999;
    border-bottom: 1px solid #e4e5e7;
  }
}
.box {
  border: 1px solid #e4e5e7;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: center;
  padding: 20px;
  background: #fff;
  .boxDis {
    width: 100%;
    margin-bottom: 16px;
    .title {
      margin: 10px 0;
      color: #999999;
    }
    .item_box {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      /deep/ .ant-form-item {
        margin-bottom: 0;
        margin-right: 16px;
      }
      /deep/ .ant-btn {
        margin-top: 3px;
      }
    }
  }
}
</style>
