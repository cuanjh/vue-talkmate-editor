<template>
<transition name="fade">
  <div class="edit-container" v-show="showEdit">
    <div class="edit-content">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <div class="content">
        <el-form inline="true" label-width="95px" ref="form" :model="form">
          <el-form-item label="model_key: ">
            <el-input v-model="form.model_key" :disabled="type == 'edit'"></el-input>
          </el-form-item>
          <el-form-item label="名称: ">
            <el-input v-model="form.name" ></el-input>
          </el-form-item>
          <el-form-item label="描述: ">
            <el-input v-model="form.desc" ></el-input>
          </el-form-item>
          <div class="num-content">
            <h1>feilds列表</h1>
            <div class="number">
              <span class="button" @click="reduce()">－</span>
              <span class="num">{{form.feilds.length}}</span>
              <span class="button" @click="add()">＋</span>
            </div>
          </div>
          <div class="feilds" v-for="(feild, index) in form.feilds" :key="index">
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
              <el-input v-model="feild.type" ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="btns">
          <el-button
            class="cancel"
            @click="close()">取消</el-button>
          <el-button
            class="determine active"
            type="primary"
            :disabled="!isDetermine"
            @click="determine()" >确定</el-button>
        </div>
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
            type: ''
          }
        ]
      },
      type: ''
    }
  },
  components: {
  },
  computed: {
    isDetermine () {
      return this.form.model_key
    }
  },
  methods: {
    show (params) {
      console.log(params)
      this.type = params.type
      this.showEdit = true
      if (this.type === 'edit') {
        this.form = params.data
      }
    },
    // 加
    add () {
      let feild = {
        data_from: '',
        feild: '',
        name: '',
        type: ''
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
      this.form.feilds.splice(index, 1)
      console.log(this.form.feilds)
    },
    close () {
      this.form.model_key = ''
      this.form.name = ''
      this.form.desc = ''
      this.form.feilds = [
        {
          data_from: '',
          feild: '',
          name: '',
          type: ''
        }
      ]
      this.$emit('editModel')
      this.showEdit = false
    },
    determine () {
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
            this.showEdit = false
            this.$emit('editModel')
          }
        })
      } else {
        addModel(this.form).then(res => {
          console.log(res)
          if (res.success) {
            this.showEdit = false
            this.$emit('editModel')
          }
        })
      }
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
  width:800px;
  max-height: 630px;
  background:rgba(245,246,250,1);
  border-radius:4px;
  padding: 50px 30px 40px;
  box-sizing: border-box;
  .num-content {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 20px 0;
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
    margin-top: 40px;
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
    background: #fff;
    padding: 32px 12px 10px;
    margin-bottom: 10px;
    border-radius: 4px;
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
form {
  max-height: 480px;
  overflow-y: auto;
  padding-right: 20px;
}
/*滚动条样式*/
form::-webkit-scrollbar {/*滚动条整体样式*/
  position: relative;
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
form::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  position: absolute;
  width: 6px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
  background: rgba(0, 0, 0, .4);
  padding: 20px;
}
form::-webkit-scrollbar-track {/*滚动条里面轨道*/
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
}
</style>
<style >
.edit-container .el-form-item__content {
  /* display: flex; */
}
.edit-container .el-form-item__label {
  /* width: 100px; */
}
</style>
