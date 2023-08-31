/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-31
 * TreeGraph.ts
 */

import type { TreeData } from '@/util/type';
import type { NodeOriginalType } from './type';

import Tree from '@/util/Tree';

class TreeGraph {
    public tree: InstanceType<typeof Tree> | null = null;
    constructor(treeData: TreeData) {
        this.tree = new Tree(treeData);
    }
}

export default TreeGraph;
