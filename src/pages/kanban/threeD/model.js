import enquireJs from 'enquire.js'
import moment from 'moment'
import merge from 'deepmerge'
import domtoimage from 'dom-to-image'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'


export function makeTextSprite(canvas, scene, props) {
    let m = scene.getObjectByName(scene.name + 'sprite')
    if (m) m.parent.remove(m)

    let texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    let spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    })

    let sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(...props[0].scale)
    sprite.name = scene.name + 'sprite'

    sprite.center = new THREE.Vector2(0, 0)
    sprite.position.set(...props[0].pos)
    scene.add(sprite)
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
