import type { Ref } from 'vue';
import type { RenderData, TreeNode } from '../type';

import * as treeConfig from './config';

class Tree {
    public x = 0;
    public y = 0;
    public width = 0;
    public height = 0;
    public data: RenderData | null = null;
    public parent: TreeNode | null = null;
    public children: TreeNode[] = [];

    constructor(data: RenderData, parent: null | TreeNode) {
        this.parent = parent;
        this.data = data;
        this.width =
            data.originalType === treeConfig.nodeOriginalType.EQ
                ? treeConfig.nodeConfig.EQ.width
                : treeConfig.nodeConfig.PointList.width;
        this.height =
            data.originalType === treeConfig.nodeOriginalType.EQ
                ? treeConfig.nodeConfig.EQ.height
                : treeConfig.nodeConfig.PointList.height;
        if (Array.isArray(data.children) && data.children.length) {
            data.children.forEach(item => {
                this.children.push(new Tree(item, this));
            });
        }
    }
}

class GenerateTree {
    public dataRef: Ref<TreeNode[]> | null = null;

    init(data: RenderData) {
        this.dataRef = RenderTree.dataRef;
        this.normalizeRenderData(data);
        // 生成首屏布局树
        this.dataRef!.value = [new Tree(data, null)];
        console.log(this);
    }

    normalizeRenderData(data: RenderData) {
        if (
            data &&
            data.originalType === treeConfig.nodeOriginalType.EQ &&
            Array.isArray(data.children) &&
            data.children.length
        ) {
            data.children.forEach(item => {
                this.normalizeRenderData(item);
            });
        }
        // 配置EQ节点大小
        data.width = treeConfig.nodeConfig.EQ.width;
        data.height = treeConfig.nodeConfig.EQ.height;
        // 将modelList扁平化为node的children
        if (data.modelList) {
            if (!data.children) data.children = [];
            const pointList = {
                originalType: treeConfig.nodeOriginalType.PointList,
                uniqueUuid: Math.floor(Math.random() * 10 ** 15 + Date.now()) + '',
                children: data.modelList,
                width: treeConfig.nodeConfig.PointList.width,
                height: treeConfig.nodeConfig.PointList.height,
            };
            // 移除data对modelList的引用
            delete data.modelList;
            data.children.push(pointList);
        }
    }
}

class LoadResource {
    async loadFirstScreen() {
        const data = await treeConfig.syncLoadScreen();
        return data;
    }
}

class RenderTree {
    static dataRef: Ref<TreeNode[]> | null = null;
    public loader: InstanceType<typeof LoadResource>;
    public generator: InstanceType<typeof GenerateTree>;

    constructor() {
        if (!RenderTree.dataRef) {
            throw new Error('use class RenderTree must first init its static property dataRef!');
        } else {
            this.loader = new LoadResource();
            this.generator = new GenerateTree();
        }
        // 进行初始化
        this._init();
    }

    _init() {
        this.loader.loadFirstScreen().then(data => {
            data && this.generator.init(data);
        });
    }
}

export default RenderTree;
