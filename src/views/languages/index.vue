<template>
  <div class="langs-container">
    <letters-comp />
    <div class="langs-content">
      <router-view></router-view>
    </div>
    <up-course-img-comp />
    <add-lang-comp />
  </div>
</template>

<script>
import LettersComp from './common/letters'
import UpCourseImgComp from './common/upCourseImg'
import AddLangComp from './common/addLang'

export default {
  components: {
    LettersComp,
    UpCourseImgComp,
    AddLangComp
  }
}
</script>

<style lang="scss" scoped>
.langs-container {
  padding: 0px 18px 0;
  box-sizing: border-box;
  height: 100%;
  display: flex;
}
.langs-content {
  padding-top: 30px;
}
</style>
