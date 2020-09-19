<template>
  <div>
    <Header />
    <div style="min-height: calc(100vh - 4rem)">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Header from "@/components/layout/Header.vue"
import Footer from "@/components/layout/Footer.vue"

export default Vue.extend({
  name: "DefaultLayout",
  components: {
    Header,
    Footer,
  },
})
</script>
