/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * Tree.ts
 */

import type { TreeData } from './type';

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
    // 树的根节点
    public treeNode: InstanceType<typeof TreeNode> | null = null;
    // 基于uniqueUuid的map节点存储
    public treeNodeMap = new Map<string, TreeNode>();
    // 基于树层级存储树的节点
    public treeNodeLevelMap = new Map<number, TreeNode[]>();

    constructor(treeData: TreeData) {
        this._createTree(treeData);
    }

    // 生成树
    _createTree(treeData: TreeData) {
        if (treeData) {
            // 生成树实例且挂载至当前实例上
            this.treeNode = this._depthFirstSearch(
                treeData,
                this._createTreeNode.bind(this),
            );
        } else {
            console.error(
                `argument err: _createTree must have a tree data as its argument!`,
            );
        }
    }

    // 深度遍历
    _depthFirstSearch(
        treeData: TreeData,
        callback: (
            treeData: TreeData,
            parent: TreeNodeInstance | null,
            depth: number,
        ) => TreeNodeInstance,
        parent: TreeNodeInstance | null = null,
        depth = 0,
    ) {
        if (treeData) {
            // 1. 更新parent为上一次创建的实例
            parent = callback(treeData, parent, depth);
            // 2. 递归处理子节点
            if (treeData.children && treeData.children.length) {
                treeData.children.forEach(data => {
                    this._depthFirstSearch(data, callback, parent, depth + 1);
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
        const level = depth + 1;
        const levelMap = this.treeNodeLevelMap;
        const depthElements = levelMap.get(level);
        if (Array.isArray(depthElements)) {
            depthElements.push(treeNode);
            this.width = Math.max(this.width, depthElements.length);
        } else {
            levelMap.set(level, [treeNode]);
            this.width = Math.max(this.width, 1);
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
    breadthFirstSearch(
        treeData: TreeData | TreeNodeInstance,
        callback: (item: TreeData) => TreeNodeInstance,
    ) {
        // 获取树的根节点
        const queue = [treeData];
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

    // 向树追加子树
    appendSubTree(treeData: TreeData) {
        if (!treeData)
            return console.error(
                `argument err: appendSubTree must have a tree data as its argument!`,
            );
        // 生成树实例且挂载至当前实例上
        const treeNode = this.treeNodeMap.get(treeData.uniqueUuid);
        if (treeNode && Array.isArray(treeData.children)) {
            treeData.children.forEach(data => {
                this._depthFirstSearch(
                    data,
                    this._createTreeNode.bind(this),
                    treeNode,
                    treeNode.depth + 1,
                );
            });
        } else {
            return console.error(
                `argument err: current node can not exsit in tree!`,
            );
        }
    }
}

export default Tree;
