<template>
    <Transition name="list">
        <button :class="class" :disabled="disabled">
            <icon v-if="icon" v-bind:icon="icon"/>
            <slot></slot>
        </button>
    </Transition>
</template>
    
<script>
export default {
    props: {
        class: String,
        icon: String,
        disabled: Boolean
    }
}
</script>

<style lang="scss">
@use 'variables' as v;

button {
    width: fit-content;
    border-radius: 0.75em;
    pointer-events:auto;
    box-sizing: border-box;
    display: flex;
    height: 3.2em;
    min-width: 3.2em;
    justify-content: center;
    align-items: center;
    line-height: 120%;
    color: v.$text-color;
    background: linear-gradient(v.$content-color, rgba(v.$background-color, 0.25));
    background-color: v.$content-color;
    border: none;
    margin: 0;
    text-decoration: none;
    vertical-align: middle;
    transition: 0.2s;
    gap: 12px;
    font-weight: bold;
    font-size: 1.25em;

    img {
        width: 1.25em;
        background: none;
    }

    &:enabled:active {
        background-color: rgba(v.$primary-color, 0.4);
        transition: 0.05s;
    }
    &:disabled {
        opacity: 0.25;
    }

    &.button {
        height: 3.2em;
        min-width: 3.2em;
    }

    &.primary, &.secondary {
        height: 3.2em;
        min-width: 3.2em;
    }

    &.primary {
        background: none;
        background-color: v.$primary-color;
        color: v.$background-color;
    }
    &.secondary {
        background: none;
        color: v.$primary-color;
        border: 1px solid v.$primary-color;
    }

    &.complete {
        align-self: center;
        position: absolute;
        bottom: 1.5em;
        width: calc(100% - 3em);
    }
}
</style>