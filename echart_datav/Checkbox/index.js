const Event = require('bcore/event')
const $ = require('jquery')
const _ = require('lodash')
const {buttonBg1, buttonBg2, icon1, icon2, icon3} = require('./base64')

const style = {
    mainItem:"width:218px;height:78px;background-size:100% 100%;",
    vertiCenter:'display:flex;align-items:center;',
    font:'font-size:30px;color:rgba(255, 255, 255, 1);font-family:思源黑体 CN;'
}
const buttons = [
    {
        label:'警力',
        iconPath:icon1,
        iconHW:[30, 32],
        isActive:false
    },
    {
        label:'路况',
        iconPath:icon2,
        iconHW:[30, 32],
        isActive:false
    },
    {
        label:'摄像机',
        iconPath:icon3,
        iconHW:[70, 65],
        isActive:false
    }
]
module.exports = Event.extend( function Base(container, config) {
    this.container = $(container)
    this.config = {}
    this.data = {}
    this.init(config)
}, {
    init(config){
        this.config = config
        const socket = require('./socketIoClient.js')(config.socket)
        socket.on('screen-server', msg => {
            console.log(msg)
        })
    },
    render (data, config) {
        if(config) this.config = config
        if(data) this.data = data
        const {space} = this.config
        this.container.html(
            `
                <main>
                    ${(()=>{
                        const htmlArr = buttons.map(({label, iconPath, iconHW, isActive})=>{
                            return `
                                <div style="${style.mainItem};margin-bottom:${space}px;${isActive?`background-image:url(${buttonBg2})`:`background-image:url(${buttonBg1})`}">
                                    <div style="${style.vertiCenter}height:100%;justify-content:space-between;
                                    padding:0 34px 0 24px;">
                                        <div style="width:70px;height:70px;${style.vertiCenter};justify-content:center">
                                            <img 
                                                src="${iconPath}" 
                                                alt="" 
                                                width="${iconHW[0]}"
                                                height="${iconHW[1]}"
                                            />
                                        </div>
                                        <div style="${style.font};width:90px">${label}</div>
                                    </div>
                                </div>
                            `
                        })
                        return htmlArr.join('')
                    })()}
                </main>
            `
        )
    },
    resize (width, height) {
    },
    destroy () {
        console.log('请实现 destroy 方法')
    }
})