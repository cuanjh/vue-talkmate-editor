<template>
  <div class="step-two">
    <div class="step-back">
      <span class="el-icon-arrow-left back" @click="back()">Pro V2</span>
    </div>
    <div class="step-select">
      <el-select v-model="courseClass"
        value-key="code"
        @change="curClassChange">
        <el-option v-for="item in filterClasses"
          :key="item.code"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="course"
        @change="curCourseChange">
        <el-option v-for="item in courses"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-select v-model="core"
        @change="curCoreChange">
        <el-option v-for="item in cores"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      courseClass: {
        code: 'K1A',
        name: '初级A1'
      },
      filterClasses: [
        {
          code: 'K1A',
          name: '初级A1'
        },
        {
          code: 'K1B',
          name: '初级A2'
        },
        {
          code: 'K2A',
          name: '中级B1'
        },
        {
          code: 'K2B',
          name: '中级B2'
        },
        {
          code: 'K3A',
          name: '高级B1'
        },
        {
          code: 'K3B',
          name: '高级B2'
        }
      ],
      course: '课程1',
      courses: [
        {
          name: '课程1'
        },
        {
          name: '课程2'
        },
        {
          name: '课程3'
        },
        {
          name: '课程4'
        },
        {
          name: '课程5'
        }
      ],
      core: '核心1',
      cores: [
        {
          name: '核心1'
        },
        {
          name: '核心2'
        },
        {
          name: '核心3'
        },
        {
          name: '核心4'
        },
        {
          name: '核心5'
        }
      ]
    }
  },
  methods: {
    back () {
      this.$emit('stepTeoBack')
    },
    curClassChange (params) {
      console.log(params)
      this.courseClass = params
    },
    curCourseChange (params) {
      console.log(params)
      this.course = params
    },
    curCoreChange (params) {
      console.log(params)
      this.core = params
    }
  }
}
</script>

<style lang="scss" scoped>
.step-two {
  .step-back {
    padding: 18px 20px 20px;
    .back {
      font-size:18px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:25px;
      outline: none;
      &:hover {
        cursor: pointer;
        color: #007AFF;
      }
    }
  }
  .step-select {}
}
</style>
<style>
.step-two .el-select {
  width: 136px;
  background:rgba(255,255,255,1);
  border-radius:8px;
  margin-left: 30px;
}
.step-two .el-select .el-input__inner {
  border: none!important;
  width: 136px!important;
  height: 32px!important;
  background:rgba(248,248,248,.9)!important;
  border-radius:8px!important;
  color: #51B8F8;
  text-align: center;
}
.step-two .el-input__icon {
  line-height: 32px!important;
}
.step-two .el-input__suffix {
  background: #0581D1;
  border-radius: 0 8px 8px 0;
}
.step-two .el-input__icon {
  line-height: 32px!important;
}
.step-two .el-select-dropdown__item {
  color: #51B8F8;
  text-align: center;
}
.step-two .el-select-dropdown__item.selected {
  background:linear-gradient(270deg,rgba(195,236,252,.7) 0%,rgba(5,129,209,.7) 100%);
  color: #fff;
  font-weight: 500;
}
</style>
