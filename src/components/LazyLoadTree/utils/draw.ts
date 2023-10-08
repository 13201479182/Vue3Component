import { TreeNodeInstance } from './tree';

// 第一次递归
function firstWalk(treeNode: TreeNodeInstance, distance: number) {
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
            (treeNode.children[0].x + treeNode.children[treeNode.children.length - 1].x) / 2;
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
    treeNode: TreeNodeInstance,
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

function thirdWalk(treeNode: TreeNodeInstance, n: number) {
    treeNode.x += n;
    treeNode.children.forEach(child => {
        thirdWalk(child, n);
    });
}

// 修正子孙节点定位
function apportion(
    treeNode: TreeNodeInstance,
    defaultAncestor: TreeNodeInstance,
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

            let shift = vInnerLeft.x + sInnerLeft - (vInnerRight.x + sInnerRight) + distance;
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

function moveSubtree(wl: TreeNodeInstance, wr: TreeNodeInstance, shift: number) {
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

function executeShifts(treeNode: TreeNodeInstance) {
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
    vInnerLeft: TreeNodeInstance,
    treeNode: TreeNodeInstance,
    default_ancestor: TreeNodeInstance,
) {
    if (vInnerLeft.ancestor && treeNode.parent?.children.includes(vInnerLeft.ancestor)) {
        return vInnerLeft.ancestor;
    } else {
        return default_ancestor;
    }
}

export default function generateCoordinate(
    treeNode: TreeNodeInstance,
    maxWidth: number,
    maxHeight: number,
) {
    let dt = firstWalk(treeNode, maxWidth + 50);
    let min = secondWalk(dt, maxHeight + 50);
    if (min < 0) {
        thirdWalk(dt, -min);
    }
}
