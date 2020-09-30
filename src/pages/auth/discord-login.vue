<template>
  <div>
    <InlineLoader v-if="loading" />
    <div v-else-if="!loading && !error">
        <h1>stuff</h1>
    </div>

    <div v-if="error" class="mb-4">
      <router-link to="/login" class="button is-primary is-medium">Zpět k přihlášení</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { clearFlash, flashOneMessage } from "@/app/functions/flash"
import { objectEmpty } from "@/app/functions/misc"
import InlineLoader from "@/components/global/InlineLoader.vue"

import Vue from "vue"
export default Vue.extend({
  components: {
    InlineLoader,
  },
  data: () => ({
    loading: false,
    error: false
  }),
  mounted() {
    const { query } = this.$route
    if (objectEmpty(query)) return this.$router.push("/login")

    clearFlash()
    this.loading = true

    if (query.hasOwnProperty("error")) {
      this.loading = false
      this.error = true
      return flashOneMessage({
        type: "danger",
        title: `Chyba (${query.error})`,
        message: `Došlo k chybě při přihlašování k Discordu. Chyba: ${
          query.error_description ?? "neznámá"
        }`,
      })
    }

    if (!query.hasOwnProperty("code")) {
      this.loading = false
      return this.$router.push('/login')
    }
    setTimeout(async () => {
      try {
        const response = await this.$axios.request({
          method: "POST",
          url: "/auth/discord-authorize",
          data: {
            code: query.code,
          },
        })
        if (!response.data.success) {
          this.loading = false
          return flashOneMessage({
            type: "danger",
            title: `Došlo k chybě (State: ${response.data.state})`,
            message: response.data.localized || "Žádný popis chyby",
          })
        }

        // TODO: do stuff
      } catch (e) {
        this.loading = false
        flashOneMessage({
          type: "danger",
          title: "Došlo k chybě",
          message: `Došlo k chybě při ověřování OAuth code. Chyba: ${e.message}`,
        })
      }
    }, Math.random() * 600)
  },
})
</script>
