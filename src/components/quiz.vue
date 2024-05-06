<template>
  <div id="quiz">
    <h1>Quiz</h1>
    <b>Is the following statement true or false?</b>
    <Transition name="fade">
      <div id="quizCard" :class="{ red: animation, next: correct }" v-if="!quizDone">
        <h5>Question {{ currentQuestion + 1 }}</h5>
        <p>{{ questions[currentQuestion].question }}</p>
      </div>
    </Transition>
    <Transition name="fade">
      <div id="quizCard" v-if="quizDone">
        <p>All done!</p>
      </div>
    </Transition>

    <div class="row" id="actionButtons">
      <Transition name="fade">
        <Button class="primary" v-if="!quizDone" @click="nextQuestion(false)">False</Button>
      </Transition>
      <Transition name="fade">
        <Button class="primary" v-if="!quizDone" @click="nextQuestion(true)">True</Button>
      </Transition>
      <Transition name="fade">
        <Button class="primary" v-if="quizDone" @click="$emit('quizDone')">Finish Bite</Button>
      </Transition>
    </div>
  </div>
</template>

<script>
import Image from '@/components/image.vue';
import Button from '@/components/button.vue';

export default {
  components: {
    Image,
    Button
  },

  props: {
    questions: Array
  },

  data() {
    return {
      currentQuestion: 0,
      quizDone: false,
      animation: false,
      correct: false
    }
  },

  methods: {
    nextQuestion(answer) {
      console.log(this.currentQuestion, this.questions.length)

      if (answer === this.questions[this.currentQuestion].answer) {
        this.correct = true
        setTimeout(() => {
          this.correct = false
        }, 500)

        if (this.currentQuestion < this.questions.length - 1) {
          this.currentQuestion = this.currentQuestion + 1
        } else {
          this.$emit("finished", true)
          this.quizDone = true
        }
      } else {
        this.animation = true
        setTimeout(() => {
          this.animation = false
        }, 500)
      }
    }
  },

  emits: ["quizDone", "finished"]
}
</script>

<style lang="scss">
@use "variables" as v;

#quiz {
  gap: v.$content-gap;
  height: 100%;
  padding: v.$viewport-padding-vertical v.$viewport-padding-horizontal;
  padding-top: 25%;

  #actionButtons {
    flex-grow: 1;
    align-items: flex-end;
  }
}

#quizCard {
  * {
    color: v.$background-color;
  }
  
  padding: calc(2.5*v.$viewport-padding-horizontal);
  background-color: v.$text-color;
  color: v.$background-color;
  width: 100%;
  aspect-ratio: 1/1;
  gap: v.$content-gap;
  align-items: center;

  &.red {
    background-color: #FACADB;
  }

  &.next {
    background-color: #B8F8D6;
  }

  h5 {
    opacity: 0.6;
  }

  p {
    text-align: center;
    font-size: 1.25em;
    font-weight: 500;
  }
}
</style>