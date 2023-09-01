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
    // 节点对应父级的最左侧节点
    public leftMostBrother: TreeNode | null = null;
    // 节点的x坐标
    public x: number = 0;
    // 节点对应的线程节点
    public thread: null | TreeNode = null;
    // 节点的差值 左兄弟定位与子节点中间定位
    public mod: number = 0;

    constructor(treeData: TreeData) {
        this.data = treeData;
    }

    // 是否为叶子节点
    get isLeaf() {
        return this.children.length ? false : true;
    }

    // 获取节点的右轮廓
    get rightOutline(): TreeNode | null {
        return (
            this.thread ||
            (this.children.length > 0
                ? this.children[this.children.length - 1]
                : null)
        );
    }

    // 获取节点的左轮廓
    get leftOutline(): TreeNode | null {
        return (
            this.thread || (this.children.length > 0 ? this.children[0] : null)
        );
    }

    // 获取节点的层级结构
    get levelMapStructure(): Map<number, TreeNode> {
        const levelMap = new Map();
        this._depthFirstSearch(this, (treeNode, depth) => {
            const level = depth + 1;
            const levelElements = levelMap.get(level);
            if (levelElements) {
                levelElements.push(treeNode);
            } else {
                levelMap.set(level, [treeNode]);
            }
        });
        return levelMap;
    }

    // 深度遍历
    _depthFirstSearch(
        treeNode: TreeNode,
        callback: (treeNode: TreeNode, depth: number) => void,
        depth = this.depth,
    ) {
        if (treeNode) {
            callback(treeNode, depth);
            if (treeNode.children && treeNode.children.length) {
                treeNode.children.forEach(data => {
                    this._depthFirstSearch(data, callback, depth + 1);
                });
            }
        }
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

    constructor(treeData: TreeData) {
        // 生成树
        this._createTree(treeData);
        // 生成坐标
        this._generateTreeNodeCoordinate();
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
            depth: number,
            parent: TreeNodeInstance | null,
            levelTreeMaps: Map<number, TreeNode[]>,
        ) => TreeNodeInstance | void,
        depth = 0,
        parent: TreeNodeInstance | null = null,
        levelTreeMaps = new Map<number, TreeNode[]>(),
    ) {
        if (treeData) {
            // 1. 更新parent为上一次创建的实例
            const nodeInstance = callback(
                treeData,
                depth,
                parent,
                levelTreeMaps,
            );
            parent = nodeInstance ? nodeInstance : null;
            // 2. 递归处理子节点
            if (treeData.children && treeData.children.length) {
                treeData.children.forEach(data => {
                    this._depthFirstSearch(
                        data,
                        callback,
                        depth + 1,
                        parent,
                        levelTreeMaps,
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
        depth: number,
        parent: TreeNodeInstance | null,
        levelTreeMaps: Map<number, TreeNode[]>,
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
        const levelElements = levelTreeMaps.get(level);
        if (levelElements) {
            levelElements.push(treeNode);
            this.width = Math.max(this.width, levelElements.length);
        } else {
            levelTreeMaps.set(level, [treeNode]);
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
            // 6-5 更新当前节点对应父级的最左侧节点
            if (index > 0) {
                treeNode.leftMostSibling = parent.children[0];
            }
        }
        // 7. 生成节点的map结构,便于查找
        this.treeNodeMap.set(treeData.uniqueUuid, treeNode);
        return treeNode;
    }

    _firstwalk(treeNode: TreeNode, distance = 200) {
        if (treeNode.isLeaf) {
            // 叶子节点
            if (treeNode.leftBrother) {
                treeNode.x = treeNode.leftBrother.x + distance;
            } else {
                treeNode.x = 0;
            }
        } else {
            treeNode.children.forEach(node => {
                this._firstwalk(node, distance);
                // 修正子孙节点位置
                this._apportion(node, distance);
            });
        }
    }

    _apportion(treeNode: TreeNode, distance: number) {
        const leftBrother = treeNode.leftBrother;
        if (leftBrother) {
            /**
             * 四个节点指针,用于计算轮廓差值
             *
             * leftSubtreeLeft:     左子树左轮廓
             * leftSubtreeRight:    左子树右轮廓
             * rightSubtreeLeft:    右子树左轮廓
             * rightSubtreeRight:   右子树右轮廓
             */
            let leftSubtreeLeft: null | TreeNode = leftBrother;
            let leftSubtreeRight: null | TreeNode = leftBrother;
            let rightSubtreeLeft: null | TreeNode = treeNode;
            let rightSubtreeRight: null | TreeNode = treeNode;

            /**
             * 四个mod指针,用于记录四个轮廓的差值
             *
             * leftSubtreeLeftMod:      左子树左轮廓的差值
             * leftSubtreeRightMod:     左子树右轮廓的差值
             * rightSubtreeLeftMod:     右子树左轮廓的差值
             * rightSubtreeRightMod:    右子树右轮廓的差值
             */
            let leftSubtreeLeftMod = leftSubtreeLeft.mod;
            let leftSubtreeRightMod = leftSubtreeRight.mod;
            let rightSubtreeLeftMod = rightSubtreeLeft.mod;
            let rightSubtreeRightMod = rightSubtreeRight.mod;

            while (
                leftSubtreeRight.rightOutline &&
                rightSubtreeLeft.leftOutline
            ) {
                leftSubtreeRight = leftSubtreeRight.rightOutline;
                rightSubtreeLeft = rightSubtreeLeft.leftOutline;
                leftSubtreeLeft = leftSubtreeLeft?.leftOutline
                    ? leftSubtreeLeft.leftOutline
                    : null;
                rightSubtreeRight = rightSubtreeRight?.rightOutline
                    ? rightSubtreeRight.rightOutline
                    : null;
            }

            // 设置下一级节点的线程
            if (rightSubtreeRight?.isLeaf && leftSubtreeRight?.rightOutline) {
                rightSubtreeRight.thread = leftSubtreeRight.rightOutline;
            }
            if (leftSubtreeRight?.isLeaf && rightSubtreeRight?.leftOutline) {
                leftSubtreeRight.thread = rightSubtreeRight.leftOutline;
            }
        }
    }

    // 生成树节点的坐标xy
    _generateTreeNodeCoordinate() {
        const treeNode = this.treeNode;
        if (treeNode) {
            this._firstwalk(treeNode);
        }
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
                    treeNode.depth + 1,
                    treeNode,
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
