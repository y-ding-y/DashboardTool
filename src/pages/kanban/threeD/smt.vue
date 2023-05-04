<template>
    <div>
        <div id="ss" style="position: relative">
            <canvas :key="cavkey" :style="{ height: fullHeight + 'px', width: '100%' }" id="threes"></canvas>
        </div>
    </div>
</template>

<script>
    import * as THREE from 'three'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

    //修改OrbitControls.js取消鼠标右键
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
    import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
    import { mapState } from 'vuex'
    const fullHeight = window.screen.height

    export default {
        props: {
            line: {
                type: String,
                default: 'line1',
            },
        },
        data() {
            return {
                actionstatus: '',
                cavkey: 0,

                scene: '',

                outlinePass: '',
                c: '',

                selectedObjects: [],
                visible: true,

                lineSetting: { name: '', name_cn: '', name_us: '' },
                setting: {
                    leader: { name: '', avatar: '' },
                    manpower: { deptno: '', orgId: '' },
                    sfcs: { deptno: '', line: '' },
                    env: { thid: null },
                },
                manpower: { onduty: null, staff: null },
                env: {
                    hu: null,
                    hu_min: null,
                    hu_max: null,
                    tm: null,
                    tm_min: null,
                    tm_max: null,
                },
                titleKey: 0,
                dateFrom: null,
                dateTo: null,
                dateRangeStart: null,
                monthlyInput: null,
                monthlyOutput: null,
                dailyInput: null,
                dailyOutput: null,
                dailyIo: [],
                hourlyIo: [],
                modelIo: [],
                defects: [],
                defectQty: null,
                fpys: [],
                fpyValue: null,
                loading: true,
                mainChartHeight: (fullHeight - 244 - 1) / 2,
                miniChartHeight: 90,
                fullHeight,
                scale: [],
                pieStyle: {
                    stroke: '#fff',
                    lineWidth: 0.5,
                    fill: 'white',
                },
            }
        },
        created() {
            this.scene = ''
            this.loading = true
            setTimeout(() => (this.loading = false), 1000)
        },
        mounted() {
            this.initThree()
        },
        methods: {
            initThree() {
                let labelRenderer
                const group = new THREE.Group()
                const scene = new THREE.Scene()

                //scene.background = new THREE.Color('#0e0934');

                var cubeTextureLoader = new THREE.CubeTextureLoader()
                cubeTextureLoader.setPath('/model/')
                var cubeTexture = cubeTextureLoader.load([
                    'bg4.png',
                    'bg4.png',
                    'bg4.png',
                    'bg4.png',
                    'bg4.png',
                    'bg4.png',
                ])
                scene.environment = cubeTexture

                const canvas = document.getElementById('threes')
                const renderer = new THREE.WebGLRenderer({
                    canvas,
                    antialias: true,
                    alpha: true,
                })
                renderer.setClearAlpha(0.1)
                renderer.shadowMap.enabled = true
                this.renderer = renderer

                const pmremGenerator = new THREE.PMREMGenerator(this.renderer) // 使用hdr作为背景色
                pmremGenerator.compileEquirectangularShader()

                const camera = new THREE.PerspectiveCamera(
                    50,
                    canvas.clientWidth / canvas.clientHeight,
                    0.1,
                    10000
                )
                camera.position.z = 15
                camera.position.y = 19
                camera.position.x = -50
                this.camera = camera
                var axis = new THREE.AxesHelper(3000) // 3表示轴的长度  显示坐标轴
                scene.add(axis)
                const ss = document.getElementById('ss')
                labelRenderer = new CSS2DRenderer({ canvas })
                labelRenderer.setSize(ss.clientWidth, ss.clientHeight)
                labelRenderer.domElement.style.position = 'absolute'
                labelRenderer.domElement.style.top = '0'
                ss.appendChild(labelRenderer.domElement)

                let loader = new GLTFLoader()
                // let pathArr = [
                // 	-10, 0, 10,
                // 	-5, 1, 5,
                // 	0, 0, 0,
                // 	5, -1, 5,
                // 	10, 0, 10,
                // 	10, 1, 0
                // ]

                //loader.load(e, (gltf) => {
                loader.load('/model/smtonly1.glb', (gltf) => {
                    let model = gltf.scene
                    model.add(this.camera)
                    group.add(model)
                    scene.add(group)
                })
                this.group = group
                const ambient = new THREE.AmbientLight('#fff', 1)
                scene.add(ambient) //将环境光添加到场景中

                // const light = new THREE.DirectionalLight(0xaaaaaa)
                // //light.position.set(0, -15, 10)
                // light.position.set(10, 10, 10)
                // light.lookAt(new THREE.Vector3(0, 0, 0))

                // light.castShadow = true
                // scene.add(light)

                const light1 = new THREE.RectAreaLight('#b3ed7b', 500, 600, 600)
                light1.rotation.x = -0.5 * Math.PI
                light1.position.set(0, 0, 24)
                scene.add(light1)

                this.scene = scene

                this.controls = new OrbitControls(this.camera, renderer.domElement)
                this.controls.enableDamping = true //阻尼感
                this.controls.enablePan = true
                this.controls.minPolarAngle = 0
                this.controls.maxPolarAngle = 0.49 * Math.PI
                // this.controls.minZoom = 0;
                this.controls.minDistance = 1
                //	this.controls.maxDistance = 100;

                this.controls2 = new OrbitControls(this.camera, labelRenderer.domElement)
                this.controls2.enableDamping = true
                this.controls2.enablePan = true
                this.controls2.minPolarAngle = 0
                this.controls2.maxPolarAngle = 0.49 * Math.PI
                this.controls2.minDistance = 1

                this.controls.target.set(-8, 0, 0)
                this.controls2.target.set(-8, 0, 0)
                var that = this
                function animate() {
                    // that.controls.target.set(that.x, 0, 0); // 不注释无法右键拖动
                    that.controls.update()
                    that.controls2.update()
                    renderer.render(scene, that.camera)
                    labelRenderer.render(scene, that.camera)
                    requestAnimationFrame(animate)
                    if (resizeRendererToDisplaySize(renderer, labelRenderer)) {
                        const canvas = renderer.domElement
                        that.camera.aspect = canvas.clientWidth / canvas.clientHeight
                        that.camera.updateProjectionMatrix()
                    }
                }
                animate()

                function resizeRendererToDisplaySize(renderer, labelRenderer) {
                    const canvas = renderer.domElement
                    var height = window.innerHeight
                    var width = window.innerWidth
                    var canvasPixelWidth = canvas.width / window.devicePixelRatio
                    var canvasPixelHeight = canvas.height / window.devicePixelRatio
                    const ss = document.getElementById('ss')
                    const needResize =
                        canvasPixelWidth !== width || canvasPixelHeight !== height
                    if (needResize) {
                        renderer.setSize(width, height, false)
                        labelRenderer.setSize(ss.clientWidth, ss.clientHeight, false)
                    }
                    return needResize
                }
            },

            sortByKey(array, key) {
                return array.sort(function (a, b) {
                    var x = a[key] //如果要从大到小,把x,y互换就好
                    var y = b[key]
                    return x < y ? -1 : x > y ? 1 : 0
                })
            },

            lines(scene, pathArr) {
                const radius = 0.2
                let curveArr = []
                // 三个一组取出curve数据
                for (let i = 0; i < pathArr.length; i += 3) {
                    curveArr.push(
                        new THREE.Vector3(pathArr[i], pathArr[i + 1], pathArr[i + 2])
                    )
                }
                // console.log(this.sortByKey(curveArr, 'x'))
                var curve = new THREE.CatmullRomCurve3(this.sortByKey(curveArr, 'x'))

                /**
                 * TubeGeometry(path : Curve, tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean)
                 */
                var tubeGeometry = new THREE.TubeGeometry(curve, 100, radius, 50, false)
                var textureLoader = new THREE.TextureLoader()
                var texture = textureLoader.load('/model/lines.png')

                // 设置阵列模式 RepeatWrapping
                texture.wrapS = THREE.RepeatWrapping
                texture.wrapT = THREE.RepeatWrapping
                // 设置x方向的重复数(沿着管道路径方向)
                // 设置y方向的重复数(环绕管道方向)
                texture.repeat.x = 5
                texture.repeat.y = 4
                // 设置管道纹理偏移数,便于对中
                texture.offset.y = 0.9
                var tubeMaterial = new THREE.MeshPhongMaterial({
                    map: texture,
                    transparent: true,
                })
                var tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
                // 使用加减法可以设置不同的运动方向
                setInterval(() => {
                    texture.offset.x -= 0.03
                })
                //   return tube
                scene.add(tube)
            },
        },
        computed: {
            ...mapState('setting', ['lang']),
            dialogwidth() {
                return document.documentElement.clientWidth / 2
            },
            fontsize() {
                var h = (fullHeight - 300) / 3
                return h * 0.005
            },
        },
    }
</script>

<style lang="less" scoped>
    #threes {
        background-image: linear-gradient(rgb(102, 111, 183),
                rgba(186, 222, 247, 0.826));
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.8s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }

    .success,
    .success:hover,
    .success:visited {
        background-color: @success-color;
        color: white;
    }

    .divclas {
        overflow-y: scroll;
        height: 200px;
    }

    .label {
        width: 100px;
        height: 100px;
    }

    .maincolor {
        color: @primary-color;
    }

    .successcolor {
        color: @success-color;
    }

    .manpower {
        background-size: 120px auto;
        background-repeat: no-repeat;
        background-position: 80% 36%;
        color: @primary-3;
    }
</style>

<style>
    .leftd {
        height: 80%;
        position: absolute;
        left: 1%;
        bottom: 10%;
        width: 20%;
        background-color: rgba(153, 152, 160, 0.521);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .rightd {
        position: absolute;
        right: 0;
        top: 0;
        width: 20%;
        background-color: rgba(153, 152, 160, 0.521);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .centerd {
        position: absolute;
        width: 80%;
        background-color: rgba(153, 152, 160, 0.521);
        display: flex;
    }

    .test {
        color: #57b3ed7b;
    }

    .seamless-warp {
        overflow: hidden;
    }
</style>