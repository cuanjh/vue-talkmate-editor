<template>
  <div class="new-version">
    <div class="version-content">
      <div class="processes">
        <process1 ref="process1"/>
        <process2 ref="process2"/>
        <process3 ref="process3"/>
      </div>
    </div>
  </div>
</template>

<script>
import Process1 from './process1'
import Process2 from './process2'
import Process3 from './process3'

export default {
  data () {
    return {
    }
  },
  components: {
    Process1,
    Process3,
    Process2
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.new-version {
  padding-top: 20px;
  margin-bottom: 30px;
  border-top: 1px solid rgba(0, 0, 0, .1);
  .version-content {
    padding: 0 20px;
    .processes {
    }
  }
}

</style>
