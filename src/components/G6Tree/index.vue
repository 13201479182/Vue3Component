<!--
 * @author: 刘汇源lwx188666
 * @since: 2023-09-21
 * index.vue
-->
<template>
    <div id="g6-tree" ref="g6Tree"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import G6 from '@antv/g6';
import { data } from '@/mocks/g6Data.ts';

console.log(data);

const g6Tree = ref<HTMLDivElement | null>();

function init() {
    const width = g6Tree.value?.scrollWidth;
    const height = g6Tree.value?.scrollHeight;

    const COLLAPSE_ICON = function COLLAPSE_ICON(
        x: number,
        y: number,
        r: number,
    ) {
        return [
            ['M', x - r, y - r],
            ['a', r, r, 0, 1, 0, r * 2, 0],
            ['a', r, r, 0, 1, 0, -r * 2, 0],
            ['M', x + 2 - r, y - r],
            ['L', x + r - 2, y - r],
        ];
    };
    const EXPAND_ICON = function EXPAND_ICON(x: number, y: number, r: number) {
        return [
            ['M', x - r, y - r],
            ['a', r, r, 0, 1, 0, r * 2, 0],
            ['a', r, r, 0, 1, 0, -r * 2, 0],
            ['M', x + 2 - r, y - r],
            ['L', x + r - 2, y - r],
            ['M', x, y - 2 * r + 2],
            ['L', x, y - 2],
        ];
    };

    G6.registerNode(
        'icon-node',
        {
            options: {
                size: [60, 20],
                stroke: '#91d5ff',
                fill: '#91d5ff',
            },
            draw(cfg, group) {
                const styles = this.getShapeStyle(cfg);
                const { labelCfg = {} } = cfg;

                const w = styles.width;
                const h = styles.height;

                const keyShape = group.addShape('rect', {
                    attrs: {
                        ...styles,
                        x: -w / 2,
                        y: -h / 2,
                    },
                });

                /**
                 * leftIcon 格式如下：
                 *  {
                 *    style: ShapeStyle;
                 *    img: ''
                 *  }
                 */
                if (cfg.leftIcon) {
                    const { style, img } = cfg.leftIcon;
                    group.addShape('rect', {
                        attrs: {
                            x: 1 - w / 2,
                            y: 1 - h / 2,
                            width: 38,
                            height: styles.height - 2,
                            fill: '#8c8c8c',
                            ...style,
                        },
                    });

                    group.addShape('image', {
                        attrs: {
                            x: 8 - w / 2,
                            y: 8 - h / 2,
                            width: 24,
                            height: 24,
                            img:
                                img ||
                                'https://g.alicdn.com/cm-design/arms-trace/1.0.155/styles/armsTrace/images/TAIR.png',
                        },
                        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                        name: 'image-shape',
                    });
                }

                // 如果不需要动态增加或删除元素，则不需要 add 这两个 marker
                group.addShape('marker', {
                    attrs: {
                        x: 40 - w / 2,
                        y: 52 - h / 2,
                        r: 6,
                        stroke: '#73d13d',
                        cursor: 'pointer',
                        symbol: EXPAND_ICON,
                    },
                    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                    name: 'add-item',
                });

                group.addShape('marker', {
                    attrs: {
                        x: 80 - w / 2,
                        y: 52 - h / 2,
                        r: 6,
                        stroke: '#ff4d4f',
                        cursor: 'pointer',
                        symbol: COLLAPSE_ICON,
                    },
                    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                    name: 'remove-item',
                });

                if (cfg.displayName) {
                    group.addShape('text', {
                        attrs: {
                            ...labelCfg.style,
                            text: cfg.displayName,
                            x: 50 - w / 2,
                            y: 25 - h / 2,
                        },
                    });
                }

                return keyShape;
            },
            update: undefined,
        },
        'rect',
    );

    G6.registerEdge('flow-line', {
        draw(cfg, group) {
            const startPoint = cfg.startPoint;
            const endPoint = cfg.endPoint;

            const { style } = cfg;
            const shape = group.addShape('path', {
                attrs: {
                    stroke: style!.stroke,
                    endArrow: style!.endArrow,
                    path: [
                        ['M', startPoint!.x, startPoint!.y],
                        ['L', startPoint!.x, (startPoint!.y + endPoint!.y) / 2],
                        ['L', endPoint!.x, (startPoint!.y + endPoint!.y) / 2],
                        ['L', endPoint!.x, endPoint!.y],
                    ],
                },
            });

            return shape;
        },
    });

    // 定义布局方式
    const defaultLayout = {
        type: 'compactBox',
        direction: 'TB',
        getId: function getId(d: any) {
            return d.uuid;
        },
        getHeight: function getHeight() {
            return 16;
        },
        getWidth: function getWidth() {
            return 16;
        },
        getVGap: function getVGap() {
            return 40;
        },
        getHGap: function getHGap() {
            return 70;
        },
    };

    // 缩略图操作框
    const minimap = new G6.Minimap({
        size: [300, 300],
    });

    // 默认节点样式
    const defaultNodeStyle = {
        fill: '#91d5ff',
        stroke: '#40a9ff',
        radius: 5,
    };

    // 默认连线样式
    const defaultEdgeStyle = {
        stroke: '#91d5ff',
        endArrow: {
            path: 'M 0,0 L 12, 6 L 9,0 L 12, -6 Z',
            fill: '#91d5ff',
            d: -20,
        },
    };

    const defaultStateStyles = {
        hover: {
            stroke: '#1890ff',
            lineWidth: 2,
        },
    };

    // 实例化g6
    const graph = new G6.TreeGraph({
        container: 'g6-tree',
        width,
        height,
        linkCenter: true,
        plugins: [minimap],
        modes: {
            default: ['drag-canvas', 'zoom-canvas'],
        },
        defaultNode: {
            type: 'icon-node',
            size: [120, 40],
            style: defaultNodeStyle,
            labelCfg: {
                style: {
                    fill: '#000',
                    fontSize: 12,
                },
            },
        },
        defaultEdge: {
            type: 'flow-line',
            style: defaultEdgeStyle,
        },
        nodeStateStyles: defaultStateStyles,
        edgeStateStyles: defaultStateStyles,
        layout: defaultLayout,
    });

    graph.data(data);
    graph.render();
    graph.fitView();
}

setTimeout(init, 1000);
</script>

<style scoped>
#g6-tree {
    width: 1800px;
    height: 600px;
}
</style>
