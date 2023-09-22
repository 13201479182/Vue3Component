import Mock from 'mockjs';

// export const data = Mock.mock({
//     'uuid|+1': '@uuid',
//     'displayName': '@cname',
//     'icon': '@image(200x100, @color)',
//     'originType|1-10': -1,
//     'children|3-10': [
//         {
//             // 属性 id 是一个自增数，起始值为 1，每次增 1
//             'uuid|+1': '@uuid',
//             'displayName': '@cname',
//             'icon': '@image(200x100, @color)',
//             'originType|1-3': -1,
//             'children|5-20': [
//                 {
//                     'uuid|+1': '@uuid',
//                     'displayName': '@cname',
//                     'icon': '@image(200x100, @color)',
//                     'originType|1-5': -1,
//                     'children|5-20': [
//                         {
//                             'uuid|+1': '@uuid',
//                             'displayName': '@cname',
//                             'icon': '@image(200x100, @color)',
//                             'originType|1-8': -1,
//                             'children|10-50': [
//                                 {
//                                     'uuid|+1': '@uuid',
//                                     'displayName': '@cname',
//                                     'icon': '@image(200x100, @color)',
//                                     'originType|1-7': -1,
//                                 },
//                             ],
//                         },
//                     ],
//                 },
//             ],
//         },
//     ],
// });

// Object.defineProperty(data, 'length', {
//     get() {
//         const map = new Map();
//         const queue = [data];
//         while (queue.length) {
//             const cur = queue.shift();
//             if (cur.children && cur.children.length) {
//                 cur.children.forEach(item => {
//                     queue.push(item);
//                 });
//             }
//             map.set(cur.uuid, cur);
//         }
//         return map.size;
//     },
// });

export const data = {
    uuid: '1',
    displayName: 'EQ001',
    originType: 1,
    children: [
        {
            uuid: '1-1',
            displayName: 'EQ002',
            originType: 1,
            children: [
                {
                    uuid: '1-1-1',
                    displayName: 'EQ003',
                    originType: 1,
                },
                {
                    uuid: '1-1-2',
                    displayName: 'EQ004',
                    originType: 1,
                },
                {
                    uuid: '1-1-3',
                    displayName: 'EQ005',
                    originType: 1,
                },
            ],
        },
        {
            uuid: '1-2',
            displayName: 'OtherPoint',
            originType: 99,
            children: [
                {
                    uuid: '1-2-1',
                    displayName: 'AI001',
                    originType: 2,
                },
                {
                    uuid: '1-2-2',
                    displayName: 'DI001',
                    originType: 5,
                },
                {
                    uuid: '1-2-3',
                    displayName: 'AO001',
                    originType: 4,
                },
                {
                    uuid: '1-2-4',
                    displayName: 'DO001',
                    originType: 7,
                },
                {
                    uuid: '1-2-5',
                    displayName: 'AIO001',
                    originType: 3,
                },
                {
                    uuid: '1-2-6',
                    displayName: 'DIO001',
                    originType: 6,
                },
                {
                    uuid: '1-2-7',
                    displayName: 'FieldPoint001',
                    originType: 8,
                },
            ],
        },
    ],
};
