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
import type { TreeInstance } from './utils/tree';
import type { TreeData, RenderTreeData } from './type';

import { watch, shallowRef, ref, onMounted } from 'vue';
import Tree from './utils/tree';
import { NodeOriginalType } from './type';

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
function findTargetNode(nodeTree: RenderTreeData, parentUuid: string): RenderTreeData | void {
    const queue = [nodeTree];
    while (queue.length > 0) {
        const shiftNode = queue.shift() as RenderTreeData;
        if (shiftNode.uniqueUuid === parentUuid) return shiftNode;
        if (shiftNode.children && shiftNode.children.length) {
            shiftNode.children.forEach(item => {
                queue.push(item);
            });
        }
    }
}
// 懒加载下一级树
function loadNextLevelTree() {
    const nextLevelNodeArr = treeData.value?.levelMap.get(++loadedLevel);

    if (nextLevelNodeArr) {
        if (loadedLevel === 0) {
            // 加载根节点
            const rootNode = nextLevelNodeArr[0];
            treeNode.value.push({
                uniqueUuid: rootNode.data!.uniqueUuid,
                width: rootNode.width,
                height: rootNode.height,
                x: rootNode.x,
                y: rootNode.y,
                data: rootNode.data,
                children: [],
            });
        } else {
            // 加载叶子节点
            nextLevelNodeArr.forEach(item => {
                const target = findTargetNode(treeNode.value[0], item.data!.parentUuid);
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
        loadLevelTree(10);
        console.log('treeNode:', treeNode);
    }
});

// 标准化当前数据
function normalizeTreeData(node: TreeData, parent: TreeData | null) {
    if (node && Array.isArray(node.children) && node.children.length) {
        node.children.forEach(item => {
            normalizeTreeData(item, node);
        });
    }

    // 为每一个节点绑定其父级uid
    node.parentUuid = parent ? parent.uniqueUuid : null;

    // 将modelList扁平化为node的children
    if (node.modelList) {
        if (!node.children) node.children = [];
        const point = {
            originalType: NodeOriginalType.Point,
            parentUuid: node.uniqueUuid,
            uniqueUuid: Math.floor(Math.random() * 10 ** 15 + Date.now()) + '',
            modelList: node.modelList,
        };
        // 为modelList中的每一个成员赋予parentUuid
        node.modelList.forEach(item => {
            item.parentUuid = point.uniqueUuid;
        });
        node.children.push(point);
        // 移除data对modelList的引用
        delete node.modelList;
    }
}
// 更新当前数据
function update() {
    props.queryTreeDataApi().then(data => {
        const sourceData: any = data;
        normalizeTreeData(sourceData, null);
        treeData.value = new Tree(sourceData);
    });
}
update();

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
