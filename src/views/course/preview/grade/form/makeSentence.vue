<template>
<div :class="['form', form.content_type]">
  <h2>{{typeName(form.content_type)}}</h2>
  <div class="sentence">
    <a v-for="(itm, index) in options"
      :key="index"
      v-text="itm"
      @click="reset(index)">
    </a>
  </div>
  <div class="choice-list">
    <div class="choice-content">
      <a  v-for="(item, index) in allWords" :key="index">
        <span @click="makeSentence(index)">{{item}}</span>
      </a>
    </div>
  </div>
</div>
</template>

<script>
import _ from 'lodash'

export default {
  props: ['form', 'contentTypes', 'assetsDomain'],
  data () {
    return {
      aadActive: false,
      options: [],
      allWords: []
    }
  },
  created () {
    this.$on('init', () => {
      console.log('makeSentence init', this.form)
      this.resetAll()
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
    resetAll () {
      this.allWords = JSON.parse(JSON.stringify(this.form.words_choice))
      this.options = []
      this.allWords.forEach(item => {
        this.options.push('')
      })
      console.log(this.allWords, this.options)
    },
    reset (index) {
      var word = this.options[index]
      this.options[index] = ''
      // this.allWords.push(word)
      this.allWords.splice(index, 1, word)
    },
    makeSentence (index) {
      let word = this.allWords[index]
      this.allWords.splice(index, 1, '')
      // this.allWords[index].replace(word, '')
      let i = _.findIndex(this.options, (o) => {
        return o === ''
      })
      this.options[i] = word
    }
  }
}
</script>

<style lang="scss" scoped>
.sentence {
  display: inline-block;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  min-height: 60px;
  a {
    font-size:14px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:18px;
  }
}
.choice-list {
  background:rgba(255,255,255,1);
  box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
  border-radius:14px;
  margin: 6% 20px 0;
  // position: absolute;
  // width: 86%;
  // bottom: 8%;
  min-height: 300px;
  .choice-content {
    width: 100%;
    padding: 6%;
    box-sizing: border-box;
  }
  a {
    display: inline-block;
    min-width: 26px;
    min-height: 30px;
    text-align: center;
    margin-bottom: 10px;
    margin-right: 10px;
    span {
      cursor: pointer;
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:18px;
      padding: 6px 12px;
      border: .5px solid rgba(7,7,7,.2);
      border-radius: 6px;
      box-sizing: border-box;
    }
  }
}
</style>
