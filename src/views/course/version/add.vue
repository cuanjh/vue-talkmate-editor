<template>
  <transition name="fade">
    <div class="add-version-container" v-if="isShow">
      <div class="add-version-wrap">
        <div class="close" @click="close">
          <i class="el-icon-close"></i>
        </div>
        <div class="content">
          <h1>创建新版本</h1>
          <div class="content-wrap">
            <div class="version-num">
              <span>版本号：</span>
              <span class="text-ver" v-if="!isChange">{{version}}</span>
              <input type="text" id="input" autofocus v-model="version" v-else>
              <a href="javascript:;" v-if="!isChange" @click="changeVer()">修改</a>
              <a href="javascript:;" class="determine" v-else @click="determine()">确定</a>
            </div>
            <div class="course-content">
              <span>课程内容：</span>
              <div class="buttons">
                <a
                  class="copy"
                  :class="{'active': isActive == true}"
                  @click="addVersion(true)">复制现有版本<small>（适用于现有版本基础上的修改）</small></a>
                <a
                  class="add-new"
                  :class="{'active': isActive == false}"
                  @click="addVersion(false)">重新编写内容<small>（适用于重建或较大的修改）</small></a>
              </div>
            </div>
          </div>
          <copy-version ref="copyVer" v-show="isActive == true"/>
          <new-version v-show="isActive == false"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import NewVersion from './newVersion'
import CopyVersion from './copyVersion'

export default {
  data () {
    return {
      isChange: false,
      isActive: -1,
      isShow: false,
      version: 'V3'
    }
  },
  created () {
    this.$bus.on('closeAdd', () => {
      this.close()
    })
  },
  components: {
    NewVersion,
    CopyVersion
  },
  methods: {
    show () {
      this.isShow = true
    },
    close () {
      this.isShow = false
      this.isActive = -1
      this.isChange = false
      this.version = 'V3'
    },
    addVersion (params) {
      this.isActive = params
      console.log(params)
      if (params) {
        this.$refs.copyVer.showCopy()
      }
    },
    changeVer () {
      this.version = ''
      this.isChange = true
    },
    determine () {
      if (!this.version) {
        this.version = 'V3'
      }
      this.isChange = false
    }
  },
  beforeDestroy () {
    this.$bus.off('closeAdd')
  }
}
</script>

<style lang="scss" scoped>
.add-version-container {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba($color: #000000, $alpha: 0.7);
  .add-version-wrap {
    position: relative;
    width: 500px;
    min-height: 300px;
    border-radius: 4px;
    background: #F5F6FA;
    .close {
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
    }
    .content {
      h1 {
        color: #000;
        font-size: 18px;
        font-weight: 600;
        line-height: 25px;
        text-align: center;
        margin-bottom: 36px;
        margin-top: 40px;
      }
    }
    .content-wrap {
      padding:0 40px 40px;
      span {
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:20px;
      }
      input {
        border: none;
        background: transparent;
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:20px;
        width: 60px;
      }
      .version-num {
        margin-bottom: 40px;
        a {
          font-size:10px;
          font-weight:400;
          color:rgba(0,0,0,.4);
          line-height:14px;
        }
        .determine {
          color: #007AFF;
        }
        .text-ver {
          display: inline-block;
          width: 60px;
        }
        input {
          &:focus {
            color: #007AFF;
          }
        }
      }
      .course-content {
        display: flex;
        span {
          margin-top: 10px;
        }
        .buttons {
          display: flex;
          flex-direction: column;
          a {
            cursor: pointer;
            font-size:14px;
            font-weight:400;
            color:rgba(0,0,0,.6);
            line-height:20px;
            padding: 10px 28px;
            box-sizing: border-box;
            border-radius:4px;
            background: #fff;
            margin-bottom: 20px;
            &:last-child {
              margin-bottom: 0;
            }
            small {
              font-size: 10px;
            }
            &:hover {
              background: #007AFF;
              color: #fff;
            }
            &.active {
              background: #007AFF;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
