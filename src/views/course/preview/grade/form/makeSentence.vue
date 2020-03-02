<template>
<div :class="['form', form.content_type]">
  <h2>{{typeName(form.content_type)}}</h2>
  <span class="sentence">
    <a v-for="(itm, index) in options"
      :key="index"
      v-text="itm"
      @click="reset(index)">
    </a>
  </span>
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
    makeSentence (index) {
      let word = this.allWords[index]
      this.allWords.splice(index, 1)
      let i = _.findIndex(this.options, (o) => {
        return o === ''
      })
      this.options[i] = word
      let sentence = this.options.join(' ')
      console.log(sentence, this.form.sentence)
      if (sentence === this.form.sentence) {
        console.log('句子')
      }
      console.log('this.options', this.options)
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
  }
}
</style>
