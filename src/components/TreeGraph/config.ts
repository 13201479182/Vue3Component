/*
 * @author: 刘汇源lwx188666
 * @since: 2023-09-04
 * config.ts
 */
import { NodeOriginalType, PointConfig } from './type';

const config = new Map<NodeOriginalType, PointConfig>();
// EQ的相关配置
config.set(NodeOriginalType.EQ, {
    width: 100,
    height: 100,
});
// AI测点相关的配置
config.set(NodeOriginalType.AI, {
    width: 120,
    height: 120,
});
// AIO测点相关的配置
config.set(NodeOriginalType.AIO, {
    width: 150,
    height: 150,
});
// DI测点相关的配置
config.set(NodeOriginalType.DI, {
    width: 80,
    height: 80,
});
// DIO测点相关的配置
config.set(NodeOriginalType.DIO, {
    width: 130,
    height: 130,
});

export default config;
