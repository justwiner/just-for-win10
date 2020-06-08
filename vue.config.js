module.exports = {
    lintOnSave: false,
    publicPath: process.env.NODE_ENV === 'development' ? 'http://localhost:8237' : '/win10_portal',
    chainWebpack: config => {
        config.entryPoints.clear()
        config.entry('win10_portal').add(process.env.VUE_APP_ENTRY).end()
        if (process.env.VUE_APP_CURRENTMODE === 'portal') {
            config.output.filename('win10_portal.js').library('win10_portal').libraryTarget('amd').end()
        } else {
            config.output.filename('win10_portal.js').library('win10_portal')
        }
        config.devServer.port(8237).headers({
            "Access-Control-Allow-Origin": "*",
        })
        if (process.env.VUE_APP_CURRENTMODE === 'portal') {
            config.externals(['vue', 'vue-router']);
        }
        config.module.rule('images').use('url-loader').loader('url-loader').tap(options => ({
            limit: 4096,
            fallback: {
            loader: 'file-loader',
            options: {
                name: 'img/[name].[ext]'
            }
            }
        }))
    }
}