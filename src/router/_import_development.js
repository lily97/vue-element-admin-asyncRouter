// 开发环境导入组件
// module.exports = file => require('@/views/' + file + '.vue').default // vue-loader at least v13.0.0+ 会报一大堆错！！！！
module.exports = file => {
    return (resolve) => require([`@/views/${file}`], resolve)
}
