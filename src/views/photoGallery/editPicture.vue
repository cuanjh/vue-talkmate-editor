<template>
  <el-dialog
    title="图片编辑"
    :visible.sync="dialogVisible"
    @close="close"
    width="80%">
    <div class="edit-picture">
      <div class="edit-picture-content">
        <div class="left">
          <img :src="src" alt="">
          <div class="size">
            图片尺寸：{{ size }}
          </div>
          <div class="tag" v-if="havaTags.length > 0">
            <span v-for="t in havaTags" :key="'t' + t.TagKey">{{ t.TagName }}</span>
          </div>
          <div class="tag" v-else>
            暂无分类
          </div>
          <div class="desc" v-html="picDesc.replace(/(\r\n)|(\n)/g,'<br>')"></div>
        </div>
        <div class="right">
          <div class="title">选择分类</div>
          <ul>
            <li v-for="(tag,index) in tags" :key="index" @click="selTag(tag)" :class="{'active': (',' + selTagKeys.join(',') + ',').indexOf(',' + tag.TagKey + ',') > -1}">
              {{ tag.TagKey }}
            </li>
          </ul>
          <div class="title">没有合适的分类？可新建分类</div>
          <input type="text" placeholder="请输入新的分类名称" v-model="newTag">
          <div class="title">图片描述</div>
          <textarea v-model="desc" name="" id="" cols="30" rows="10" placeholder="请描述该图片，例：穿西装的男人和穿礼服的女人，餐厅喝红酒。"></textarea>
        </div>
      </div>
      <div class="btn-area">
        <a class="btn" href="javascript:;" @click="save()">保存</a>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  addImageTag,
  editImage
} from '@/api/course'

export default {
  data () {
    return {
      dialogVisible: false,
      picture: {},
      src: '',
      tags: [],
      havaTags: [],
      picDesc: '',
      selTagKeys: [],
      newTag: '',
      desc: '',
      size: ''
    }
  },
  components: {
  },
  methods: {
    reset () {
      this.selTagKeys = []
      this.newTag = ''
      this.havaTags = []
      this.picDesc = ''
    },
    show (preload) {
      this.reset()
      console.log(preload)

      this.picture = preload.picture
      this.desc = this.picture.desc
      this.picDesc = this.picture.desc
      if (this.picture.tagKeys) {
        this.selTagKeys = this.picture.tagKeys
      }
      this.tags = preload.tags
      this.src = preload.src
      let i = new Image()
      i.src = this.src
      i.addEventListener('load', () => {
        this.size = i.width + ' x ' + i.height
      })

      if (this.picture.Tags) {
        let arrTags = this.picture.Tags
        arrTags.forEach(item => {
          let obj = this.tags.find(tag => {
            return tag.TagKey === parseInt(item)
          })
          if (obj) {
            this.havaTags.push(obj)
          }
        })
      }
      this.dialogVisible = true
    },
    selTag (tag) {
      let i = this.selTagKeys.findIndex(item => {
        return item === (tag.TagKey + '')
      })
      if (i === -1) {
        this.selTagKeys.push(tag.TagKey + '')
      } else {
        this.selTagKeys.splice(i, 1)
      }
      console.log(this.selTagKeys)
    },
    save () {
      console.log(this.newTag, this.desc)
      let i = this.tags.findIndex(item => {
        return item === this.newTag
      })
      if (i > -1) {
        this.$message({
          message: '已存在分类',
          type: 'warning'
        })
        return false
      } else if (this.newTag) {
        this.selTagKeys.push(this.newTag)
        addImageTag({ tagKey: this.newTag })
      }
      let params = {
        image_id: this.picture.image_id,
        image_url: this.picture.image_url,
        tagKeys: this.selTagKeys,
        desc: this.desc
      }
      console.log(params)
      editImage(params).then(res => {
        if (res.success) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$emit('closeEditImage')
          this.dialogVisible = false
        }
      })
    },
    close () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-picture {
  padding: 0px 4px 20px 20px;
  position: relative;
  .edit-picture-content {
    display: flex;
    flex-direction: row;
    min-height: 480px;
    .left {
      font-size: 12px;
      color: #54647D;
      img {
        width: 480px;
        height: 330px;
        object-fit: cover;
      }
      .code {
        margin-top: 13px;
      }
      .size {
        margin-top: 8px;
      }
      .tag {
        margin-top: 7px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        span {
          min-width: 60px;
          height: 30px;
          border-radius: 2px;
          background: #F5F7F9;
          margin-right: 10px;
          margin-top: 10px;
          padding: 0 10px;
          text-align: center;
          line-height: 30px;
        }
      }
      .desc {
        margin-top: 15px;
        max-width: 456px;
      }
    }
    .right {
      margin-left: 29px;
      .title {
        font-size: 12px;
        color: #0A2B40;
        margin-bottom: 10px;
      }
      ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: 16px;
        height: 124px;
        overflow: auto;
        &::-webkit-scrollbar {
          width: 2px;
          height: 200px;
          background: #E2EBEF;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
          background: #A6B2BC;
        }
        li {
          min-width: 60px;
          height: 30px;
          background: #F5F7F9;
          border-radius: 2px;
          text-align: center;
          margin-right: 10px;
          color: #0A2B40;
          font-weight: 400;
          font-size: 12px;
          line-height: 30px;
          margin-top: 10px;
          padding: 0 10px;
          cursor: pointer;
        }
        .active {
          background: #EE2759;
          color: #fff;
        }
      }
      input {
        width: 387px;
        height: 36px;
        border-radius: 2px;
        border: 1px solid #A6B2BC;
        font-size: 12px;
        padding-left: 20px;
        margin-bottom: 30px;
      }
      textarea {
        width: 386px;
        height: 100px;
        padding-left: 20px;
        font-size: 12px;
        padding-top: 10px;
      }
    }
  }
  .btn-area {
    text-align: right;
    margin-right: 108px;
    margin-top: -40px;
    .btn {
      display: inline-block;
      width: 250px;
      height: 50px;
      padding: 0;
      line-height: 50px;
      background: #2C98F9;
      border-radius: 4px;
      font-size: 17px;
      font-weight: 400;
      color: #FFFFFF;
      text-align: center;
    }
  }
}
</style>
