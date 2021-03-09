import vue from 'vue'
import hoverDialog from './hoverDialog'

const HoverDialog = vue.extend(hoverDialog)

let hoverDom = null
let flag = false
function toggleHoverDialog (params) {
  console.log(params)
  if (!hoverDom) {
    hoverDom = new HoverDialog({
      el: document.createElement('div'),
      data () {
        return {
          dataObj: params.data.dataObj,
          handlers: params.data.handlers,
          styleObject: {
            left: (params.data.x - 30) + 'px',
            top: (params.data.y + 10) + 'px'
          },
          show: params.show
        }
      }
    })
  }
  hoverDom.$el.addEventListener('mouseleave', () => {
    console.log('mouseleave', flag)
    if (flag) {
      hoverDom.show = false
      hoverDom = null
      flag = false
    }
  })

  document.addEventListener('click', (e) => {
    console.log(1)
    if (hoverDom) {
      let f = hoverDom.$el.contains(e.target)
      if (f) return
      hoverDom.show = false
      hoverDom = null
      flag = false
    }
  })

  hoverDom.$el.addEventListener('mouseenter', () => {
    setTimeout(() => {
      flag = true
    }, 500)
  })
  if (params.show) {
    document.body.appendChild(hoverDom.$el)
  }
}

function registryHover () {
  vue.prototype.$hoverDialog = toggleHoverDialog
}

export default registryHover
