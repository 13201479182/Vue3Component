<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * App.vue
-->
<template>
    <!-- 懒加载树使用示例 -->
    <LazyLoadTreeDemo></LazyLoadTreeDemo>
</template>

<script setup lang="ts">
import LazyLoadTreeDemo from '@/demo/LazyLoadTreeDemo.vue';
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
ul {
    margin: 0;
    padding: 0;
}
::-webkit-scrollbar {
    width: 6px;
}
/*定义滚动条轨道：内阴影+圆角*/
::-webkit-scrollbar-track {
    background-color: lightgray;
}
/*定义滑块：内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: salmon;
}
</style>
