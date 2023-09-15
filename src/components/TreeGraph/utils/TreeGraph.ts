/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-31
 * TreeGraph.ts
 */

import type { TreeData } from '../type';
import type { TreeInstance } from './tree';

import Tree from '@/components/TreeGraph/utils/tree';

class TreeGraph {
    public tree: TreeInstance;

    constructor(treeData: TreeData) {
        this.tree = new Tree(treeData);
    }
}

export default TreeGraph;
