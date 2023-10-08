/*
 * @author: 刘汇源lwx188666
 * @since: 2023-09-04
 * config.ts
 */
import { NodeOriginalType, PointConfig } from '../type';

const config = new Map<NodeOriginalType, PointConfig>();
// EQ的相关配置
config.set(NodeOriginalType.EQ, {
    width: 100,
    height: 70,
});
// 除了EQ外的相关配置
config.set(NodeOriginalType.Other, {
    width: 120,
    height: 100,
});

export default config;
