<template>
  <Transition name="fade">
    <div id="date-inputs" :class="{ show: show }">
      <DatePicker :dateFormat="dateFormat" @setDate="d => date = d" />
      <input v-model="inputTime" @blur="setTime($event)" />
    </div>
  </Transition>
</template>

<script>
import DatePicker from '@/components/datepicker.vue'
import Button from '@/components/button.vue'
import { DateTime } from 'luxon'

export default {
  components: {
    Button,
    DatePicker
  },

  props: {
    //content: Object,
    sendNotification: Boolean,
    reminderDate: String,
    show: Boolean
  },

  emits: ["notificationDate"],

  computed: {
    scheduledDate() {
      const today = DateTime.now().startOf('day');
      const timeOfDay = DateTime.fromFormat(this.time, this.timeFormat).diff(today);
      const result = DateTime.fromJSDate(this.date).startOf('day').plus(timeOfDay);

      return result
    }
  },

  watch: {
    currentTime(time) {
      if (this.scheduledDate) {
        // Zeitdifferenz zur aktuellen Zeit -> wie viele Minuten in der Zukunft liegt das Datum?
        this.future = time.diff(this.scheduledDate, this.notifType)[this.notifType]

        /*
        if(this.future >= 0) {
          this.$emit("enableNotification", true)
        } else {
          this.$emit("enableNotification", false)
        }*/
        this.$emit("notificationDate", [this.scheduledDate, this.future])
      }
    },

    inputTime() {
      if (/^([0]?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i.test(this.inputTime) && DateTime.fromFormat(this.inputTime, this.timeFormat).isValid) {
        this.time = this.inputTime
      }
    },
  },

  data() {
    return {
      dateFormat: 'MM/dd/yyyy', //'dd.MM.yyyy',
      timeFormat: 'h:mm a', // 'HH:mm'

      inputTime: null,
      currentTime: null,
      date: null,
      time: null,

      notifType: "minutes",
      future: 0
    }
  },

  methods: {
    setTime() {
      // convert if wrong date format
      if (DateTime.fromFormat(this.inputTime, 'HH:mm').isValid) {
        this.inputTime = DateTime.fromFormat(this.inputTime, 'HH:mm').toFormat(this.timeFormat)
      } else if (DateTime.fromFormat(this.inputTime.split(" ")[0], 'HH:mm').isValid) {
        if (DateTime.fromFormat(this.inputTime.split(" ")[0], 'HH:mm').toObject().hour > 12) {
          this.inputTime = DateTime.fromFormat(this.inputTime.split(" ")[0], 'HH:mm').toFormat(this.timeFormat)
        }
      }

      // check for valid time format 
      if (/^([0]?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i.test(this.inputTime) === false) {
        //if (DateTime.fromFormat(input.target.value, this.timeFormat).isValid) {
        this.inputTime = this.time
      }
    },
  },

  async created() {
    setInterval(() => {
      this.currentTime = DateTime.now()
    }, 100)

    this.time = DateTime.now()/*.plus({ hours: 1 })*/.toFormat(this.timeFormat)
    if (this.reminderDate) {
      this.time = DateTime.fromISO(this.reminderDate).toFormat(this.timeFormat)
    }

    this.inputTime = this.time
  }

};
</script>

<style lang="scss">
@use "variables" as v;

#date-inputs {
  height: 1px;
  opacity: 0;
  margin: -0.625em 0;

  width: 100%;
  gap: 0.5em;

  &.show {
    height: calc(2*3em + 1.75em);
    opacity: 1;
    margin: 0;
  }
}
</style>