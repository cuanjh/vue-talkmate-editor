<template>
  <div class="aside">
    <div class="lang-info">
      <div class="name">
        <span>英语</span>
        <i class="el-icon-arrow-down" @click="tolangManage"></i>
      </div>
    </div>
    <div class="project">
      <div class="title">
        <span>项目</span>
        <router-link :to="{path: '/layout/edit-project'}">编辑</router-link>
      </div>
      <ul>
        <li
          v-for="item in projects"
          :key="item.val"
          :class="{'active': selProject === item.val}"
          @click="switchProject(item.val)">
          <span>{{ item.text }}</span>
          <span v-if="selProject === item.val">{{ curVersion }}</span>
        </li>
      </ul>
    </div>
    <div class="catalog">
      <div class="title">目录</div>
      <!-- <ul class="level" @mouseenter="isShowScroll = true" @mouseleave="isShowScroll = false" :style="{'height': levelHeight + 'px', 'overflow': isShowScroll ? 'auto' : 'hidden'}">
        <li>
          <div :class="['name', {active: 'ENG-Basic-Level1' == selCatalog}]" @click="switchCatalog('ENG-Basic-Level1', 'level')">
            <span>初级A1</span>
            <span>入门</span>
          </div>
          <transition name="catalog-fade">
            <ul class="chapter" v-show="selCatalog.indexOf('ENG-Basic-Level1') > -1">
              <li>
                <div :class="['name', {active: 'ENG-Basic-Level1-Unit1-Chapter1' == selCatalog}]" @click="switchCatalog('ENG-Basic-Level1-Unit1-Chapter1', 'chapter')"><i class="el-icon-caret-right"></i>课程1</div>
                <ul class="module" v-show="selCatalog.indexOf('ENG-Basic-Level1-Unit1-Chapter1') > -1">
                  <li><div :class="['name', {active: 'ENG-Basic-Level1-Unit1-Chapter1-A01' == selCatalog}]" @click="switchCatalog('ENG-Basic-Level1-Unit1-Chapter1-A01', 'part')">核心1</div></li>
                  <li><div class="name">核心2</div></li>
                  <li><div class="name">核心3</div></li>
                  <li><div class="name">核心4</div></li>
                  <li><div class="name">核心5</div></li>
                  <li><div class="name">听力</div></li>
                  <li><div class="name">读写</div></li>
                  <li><div class="name">语法</div></li>
                  <li><div class="name">写作</div></li>
                  <li><div class="name">阅读</div></li>
                </ul>
              </li>
              <li><div :class="['name', {active: 'ENG-Basic-Level1-Unit1-Chapter2' == selCatalog}]" @click="switchCatalog('ENG-Basic-Level1-Unit1-Chapter2', 'chapter')"><i class="el-icon-caret-right"></i>课程2</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程3</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程4</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程5</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程6</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程7</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程8</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程9</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程10</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程11</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程12</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程13</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程14</div></li>
            </ul>
          </transition>
        </li>
        <li>
          <div :class="['name', {active: 'ENG-Basic-Level2' == selCatalog}]" @click="switchCatalog('ENG-Basic-Level2', 'level')">
            <span>初级A2</span>
            <span>巩固</span>
          </div>
          <transition name="catalog-fade">
            <ul class="chapter" v-show="'ENG-Basic-Level2' == selCatalog">
              <li>
                <div class="name"><i class="el-icon-caret-right"></i>课程1</div>
                <ul class="module">
                  <li><div class="name">核心1</div></li>
                  <li><div class="name">核心2</div></li>
                  <li><div class="name">核心3</div></li>
                </ul>
              </li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程2</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程3</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程4</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程5</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程6</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程7</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程8</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程9</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程10</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程11</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程12</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程13</div></li>
              <li><div class="name"><i class="el-icon-caret-right"></i>课程14</div></li>
            </ul>
          </transition>
        </li>
        <li>
          <div :class="['name', {active: 'ENG-Basic-Level3' == selCatalog}]" @click="switchCatalog('ENG-Basic-Level3', 'level')">中级B1</div>
        </li>
        <li>
          <div :class="['name', {active: 'ENG-Basic-Level4' == selCatalog}]" @click="switchCatalog('ENG-Basic-Level4', 'level')">中级B2</div>
        </li>
        <li>
          <div :class="['name', {active: 'ENG-Basic-Level5' == selCatalog}]" @click="switchCatalog('ENG-Basic-Level5', 'level')">高级C1</div>
        </li>
        <li>
          <div :class="['name', {active: 'ENG-Basic-Level6' == selCatalog}]" @click="switchCatalog('ENG-Basic-Level6', 'level')">高级C2</div>
        </li>
      </ul> -->
      <div class="level" @mouseenter="isShowScroll = true" @mouseleave="isShowScroll = false" :style="{'height': levelHeight + 'px', 'overflow': isShowScroll ? 'auto' : 'hidden'}">
        <el-tree
          :data="catalog"
          node-key="id"
          default-expand-all
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          @node-contextmenu="rightClick"
          @node-click="nodeClick"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag">
        </el-tree>
      </div>
    </div>
    <right-menu ref="rightMenu"></right-menu>
  </div>
</template>

<script>
import RightMenu from './rightMenu'
export default {
  data () {
    return {
      isShowScroll: false,
      selProject: 'pro',
      projects: [
        {
          val: 'pro',
          text: 'Pro'
        },
        {
          val: 'kid',
          text: 'Kid'
        }
      ],
      curVersion: '',
      selCatalog: '',
      levelHeight: 0,
      selLayer: 'project',
      catalog: [{
        id: 1,
        label: '初级A1',
        layer: 'level',
        children: [{
          id: 11,
          label: '课程1',
          layer: 'chapter',
          children: [{
            id: 111,
            layer: 'part',
            label: '核心1'
          }, {
            id: 112,
            layer: 'part',
            label: '核心2'
          }]
        }, {
          id: 12,
          label: '课程2',
          children: [{
            id: 121,
            label: '核心1'
          }, {
            id: 122,
            label: '核心2'
          }]
        }, {
          id: 13,
          label: '课程3',
          children: [{
            id: 131,
            label: '核心1'
          }, {
            id: 132,
            label: '核心2'
          }]
        }, {
          id: 14,
          label: '课程4',
          children: [{
            id: 141,
            label: '核心1'
          }, {
            id: 142,
            label: '核心2'
          }]
        }, {
          id: 15,
          label: '课程5',
          children: [{
            id: 151,
            label: '核心1'
          }, {
            id: 152,
            label: '核心2'
          }]
        }]
      }, {
        id: 2,
        label: '初级A2',
        layer: 'level',
        children: [{
          id: 21,
          label: '课程1',
          layer: 'chapter'
        }, {
          id: 22,
          label: '课程2',
          layer: 'chapter'
        }]
      }, {
        id: 3,
        label: '中级B1',
        layer: 'level',
        children: [{
          id: 31,
          label: '课程1',
          layer: 'chapter'
        }, {
          id: 32,
          label: '课程2',
          layer: 'chapter',
          children: [{
            id: 321,
            layer: 'part',
            label: '核心1'
          }, {
            id: 322,
            layer: 'part',
            label: '核心2'
          }, {
            id: 323,
            layer: 'part',
            label: '核心3'
          }]
        }]
      }, {
        id: 4,
        label: '中级B2',
        layer: 'level',
        children: []
      }, {
        id: 5,
        label: '高级C1',
        layer: 'level'
      }, {
        id: 6,
        label: '高级C2',
        layer: 'level'
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  components: {
    RightMenu
  },
  mounted () {
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.levelHeight = h - 280
    document.addEventListener('click', () => {
      if (this.$refs['rightMenu']) {
        this.$refs['rightMenu'].hide()
      }
    })
  },
  methods: {
    tolangManage () {},
    switchProject (val) {
      this.selProject = val
      this.curVersion = ''
      this.selLayer = 'project'
      this.$router.push({ path: '/layout/version/' + val })
    },
    switchVersion (version) {
      this.curVersion = version
    },
    switchCatalog (catalog, layer) {
      this.selCatalog = catalog
      this.selLayer = layer
      switch (layer) {
        case 'level':
          this.$router.push({ path: '/layout/level/' + catalog })
          break
        case 'chapter':
          this.$router.push({ path: '/layout/chapter/' + catalog })
          break
        case 'part':
          this.$router.push({ path: '/layout/part/' + catalog })
          break
        default:
          break
      }
    },
    handleDragStart (node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver (draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    rightClick (ev, data, node, self) {
      console.log(ev)
      // console.log(data)
      // console.log(node)
      // console.log(self)
      this.$refs['rightMenu'].show({ left: ev.x, top: ev.y })
    },
    nodeClick (data, node, self) {
      if (this.$refs['rightMenu']) {
        this.$refs['rightMenu'].hide()
      }
      // console.log(data)
      // console.log(node)
      // console.log(self)
      this.selLayer = data.layer
      switch (data.layer) {
        case 'level':
          this.$router.push({ path: '/layout/level/' + data.id })
          break
        case 'chapter':
          this.$router.push({ path: '/layout/chapter/' + data.id })
          break
        case 'part':
          this.$router.push({ path: '/layout/part/' + data.id })
          break
        default:
          break
      }
    },
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    allowDrag (draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1
    }
  }
}
</script>

<style lang="scss" scoped>
  .lang-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100px;
    border-bottom: 1px solid rgba($color: #fff, $alpha: 0.3);
    .name {
      margin-left: 43px;
      font-size: 18px;
      font-weight: 600;
      color: #FEFEFE;
      line-height: 25px;
      cursor: pointer;
    }
  }
  .project {
    .title {
      font-size: 14px;
      font-weight: 400;
      color: rgba($color: #fff, $alpha: 0.4);
      line-height: 20px;
      margin-top: 10px;
      margin-left: 20px;
      margin-bottom: 10px;
      margin-right: 20px;
      display: flex;
      justify-content: space-between;
      a {
        cursor: pointer;
        font-size:10px;
        font-weight:400;
        color:rgba(0,122,255,1);
        line-height:14px;
      }
    }
    ul {
      padding-bottom: 9px;
      border-bottom: 1px solid rgba($color: #fff, $alpha: 0.3);
      li {
        margin: 0 3px;
        padding-left: 26px;
        padding-top: 5px;
        padding-bottom: 5px;
        color: rgba($color: #fff, $alpha: 0.6);
        font-size: 14px;
        transition: all ease .3s;
        cursor: pointer;
        span:nth-child(2) {
          position: absolute;
          right: 20px;
        }
      }
      .active {
        background: #007AFF;
        color: rgba($color: #fff, $alpha: 1);
        border-radius: 4px;
      }
    }
  }
  .catalog {
    .title {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: rgba($color: #fff, $alpha: 0.4);
      margin: 10px 0 10px 20px;
    }
    .level {
      color: rgba($color: #fff, $alpha: 0.6);
      margin-right: 5px;
      &::-webkit-scrollbar {
        width: 6px;
        background: #002742;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: rgba($color: #fff, $alpha: 0.4);
      }
      .name {
        position: relative;
        margin: 0 3px;
        padding: 4px 18px;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        transition: all ease .3s;
        cursor: pointer;
        span:nth-child(2) {
          position: absolute;
          top: 7px;
          right: 16px;
          font-size: 12px;
          line-height: 17px;
        }
      }
    }
    .chapter {
      .name {
        padding: 7px 18px;
        font-size: 12px;
        line-height: 17px;
      }
    }
    .module {
      .name {
        padding: 7px 47px;
      }
    }
    .active {
      background: #007AFF;
      border-radius: 4px;
      color: #fff;
    }
  }
  .catalog-fade-enter-active {
    transition: all .3s ease;
  }
  .catalog-fade-enter, .slide-fade-leave-to {
    transform: translateY(40px);
    opacity: 0;
  }
</style>
