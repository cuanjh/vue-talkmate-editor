<template>
  <div :class="['form', form.content_type]">
    <h2>{{typeName(form.content_type)}}</h2>
    <div class="fillGap-box">
      <span class="sentence">{{sentence}}</span>
    </div>
    <div class="choice-list img-choice" v-if="form.imgs_choice.length > 0">
      <img :src="(assetsDomain + form.imgs_choice[0]) | urlFix('imageView2/1/format/jpg')" alt="">
      <a v-for="(item, index) in form.words_choice" :key="index">
        <span
        :class="{'active': currIndex == index && word == item && aadActive}"
        @click="choiceSentence(item, index)">
        {{item}}</span>
      </a>
    </div>
    <div class="choice-list" v-else>
      <ul>
        <li v-for="(item, index) in form.words_choice" :key="index">
          <span
          :class="{'active': currIndex == index && word == item && aadActive}"
          @click="choiceSentence(item, index)">
          {{item}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['form', 'contentTypes', 'assetsDomain'],
  data () {
    return {
      aadActive: false,
      word: '',
      currIndex: '',
      sentence: ''
    }
  },
  created () {
    this.$on('init', () => {
      console.log('fillGap init', this.form)
      this.initWords()
    })
    this.$on('break', () => {
    })
  },
  methods: {
    typeName (type) {
      let obj = this.contentTypes.find(item => {
        return item.type === type
      })
      console.log(obj)
      let desc = ''
      if (obj) {
        desc = obj.name
      }
      return desc
    },
    initWords () {
      this.word = this.form.words_choice[0]
      console.log(this.word)
      this.sentence = this.form.sentence.replace(this.word, ' ______ ')
    },
    choiceSentence (item, index) {
      console.log(item, index, this.word)
      if (item === this.word) {
        this.currIndex = index
        this.aadActive = true
        setTimeout(() => {
          this.close()
        }, 1000)
      }
    },
    close () {
      this.currIndex = ''
      this.aadActive = false
    }
  }
}
</script>

<style lang="scss" scoped>
.fillGap-box {
  padding: 16px 12px 0;
}
.choice-list {
  background:rgba(255,255,255,1);
  box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
  border-radius:14px;
  margin: 30px 20px 0;
  ul {
    li {
      text-align: center;
      span {
        cursor: pointer;
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:18px;
        display: inline-block;
        width: 100%;
        padding: 20px;
        border-bottom: .5px solid rgba(0, 0, 0, .2);
        box-sizing: border-box;
        &.active {
          background: #4CD964;
        }
      }
    }
  }
  img {
    display: block;
    width: 116px;
    height: 118px;
    object-fit: cover;
    margin: 0 auto 20px;
  }
  a span {
    cursor: pointer;
    display: inline-block;
    font-size:14px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:18px;
    padding: 6px 12px;
    border: .5px solid rgba(7,7,7,.2);
    margin: 0 10px 10px 0;
    border-radius: 6px;
    box-sizing: border-box;
    &.active {
      background: #4CD964;
    }
  }
}
.img-choice {
  padding: 20px 10px 20px;
  box-sizing: border-box;
}
</style>
