<template>
  <div class="edit-project">
    <div class="edit-head">
      <span>项目编辑</span>
      <a href="javascript:;" @click="addEditor()">+新增项目</a>
    </div>
    <div class="edit-table">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>编码</th>
            <th>名称<span>（中文）</span></th>
            <th>名称<span>（英文）</span></th>
            <th>小图</th>
            <th>大图</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.code + item.langIndex">
            <td><input type="text" v-model="item.langIndex"></td>
            <td><input type="text" v-model="item.code"></td>
            <td><input type="text" v-model="item.zhName"></td>
            <td><input type="text" v-model="item.enName"></td>
            <td class="img-small">
              <img :src="item.flag" alt="">
            </td>
            <td class="img-big">
              <img :src="item.flag" alt="">
              <div class="mark"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <add-new-comp ref="newEditor"/>
  </div>
</template>

<script>
import AddNewComp from './addNew'

export default {
  data () {
    return {
      tableData: [
        {
          code: 'ENG-Basic',
          langIndex: 1,
          isHot: '是',
          zhName: '英语',
          enName: 'English',
          flag: 'http://course-assets.talkmate.com/course/icons/ENG-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg'
        },
        {
          code: 'KOR-Basic',
          langIndex: 2,
          isHot: '是',
          zhName: '韩语',
          enName: 'English',
          flag: 'http://course-assets.talkmate.com/course/icons/KOR-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg'
        },
        {
          code: 'JPN-Basic',
          langIndex: 3,
          isHot: '是',
          zhName: '英语',
          enName: 'English',
          flag: 'http://course-assets.talkmate.com/course/icons/JPN-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg'
        },
        {
          code: 'FRE-Basic',
          langIndex: 4,
          isHot: '是',
          zhName: '英语',
          enName: 'English',
          flag: 'http://course-assets.talkmate.com/course/icons/FRE-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg'
        }
      ]
    }
  },
  components: {
    AddNewComp
  },
  mounted () {
  },
  methods: {
    addEditor () {
      this.$refs.newEditor.show()
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-project {
  padding: 30px 60px;
  .edit-head {
    position: relative;
    text-align: center;
    margin-bottom: 50px;
    span {
      font-size:20px;
      font-weight:600;
      color:rgba(0,0,0,1);
      line-height:28px;
    }
    a {
      position: absolute;
      right: 0;
      font-size:12px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:24px;
      &:hover {
        color: #007AFF;
      }
    }
  }
}
.edit-table {
  table {
    width: 100%;
    tr {
      th {
        font-size:14px;
        font-weight:600;
        color:rgba(0,0,0,1);
        line-height:20px;
        padding-bottom: 20px;
        text-align: left;
        &:nth-child(1) {
          // padding-right: 50px;
          width: 60px;
          padding-right: 20px;
        }
        &:nth-child(2) {
          width: 15%;
          padding-right: 30px;
        }
        &:nth-child(3) {
          width: 15%;
          padding-right: 30px;
        }
        &:nth-child(5) {
          // padding-right: 400px;
          width: 60px;
        }
        &:nth-child(6) {
          width: 100px;
        }
        span {
          font-size: 10px;
        }
      }
    }
    td {
      position: relative;
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:20px;
      padding-bottom: 30px;
      &:nth-child(1) {
        width: 60px;
        padding-right: 20px;
      }
      &:nth-child(2) {
        width: 15%;
        padding-right: 30px;
      }
      &:nth-child(3) {
        width: 15%;
        padding-right: 30px;
      }
      input {
        width: 100%;
        display: inline-block;
        border: none;
        background: transparent;
        &:focus {
          color: #007AFF;
        }
      }
    }
    .img-small {
      width: 30px;
      height: 30px;
      padding-right: 30px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
      }
    }
    .img-big {
      position: relative;
      width:120px;
      height:30px;
      img {
        width: 100px;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
      }
      .mark {
        width: 100px;
        height: 30px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background:rgba(0,0,0,.3);
        border-radius: 4px;
      }
    }
  }
  tbody {
    height: 530px;
  }
}
/*滚动条样式*/
tbody::-webkit-scrollbar {/*滚动条整体样式*/
  position: relative;
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
tbody::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  position: absolute;
  width: 6px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
  background: rgba(0, 0, 0, .4);
  padding: 20px;
}
tbody::-webkit-scrollbar-track {/*滚动条里面轨道*/
  width: 4px;
  width:2px;
  background:rgba(216,216,216,1);
  border-radius:1px;
  opacity:0.1;
}
</style>
