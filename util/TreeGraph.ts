/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * Tree.ts
 */

import type { TreeData, NodeOriginalType } from './type';

type TreeNodeInstance = InstanceType<typeof TreeNode>;

class TreeNode {
    // 节点的度
    public degree = 0;
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
    // 节点的原始数据
    public data: TreeData | null = null;

    constructor(treeData: TreeData) {
        this.data = treeData;
    }
}

class Tree {
    // 树的度
    public degree = 0;
    // 树的高度
    public height = 0;
    // 树的宽度
    public width = 0;
    // 树的数据
    public treeData: TreeData | null = null;
    // 树的根节点
    public treeNode: InstanceType<typeof TreeNode> | null = null;
    // 基于uniqueUuid的map节点存储
    public treeNodeMap = new Map();

    constructor(treeData: TreeData) {
        this.treeData = treeData;
        this.createTree(treeData);
    }

    // 生成树
    createTree(treeData: TreeData) {
        if (!treeData) return;
        // 生成树实例
        const treeNode = this._depthFirstSearch(
            treeData,
            this._createTreeNode.bind(this),
        );
        // 挂载树实例至当前实例上
        if (!this.treeNode) {
            // 直接挂载
            this.treeNode = treeNode;
        } else {
            // 寻找并更新对应节点的子节点
        }
    }

    // 深度遍历
    _depthFirstSearch(
        treeData: TreeData,
        callback: (
            treeData: TreeData,
            parent: TreeNodeInstance | null,
            depth: number,
            depthMap: Map<number, TreeNode[]>,
        ) => TreeNodeInstance,
        parent: TreeNodeInstance | null = null,
        depth = 0,
        depthMap = new Map<number, TreeNode[]>(),
    ) {
        if (treeData) {
            // 初始化对应深度的记录
            const depthElements = depthMap.get(depth);
            !depthElements && depthMap.set(depth, []);
            // 更新parent为上一次创建的实例
            parent = callback(treeData, parent, depth, depthMap);
            // 递归处理子节点
            if (treeData.children && treeData.children.length) {
                treeData.children.forEach(data => {
                    this._depthFirstSearch(
                        data,
                        callback,
                        parent,
                        depth + 1,
                        depthMap,
                    );
                });
            }
        }
        // 返回创建的节点实例
        return parent;
    }

    // 生成树节点
    _createTreeNode(
        treeData: TreeData,
        parent: TreeNodeInstance | null,
        depth: number,
        depthMap: Map<number, TreeNode[]>,
    ) {
        const treeNode = new TreeNode(treeData);
        // 1. 更新节点的深度
        treeNode.depth = depth;
        // 2. 更新节点的度
        treeNode.degree = Array.isArray(treeData.children)
            ? treeData.children.length
            : 0;
        // 3. 更新树的度
        this.degree = Math.max(this.degree, treeNode.degree);
        // 4. 更新树的高度
        this.height = Math.max(this.height, depth + 1);
        // 5. 更新树的宽度
        const depthElements = depthMap.get(depth);
        if (Array.isArray(depthElements)) {
            depthElements.push(treeNode);
            this.width = Math.max(this.width, depthElements.length);
        }
        // 6. 父节点存在时需要更新的关系
        if (parent) {
            // 6-1. 更新父
            treeNode.parent = parent;
            // 6-2. 更新子
            parent.children.push(treeNode);
            // 更新左右兄弟
            const index = parent.children.findIndex(node => node === treeNode);
            const preChild = parent.children[index - 1];
            if (preChild) {
                // 6-3 更新当前节点的左兄弟
                treeNode.leftBrother = preChild;
                // 6-4 更新前一个节点的右兄弟
                preChild.rightBrother = treeNode;
            }
        }
        // 7. 生成节点的map结构,便于查找
        this.treeNodeMap.set(treeData.uniqueUuid, treeNode);
        return treeNode;
    }

    // 广度遍历
    breadthFirstSearch(callback: (item: TreeData) => TreeNodeInstance) {
        // 获取树的根节点
        const queue = [this.treeData];
        while (queue.length > 0) {
            const node = queue.shift() as TreeData;
            callback(node);
            if (node.children) {
                node.children.forEach(treeNode => {
                    queue.push(treeNode);
                });
            }
        }
    }
}

class TreeGraph {
    constructor(treeData: TreeData) {
        console.time('构建树时间:');
        const tree = new Tree(treeData);
        console.timeEnd('构建树时间:');
        console.log('tree:', tree);
    }
}

export default TreeGraph;
