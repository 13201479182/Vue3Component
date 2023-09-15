<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-09-01
 * TreeGraph.vue
-->
<template>
    <div class="tree-graph">
        <!-- 展示当前组件的内容 -->
        <span class="graph-item" :style="style">{{
            data.data?.uniqueUuid
        }}</span>

        <!-- 递归调用当前组件 -->
        <ul v-if="data.children && data.children.length">
            <li v-for="item in data.children">
                <TreeGraphComponent :data="item"></TreeGraphComponent>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    data: any;
}>();

const style = computed(() => {
    const node = props.data;
    return {
        top: node.y + 'px',
        left: node.x + 'px',
        width: node.width + 'px',
        height: node.height + 'px',
    };
});
</script>

<style scoped>
.graph-item {
    width: 100px;
    height: 100px;
    background-color: salmon;
    display: inline-block;
    position: absolute;
}
li {
    list-style: none;
}
ul {
    margin: 0;
    padding: 0;
}
</style>
