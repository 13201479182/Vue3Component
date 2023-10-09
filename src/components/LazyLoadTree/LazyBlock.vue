<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-10-09
 * LazyBlock.vue
-->
<template>
    <ul ref="lazyBlockRef" class="lazy-block">
        <li v-for="item in lazyData" :key="item.uniqueUuid" :title="item.displayName">
            {{ item.name }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { TreeData } from './type';

import { onMounted, ref } from 'vue';

// 自定义属性
interface Props {
    data: TreeData[];
}
const props = defineProps<Props>();

const lazyData = ref<TreeData[]>([]);

let loadCount = -1;
function loadLazyData(count) {
    const data = props.data;
    while (count > 0) {
        count--;
        if (data[++loadCount]) {
            lazyData.value.push(data[loadCount]);
        } else {
            return;
        }
    }
}

const lazyBlockRef = ref<HTMLUListElement | null>(null);
onMounted(() => {
    const h = lazyBlockRef.value!.scrollHeight;
    const needCount = Math.ceil(h / 25);
    loadLazyData(needCount);

    lazyBlockRef.value!.addEventListener('scroll', (e: any) => {
        const { scrollTop, scrollHeight, offsetHeight } = e.target;
        if (scrollTop + offsetHeight >= scrollHeight) {
            loadLazyData(1);
        }
    });
});
</script>
