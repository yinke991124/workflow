<template>
  <div>
    <div class="rule_box"  v-for="(item, index) in dataArr" :key="index">
      <div v-if="item.type == 'FLOW_NODE_TYPE_APPROVAL'">
        <div class="rule_item">
          <p class="tit">
            <span>审批人</span>
            <span @click="delData(dataArr, index)">&times;</span>
          </p>
          <div class="content_box" :class="{'ccc':!(item.approverName && item.approverName.length)}" @click="setDetailData('FLOW_NODE_TYPE_APPROVAL', dataArr, index, item)">
            <span>{{ item.approverName && item.approverName.length ? item.approverName.join('/') : '请选择审批人' }}</span>
            <span class="arrow">&gt;</span>
          </div>
        </div>
        <p class="pub-requir-color showTip" v-if="!(item.approverName && item.approverName.length) && isNextVerify">请选择人员</p>
      </div>
      <div v-if="item.type == 'FLOW_NODE_TYPE_CC'">
        <div class="rule_item">
          <p class="tit">
            <span>抄送人</span>
            <span @click="delData(dataArr, index)">&times;</span>
          </p>
          <div class="content_box" :class="{'ccc':!(item.carbonCopyName && item.carbonCopyName.length)}" @click="setDetailData('FLOW_NODE_TYPE_CC', dataArr, index, item)">
            <span>{{ item.carbonCopyName && item.carbonCopyName.length ? item.carbonCopyName.join('/') : '请选择抄送人' }}</span>
            <span class="arrow">&gt;</span>
          </div>
        </div>
        <p class="pub-requir-color showTip" v-if="!(item.carbonCopyName && item.carbonCopyName.length) && isNextVerify">请选择人员</p>
      </div>
      <div class="condition_box" v-if="item.type == 'FLOW_NODE_TYPE_CONDITION' && item.conditionArr && item.conditionArr.length">
        <div class="top_add">
          <a-button @click="addConditionItem(item, dataArr, index)" class="blue">添加条件</a-button>
        </div>
        <div class="rule_box row condition_inner">
          <div class="box" v-for="(child, childIndex) in item.conditionArr" :key="childIndex">
            <div class="rule_box">
              <!-- 线条 -->
              <div class="line_box" :class="{ 'end': childIndex == 0, 'start': childIndex == item.conditionArr.length-1 }"></div>
              <div class="rule_item_box">
                <div class="rule_item">
                  <p class="tit">
                    <span>条件{{childIndex+1}}</span>
                    <span @click="delData(item.conditionArr, childIndex, 'FLOW_NODE_TYPE_CONDITION_ITEM', dataArr, index)">&times;</span>
                  </p>
                  <div class="content_box" @click="setDetailData('FLOW_NODE_TYPE_CONDITION', dataArr, index, item, childIndex )">
                    <template v-if="child.rules && child.rules.length">
                      <p class="ccc ruleName" v-for="(rule, ruleIndex) in child.rules" :key="ruleIndex">{{ rule.name + '：' + rule.ruleName }}</p>
                    </template>
                    <template v-else>
                      <span class="ccc">请设置条件</span>
                      <span class="arrow">&gt;</span>
                    </template>
                  </div>
                </div>
                <p class="pub-requir-color showTip" v-if="!(child.rules && child.rules.length) && isNextVerify">请设置条件</p>
              </div>
              <div class="add_btn pub_line pub_top_line">
                <a-dropdown overlayClassName="dropdownbox">
                  <a-icon type="plus-square" class="add" @click="e => e.preventDefault()" />
                  <a-menu slot="overlay">
                    <a-menu-item key="1" @click="addItem('FLOW_NODE_TYPE_APPROVAL', child.children, index)"> <a-icon type="user" />审批人</a-menu-item>
                    <a-menu-item key="2" @click="addItem('FLOW_NODE_TYPE_CC', child.children, index)"> <a-icon type="user" />抄送人</a-menu-item>
                    <a-menu-item key="3" @click="addItem('FLOW_NODE_TYPE_CONDITION', child.children, index)"> <a-icon type="user" />条件分支</a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
              <template v-if="child.children && child.children.length">
                <recursion-template :isNextVerify="isNextVerify" :treeData="child.children" @addConditionItem="addConditionItem" @addItem="addItem" @delData="delData" @setDetailData="setDetailData" />
              </template>
            </div>
            <div class="vertical_line">
              <div class="inner_line"></div>
              <div class="bot_line" :class="{ 'end': childIndex == 0, 'start': childIndex == item.conditionArr.length-1 }"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="add_btn pub_line pub_top_line" v-if="index+1 <= dataArr.length">
        <a-dropdown overlayClassName="dropdownbox">
          <a-icon type="plus-square" class="add" @click="e => e.preventDefault()" />
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="addItem('FLOW_NODE_TYPE_APPROVAL', dataArr, index+1)"> <a-icon type="user" />审批人</a-menu-item>
            <a-menu-item key="2" @click="addItem('FLOW_NODE_TYPE_CC', dataArr, index+1)"> <a-icon type="user" />抄送人</a-menu-item>
            <a-menu-item key="3" @click="addItem('FLOW_NODE_TYPE_CONDITION', dataArr, index+1)"> <a-icon type="user" />条件分支</a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'RecursionTemplate',
    props: {
        treeData: {
          type: Array,
          default: () => []
        },
        isNextVerify: {
          type: Boolean,
          default: () => false
        }
    },
    data() {
        return {
          dataArr: this.treeData,
        }
    },
    watch: {
      treeData: {
        handler(val) {
          this.formatterData(val)
          this.dataArr = val
          // 传递当前数据
          this.$emit('saveData', val)
        },
        deep: true
      }
    },
    methods: {
      addConditionItem(item, dataArr, index) {
        this.$emit('addConditionItem', item, dataArr, index)
      },
      addItem(type, dataArr, index) {
        this.$emit('addItem', type, dataArr, index)
      },
      delData(dataArr, index, type, parentItem, parentIndex) {
        this.$emit('delData', dataArr, index, type, parentItem, parentIndex)
      },
      formatterData(data) {
        if(data && data.length) {
          data.forEach(item => {
            if(item.type == 'FLOW_NODE_TYPE_CONDITION' && item.conditionArr && item.conditionArr.length) {
              item.conditionArr.forEach(ele => {
                if(ele.children && ele.children.length) {
                  this.formatterData(ele.children)
                }
              })
            }else {
              if(item.children && item.children.length) {
                this.formatterData(item.children)
              }
            }
          })
        }
      },
      setDetailData(type, dataArr, index, item, childIndex) {
        this.$emit('setDetailData', type, dataArr, index, item, childIndex)
      },
    }
}
</script>
<style lang="less" scoped>
  @import './workflow.less';
</style>