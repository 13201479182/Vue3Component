<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * index.vue
-->
<template>
    <div class="contanier">
        <TreeGraphComponent :data="treeData"></TreeGraphComponent>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { treeExample1 } from '@/mocks/treeData';
import TreeGraph from './TreeGraph';

import TreeGraphComponent from './TreeGraphComponent.vue';

const treeGraph = new TreeGraph(treeExample1);
const treeData = ref(treeGraph.tree?.treeNode);

console.log('TreeGraph:', treeGraph);
</script>

<style scoped>
.contanier {
    position: fixed;
    width: 100%;
    height: 100%;
}
</style>
./treeGraph ./TreeGraph
