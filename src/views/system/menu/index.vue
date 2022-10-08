<template>
  <div class="dashboard-container">

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getMenuList } from '@/api/user'

export default {
  computed: {
    ...mapGetters([
    ])
  },
  data() {
    return {
      seek: {},
    }
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    getMenuList() {
      getMenuList(this.seek).then(res => {
        console.log(res);
        const {
          data
        } = res
      }).catch(error => {
        console.log(error);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
