<template>
  <div class="cropper-container">
    <vue-cropper
      ref="cropper"
      src="https://course-assets1.talkmate.com/course/images/common/Basic/Level1/Unit1/Chapter1/A0/1-1.webp?imageView2/1/format/jpg">
    </vue-cropper>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
export default {
  components: {
    VueCropper
  }
}
</script>
