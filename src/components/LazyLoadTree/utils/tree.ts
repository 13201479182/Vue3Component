/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * Tree.ts
 */

import type { TreeData, PointConfig } from '@/components/TreeGraph/type';

import generateCoordinate from './draw';
import TreeNodeConfig from './TreeNodeConfig';

class TreeNode implements PointConfig {
    [k: string]: any;

    // 节点的原始数据
    public data: TreeData | null = null;
    // 节点的深度
    public depth = 0;
    // 节点的父
    public parent: TreeNodeInstance | null = null;
    // 节点的子
    public children: TreeNodeInstance[] = [];
    // 节点的左兄弟
    public leftBrother: TreeNodeInstance | null = null;
    // 节点的右兄弟
    public rightBrother: TreeNodeInstance | null = null;
    // 节点在其父级对应子集中的索引
    public index: number = 0;
    // 节点对应父级的最左侧节点
    public leftMostBrother: TreeNodeInstance | null = null;
    // xy坐标
    public x: number = 0;
    public y: number = 0;

    // 计算坐标使用优化性能
    public ancestor: TreeNodeInstance | null = null;
    public change: number = 0;
    public shift: number = 0;
    public thread: null | TreeNodeInstance = null;
    public mod: number = 0;

    // 接口对应属性的实现
    public width: number = 0;
    public height: number = 0;

    constructor(treeData: TreeData) {
        this.data = treeData;
    }

    // 是否为叶子节点
    get isLeaf() {
        return this.children.length ? false : true;
    }

    // 获取节点的右轮廓
    get right(): TreeNode | null {
        return (
            this.thread ||
            (this.children.length > 0 ? this.children[this.children.length - 1] : null)
        );
    }

    // 获取节点的左轮廓
    get left(): TreeNode | null {
        return this.thread || (this.children.length > 0 ? this.children[0] : null);
    }

    // 广度遍历
    breadthFirstSearch(callback: (item: TreeNodeInstance) => void) {
        // 获取树的根节点
        const queue: TreeNodeInstance[] = [this];
        while (queue.length > 0) {
            const shiftNode = queue.shift();
            if (shiftNode) {
                callback(shiftNode);
                if (shiftNode.children && shiftNode.children.length) {
                    shiftNode.children.forEach(treeNode => {
                        queue.push(treeNode);
                    });
                }
            }
        }
    }

    // 生成树节点的坐标xy
    _generateTreeNodeCoordinate() {
        const treeNode = this;
        const wArr: number[] = [80];
        const hArr: number[] = [80];
        // 计算配置的最大宽度和最大高度
        for (let config of TreeNodeConfig.values()) {
            wArr.push(config.width);
            hArr.push(config.height);
        }
        // 开始生成
        if (treeNode) {
            generateCoordinate(treeNode, Math.max.apply(null, wArr), Math.max.apply(null, hArr));
        }
    }
}

class Tree {
    // 树的根节点
    public treeNode: TreeNodeInstance | null = null;
    public levelMap = new Map<number, TreeNode[]>();

    constructor(treeData: TreeData) {
        if (treeData) {
            this._initTree(treeData);
        } else {
            console.error(`argument err: Tree constructor need requried argument treeData!`);
        }
    }

    // 获取树的宽度
    get width(): number {
        const widths: number[] = [];
        this.breadthFirstSearch(treeNode => {
            const depth = treeNode.depth;
            if (!widths[depth]) {
                widths[depth] = 1;
            } else {
                widths[depth] += 1;
            }
        });
        return Math.max.apply(null, widths);
    }

    // 获取树的高度
    get height(): number {
        const heights: number[] = [];
        this.breadthFirstSearch(treeNode => {
            heights.push(treeNode.depth + 1);
        });
        return Math.max.apply(null, heights);
    }

    // 获取基于uniqueUuid的map存储结构,便于crud
    get treeNodeMap(): Map<string, TreeNodeInstance> {
        const levelMap = new Map<string, TreeNodeInstance>();
        this.breadthFirstSearch(treeNode => {
            if (treeNode.data) {
                levelMap.set(treeNode.data.uniqueUuid, treeNode);
            }
        });
        return levelMap;
    }

    // 将treeData标准化为树
    _initTree(treeData: TreeData) {
        this.treeNode = this.depthFirstSearch(
            treeData,
            this._createTreeNode.bind(this),
        ) as TreeNode;
        // 生成x,y坐标
        this.treeNode?._generateTreeNodeCoordinate();
    }

    // 深度遍历当前树
    depthFirstSearch(
        treeData: TreeData | null,
        callback: (
            treeItem: TreeData,
            depth: number,
            parent: TreeNodeInstance | TreeData | null,
            index: number,
        ) => TreeNodeInstance | void,
        depth = 0,
        parent: TreeNodeInstance | TreeData | null = null,
        index = 0,
    ) {
        if (treeData) {
            // 1. 更新parent为上一次创建的实例
            const nodeInstance = callback(treeData, depth, parent, index);
            parent = nodeInstance ? nodeInstance : treeData;
            // 2. 递归处理子节点
            if (treeData.children && treeData.children.length) {
                treeData.children.forEach((data, index) => {
                    this.depthFirstSearch(data, callback, depth + 1, parent, index);
                });
            }
        }
        // 返回创建的节点实例
        return parent;
    }

    // 广度遍历当前树
    breadthFirstSearch(callback: (item: TreeNodeInstance) => void) {
        if (!this.treeNode) return;
        // 获取树的根节点
        const queue = [this.treeNode];
        while (queue.length > 0) {
            const node = queue.shift() as TreeNode;
            callback(node);
            if (node.children) {
                node.children.forEach(treeNode => {
                    queue.push(treeNode);
                });
            }
        }
    }

    // 生成树节点
    _createTreeNode(
        treeData: TreeData,
        depth: number,
        parent: TreeNodeInstance | TreeData | null,
        index: number,
    ) {
        parent = parent as TreeNodeInstance;
        // 1. 生成treeNode实例
        const treeNode = new TreeNode(treeData);
        // 2. 更新treeNode的索引
        treeNode.index = index;
        // 3. 更新treeNode的深度
        treeNode.depth = depth;
        // 4. 更新treeNode父子节点的引用关系
        if (parent) {
            // 4-1. 更新当前节点的parent指向
            treeNode.parent = parent;
            // 4-2. 更新当前节点parent的children
            parent.children.push(treeNode);
            // 4-3. 更新左右兄弟
            const preChild = parent.children[index - 1];
            if (preChild) {
                treeNode.leftBrother = preChild;
                preChild.rightBrother = treeNode;
            }
            // 4-4. 更新当前节点对应父级的最左侧子节点
            index > 0 ? (treeNode.leftMostBrother = parent.children[0]) : null;
        }
        // 5. 配置当前节点
        this._configTreeNode(treeNode);
        // 6. 生成level结构
        const levelMap = this.levelMap.get(depth);
        if (levelMap) {
            levelMap.push(treeNode);
        } else {
            this.levelMap.set(depth, [treeNode]);
        }
        return treeNode;
    }

    // 依据配置更新节点的信息
    _configTreeNode(treeNode: TreeNodeInstance) {
        const originType = treeNode.data?.originalType;
        if (originType) {
            const config = TreeNodeConfig.get(originType);
            config &&
                Object.keys(config).forEach(k => {
                    if (Object.prototype.hasOwnProperty.call(treeNode, k)) {
                        treeNode[k] = config[k];
                    }
                });
        }
    }
}

export type TreeNodeInstance = InstanceType<typeof TreeNode>;
export type TreeInstance = InstanceType<typeof Tree>;
export default Tree;
