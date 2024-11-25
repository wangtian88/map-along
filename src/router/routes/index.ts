import type { RouteRecordRaw } from "vue-router";

const routeModuleList: RouteRecordRaw[] = [];

routeModuleList.push(
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/App.vue'),
    redirect: '/map/movealong',
    meta: {
      title: '轨迹回放',
    },
    children: [
      {
        path: 'movealong',
        name: 'Movealong',
        component: () => import('@/views/moveAlong.vue'),
        meta: {
          title: '轨迹回放/围栏',
        },
      },
      {
        path: 'infowindow',
        name: 'Infowindow',
        component: () => import('@/views/infoWindow.vue'),
        meta: {
          title: '信息体窗口',
        },
      },
      {
        path: 'dragroad',
        name: 'DragRoad',
        component: () => import('@/views/dragRoad.vue'),
        meta: {
          title: '路径规划',
        },
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/search.vue'),
        meta: {
          title: '地点搜索',
        },
      },
      {
        path: 'esticMarker',
        name: 'EsticMarker',
        component: () => import('@/views/esticMarker.vue'),
        meta: {
          title: '灵活点标记',
        },
      },
      {
        path: 'marker',
        name: 'Marker',
        component: () => import('@/views/marker.vue'),
        meta: {
          title: '动态引入点标记',
        },
      },
      {
        path: 'tileLayer',
        name: 'TileLayer',
        component: () => import('@/views/tileLayer.vue'),
        meta: {
          title: '区域掩模',
        },
      },
      {
        path: 'echartsLine',
        name: 'EchartsLine',
        component: () => import('@/views/echartsLine.vue'),
        meta: {
          title: '折线图',
        },
      },
    ],
  },
);

// 404 on a page
// export const PageNotFoundRoute: RouteRecordRaw = {
//   path: '/:path(.*)*',
//   name: 'PageNotFound',
//   component: () => import('/@/views/sys/exception.vue'),
//   meta: {
//     title: 'ErrorPage',
//     hideBreadcrumb: true,
//     hideMenu: true,
//   },
//   children: [
//     {
//       path: '/:path(.*)*',
//       name: 'PageNotFound',
//       component: () => import('/@/views/sys/exception.vue'),
//       meta: {
//         title: 'ErrorPage',
//       },
//     },
//   ],
// };

// Basic routing without permission
export const basicRoutes = [...routeModuleList];
