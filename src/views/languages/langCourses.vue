<template>
  <div class="content">
    <div class="langs-head">
      <h1>选择课程语种
        <router-link :to="{path: '/lang/lang-setting'}" href="javascript:;">设置</router-link>
      </h1>
      <div class="lang-search">
        <input type="text" placeholder="输入内容关键字">
        <a href="javascript:;">搜索</a>
      </div>
    </div>
    <div class="langs-lists" id="langs-lists">
      <div class="langs-classify" v-for="(item, index) in lists" :key="'lang-' + index">
        <h2 :id="'letter-' + item.letter">{{item.letter}}</h2>
        <div class="classify-lists">
          <div class="classify-item" v-for="course in item.courses" :key="course.name + '-' + course.code">
            <a href="javascript:;">
              <div class="img-box">
                <img :src="qnUrl(course.flag)" alt="">
              </div>
              <p>{{course.name}}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import LettersComp from './common/letters'
export default {
  data () {
    return {
      lists: [
        {
          letter: '热',
          courses: [
            {
              'code': 'ENG-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ENG-3x.webp?v=4',
              'name': '英语'
            }, {
              'code': 'KOR-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/KOR-3x.webp?v=4',
              'name': '韩语'
            }, {
              'code': 'JPN-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/JPN-3x.webp?v=4',
              'name': '日语'
            }, {
              'code': 'FRE-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/FRE-3x.webp?v=4',
              'name': '法语'
            }, {
              'code': 'SPA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/SPA-3x.webp?v=4',
              'name': '西班牙语'
            }, {
              'code': 'CAN-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/CAN-3x.webp?v=4',
              'name': '粤语'
            }, {
              'code': 'GER-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/GER-3x.webp?v=4',
              'name': '德语'
            }, {
              'code': 'CHI-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/CHI-3x.webp?v=4',
              'name': '汉语'
            }, {
              'code': 'RUS-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/RUS-3x.webp?v=4',
              'name': '俄语'
            }, {
              'code': 'ARA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ARA-3x.webp?v=4',
              'name': '阿拉伯语'
            }, {
              'code': 'THA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/THA-3x.webp?v=4',
              'name': '泰国语'
            }, {
              'code': 'FIN-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/FIN-3x.webp?v=4',
              'name': '芬兰语'
            }, {
              'code': 'ITA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ITA-3x.webp?v=4',
              'name': '意大利语'
            }, {
              'code': 'ESP-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ESP-3x.webp?v=4',
              'name': '世界语'
            }
          ]
        },
        {
          letter: 'A',
          courses: [
            {
              'code': 'ENG-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ENG-3x.webp?v=4',
              'name': '英语'
            }, {
              'code': 'KOR-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/KOR-3x.webp?v=4',
              'name': '韩语'
            }, {
              'code': 'JPN-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/JPN-3x.webp?v=4',
              'name': '日语'
            }, {
              'code': 'FRE-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/FRE-3x.webp?v=4',
              'name': '法语'
            }, {
              'code': 'SPA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/SPA-3x.webp?v=4',
              'name': '西班牙语'
            }, {
              'code': 'CAN-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/CAN-3x.webp?v=4',
              'name': '粤语'
            }, {
              'code': 'GER-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/GER-3x.webp?v=4',
              'name': '德语'
            }, {
              'code': 'CHI-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/CHI-3x.webp?v=4',
              'name': '汉语'
            }, {
              'code': 'RUS-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/RUS-3x.webp?v=4',
              'name': '俄语'
            }, {
              'code': 'ARA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ARA-3x.webp?v=4',
              'name': '阿拉伯语'
            }, {
              'code': 'THA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/THA-3x.webp?v=4',
              'name': '泰国语'
            }, {
              'code': 'FIN-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/FIN-3x.webp?v=4',
              'name': '芬兰语'
            }, {
              'code': 'ITA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ITA-3x.webp?v=4',
              'name': '意大利语'
            }, {
              'code': 'ESP-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ESP-3x.webp?v=4',
              'name': '世界语'
            }
          ]
        },
        {
          letter: 'B',
          courses: [
            {
              'code': 'ENG-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ENG-3x.webp?v=4',
              'name': '英语'
            }, {
              'code': 'KOR-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/KOR-3x.webp?v=4',
              'name': '韩语'
            }, {
              'code': 'JPN-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/JPN-3x.webp?v=4',
              'name': '日语'
            }, {
              'code': 'FRE-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/FRE-3x.webp?v=4',
              'name': '法语'
            }, {
              'code': 'SPA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/SPA-3x.webp?v=4',
              'name': '西班牙语'
            }, {
              'code': 'CAN-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/CAN-3x.webp?v=4',
              'name': '粤语'
            }, {
              'code': 'GER-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/GER-3x.webp?v=4',
              'name': '德语'
            }, {
              'code': 'CHI-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/CHI-3x.webp?v=4',
              'name': '汉语'
            }, {
              'code': 'RUS-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/RUS-3x.webp?v=4',
              'name': '俄语'
            }, {
              'code': 'ARA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ARA-3x.webp?v=4',
              'name': '阿拉伯语'
            }, {
              'code': 'THA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/THA-3x.webp?v=4',
              'name': '泰国语'
            }, {
              'code': 'FIN-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/FIN-3x.webp?v=4',
              'name': '芬兰语'
            }, {
              'code': 'ITA-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ITA-3x.webp?v=4',
              'name': '意大利语'
            }, {
              'code': 'ESP-Basic',
              'flag': 'http://course-assets.talkmate.com/course/icons/ESP-3x.webp?v=4',
              'name': '世界语'
            }
          ]
        }
      ]
    }
  },
  components: {
    // LettersComp
  },
  methods: {
    qnUrl (url) {
      return url.split('?')[0] + '?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1'
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    height: 100%;
  }
  .langs-head {
    position: relative;
    padding-bottom: 42px;
    h1 {
      font-size:20px;
      font-weight:600;
      color:rgba(0,0,0,1);
      line-height:28px;
      text-align: center;
    }
    a {
      font-size:12px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:17px;
      &:hover {
        color: #007AFF;
      }
    }
    .lang-search {
      position: absolute;
      right: 40px;
      top: 0;
      input {
        width: 200px;
        height: 30px;
        border: none;
        background:rgba(255,255,255,1);
        border-radius:16px;
        padding: 0 20px;
        margin-right: 16px;
      }
    }
  }
  .langs-lists {
    height: 90%;
    overflow-y: auto;
    .langs-classify {
      h2 {
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:20px;
        margin-bottom: 23px;
      }
    }
    .classify-lists {
      display: flex;
      flex-wrap: wrap;
      .classify-item {
        margin-right: 53px;
        margin-bottom: 40px;
        a {
          display: inline-block;
          width: 100%;
          height: 100%;
          .img-box {
            width: 58px;
            height: 58px;
            background: #e1e1e1;
            border-radius: 8px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 8px;
            }
          }
          p {
            font-size:14px;
            font-weight:400;
            color:rgba(0,0,0,1);
            line-height:20px;
            text-align: center;
            padding-top: 12px;
          }
        }
      }
    }
  }
  /*滚动条样式*/
  .langs-lists::-webkit-scrollbar {/*滚动条整体样式*/
    position: relative;
    width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .langs-lists::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    position: absolute;
    width: 6px;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
    background: rgba(0, 0, 0, .4);
    padding: 20px;
  }
  .langs-lists::-webkit-scrollbar-track {/*滚动条里面轨道*/
    width: 4px;
    width:2px;
    background:rgba(216,216,216,1);
    border-radius:1px;
    opacity:0.1;
  }
</style>
