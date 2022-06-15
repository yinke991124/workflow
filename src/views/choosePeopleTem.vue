<template>
  <div class="item">
    <h4><i class="pub-requir-color">*</i> 人员选择</h4>
    <div class="box">
      <div class="boxDis">
        <a-transfer
          show-search
          :data-source="userData"
          :list-style="{ width: '335px', height: '300px' }"
          :target-keys="targetKeys"
          :render="item => `${item.realName}  ${item.mobile ? item.mobile : ''}`"
          @change="handleChange"
          :titles="['人员选择', '已选人员']"
        />
        <template v-if="treeData && treeData.length">
          <a-tree-select
            v-model="orgId"
            class="sel_box"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            @change="onchange"
          />
        </template>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'choosePeopleTem',
  props: {
    // 默认选中的人
    defaultTargetKeys: {
      type: Array,
      default: () => []
    },
  },
  watch: {
    defaultTargetKeys: {
      handler(val) {
        if(val) {
          this.userData.forEach(item => {
            if(val.indexOf(item.key) > -1) {
              item.chosen = true
            }
          })
        }
      },
      deep: true
    }
  },
  data() {
    return {
      targetKeys: this.defaultTargetKeys && this.defaultTargetKeys.length ? this.defaultTargetKeys : [],
      targetNames: [],
      treeData: [],
      orgId: null,
      userData: []
    }
  },
  created() {
    /* getOrgList().then(res => {
      this.treeData = this.formatterData(res)
      if(res && res.length) {
        this.getUserData(res[0].id)
        this.orgId = res[0].id
      }
    }) */
  },
  methods: {
    formatterData(arr) {
      const returnArr = []
      arr.forEach(item => {
        const obj = {}
        obj.title = item.name
        obj.value = item.id
        obj.key = item.id
        if (item.child && item.child.length) {
          obj.children = this.formatterData(item.child)
        }
        returnArr.push(obj)
      })
      return returnArr
    },
    onchange(value) {
      this.getUserData(value)
    },
    getUserData(orgId, value) {
      /* getUserList({orgId: orgId, keyword: value, pageSize: 88888888}).then(res => {
        if(res && res.voList && res.voList.length) {
          res.voList.forEach(item => {
            item.key = item.id+''
            item.title = item.realName
          })
        }
        this.userData = res.voList
      }) */
    },
    handleChange(targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys;
      this.targetNames = []
      if(targetKeys && targetKeys.length) {
        targetKeys.forEach(item => {
          this.userData.forEach(ele => {
            if(ele.id == item) {
              this.targetNames.push(ele.title)
            }
          })
        })
      }
      this.$emit('choosePeople', targetKeys, this.targetNames)
    },
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
    position: relative;
    .sel_box {
      width: 120px;
      position: absolute;
      left: 13px;
      top: 53px;
    }
    .title {
      margin: 10px 0;
      color: #999999;
    }
    /deep/ .ant-transfer-list-body-search-wrapper {
      width: 60% !important;
      right: 0 !important;
      left: unset !important;
    }
    /deep/ .ant-transfer-list {
      &:last-child {
        .ant-transfer-list-body-with-search {
          .ant-transfer-list-body-search-wrapper {
            width: 100% !important;
            display: none;
          }
        }
        .ant-transfer-list-content {
          margin-top: -50px;
        }
      }
    }
  }
}
</style>
