<template>
  <va-page-layout
    @toggleSidebar="toggleSidebar"
    :mobileWidth="mobileWidth"
  >
    <app-navbar
      :minimized.sync="minimized"
    />
    <app-sidebar
      :minimized="minimized"
    />
    <main
      slot="content"
      id="content"
      class="layout gutter--xl fluid"
      :class="{'app-layout__main--full-width-sidebar': !minimized}"
      role="main"
    >
      <router-view/>
    </main>
  </va-page-layout>
</template>

<script>
import VaPageLayout from './VaPageLayout' 
import AppNavbar from './app-navbar/AppNavbar'
import AppSidebar from './app-sidebar/AppSidebar'
import { mapGetters } from 'vuex'
import AppTopbar from './app-topbar/AppTopbar'

export default {  // 这个vue集成了很多东西,它被router里面的index.js引用了,模块化载入，只代表顶栏和侧栏
  name: 'app-layout',
  components: {
    AppTopbar,
    VaPageLayout,
    AppNavbar,
    AppSidebar,
  },
  data () {
    return {
      minimized: false,
      mobileWidth: 767,
    }
  },
  computed: {
    ...mapGetters([
      'isLoading',
    ]),
  },
  methods: {
    toggleSidebar (minimized) {
      this.minimized = minimized
    },
  },
}
</script>

<style lang="scss">
  .app-layout {
    &__main {
      &--full-width-sidebar {
        @include media-breakpoint-down(xs) {
          display: none;
        }
      }
    }
  }
</style>
