<template>
  <transition name="fade" mode="out-in">
    <div class="form-thumb" :style="{top: top + 'px'}" v-show="isShow" @click="clickThumbForm">
      <div class="type-name">{{ typeName }}</div>
      <div class="form-img">
        <el-image v-show="imgUrl" :src="imgUrl | urlFix('imageView2/1/format/jpg')" fit="cover"></el-image>
      </div>
      <div class="text">
        <span v-text="(form && form.sentence) ? (form.type == 'fillGap') ? form.sentence.replace(form.options[0], '______') : form.sentence : ''"></span>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      isShow: false,
      top: '',
      form: null
    }
  },
  created () {
    this.$bus.$on('curContentForm', (form) => {
      console.log('curContentForm', form)
      this.form = form
    })
  },
  computed: {
    ...mapState({
      contentTypes: state => state.course.contentTypes,
      assetsDomain: state => state.course.assetsDomain
    }),
    typeName () {
      console.log(this.contentTypes)
      if (!this.form) {
        return ''
      }
      let obj = this.contentTypes.find(item => {
        return item.type === this.form.type
      })
      let name = ''
      if (obj) {
        name = obj.name
      }
      return name
    },
    imgUrl () {
      if (!this.form) {
        return ''
      }
      let url = ''
      if (this.form && this.form.image) {
        url = this.assetsDomain + this.form.image
      }
      return url
    }
  },
  methods: {
    show (params) {
      this.top = params.top
      this.isShow = true
    },
    hide () {
      this.isShow = false
    },
    clickThumbForm () {
      document.getElementById('edit-file').scrollTop = 0
    }
  },
  destroyed () {
    this.$bus.$off('curContentForm')
  }
}
</script>

<style lang="scss" scoped>
.form-thumb {
  position: fixed;
  right: 20px;
  width: 100px;
  height: 100px;
  background: #FFFFFF;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, .2);
}

.type-name {
  font-size: 12px;
  color: rgba(0, 0, 0, .4)
}

.form-img {
  background: #F5F6FA;
  width: 100%;
  height: 50px;
  margin: 5px 0;
  border-radius: 4px;
  overflow: hidden;
  .el-image {
    width: 100%;
    height: 100%;
  }
}

.text {
  font-size: 12px;
  margin-top: 2px;
  line-height: 16px;
  height: 30px;
  overflow: hidden
}
</style>
