<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * index.vue
-->
<template>
    <div ref="lazyTreeRef" class="lazy-tree">
        <TreeNode :parent="null" :data="treeNode"></TreeNode>
    </div>
</template>

<script setup lang="ts">
import type { RenderData } from './type';

import { ref, onBeforeMount } from 'vue';
import RenderTree from './utils/RenderTree';

import TreeNode from './TreeNode.vue';

// 初始化渲染树
const treeNode = ref<RenderData[]>([]);
const renderTree = ref<InstanceType<typeof RenderTree> | null>(null);
function initRenderTree() {
    RenderTree.dataRef = treeNode;
    renderTree.value = new RenderTree();
}

onBeforeMount(() => {
    initRenderTree();
});
</script>

<style lang="less">
.lazy-tree {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: scroll;
    .eq-item,
    .point-item,
    .top-line,
    .bottom-line,
    .level-line {
        display: inline-block;
        position: absolute;
    }
    .eq-item {
        text-align: center;
        background-color: aqua;
    }
    .point-item {
        box-sizing: border-box;
        padding: 5px;
        border: 1px dashed #a8abb2;
    }
    .top-line,
    .bottom-line {
        width: 2px;
        background-color: purple;
    }
    .level-line {
        height: 2px;
        background-color: purple;
    }
    .lazy-block {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        li {
            font-size: 14px;
            height: 25px;
            line-height: 25px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
