/*
 * @author: 刘汇源lwx188666
 * @since: 2023-08-31
 * TreeGraph.ts
 */

import type { TreeData } from '@/util/type';

import Tree from '@/util/Tree';

class TreeGraph {
    public tree: InstanceType<typeof Tree>;

    constructor(treeData: TreeData) {
        this.tree = new Tree(treeData);
    }
}

export default TreeGraph;
