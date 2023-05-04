import enquireJs from 'enquire.js'
import moment from 'moment'
import merge from 'deepmerge'
import domtoimage from 'dom-to-image'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import store from '@/store'

export { merge, moment, domtoimage }

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    },
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}

export function sayHello() {
  const hour = new Date().getHours()
  return hour > 22 && hour < 5
    ? {
        tw: '夜間好',
        cn: '夜间好',
        us: 'good night',
      }
    : hour < 11
    ? {
        tw: '早上好',
        cn: '早上好',
        us: 'good morning',
      }
    : hour < 14
    ? {
        tw: '中午好',
        cn: '中午好',
        us: 'good noon',
      }
    : hour < 18
    ? {
        tw: '下午好',
        cn: '下午好',
        us: 'good afternoon',
      }
    : {
        tw: '晚上好',
        cn: '晚上好',
        us: 'good evening',
      }
}

export function makeTextSprite(scene, tabs, props, parameters) {
  let m = scene.getObjectByName(scene.name + 'sprite')
  if (m) m.parent.remove(m)
  if (parameters === undefined) parameters = {}
  tabs.forEach((tab, k) => {
    let { width, height } = props[k]
    /* 创建画布 */
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    canvas.id = scene.name + 'sprite'
    canvas.width = width
    canvas.height = height
    let gap = 10

    let fontface = Object.prototype.hasOwnProperty.call(parameters, 'fontface')
      ? parameters['fontface']
      : 'sans-serif'
    /* 字体大小 */
    let fontsize = Object.prototype.hasOwnProperty.call(parameters, 'fontsize')
      ? parameters['fontsize'] * 16
      : 30

    let color = Object.prototype.hasOwnProperty.call(parameters, 'color')
      ? parameters['color']
      : 'rgba(0, 0, 0, 1.0)'
    /* 边框厚度 */
    let borderWith = Object.prototype.hasOwnProperty.call(
      parameters,
      'borderWith'
    )
      ? parameters['borderWith']
      : 2
    /* 边框颜色 */
    let borderColor = Object.prototype.hasOwnProperty.call(
      parameters,
      'borderColor'
    )
      ? parameters['borderColor']
      : {
          r: 0,
          g: 0,
          b: 0,
          a: 1.0,
        }
    /* 背景颜色 */
    let backgroundColor = Object.prototype.hasOwnProperty.call(
      parameters,
      'backgroundColor'
    )
      ? parameters['backgroundColor']
      : {
          r: 255,
          g: 255,
          b: 255,
          a: 1.0,
        }

    /* 字体加粗 */
    context.font = 'Bold ' + fontsize + 'px ' + fontface
    let unit = gap + fontsize
    /* 背景颜色 */
    context.fillStyle = backgroundColor
    /* 边框的颜色 */
    context.strokeStyle = borderColor
    context.lineWidth = borderWith
    context.fontWeight = 999
    /* 绘制圆角矩形 */
    roundRect(context, gap, gap, width - gap, height - gap, 40)
    tab.forEach((d, i) => {
      d = d.map((e) => {
        if (typeof e != 'string') {
          e =
            store.getters['tdpublic/commondata'][Number(e.key)].tabledata[
              Number(e.row) - 1
            ][e.colname]
        }
        return e
      })

      context.fillStyle = color
      context.fillText(d[0], gap * 2, gap + unit * (i + 1))
      if (d[2]) {
        context.fillStyle = d[2]
      }
      context.fillText(
        d[1],
        gap * 2 + measureText(d[0], context),
        gap + unit * (i + 1)
      )
    })
    // this.circle(context, 350, 180, width - gap, 20, 20, "red");
    // this.circle(context, 300, 180, width - gap, 20, 20, "green");

    let texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    let spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
    })

    let sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(...props[k].scale)
    sprite.name = scene.name + 'sprite'

    sprite.center = new THREE.Vector2(0, 0)
    sprite.position.set(...props[k].pos)
    scene.add(sprite)
  })
}

function measureText(text, ctx, font) {
  if (font) ctx.font = font
  return ctx.measureText(text).width
}
// function circle(ctx, x, y, w, h, r, color) {
//     ctx.beginPath();
//     ctx.arc(x, y, r, 0, Math.PI * 2, false);
//     ctx.fillStyle = color;
//     ctx.fill()
// }

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()

  ctx.fill()
  ctx.stroke()
  ctx.shadowColor = ''
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 0
}

export function createLine(e, scene) {
  cancelAnimationFrame(render)
  let curveArr = []
  let progress = 0
  for (let i = 0; i < e.lines.length; i += 3) {
    curveArr.push(new THREE.Vector3(e.lines[i], e.lines[i + 1], e.lines[i + 2]))
  }
  const curve = new THREE.CatmullRomCurve3(curveArr)
  const model = scene.getObjectByName(e.name)
  render()
  function render() {
    requestAnimationFrame(render)
    if (progress <= 1 - e.spead && scene != null) {
      const point = curve.getPointAt(progress) //获取样条曲线指定点坐标，作为相机的位置
      const pointBox = curve.getPointAt(progress + e.spead) //获取样条曲线指定点坐标
      model.position.set(point.x, point.y, point.z)
      model.lookAt(pointBox.x, pointBox.y, pointBox.z)
      progress += e.spead
    } else {
      progress = 0
    }
  }
}

//创建地板
export function videofloor(video) {
  var texture = new THREE.VideoTexture(video)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(5, 10)
  var material = new THREE.MeshLambertMaterial({
    map: texture,
  })
  var gemotery = new THREE.PlaneGeometry(100, 100)
  var mesh = new THREE.Mesh(gemotery, material)
  mesh.position.y = -0.001
  mesh.rotation.x = -0.5 * Math.PI
  return mesh
}

export function normalfloor() {
  let floorGeometry = new THREE.PlaneGeometry(1000, 1000)
  let floorMaterial = new THREE.MeshPhongMaterial({
    color: 'grey',
  })
  let floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.y = -0.001
  floor.rotation.x = -0.5 * Math.PI
  return floor
}

//RectAreaLight
export function RectAreaLight(x, y, z) {
  let light = new THREE.RectAreaLight(0xffffff, 5, 30, 60)
  light.position.set(x, y, z)
  light.rotation.x = -0.5 * Math.PI
  return light
}

//controls
export function Controls(camera, e) {
  let controls = new OrbitControls(camera, e)
  controls.enableDamping = true //阻尼感
  controls.dampingFactor = 0.25
  controls.enablePan = true
  // controls.autoRotate = true
  // controls.autoRotateSpeed = -3
  controls.minPolarAngle = 0
  controls.maxPolarAngle = 0.49 * Math.PI
  //  controls.minZoom = 0;
  controls.minDistance = 1
  //	this.controls.maxDistance = 100;
  return controls
}

//OutlinePass
export function outline(w, h, scene, camera) {
  const outlinePass = new OutlinePass(new THREE.Vector2(w, h), scene, camera)
  outlinePass.visibleEdgeColor.set('green') // 边缘可见部分发颜色 sColor[0].color
  outlinePass.hiddenEdgeColor.set('orange') // 边缘遮挡部分发光颜色 sColor[1].color
  outlinePass.edgeStrength = Number(10.0) //边框的亮度
  outlinePass.edgeGlow = Number(0.6) //光晕[0,1]
  outlinePass.edgeThickness = Number(1.0) //边缘浓度
  outlinePass.pulsePeriod = Number(1.8) //呼吸闪烁的速度 闪烁频率 ，默认0 ，值越大频率越低
  outlinePass.usePatternTexture = false //是否使用父级的材质
  outlinePass.downSampleRatio = 2 // 边框弯曲度
  outlinePass.clear = true
  return outlinePass
}
