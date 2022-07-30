// 导出属于员工的路由规则
import Layout from '@/layout'
// 每个子模块其实都是外层是layout 组件位于layout的二级路由里面
export default {
    path: '/approvals', // 路径
    name: 'approvals', // 给路由规则加一个name
    component: Layout, // 组件
    // 配置二级路由表
    children: [{
        path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
        component: () => import('@/views/approvals'),
        // 路由元信息 其实就是存储数据的对象 可以在这里放置一些信息
        meta: {
            title: '审批管理', // meta属性的里面的属性 随意定义 此时用title因为左侧导航会读取路由里面的meta里面的title作为显示菜单名称
            icon: 'tree-table'
        }
    }]
}