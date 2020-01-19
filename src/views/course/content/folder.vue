<template>
  <div :class="['folder', {'cur-active': !isShow, 'right-active': isRight}]" @contextmenu="contentmenu" @mouseleave="isRight = false">
    <div class="name">
      <div class="icon">
        <el-image
          v-show="false"
          src="http://course-assets.talkmate.com/course/icons/ENG-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg"
          fit="cover"></el-image>
      </div>
      <div class="title">
        <span @dblclick="dblclickFolder" v-show="isShow">{{ title }}</span>
        <input ref="input" type="text" v-show="!isShow" v-model="title" @blur="blurFolder">
      </div>
    </div>
    <div class="arror">
      <i class="el-icon-caret-right"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: ['name'],
  data () {
    return {
      isShow: true,
      isRight: false,
      title: this.name
    }
  },
  methods: {
    dblclickFolder () {
      this.title = this.name
      this.isShow = false
      setTimeout(() => {
        this.$refs['input'].focus()
      }, 0)
    },
    blurFolder () {
      this.isShow = true
    },
    contentmenu (ev) {
      this.isRight = true
      console.log(ev)
    }
  }
}
</script>

<style lang="scss" scoped>
.folder {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  border: 1px solid transparent;
  .name {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    .icon {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin: 0 5px 0 10px;
    }
    .title {
      font-size: 14px;
      font-weight: 400;
      color: #000;
      flex: 1;
      span {
        display: block;
        padding: 2px 0;
      }
      input {
        border: 0;
        padding: 2px 0;
        background: #fff;
        width: 100%;
      }
    }
  }
  .arror {
    margin-right: 18px;
    i {}
  }
}

.active {
  background: #DCDCDC;
}

.cur-active {
  background: #007AFF;
}
.right-active {
  border: 1px solid #007AFF;
}
</style>
