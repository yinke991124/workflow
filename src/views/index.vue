<template>
  <div>
    <work-flow ref="workflow" :workflowList="workflowList" :isNextVerify="isNextVerify" @saveData="saveData" />
    <a-button @click="handleSubmit" type="primary" class="btn">保存</a-button>
  </div>
</template>
<script>
import WorkFlow from './workflow.vue'
export default {
  components: { WorkFlow },
  data() {
    return {
      workflowList: [],
      isNextVerify: false,
      hasUnfinished: 'NO',//是否有未填写数据，NO为条件符合，数据完整，过。YES为条件不符合，数据缺失，提示
      hasApprover: 'NO',//至少有一个审批人，NO为条件不符合，提示，YES符合，过
    }
  },
  watch: {
    workflowList: {
      handler(val) {
        if(val && val.length) {
          this.isNextVerify = false
        }
      },
      deep: true
    }
  },
  methods: {
    saveData(val) {//监听到的所有变化后的数据
      this.workflowList = val
    },
    // 校验数据
    verifyData(data) {
      // hasUnfinished: 'NO',//是否有未填写数据，NO为条件符合，数据完整，过。YES为条件不符合，数据缺失，提示
      // hasApprover: 'NO',//至少有一个审批人，NO为条件不符合，提示，YES符合，过
      //至少有一个审批人
      let flag = data.some(item => {
        return item.type == 'FLOW_NODE_TYPE_APPROVAL'
      })
      this.hasApprover = flag ? 'YES' : 'NO'
      if(this.hasApprover == 'NO') return

      for (let index = 0; index < data.length; index++) {
        if(this.hasApprover == 'NO') break
        if(data[index].type == 'FLOW_NODE_TYPE_APPROVAL' && !data[index].approvalUserIds) {
          this.hasUnfinished = 'YES'
          break
        }
        if(data[index].type == 'FLOW_NODE_TYPE_CC' && !data[index].ccUserIds) {
          this.hasUnfinished = 'YES'
          break
        }
        if(data[index].type == 'FLOW_NODE_TYPE_CONDITION') {
          // 未填写条件(是否每一项都有条件)
          let flag1 = data[index].conditionArr.every(item => {
            return item.rules && item.rules.length
          })
          this.hasUnfinished = flag1 ? 'NO' : 'YES'
          if(!flag1) {
            break
          }
          // 条件未添加子项，用于判断是否有审批人
          let flag2 = data[index].conditionArr.every(item => {
            return item.children && item.children.length
          })
          this.hasApprover = flag2 ? 'YES' : 'NO'
          if(!flag2) {
            break
          }
          if(this.hasApprover == 'NO') break
          for (let eleIndex = 0; eleIndex < data[index].conditionArr.length; eleIndex++) {
            if(this.hasApprover == 'NO') break
            this.verifyData(data[index].conditionArr[eleIndex].children)
          }
        }
      }
    },
    handleSubmit() {
      if(this.workflowList && this.workflowList.length) {
        this.isNextVerify = true
        this.verifyData(this.workflowList)
        // hasUnfinished: 'NO',//是否有未填写数据，NO为条件符合，数据完整，过。YES为条件不符合，数据缺失，提示
        // hasApprover: 'NO',//至少有一个审批人，NO为条件不符合，提示，YES符合，过
        if(this.hasUnfinished == 'YES' || this.hasApprover == 'NO') {
          if(this.hasApprover == 'NO') {
            this.$message.error('在当前条件下至少应该存在一个审批人')
          }
          return false
        }
      }else {
        this.$message.error('请设置流程')
        return false
      }
      this.$message.success('已保存')
      console.log(this.workflowList, '保存的数据')
    }
  }
}
</script>
<style lang="less" scoped>
  .btn {
    position: absolute;
    top: 5%;
    right: 5%;
  }
</style>