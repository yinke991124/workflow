<template>
  <a-modal
    title="设置抄送人"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :bodyStyle="{background: '#F0F2F5'}"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :colon="false" :form="form">
        <a-form-item label="抄送人">
          <a-select @change="chooseUser" mode="multiple" v-decorator="['ccUserIds', { rules: [{ required: true, message: '请选择抄送人' }], initialValue: targetKeys }]">
            <a-select-option v-for="item in auditUserArr" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import _ from 'lodash'
export default {
  name: 'setApproverModal',
  props: {
    itemData: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      targetNames: this.itemData && this.itemData.carbonCopyName && this.itemData.carbonCopyName.length ? this.itemData.carbonCopyName : [],
      currentIndex: null,
      dataArr: [],
      auditUserArr: [
        { id: '1', name: '张三' },
        { id: '2', name: '李四' },
        { id: '3', name: '王五' },
        { id: '4', name: '赵六' },
        { id: '5', name: '狗蛋' },
        { id: '6', name: '狗剩' },
        { id: '7', name: '狗娃' }
      ]
    }
  },
  computed: {
    targetKeys() {
      return this.itemData && this.itemData.ccUserIds ? this.itemData.ccUserIds.split(',') : []
    }
  },
  methods: {
    showForm(dataArr, index) {
      this.visible = true
      this.$nextTick(() => {
        this.dataArr = dataArr
        this.currentIndex = index
      })
    },
    chooseUser(val) {
      this.targetNames = []
      if(val && val.length) {
        this.auditUserArr.forEach(item => {
          if(val.indexOf(item.id) > -1) {
            this.targetNames.push(item.name)
          }
        })
      }else this.targetNames = []
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, fieldsValue) => {
        if (!errors) {
          let data = _.cloneDeep(fieldsValue)
          let values = {
            ...this.itemData,
            ccUserIds: data.ccUserIds && data.ccUserIds.length ? data.ccUserIds.join(',') : '',
            carbonCopyName: this.targetNames
          }
          this.confirmLoading = true
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('closeModal', this.dataArr, this.currentIndex, values)
          }, 1000);
        } else {
          console.log('form error!')
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
