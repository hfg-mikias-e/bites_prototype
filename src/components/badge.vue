<template>
    <div id="badge" :class="'area-' + area">
        <h5>
            <slot></slot>
        </h5>
    </div>
</template>
    
<script>
export default {
    props: {
        area: Number
    }
}
</script>

<style lang="scss">
@use 'variables' as v;

#badge {
    width: fit-content;
    padding: 0.325em 0.75em;
    backdrop-filter: blur(0.5em);
    border-radius: 0.5em;

    h5 {
        font-weight: 500;
    }

    &.area-0 {
        h5 {
            color: v.$category-65786415b5cab38bd49c4ea0;
        }
        background-color: rgba(v.$category-65786415b5cab38bd49c4ea0, 0.2);
    }

    &.area-1 {
        h5 {
            color: v.$category-6578643ab5cab38bd49c4ea1;
        }
        background-color: rgba(v.$category-6578643ab5cab38bd49c4ea1, 0.2);
    }

    &.area-2 {
        h5 {
            color: v.$category-65786453b5cab38bd49c4ea3;
        }
        background-color: rgba(v.$category-65786453b5cab38bd49c4ea3, 0.2);
    }
}
</style>