// 需要监听一下移动端下的footerNav是否展示
import mitt from 'mitt'
export const emitter = mitt()
export const FOOTER_NAV_EVENT = 'FOOTER_NAV_EVENT'

// 登陆的状态
export const ACCOUNT = {
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
}

const resize = () => {
  const width = window.screen.width
  const size = (16 * width) / 375 + 'px'
  const root = document.documentElement
  const originSize = window
    .getComputedStyle(root)
    .getPropertyValue('--root-font-size')
  console.log('screen width', width, 'rem font size', size, 'var', originSize)
  if (width < 768 && size !== originSize) {
    console.log('result >>>>>>>>>>')
    root.style.setProperty('--root-font-size', size)
  }
}

export const resizeRem = () => {
  resize()
  window.addEventListener('resize', resize)
  // window.addEventListener('load', resize)
}
