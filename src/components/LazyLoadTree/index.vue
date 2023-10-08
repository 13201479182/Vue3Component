<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * index.vue
-->
<template>
    <div ref="lazyTreeRef" class="lazy-tree">
        <TreeNode :data="treeNode"></TreeNode>
    </div>
</template>

<script setup lang="ts">
import type { TreeInstance } from './utils/tree';
import type { TreeData, RenderTreeData } from './type';

import { watch, shallowRef, ref, onMounted } from 'vue';
import Tree from './utils/tree';

import TreeNode from './TreeNode.vue';

// 自定义属性
interface Props {
    queryTreeDataApi: () => Promise<Record<string, any>>;
}
const props = defineProps<Props>();

// 懒加载树
let loadedLevel = -1;
const treeNode = ref<RenderTreeData[]>([]);
// 在当前树中查找具体节点
function findTargetNode(nodeTree: RenderTreeData[], parentId: string): RenderTreeData | void {
    for (let i = 0, l = nodeTree.length; i < l; i++) {
        const node = nodeTree[i];
        if (node.data?.id === parentId) {
            return node;
        } else {
            const result = findTargetNode(node.children, parentId);
            if (result) {
                return result;
            }
        }
    }
}
// 懒加载下一级树
function loadNextLevelTree() {
    const nextLevelNodeArr = treeData.value?.levelMap.get(++loadedLevel);
    if (nextLevelNodeArr) {
        if (loadedLevel === 0) {
            // 加载根节点
            treeNode.value.push({
                uniqueUuid: nextLevelNodeArr[0].data!.uniqueUuid,
                width: nextLevelNodeArr[0].width,
                height: nextLevelNodeArr[0].height,
                x: nextLevelNodeArr[0].x,
                y: nextLevelNodeArr[0].y,
                data: nextLevelNodeArr[0].data,
                children: [],
            });
        } else {
            // 加载叶子节点
            nextLevelNodeArr.forEach(item => {
                const target = findTargetNode(treeNode.value, item.data!.parentId);
                target &&
                    target.children.push({
                        uniqueUuid: item.data!.uniqueUuid,
                        width: item.width,
                        height: item.height,
                        x: item.x,
                        y: item.y,
                        data: item.data,
                        children: [],
                    });
            });
        }
    }
}
// 懒加载几次树
function loadLevelTree(count: number) {
    if (typeof count !== 'number' || count < 1) return;
    while (count-- > 0) {
        loadNextLevelTree();
    }
}

const treeData = shallowRef<null | TreeInstance>(null);
// 监听treeData完成数据初始化加载
watch(treeData, newVal => {
    if (newVal) {
        loadedLevel = -1;
        treeNode.value = [];
        loadLevelTree(6);
    }
});

// 将modelList虚拟化
const virtualNode = {
    originalType: 999,
};
// 标准化当前数据
function normalizeTreeData(data: TreeData) {
    if (data && Array.isArray(data.children) && data.children.length) {
        data.children.forEach(item => {
            normalizeTreeData(item);
        });
    }
    if (data.modelList) {
        if (!data.children) data.children = [];
        data.children.push(
            Object.assign({
                originalType: 999,
                uniqueUuid: Math.floor(Math.random() * 10 ** 15 + Date.now()) + '',
                parentId: data.id,
            }),
            // @ts-ignore
            virtualNode,
            {
                modelList: data.modelList,
            },
        );
        // 移除data对modelList的引用
        delete data.modelList;
    }
}
// 更新当前数据
function update() {
    props.queryTreeDataApi().then(data => {
        const sourceData: any = data;
        normalizeTreeData(sourceData);
        treeData.value = new Tree(sourceData);
    });
}

const lazyTreeRef = ref<HTMLDivElement | null>();
onMounted(() => {
    lazyTreeRef.value!.addEventListener('scroll', (e: any) => {
        const { scrollTop, scrollHeight, offsetHeight } = e.target;
        if (scrollTop + offsetHeight >= scrollHeight) {
            loadLevelTree(1);
        }
    });
});

defineExpose({
    update,
});
</script>

<style scoped>
.contanier {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: scroll;
}
</style>
