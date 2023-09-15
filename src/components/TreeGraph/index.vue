<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * index.vue
-->
<template>
    <div class="contanier">
        <TreeGraphComponent v-if="data" :data="data"></TreeGraphComponent>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive } from 'vue';

import { treeData, treeTestData } from '@/mocks/treeData';
import TreeGraph from './utils/TreeGraph';

import TreeGraphComponent from './TreeGraphComponent.vue';

const treeGraph = new TreeGraph(treeData);
const data = ref(treeGraph.tree.treeNode);

// setTimeout(() => {
//     treeGraph.tree?.appendSubTree(treeTestData).then(res => {
//         data.value = null;
//         nextTick(() => {
//             data.value = res;
//         });
//     });
// }, 1000);

console.log('TreeGraph:', treeGraph);
</script>

<style scoped>
.contanier {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: scroll;
}
</style>
./treeGraph ./TreeGraph ./utils/TreeGraph
