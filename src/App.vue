<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * App.vue
-->
<template>
    <div class="contanier">123</div>
</template>

<script setup lang="ts">
import TreeGraph from '../util/TreeGraph';
import { treeData, treeTestData } from '../mocks/treeData';

console.time('构建树时间:');
const treeGraph = new TreeGraph(treeData);
// 异步向树追加节点
treeGraph.tree?.appendSubTree(treeTestData);
console.timeEnd('构建树时间:');

console.log('treeGraph:', treeGraph);
</script>

<style scoped></style>
