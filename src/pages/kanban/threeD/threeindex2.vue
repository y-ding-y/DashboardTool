<template>
    <ef-main :isMainPage="true">
        <canvas id="mainCanvas"></canvas>
    </ef-main>
</template>

<script>
    import EfMain from '@/components/page/main'

    import { merge, moment } from '@/utils/util'
    import * as THREE from 'three'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
    import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
    import { mapState } from 'vuex'

    const i18n = require('./i18n')

    export default {
        i18n: merge(require('@/i18n'), i18n),
        data() {
            return {
                moment,
                fileList: [],
                models: [],
                s_models: [],
                actionstatus: '',
                cavkey: 0,
                date: new Date(),

                scene: '',

                outlinePass: '',
                c: '',

                selectedObjects: [],

                ctx: '',
                progress: 0,
                curve: '',
            }
        },

        components: {
            EfMain,
        },
        created() {
            // this.handle_search();
            //  window.addEventListener('click', this.onMouseClick, false);
            // this.handle_json(aas, 0);
        },
        mounted() {
            this.initThree()
            var that = this
            document.getElementById('threes').onmousedown = function (e) {
                that.onMouseClick(e)
            }
            this.createLine()

            this.ss()
        },
        methods: {
            initThree() {
                let composer
                const group = new THREE.Group()
                const scene = new THREE.Scene()
                scene.fog = new THREE.Fog('#B9E6F2', 50, 500)
                scene.background = new THREE.Color('#B9E6F2')
                const canvas = document.getElementById('threes')
                const renderer = new THREE.WebGLRenderer({
                    canvas,
                    antialias: true,
                    alpha: true,
                })
                renderer.shadowMap.enabled = true
                this.renderer = renderer
                const camera = new THREE.PerspectiveCamera(
                    50,
                    canvas.clientWidth / canvas.clientHeight,
                    0.1,
                    1000
                )
                camera.position.z = 0
                camera.position.y = 10
                camera.position.x = -80
                this.camera = camera
                // var axis = new THREE.AxesHelper(3000); // 3表示轴的长度  显示坐标轴
                // scene.add(axis);

                var temp = []
                aas.buildings.map((b) => {
                    temp.push({
                        id: b.facades[0].gltfid,
                        pos: b.position,
                    })
                })
                let loader = new GLTFLoader()
                //loader.load(e, (gltf) => {
                loader.load('/model/smt.glb', (gltf) => {
                    let model = gltf.scene
                    model.traverse((o) => {
                        if (['node_FloorPlan_-10808'].includes(o.name)) {
                            group.add(o)
                        }

                        for (var i = 0; i < temp.length; i++) {
                            if (o.name == temp[i].id) {
                                o.position.set(
                                    o.parent.parent.position.x,
                                    o.parent.parent.position.y,
                                    o.parent.parent.position.z
                                )

                                group.add(o)
                            }
                        }
                    })
                    //group.add(model)
                    scene.add(group)
                })

                this.group = group
                const ambient = new THREE.AmbientLight('#fff', 1)
                scene.add(ambient) //将环境光添加到场景中

                const dirLight = new THREE.DirectionalLight('#fff', 1)
                //光源等位置
                dirLight.position.set(10, 10, 0)
                //可以产生阴影
                dirLight.castShadow = true
                dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
                scene.add(dirLight)

                this.scene = scene

                this.controls = new OrbitControls(this.camera, renderer.domElement)
                this.controls.enableDamping = true //阻尼感
                this.controls.enablePan = true
                this.controls.minPolarAngle = 0
                this.controls.maxPolarAngle = 0.49 * Math.PI
                // this.controls.minZoom = 0;
                this.controls.minDistance = 1
                //	this.controls.maxDistance = 100;

                composer = new EffectComposer(renderer)

                const renderPass = new RenderPass(scene, camera)
                composer.addPass(renderPass)

                const outlinePass = new OutlinePass(
                    new THREE.Vector2(window.clientWidth, window.clientHeight),
                    scene,
                    camera
                )

                outlinePass.visibleEdgeColor.set('green') // 边缘可见部分发颜色 sColor[0].color
                outlinePass.hiddenEdgeColor.set('white') // 边缘遮挡部分发光颜色 sColor[1].color
                outlinePass.edgeStrength = Number(10.0) //边框的亮度
                outlinePass.edgeGlow = Number(0.6) //光晕[0,1]
                outlinePass.edgeThickness = Number(1.0) //边缘浓度
                outlinePass.pulsePeriod = Number(1.8) //呼吸闪烁的速度 闪烁频率 ，默认0 ，值越大频率越低
                outlinePass.usePatternTexture = false //是否使用父级的材质
                outlinePass.downSampleRatio = 2 // 边框弯曲度
                outlinePass.clear = true

                this.outlinePass = outlinePass

                composer.addPass(outlinePass)

                var that = this
                function animate() {
                    // that.controls.target.set(that.x, 0, 0); // 不注释无法右键拖动
                    that.controls.update()
                    renderer.render(scene, that.camera)
                    composer.render(scene, that.camera)
                    requestAnimationFrame(animate)
                    if (resizeRendererToDisplaySize(renderer)) {
                        const canvas = renderer.domElement
                        that.camera.aspect = canvas.clientWidth / canvas.clientHeight
                        that.camera.updateProjectionMatrix()
                    }
                }
                animate()

                function resizeRendererToDisplaySize(renderer) {
                    const canvas = renderer.domElement
                    var height = window.innerHeight
                    var width = window.innerWidth
                    var canvasPixelWidth = canvas.width / window.devicePixelRatio
                    var canvasPixelHeight = canvas.height / window.devicePixelRatio

                    const needResize =
                        canvasPixelWidth !== width || canvasPixelHeight !== height
                    if (needResize) {
                        composer.setSize(width, height, false)
                        renderer.setSize(width, height, false)
                    }
                    return needResize
                }
            },
            addSelectedObject(object) {
                this.selectedObjects = []
                this.selectedObjects.push(object)
            },
        },
        computed: {
            ...mapState('setting', ['lang', 'pageMinHeight']),
        },
    }
</script>

<style lang="less" scoped>
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
</style>