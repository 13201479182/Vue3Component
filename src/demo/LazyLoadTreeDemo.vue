<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-10-09
 * LazyLoadTreeDemo.vue
-->
<template>
    <div class="lazy-load-tree-demo">
        <LazyLoadTree :query-tree-data-api="queryTreeDataApi"></LazyLoadTree>
    </div>
</template>

<script setup lang="ts">
import { LazyLoadTree } from '@/components';
import { treeData } from '@/mocks/lazyLoadTreeData';

function queryTreeDataApi() {
    return Promise.resolve(treeData);
}
</script>

<style scoped></style>
