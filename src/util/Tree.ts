/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-28
 * Tree.ts
 */

import type { TreeData } from './type';
import type { PointConfig } from '@/components/TreeGraph/type';

import pointConfigMap from '@/components/TreeGraph/config';

type TreeNodeInstance = InstanceType<typeof TreeNode>;

// 第一次递归
function firstWalk(treeNode: TreeNode, distance: number) {
    if (treeNode.isLeaf) {
        if (treeNode.leftBrother) {
            treeNode.x = treeNode.leftBrother.x + distance;
        } else {
            treeNode.x = 0;
        }
    } else {
        // defaultAncestor默认为第一个子节点
        let defaultAncestor = treeNode.children[0];
        treeNode.children.forEach(child => {
            firstWalk(child, distance);
            defaultAncestor = apportion(child, defaultAncestor, distance);
        });
        executeShifts(treeNode);
        // 子节点的中点
        let midpoint =
            (treeNode.children[0].x +
                treeNode.children[treeNode.children.length - 1].x) /
            2;
        let leftBrother = treeNode.leftBrother;
        if (leftBrother) {
            // 如果是非叶子节点则其x坐标等于其左兄弟的x坐标加上间距distance
            treeNode.x = leftBrother.x + distance;
            // 同时记录下偏移量（x坐标与子节点的中点之差）
            treeNode.mod = treeNode.x - midpoint;
        } else {
            // 没有左兄弟节点，x坐标直接是子节点的中点
            treeNode.x = midpoint;
        }
    }
    return treeNode;
}

// 第二次遍历
function secondWalk(
    treeNode: TreeNode,
    h: number,
    m = 0,
    depth = 0,
    min: number | null = null,
) {
    // 初始x值加上所有祖宗节点的mod修正值
    treeNode.x += m;
    treeNode.y = depth * h;
    if (min === null || treeNode.x < min) {
        min = treeNode.x;
    }
    treeNode.children.forEach(child => {
        min = secondWalk(child, h, m + treeNode.mod, depth + 1, min);
    });
    return min;
}

function thirdWalk(treeNode: TreeNode, n: number) {
    treeNode.x += n;
    treeNode.children.forEach(child => {
        thirdWalk(child, n);
    });
}

// 修正子孙节点定位
function apportion(
    treeNode: TreeNode,
    defaultAncestor: TreeNode,
    distance: number,
) {
    let leftBrother = treeNode.leftBrother;
    if (leftBrother) {
        // 四个节点指针
        let vInnerRight = treeNode; // 右子树左轮廓
        let vOuterRight = treeNode; // 右子树右轮廓
        let vInnerLeft = leftBrother; // 当前节点的左兄弟节点，左子树右轮廓
        let vOuterLeft = treeNode.leftMostBrother!; // 当前节点的最左侧的兄弟节点，左子树左轮廓

        // 四个累加mod值的变量
        let sInnerRight = treeNode.mod;
        let sOuterRight = treeNode.mod;
        let sInnerLeft = vInnerLeft.mod;
        let sOuterLeft = vOuterLeft.mod;

        while (vInnerLeft.right && vInnerRight.left) {
            vInnerLeft = vInnerLeft.right;
            vInnerRight = vInnerRight.left;
            vOuterLeft = vOuterLeft.left!;
            vOuterRight = vOuterRight?.right!;
            vOuterRight.ancestor = treeNode;

            let shift =
                vInnerLeft.x +
                sInnerLeft -
                (vInnerRight.x + sInnerRight) +
                distance;
            if (shift > 0) {
                let _ancestor = ancestor(vInnerLeft, treeNode, defaultAncestor);
                moveSubtree(_ancestor, treeNode, shift);
                sInnerRight = sInnerRight + shift;
                sOuterRight = sOuterRight + shift;
            }

            sInnerLeft += vInnerLeft.mod;
            sInnerRight += vInnerRight.mod;
            sOuterLeft += vOuterLeft.mod;
            sOuterRight += vOuterRight.mod;
        }

        // 将线程从浅的树的外侧设置到深的树的内侧
        if (vInnerLeft.right && !vOuterRight.right) {
            vOuterRight.thread = vInnerLeft.right;
            vOuterRight.mod += sInnerLeft - sOuterRight;
        } else {
            if (vInnerRight.left && !vOuterLeft.left) {
                vOuterLeft.thread = vInnerRight.left;
                vOuterLeft.mod += sInnerRight - sOuterLeft;
            }
            defaultAncestor = treeNode;
        }
    }
    return defaultAncestor;
}

function moveSubtree(wl: TreeNode, wr: TreeNode, shift: number) {
    // 两棵冲突的树的间隔被之间的树分成多少分
    let subtrees = wr.index - wl.index;
    wr.change -= shift / subtrees;
    wr.shift += shift;
    wl.change += shift / subtrees;
    // 自身移动
    wr.x += shift;
    // 后代节点移动
    wr.mod += shift;
}

function executeShifts(treeNode: TreeNode) {
    let shift = 0;
    let change = 0;
    for (let i = treeNode.children.length - 1; i >= 0; i--) {
        let w = treeNode.children[i];
        w.x += shift;
        w.mod += shift;
        change += w.change;
        shift += w.shift + change;
    }
}

// 如果vil节点的祖先节点在v节点的兄弟节点中，那么返回vil的祖先节点，否则返回default_ancestor
function ancestor(
    vInnerLeft: TreeNode,
    treeNode: TreeNode,
    default_ancestor: TreeNode,
) {
    if (
        vInnerLeft.ancestor &&
        treeNode.parent?.children.includes(vInnerLeft.ancestor)
    ) {
        return vInnerLeft.ancestor;
    } else {
        return default_ancestor;
    }
}

class TreeNode implements PointConfig {
    [k: string]: any;
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
    // 节点的y坐标
    public y: number = 0;
    // 祖先节点
    public ancestor: TreeNode | null = null;
    public change: number = 0;
    public shift: number = 0;
    // 节点对应的线程节点
    public thread: null | TreeNode = null;
    // 节点的差值 左兄弟定位与子节点中间定位
    public mod: number = 0;
    // 节点在其父级对应子集中的索引
    public index: number = 0;

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
            (this.children.length > 0
                ? this.children[this.children.length - 1]
                : null)
        );
    }

    // 获取节点的左轮廓
    get left(): TreeNode | null {
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
            index: number,
            parent: TreeNodeInstance | null,
            levelTreeMaps: Map<number, TreeNode[]>,
        ) => TreeNodeInstance | void,
        depth = 0,
        index = 0,
        parent: TreeNodeInstance | null = null,
        levelTreeMaps = new Map<number, TreeNode[]>(),
    ) {
        if (treeData) {
            // 1. 更新parent为上一次创建的实例
            const nodeInstance = callback(
                treeData,
                depth,
                index,
                parent,
                levelTreeMaps,
            );
            parent = nodeInstance ? nodeInstance : null;
            // 2. 递归处理子节点
            if (treeData.children && treeData.children.length) {
                treeData.children.forEach((data, index) => {
                    this._depthFirstSearch(
                        data,
                        callback,
                        depth + 1,
                        index,
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
        index: number,
        parent: TreeNodeInstance | null,
        levelTreeMaps: Map<number, TreeNode[]>,
    ) {
        const treeNode = new TreeNode(treeData);
        // 0. 更细索引
        treeNode.index = index;
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
                treeNode.leftMostBrother = parent.children[0];
            }
        }
        // 7. 生成节点的map结构,便于查找
        this.treeNodeMap.set(treeData.uniqueUuid, treeNode);
        // 8. 接口对应的实现
        const originType = treeNode.data?.originalType;
        if (originType) {
            const config = pointConfigMap.get(originType);
            config &&
                Object.keys(config).forEach(k => {
                    treeNode[k] = config[k];
                });
        }
        return treeNode;
    }

    // 生成树节点的坐标xy
    _generateTreeNodeCoordinate() {
        const treeNode = this.treeNode;
        const wArr = [];
        const hArr = [];
        // 计算配置的最大宽度和最大高度
        for (let config of pointConfigMap.values()) {
            if (typeof config.width === 'number') {
                wArr.push(config.width);
            }
            if (typeof config.height === 'number') {
                hArr.push(config.height);
            }
        }
        const maxWidth = Math.max(...wArr);
        const maxHeight = Math.max(...hArr);
        // 开始生成
        if (treeNode) {
            let dt = firstWalk(treeNode, maxWidth + 50);
            let min = secondWalk(dt, maxHeight + 50);
            if (min < 0) {
                thirdWalk(dt, -min);
            }
        }
    }

    // 广度遍历
    breadthFirstSearch(callback: (item: TreeNode) => void) {
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

    // 向树追加子树
    appendSubTree(treeData: TreeData) {
        return new Promise<TreeNode>((resolve, reject) => {
            if (!treeData)
                return reject(
                    `argument err: appendSubTree must have a tree data as its argument!`,
                );
            // 生成树实例且挂载至当前实例上
            const treeNode = this.treeNodeMap.get(treeData.uniqueUuid);
            if (treeNode && Array.isArray(treeData.children)) {
                // 依次实例化当前元素的子元素
                treeData.children.forEach((data, index) => {
                    this._depthFirstSearch(
                        data,
                        this._createTreeNode.bind(this),
                        treeNode.depth + 1,
                        index,
                        treeNode,
                    );
                });
                // 生成坐标重置实例状态
                this.breadthFirstSearch(item => {
                    // 移除上一次缓存的线程
                    item.thread = null;
                });
                // 重新计算生成xy坐标
                this._generateTreeNodeCoordinate();
                resolve(this.treeNode!);
            } else {
                reject(`argument err: current node can not exsit in tree!`);
            }
        });
    }
}

export default Tree;
