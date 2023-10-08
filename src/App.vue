<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * App.vue
-->
<template>
    <LazyLoadTree></LazyLoadTree>
</template>

<script setup lang="ts">
import { LazyLoadTree } from '@/components/index';
</script>

<style>
html,
body,
#app {
    width: 100%;
    height: 100%;
    position: relative;
}
body {
    padding: 0;
    margin: 0;
}
</style>
