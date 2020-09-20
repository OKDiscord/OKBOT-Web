<template>
  <div v-if="error" class="notification is-danger">
    <p>Nelze načíst channely. Prosím, zkuste to později.</p>
  </div>

  <div class="select is-dark" v-else>
    <select @change="change">
      <option @click="setChannel(null)">Vyberte channel</option>
      <option v-for="(c, i) in channels" :key="i" @click="setChannel(c)">{{
        c.name
      }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export type Channel = {
  id: string
  name: string
  nsfw: boolean
}

export type ChannelsResponse = {
  success: boolean
  channels: Channel[]
}
// FIXME: remove @ts-ignore

export default Vue.extend({
  props: ["setChannel", "change", "setSuccessFetch"],
  data: () => ({
    toggled: false,
    channels: [] as Channel[],
    error: false
  }),
  async mounted() {
    try {
      const response = await this.$axios.request<ChannelsResponse>({
        url: "/channels",
        method: "GET"
      })

      if (!response.data.success) return (this.error = true)

      this.channels = response.data.channels
      this.setSuccessFetch(true)
    } catch (e) {
      console.log(e)
      this.error = true
      this.setSuccessFetch(false)
    }
  }
})
</script>
