<template>
<transition name="fade">
  <div class="edit-container" v-show="showEdit">
    <div class="edit-content">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <div class="content">
        <el-form :inline="true" label-width="95px" ref="form" :model="form">
          <el-form-item label="model_key: " prop="model_key" :rules="[
            {required: true, message: 'model_key不能为空', trigger: 'blur'},
            {pattern: /^[a-zA-Z_]{1,}$/, message: '只允许输入字母或下划线！'}
          ]">
            <el-input v-model="form.model_key" maxlength="50" show-word-limit :disabled="type == 'edit'"></el-input>
          </el-form-item>
          <el-form-item label="名称: " prop="name" :rules="{
            required: true, message: '名称不能为空', trigger: 'blur'
          }">
            <el-input v-model="form.name" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="描述: " class="desc">
            <el-input v-model="form.desc" maxlength="40" show-word-limit></el-input>
          </el-form-item>
          <div class="num-content">
            <h1>feilds列表</h1>
            <div class="number">
              <span class="button" @click="reduce()">－</span>
              <span class="num">{{form.feilds.length}}</span>
              <span class="button" @click="add()">＋</span>
            </div>
          </div>
          <div id="feilds-lists" class="feilds">
            <div class="feilds-item"
              :data-id="index"
              v-for="(feild, index) in form.feilds"
              :key="index">
              <div class="del" @click="delFeild(feild, index)"><i class="el-icon-circle-close"></i></div>
              <el-form-item label="data_from: ">
                <el-input v-model="feild.data_from" ></el-input>
              </el-form-item>
              <el-form-item label="feild: ">
                <el-input v-model="feild.feild" ></el-input>
              </el-form-item>
              <el-form-item label="name: ">
                <el-input v-model="feild.name" ></el-input>
              </el-form-item>
              <el-form-item label="type: ">
                <!-- <el-input v-model="feild.type" ></el-input> -->
                <el-select v-model="feild.type" placeholder="请选择字段类型">
                  <el-option
                    v-for="item in feildTypes"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-button v-show="feild.type == 'arrayObject'" @click="addSubFeilds(feild)" class="icon-plus-sub-fields" icon="el-icon-plus" circle></el-button>
              </el-form-item>
              <div class="sub-feilds-list" v-if="feild.type === 'arrayObject' && feild.sub_feilds && feild.sub_feilds.length">
                <div class="feilds-item"
                  :data-id="index"
                  v-for="(f, i) in feild.sub_feilds"
                  :key="i">
                  <div class="del" @click="delSubFeild(index, i)"><i class="el-icon-circle-close"></i></div>
                  <el-form-item label="data_from: ">
                    <el-input v-model="f.data_from" size="small"></el-input>
                  </el-form-item>
                  <el-form-item label="feild: ">
                    <el-input v-model="f.feild" size="small"></el-input>
                  </el-form-item>
                  <el-form-item label="name: ">
                    <el-input v-model="f.name" size="small"></el-input>
                  </el-form-item>
                  <el-form-item label="type: ">
                    <el-select v-model="f.type" placeholder="请选择字段类型" size="small">
                      <el-option
                        v-for="item in feildTypes"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                    <el-button v-show="f.type == 'arrayObject'" @click="addSub2Feilds(f, index)" size="small" class="icon-plus-sub-fields" icon="el-icon-plus" circle></el-button>
                  </el-form-item>
                  <div class="sub-feilds-list" v-if="f.type === 'arrayObject' && f.sub_feilds && f.sub_feilds.length">
                    <div class="feilds-item"
                      :data-id="i"
                      v-for="(f2, i2) in f.sub_feilds"
                      :key="i2">
                      <div class="del" @click="delSub2Feild(index, i, i2)"><i class="el-icon-circle-close"></i></div>
                      <el-form-item label="data_from: ">
                        <el-input v-model="f2.data_from" size="small"></el-input>
                      </el-form-item>
                      <el-form-item label="feild: ">
                        <el-input v-model="f2.feild" size="small"></el-input>
                      </el-form-item>
                      <el-form-item label="name: ">
                        <el-input v-model="f2.name" size="small"></el-input>
                      </el-form-item>
                      <el-form-item label="type: ">
                        <el-select v-model="f2.type" placeholder="请选择字段类型" size="small">
                          <el-option
                            v-for="item in feildTypes"
                            :key="item"
                            :label="item"
                            :value="item">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item class="desc" label="备注: ">
                        <el-input style="width: 512px" type="textarea" v-model="f2.desc" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <el-form-item class="desc" label="备注: ">
                    <el-input style="width: 512px" type="textarea" v-model="f.desc" size="small"></el-input>
                  </el-form-item>
                </div>
              </div>
              <el-form-item class="desc" label="备注: ">
                <el-input style="width:570px" type="textarea" v-model="feild.desc" ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div class="btns">
        <el-button
          class="cancel"
          @click="close()">取消</el-button>
        <el-button
          class="determine active"
          type="primary"
          @click="determine()" >确定</el-button>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import {
  addModel,
  editorModel
} from '@/api/course'
import Sortable from 'sortablejs'

export default {
  data () {
    return {
      showEdit: false,
      form: {
        model_key: '',
        name: '',
        desc: '',
        feilds: [
          {
            data_from: '',
            feild: '',
            name: '',
            type: '',
            list_order: 1,
            desc: '',
            sub_feilds: []
          }
        ]
      },
      newFeilds: [],
      type: '',
      feildTypes: [
        'int',
        'bool',
        'string',
        'stringOptions',
        'text',
        'textOptions',
        'textRadar',
        'richText',
        'template',
        'templateArray',
        'array',
        'arrayObject',
        'button',
        'select',
        'checkboxGroup',
        'cascader'
      ]
    }
  },
  mounted () {
    /* eslint-disable */
    let $el = document.getElementById('feilds-lists')
    let sortable = new Sortable($el, {
      animation: 0,
      onEnd: (evt) => {
        let oldIndex = evt.oldIndex
        let newIndex = evt.newIndex
        console.log(oldIndex, newIndex)
        this.newFeilds = []
        let copyFeilds = this.form.feilds
        let indexArr = sortable.toArray()
        console.log(indexArr)
        indexArr.forEach((item, index) => {
          let obj = copyFeilds[item]
          obj['list_order'] = (index + 1)
          this.newFeilds.push(obj)
        })
        console.log(this.newFeilds)
      }
    })
    /* eslint-enable */
  },
  methods: {
    show (params) {
      console.log(params)
      this.type = params.type
      this.showEdit = true
      if (this.type === 'edit') {
        this.form = params.data
        console.log(this.form)
        this.newFeilds = this.form.feilds
      } else {
        this.form.model_key = ''
        this.form.name = ''
        this.form.desc = ''
        this.form.feilds = [
          {
            data_from: '',
            feild: '',
            name: '',
            type: '',
            desc: '',
            list_order: 1
          }
        ]
      }
    },
    // 加
    add () {
      let feild = {
        data_from: '',
        feild: '',
        name: '',
        type: '',
        desc: '',
        list_order: this.form.feilds.length + 1
      }
      this.form.feilds.push(feild)
    },
    // 减
    reduce () {
      if (this.form.feilds.length === 1) {
        return false
      }
      this.form.feilds.pop()
    },
    delFeild (item, index) {
      console.log(item, index)
      if (this.form.feilds.length === 1) {
        return false
      }
      if (this.newFeilds.length > 0) {
        this.form.feilds = this.newFeilds
      }
      let feild = this.form.feilds.findIndex((ele) => {
        return ele.list_order === item.list_order
      })
      this.form.feilds.splice(feild, 1)
      console.log(feild, this.form.feilds)
    },
    // arrayObject添加子项
    addSubFeilds (f) {
      let i = this.form.feilds.findIndex(item => {
        return item.feild === f.feild
      })
      let listOrder = 1
      if (this.form.feilds[i]['sub_feilds'] && this.form.feilds[i]['sub_feilds'].length) {
        listOrder = this.form.feilds[i]['sub_feilds'].length + 1
      }
      let feild = {
        data_from: '',
        feild: '',
        name: '',
        type: '',
        desc: '',
        list_order: listOrder
      }
      if (this.form.feilds[i]['sub_feilds'] && this.form.feilds[i]['sub_feilds'].length) {
        this.form.feilds[i]['sub_feilds'].push(feild)
      } else {
        this.$set(this.form.feilds[i], 'sub_feilds', [])
        this.form.feilds[i]['sub_feilds'].push(feild)
      }
    },
    delSubFeild (bigIndex, index) {
      this.form.feilds[bigIndex]['sub_feilds'].splice(index, 1)
    },
    addSub2Feilds (f, index) {
      let i = this.form.feilds[index].sub_feilds.findIndex(item => {
        return item.feild === f.feild
      })
      let listOrder = 1
      if (this.form.feilds[index]['sub_feilds'][i]['sub_feilds'] && this.form.feilds[index]['sub_feilds'][i]['sub_feilds'].length) {
        listOrder = this.form.feilds[index]['sub_feilds'][i]['sub_feilds'].length + 1
      }
      let feild = {
        data_from: '',
        feild: '',
        name: '',
        type: '',
        desc: '',
        list_order: listOrder
      }
      if (this.form.feilds[index]['sub_feilds'][i]['sub_feilds'] && this.form.feilds[index]['sub_feilds'][i]['sub_feilds'].length) {
        this.form.feilds[index]['sub_feilds'][i]['sub_feilds'].push(feild)
      } else {
        this.$set(this.form.feilds[index]['sub_feilds'][i], 'sub_feilds', [])
        this.form.feilds[index]['sub_feilds'][i]['sub_feilds'].push(feild)
      }
    },
    delSub2Feild (bigIndex, index, i) {
      this.form.feilds[bigIndex]['sub_feilds'][index]['sub_feilds'].splice(i, 1)
    },
    close () {
      this.$emit('editModel')
      this.$refs.form.resetFields()
      this.showEdit = false
    },
    determine () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log(this.form)
          if (this.type === 'edit') {
            let obj = {
              'model_info': {}
            }
            obj['model_key'] = this.form.model_key
            obj.model_info['desc'] = this.form.desc
            obj.model_info['feilds'] = this.form.feilds
            obj.model_info['name'] = this.form.name
            console.log(obj)
            editorModel(obj).then(res => {
              console.log(res)
              if (res.success) {
                this.close()
              }
            })
          } else {
            addModel(this.form).then(res => {
              console.log(res)
              if (res.success) {
                this.close()
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
  z-index: 999;
}
.edit-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  width:880px;
  background:rgba(245,246,250,1);
  border-radius:4px;
  padding: 50px 30px 20px;
  box-sizing: border-box;
  .num-content {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0px 0 20px;
    .number {
      position: absolute;
      right: 0;
      .button {
        font-size: 14px;
        color: #000;
        &:hover {
          cursor: pointer;
          color: #007AFF;
        }
      }
      .num {
        font-size: 18px;
        color: #007AFF;
        padding: 0 10px;
      }
    }
  }
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
  .btns {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    button {
      cursor: pointer;
      display: inline-block;
      width:150px;
      height:40px;
      font-size:14px;
      font-weight:400;
      border-radius:4px;
      color:rgba(0,122,255,1);
      border:1px solid rgba(0,122,255,1);
      margin-right: 48px;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        opacity: .8;
      }
      &.active {
        color:rgba(255,255,255,1);
        background: #007AFF;
      }
      &.is-disabled {
        cursor: not-allowed;
        border: none;
        background-color: #a0cfff;
      }
    }
  }
  .feilds {
    position: relative;
    .feilds-item {
      position: relative;
      background: #fff;
      padding: 32px 12px 10px;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    .del {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 99;
      i {
        font-size: 20px;
        color: #a0cfff;
        &:hover {
          cursor: pointer;
          color: #007AFF;
        }
      }
    }
  }
}
.feilds {
  // max-height: 500px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 20px;
}
/*滚动条样式*/
.feilds::-webkit-scrollbar {/*滚动条整体样式*/
  position: relative;
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.feilds::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  position: absolute;
  width: 6px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
  background: rgba(0, 0, 0, .4);
  padding: 20px;
}
.feilds::-webkit-scrollbar-track {/*滚动条里面轨道*/
  width: 4px;
  width:2px;
  background:rgba(216,216,216,1);
  border-radius:1px;
  opacity:0.1;
}
.el-form {
  .el-form-item {
    width: 48%;
  }
  .el-input {
    width: 230px;
  }
  .desc {
    width: 100% !important;
    .el-input {
      width: 595px;
    }
  }
}

.icon-plus-sub-fields {
  font-size: 12px;
  margin-left: 5px;
}

.sub-feilds-list {
  border: 1px solid rgba(0, 0, 0, .1);
  width: 95%;
  margin-left: 20px;
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-input {
    width: 200px;
  }
}

.form-item-desc {
  width: 100% !important;
  .el-input {
    width: 400px;
  }
}
</style>
