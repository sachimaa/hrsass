import { option } from "runjs"

// 负责管理所有的自定义指令
export const imagerror = {
    // 指令对象 会在当前的dom元素插入到节点之后执行
    inserted(dom, options) {
        // options是指令中的变量的解释 其中一个属性叫做value
        // dom表示抢钱指令作用的dom对象
        // dom认为此时就是图片
        // 当前图片有地址 但是地址没有加载成功时会报错 会触发图片的一个事件=>onerror
        dom.onerror = function(){
            // 当图片出行异常的时候 会将指令配置的默认图片设置为该图片的内容
            // dom可以注册error事件
            dom.src = options.value // 这里不能写死
        }
    }
}