<template>
  <form @submit.prevent="submit">
    <div class="field">
      <label class="label is-size-4">Otázka</label>
      <input type="text" v-model="question" class="input is-medium" />
    </div>

    <div class="field has-text-right" style="margin-top: 30px !important">
      <button
        class="button"
        @click.prevent="createField"
        :class="{'is-dark is-disabled': answers.length === 10, 'is-info': answers.length !== 10}"
      >+ Přidat odpověď</button>
    </div>

    <div ref="answersContainer"></div>

    <div class="field has-text-right" style="margin-top: 60px !important">
      <button
        class="button is-medium"
        :class="{
          'is-primary': !formLoading,
          'is-dark is-loading': formLoading
        }"
        type="submit"
      >Odeslat</button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue"
import PollAnswer from "./PollAnswer.vue"

export default Vue.extend({
  components: {
    PollAnswer,
  },
  data() {
    return {
      question: "",
      answers: [] as string[],
      formLoading: false,
    }
  },
  mounted() {
    this.createField()
  },
  methods: {
    async submit() {
      this.formLoading = true

      try {
        const response = await this.$axios.request({
          method: "POST",
          url: "/poll",
          data: {
            question: this.question,
            answers: this.answers,
          },
        })
      } catch (e) {
        console.log("bitch")
        console.log(e)
      }
    },
    createField() {
      const newAnswerId = this.answers.length

      this.answers.push("")

      const PollAnswerInstance = Vue.extend(PollAnswer)

      const field = new PollAnswerInstance({
        propsData: {
          setAnswer: (newTitle: any) =>
            (this.answers[newAnswerId] = newTitle.target.value),
        },
      })
      field.$mount()

      // @ts-ignore
      this.$refs.answersContainer.appendChild(field.$el)
    },
    addAnswerDisabled() {
      return this.answers.length === 10
    },
  },
})
</script>
