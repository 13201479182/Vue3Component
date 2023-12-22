<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-10-08
 * TreeNode.vue
-->
<template>
    <div class="tree-node">
        <div v-for="item in data" :key="item.uniqueUuid">
            <span class="level-line" :style="treeNodeStyle.getLevelLineStyle(data)"></span>
            <div v-if="item.data">
                <div v-if="item.data.originalType === 1" class="eq-item" :style="treeNodeStyle.getEqStyle(item)">
                    <!-- eq节点的顶部线 -->
                    <span class="top-line" :style="treeNodeStyle.getTopLineStyle(item)"></span>
                    <!-- eq节点的底部线 -->
                    <span class="bottom-line" :style="treeNodeStyle.getBottomLineStyle(item)"> </span>
                    <!-- eq展示 -->
                    {{ item.data.name }}
                </div>

                <ul v-else-if="item.data.originalType === 999" class="point-item" :style="treeNodeStyle.getPointStyle(item)">
                    <!-- modelList的顶部线 -->
                    <span class="top-line" :style="treeNodeStyle.getTopLineStyle(item)"></span>
                    <LazyBlock :data="item.data.modelList"></LazyBlock>
                </ul>
            </div>

            <!-- 递归调用当前组件 -->
            <TreeNode v-if="item.children.length" :parent="item" :data="item.children"></TreeNode>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { RenderData } from './type';

import TreeNode from './TreeNode.vue';
import LazyBlock from './LazyBlock.vue';

// 自定义属性
interface Props {
    parent: null | RenderData;
    data: RenderData[];
}
const props = withDefaults(defineProps<Props>(), {
    parent: null,
    data: () => [],
});

const treeNodeStyle = {
    // 获取eq的样式
    getEqStyle(item) {
        return {
            top: `${item.y}px`,
            left: `${item.x}px`,
            width: `${item.width}px`,
            height: `${item.height}px`,
        };
    },
    // 获取测点的样式
    getPointStyle(item) {
        return {
            top: `${item.y}px`,
            left: `${item.x}px`,
            width: `${item.width}px`,
            height: `${item.height}px`,
        };
    },
    // 获取节点上边界中线
    getTopLineStyle(item) {
        const style: { [key: string]: string } = {
            left: `${(item.width - 2) / 2}px`,
        };
        if (!props.parent) {
            style.display = 'none';
        } else {
            if (props.parent.children.length < 2) {
                style.display = 'none';
            } else {
                const margin = item.y - props.parent.y - props.parent.height;
                style.top = `-${margin / 2}px`;
                style.height = `${margin / 2}px`;
            }
        }
        return style;
    },
    // 获取同一层级节点上边界线
    getLevelLineStyle(data: RenderData[]) {
        const firstChild = data[0];
        const lastChild = data[data.length - 1];
        const style: { [key: string]: string } = {
            left: `${firstChild.x + firstChild.width / 2}px`,
            width: `${lastChild.x + lastChild.width / 2 - firstChild.x - firstChild.width / 2}px`,
        };
        if (props.parent) {
            const margin = data[0].y - props.parent.y - props.parent.height;
            style.top = `${firstChild.y - margin / 2}px`;
        } else {
            style.display = 'none';
        }
        return style;
    },
    // 获取节点下边界线
    getBottomLineStyle(item) {
        const style: { [key: string]: string } = {
            top: `${item.height}px`,
            left: `${(item.width - 2) / 2}px`,
        };
        if (item.children.length === 1) {
            const margin = item.children[0].y - item.y - item.height;
            style.height = `${margin}px`;
        } else if (item.children.length > 1) {
            const margin = item.children[0].y - item.y - item.height;
            style.height = `${margin / 2}px`;
        } else {
            style.display = 'none';
        }
        return style;
    },
};
</script>
