<template>
    <div id="date-container">
        <DatePicker id="date-picker" v-model="date" locale="en-US" dark>
            <template #trigger>
                <input type="text" :value="inputDate" /> <!-- @blur="updateValue($event)" -->
            </template>
        </DatePicker>
    </div>
</template>
  
<script>
import { DateTime } from 'luxon'
import DatePicker from '@vuepic/vue-datepicker';
import Backdrop from '@/components/backdrop.vue';

export default {
    props: {
        dateFormat: String
    },

    emits: ['setDate'],

    components: {
        DatePicker,
        Backdrop
    },

    watch: {
        date(newDate) {
            //this.inputDate = DateTime.fromJSDate(newDate).toFormat(this.dateFormat)
            this.setInputFormat(DateTime.fromJSDate(newDate))
            this.$emit('setDate', this.date)
        },
    },

    data() {
        return {
            date: new Date(),
            inputDate: null,
            time: null
        };
    },

    methods: {
        /*
        updateValue(input) { // $event directly gets the element
            function isValidDate(d) {
                return d instanceof Date && !isNaN(d);
            }

            const newDate = DateTime.fromFormat(input.target.value, this.dateFormat).toJSDate()
            if (isValidDate(newDate)) {
                this.date = newDate
            } else {
                //setze Eingabe auf das letzte gültige Datum zurück
                //this.inputDate = DateTime.fromJSDate(this.date).toFormat(this.dateFormat)
                this.setInputFormat(DateTime.fromJSDate(this.date))
                input.target.value = this.inputDate
            }
        },
        */

        setInputFormat(dateObj) {
            const date = dateObj.setLocale('en-US').toRelativeCalendar()
            this.inputDate = date.charAt(0).toUpperCase() + date.substring(1)
        }
    },

    created() {
        this.setInputFormat(DateTime.now())
        this.$emit('setDate', this.date)
    }
};
</script>
  
<style lang="scss">
@use "variables" as v;

/*
#date-picker {
    svg.calendar {
        height: 1.4em;
        position: absolute;
        //left: v.$viewport-padding-horizontal;
        transform: translate(0, -101%);
        z-index: 1;
        //border-right: 1px solid rgba(v.$text-color, 0.2);
        //border-radius: 0;
        padding: v.$viewport-padding-horizontal;
        background-color: rgba(v.$text-color, 0.4);

        path {
            transform: translate(0, -5%);
        }
    }
}
*/
.dp__menu {
    background-color: v.$content-color;
    border-radius: 1.5em;
}

.dp--menu-wrapper {
    position: fixed;
    z-index: 100;
    //transform: translate(calc(v.$viewport-padding-horizontal*0.5), calc(v.$viewport-padding-vertical + v.$content-padding - v.$viewport-padding-horizontal*0.5));
    //width: calc(100vw - v.$viewport-padding-horizontal);
    width: 100vw;
    top: 100% !important;
    transform: translate(0, -100%);
    left: 0;
}

.dp__menu_inner {
    padding: v.$viewport-padding-horizontal;

    padding: v.$content-padding;
    padding-bottom: v.$viewport-padding-vertical;

    >div {
        gap: v.$viewport-padding-horizontal;
    }

    &:first-child::after {
        position: absolute;
        content: "";
        display: inline-block;
        width: 200px;
        height: 200px;
        background-color: blue !important;
        z-index: -1;
    }
}

.dp__arrow_top,
.dp__overlay,
.dp__selection_preview {
    display: none;
}

.dp__calendar_header {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: rgba(v.$text-color, 0.6);
    font-weight: 500;
    //border-bottom: 1px solid rgba(v.$text-color, 0.2);
    //margin-bottom: 2%;
    border-radius: 0;
}

.dp__calendar_header_item {
    text-align: center;
    flex-grow: 1;
    padding: calc(v.$viewport-padding-horizontal/2);
}

.dp__calendar_row {
    flex-direction: row;
}

.dp__calendar_item {
    flex-grow: 1;
    padding: 1%;
}

.dp__cell_inner {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1/1;
    transition: all .2s;
    border-radius: 100%;
}

.dp__active_date {
    background: v.$primary-color;
    color: v.$background-color;
}

.dp__cell_offset,
.dp__cell_disabled,
.dp__calendar_header_separator {
    opacity: 0.25;
}

.dp__today {
    border: 1px solid v.$primary-color
}

.dp__instance_calendar {
    width: 100%;

    >div:nth-child(2) {
        display: none;
    }
}

.dp__month_year_wrap,
.dp__month_year_row,
.dp__menu_content_wrapper,
.dp__action_buttons,
.dp__flex_display {
    flex-direction: row;
    justify-content: center;
    //gap: 4%;
}

.dp__month_year_select {
    color: v.$text-color;
    font-size: 20px;
    background: none;
    flex-grow: unset;

    &:enabled:active {
        background: none;
    }
}

.dp__btn,
.dp--time-overlay-btn,
.dp--time-invalid,
.dp--qr-btn {
    justify-content: center;
    align-items: center;

    svg,
    span {
        height: 1.25em;
    }
}

.dp__action_buttons {
    padding: v.$viewport-padding-vertical v.$content-padding;
    padding-top: 0;
    gap: 0.5em;
}

.dp__action_button {
    flex-grow: 1;
    background: none;
    background-color: v.$primary-color;
    color: v.$content-color;

    &:first-of-type {
        background: none;
        border: 1px solid v.$primary-color;
        color: v.$primary-color;
    }
}

.calendar-next-enter-from,
.calendar-prev-leave-to {
    opacity: 0;
    transform: translateX(5%)
}

.calendar-next-leave-to,
.calendar-prev-enter-from {
    opacity: 0;
    transform: translateX(calc(5% * -1))
}

.dp-menu-appear-bottom-enter-active,
.dp-menu-appear-bottom-leave-active,
.dp-menu-appear-top-enter-active,
.dp-menu-appear-top-leave-active,
.dp-slide-up-enter-active,
.dp-slide-up-leave-active,
.dp-slide-down-enter-active,
.dp-slide-down-leave-active {
    transition: all 0.2s ease-out
}

.dp-menu-appear-top-enter-from,
.dp-menu-appear-top-leave-to,
.dp-slide-down-leave-to,
.dp-slide-up-enter-from {
    opacity: 0;
    transform: translateY(5%)
}

.dp-menu-appear-bottom-enter-from,
.dp-menu-appear-bottom-leave-to,
.dp-slide-down-enter-from,
.dp-slide-up-leave-to {
    opacity: 0;
    transform: translateY(calc(5% * -1))
}
</style>

