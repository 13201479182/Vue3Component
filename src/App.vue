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
import { treeData } from '../mocks/treeData';

const treeGraph = new TreeGraph(treeData);
console.log('treeGraph:', treeGraph);
</script>

<style scoped></style>
../util/TreeGraph
