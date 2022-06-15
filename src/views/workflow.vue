<template>
  <div class="main_box">
    <div class="inner_box">
      <div class="circle pub_line">
        <p>开始</p>
      </div>
      <div class="add_btn pub_line">
        <a-dropdown overlayClassName="dropdownbox">
          <a-icon type="plus-square" class="add" @click="e => e.preventDefault()" />
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="addItem('FLOW_NODE_TYPE_APPROVAL', treeData, 0)"> <a-icon type="user" />审批人</a-menu-item>
            <a-menu-item key="2" @click="addItem('FLOW_NODE_TYPE_CC', treeData, 0)"> <a-icon type="user" />抄送人</a-menu-item>
            <a-menu-item key="3" @click="addItem('FLOW_NODE_TYPE_CONDITION', treeData, 0)"> <a-icon type="user" />条件分支</a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <recursion-template ref="recursionTemplate" :isNextVerify="isNextVerify" :treeData="treeData" @addConditionItem="addConditionItem" @addItem="addItem" @delData="delData" @setDetailData="setDetailData" @saveData="saveData" />
      <div class="circle">
        <p>结束</p>
      </div>
    </div>
    <set-approver-modal ref="setApproverModal" v-if="showApproverModal" :itemData="currentItem" @closeModal="closeApproverModal" />
    <set-carbon-copy-modal ref="setCarbonCopyModal" v-if="showCarbonCopyModal" :itemData="currentItem" @closeModal="closeCarbonCopyModal" />
    <set-condition-modal ref="setConditionModal" v-if="showConditionModal" :itemData="currentItem" @closeModal="closeConditionModal" />
  </div>
</template>
<script>
import RecursionTemplate from './recursionTemplate'
import SetApproverModal from './setApproverModal'
import SetCarbonCopyModal from './setCarbonCopyModal'
import SetConditionModal from './setConditionModal'
export default {
  name: 'workflow',
  props: {
    workflowList: {
      type: Array,
      default: () => []
    },
    isNextVerify: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
    RecursionTemplate,
    SetApproverModal,
    SetCarbonCopyModal,
    SetConditionModal,
  },
  data() {
    return {
      // treeData: this.workflowList && this.workflowList.length ? this.workflowList : [],
      showApproverModal: false,
      showCarbonCopyModal: false,
      showConditionModal: false,
      currentItem: {},
      treeData: this.workflowList && this.workflowList.length ? this.workflowList : [],
      /* [
        {
        type: 'FLOW_NODE_TYPE_APPROVAL',
        name: "审批人",
        approverName: [],//选中的审批人姓名
        approvalUserIds: '',//选中的审批人id
      },{
        type: 'FLOW_NODE_TYPE_CC',
        name: "抄送人",
        carbonCopyName: [],//选中的抄送人姓名
        ccUserIds: ''//选中的抄送人id
      },{
        type: 'FLOW_NODE_TYPE_CONDITION',
        name: "条件",
        conditionArr: [{//条件组，可多条
          type: 'FLOW_NODE_TYPE_CONDITION_ITEM',
          name: "条件1",
          rules: [],//当前条件设置的一系列规则组
          children: [{//其他条件
            type: 'FLOW_NODE_TYPE_APPROVAL',
            name: "审批人",
            approverName: [],//选中的审批人姓名
            approvalUserIds: '',//选中的审批人id
          },{
            type: 'FLOW_NODE_TYPE_CONDITION',
            name: "条件",
            conditionArr: [{
              type: 'FLOW_NODE_TYPE_CONDITION_ITEM',
              name: "条件1",
              rules: [],
              children: []
            },{
              type: 'FLOW_NODE_TYPE_CONDITION_ITEM',
              name: "条件2",
              rules: [],
              children: []
            }]
          }]
        },{
          type: 'FLOW_NODE_TYPE_CONDITION_ITEM',
          name: "条件2",
          rules: [],
          children: [{
            type: 'FLOW_NODE_TYPE_CC',
            name: "抄送人",
            carbonCopyName: [],//选中的抄送人姓名
            ccUserIds: ''//选中的抄送人id
          }]
        }]
      }] */
    }
  },
  methods: {
    // 传递当前数据
    saveData(val) {
      this.$emit('saveData', val)
    },
    // 新增主线
    addItem(type, dataArr, index) {
      if(type == 'FLOW_NODE_TYPE_APPROVAL') {
        let objCopy = {
          type: type,
          name: "审批人",
          approverName: [],
          approvalUserIds: '',
        }
        dataArr.splice(index, 0, objCopy)
      }else if(type == 'FLOW_NODE_TYPE_CC') {
        let objCopy = {
          type: type,
          name: "抄送人",
          carbonCopyName: [],
          ccUserIds: ''
        }
        dataArr.splice(index, 0, objCopy)
      }else {
        let objCopy = {
          type: type,
          name: "条件",
          conditionArr: [{
            type: 'FLOW_NODE_TYPE_CONDITION_ITEM',
            name: "条件",
            rules: [],
            children: []
          },{
            type: 'FLOW_NODE_TYPE_CONDITION_ITEM',
            name: "条件",
            rules: [],
            children: []
          }]
        }
        dataArr.splice(index, 0, objCopy)
      }
    },
    // 删除
    delData(dataArr, index, type, parentItem, parentIndex) {
      if(type && type == 'FLOW_NODE_TYPE_CONDITION_ITEM') {
        if(dataArr && dataArr.length > 2) {
          dataArr.splice(index, 1)
        }else {
          dataArr.splice(0,2)
          parentItem.splice(parentIndex, 1)
        }
      }else {
        dataArr.splice(index, 1)
      }
    },
    // 新增条件
    addConditionItem(item) {
      item.conditionArr.push({
        type: 'FLOW_NODE_TYPE_CONDITION_ITEM',
        name: "新增条件",
        children: []
      })
    },
    setDetailData(type, dataArr, index, item, childIndex) {
      if(type == 'FLOW_NODE_TYPE_APPROVAL') {
        this.chooseApprover(dataArr, index, item)
      }else if(type == 'FLOW_NODE_TYPE_CC') {
        this.chooseCarbonCopy(dataArr, index, item)
      }else {
        this.setCondition(dataArr, index, item, childIndex)
      }
    },
    // 设置审批人
    chooseApprover(dataArr, index, item) {
      this.showApproverModal = true
      this.currentItem = item
      this.$nextTick(() => {
        this.$refs.setApproverModal.showForm(dataArr, index)
      })
    },
    closeApproverModal(dataArr, index, item) {
      this.showApproverModal = false
      if(dataArr && item && Object.keys(item).length) {
        // 保存数据
        dataArr.splice(index, 1, item)
      }
    },
    // 设置抄送人
    chooseCarbonCopy(dataArr, index, item) {
      this.showCarbonCopyModal = true
      this.currentItem = item
      this.$nextTick(() => {
        this.$refs.setCarbonCopyModal.showForm(dataArr, index)
      })
    },
    closeCarbonCopyModal(dataArr, index, item) {
      this.showCarbonCopyModal = false
      if(dataArr && item && Object.keys(item).length) {
        // 保存数据
        dataArr.splice(index, 1, item)
      }
    },
    // 设置条件
    setCondition(dataArr, index, item, childIndex) {
      this.showConditionModal = true
      this.currentItem = item
      this.$nextTick(() => {
        this.$refs.setConditionModal.showForm(dataArr, index, childIndex)
      })
    },
    closeConditionModal(dataArr, index, item) {
      if(dataArr && item && Object.keys(item).length) {
        // 保存数据
        dataArr.splice(index, 1, item)
      }
      this.showConditionModal = false
    },
  }
}
</script>
<style lang="less">
  @import './workflow.less';
</style>