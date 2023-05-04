<template>
    <div>

        <div ref="screen"
            style="position: absolute; background-color:rgba(237, 255, 172, 0.421); transition: transform 0.5s">
            asd
            {{test}}
           
        </div>



        <div style="position: relative;background-color: #6fffa9;z-index: 999;" id="ss">

            <canvas id="threes" :style="{ height: '610px', width:'1200px' }"></canvas>
        </div>
    </div>

</template>


<script>
    import * as THREE from 'three'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
    import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
    import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
    import { toRaw } from 'vue'
    import { mapState } from 'vuex'
    import * as Mfun from './model.js'
    import html2canvas from 'html2canvas'
    import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'


    const fullHeight = window.screen.height
    const fullWidth = window.screen.width
    export default {
        props: {
        },
        data() {
            return {
                test: "",
                cavkey: 0,
                fullHeight,
                fullWidth,
                scene: '',
                click_style: {},
                outlinePass: '',
                c: '',
                x: 0,
                oldt: { x: -8, y: 0, z: 0 },
                oldp: { x: 0, y: 0, z: 0 },

                selectedObjects: [],
                visible: true,

                stylemodel: [],

                mainmaterial: {
                    alphaMap: null,
                    envMap: null,
                    envMapIntensity: 0.8,
                    roughness: 0.1, //粗糙度
                    metalness: 0.8, //金屬度
                    transparent: true,
                    opacity: 1,
                },
                modelselected: [],
                progress: 0,
                result: null,
                srcs: process.env.VUE_APP_API_WEB_URL,
                refreshpublic: null,
                intervalmodel: [],
                rotateinterval: null,

                tableData: [{
                    date: '2016-05-03',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                },
                {
                    date: '2016-05-02',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                },
                {
                    date: '2016-05-04',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                },
                {
                    date: '2016-05-01',
                    name: 'Tom',
                    address: 'No. 189, Grove St, Los Angeles',
                },]
            }
        },
        created() {
            this.scene = ''

            window.addEventListener('click', this.onMouseClick, false)

        },
        mounted() {
            this.initThree()
        },
        beforeUnmount() {
            window.removeEventListener('click', this.onMouseClick)
            this.clearScene()
            clearInterval(this.refreshpublic)
            clearInterval(this.rotateinterval)
            this.refreshpublic = null
            this.rotateinterval = null
            this.intervalmodel.map((e) => {
                clearInterval(e.intervalflag)
                e.intervalflag = null
            })
        },
        methods: {
            getPopupContainer() {
                console.log(this.$el)
                return this.$ref.screen
            },
            handle_test() {
                html2canvas(this.$refs.screen, {
                    useCORS: true,
                }).then((canvas) => {
                    console.log(canvas)
                    if (navigator.msSaveBlob) {
                        // IE10+
                        let blob = canvas.msToBlob()
                        return navigator.msSaveBlob(blob, name)
                    } else {
                        let imageurl = canvas.toDataURL('image/png')
                        //这里需要自己选择命名规则
                        let imagename = ''
                        this.fileDownload(imageurl, imagename)
                    }
                })
            },
            fileDownload(downloadUrl, downloadName) {
                let aLink = document.createElement('a')
                aLink.style.display = 'none'
                aLink.href = downloadUrl
                aLink.download = `${downloadName}.jpg`
                // 触发点击-然后移除
                document.body.appendChild(aLink)
                aLink.click()
                document.body.removeChild(aLink)
            },


            // 清空场景，包括 scene 场景下的动画，子物体，renderer,camera,control，以及自己使用过的变量置空处理 等
            clearScene() {
                cancelAnimationFrame(this.animationId)
                this.scene.traverse((child) => {
                    if (child.material) {
                        child.material.dispose()
                    }
                    if (child.geometry) {
                        child.geometry.dispose()
                    }
                    child = null
                })

                // 场景中的参数释放清理或者置空等
                this.renderer.forceContextLoss()
                this.renderer.dispose()
                this.scene.clear()
                this.scene = null
                // this.camera = null
                this.controls = null
                this.renderer.domElement = null
                this.renderer = null
            },
            initThree() {
                let composer, labelRenderer
                const group = new THREE.Group()
                const scene = new THREE.Scene()

                scene.background = new THREE.Color('#B9E6F2')

                const canvas = document.getElementById('threes')
                const renderer = new THREE.WebGLRenderer({
                    canvas,
                    antialias: true, //抗鋸齒
                    alpha: true, //透明度
                    preserveDrawingBuffer: true //解決Unable to clone WebGL context as it has preserveDrawingBuffer=false canvas
                })
                renderer.setClearAlpha(0.1)
                // renderer.shadowMap.enabled = true
                this.renderer = renderer
                const camera = new THREE.PerspectiveCamera(
                    50,
                    canvas.clientWidth / canvas.clientHeight,
                    1,
                    100
                )



                camera.position.z = 35
                camera.position.y = 15
                camera.position.x = -8

                this.camera = camera


                const ss = document.getElementById('ss')
                labelRenderer = new CSS2DRenderer({ canvas })
                labelRenderer.setSize(ss.clientWidth, ss.clientHeight)
                labelRenderer.domElement.style.position = 'absolute'
                labelRenderer.domElement.style.top = '0'
                ss.appendChild(labelRenderer.domElement)

                const axes = new THREE.AxesHelper(700)
                const axes1 = new THREE.AxesHelper(700)
                const axes2 = new THREE.AxesHelper(700)

                scene.add(axes)


                scene.fog = new THREE.Fog('#000', 60, 100)
                let loader = new GLTFLoader()
                loader.load('/modelapi/uploads/8e/8ef345e8024f4e7d67da51cefa10043f1dcf1c97.glb', (gltf) => {
                    let model = gltf.scene
                    model.name = 'world'

                    model.traverse((o) => {
                        let material1 = new THREE.MeshStandardMaterial()
                        material1.envMapIntensity = 0.8
                        material1.roughness = 0.1 //粗糙度
                        material1.metalness = 0.8 //金屬度
                        material1.transparent = true
                        o.material = material1
                    })

                    group.add(model)
                    scene.add(group)
                })

                this.group = group

                //  scene.add(Mfun.normalfloor())
                const ambient = new THREE.AmbientLight('#fff', 1)
                scene.add(ambient)

                const light = new THREE.DirectionalLight(0xaaaaaa)
                light.position.set(10, 10, 10)
                scene.add(light)

                scene.add(Mfun.RectAreaLight(45, 7, 0))
                scene.add(Mfun.RectAreaLight(15, 7, 0))
                scene.add(Mfun.RectAreaLight(-15, 7, 0))
                scene.add(Mfun.RectAreaLight(-45, 7, 0))

                this.scene = scene

                this.controls = Mfun.Controls(this.camera, renderer.domElement) //控制器
                this.controls2 = Mfun.Controls(this.camera, labelRenderer.domElement) //控制器

                composer = new EffectComposer(renderer)

                const renderPass = new RenderPass(scene, camera)
                composer.addPass(renderPass)
                this.outlinePass = Mfun.outline(
                    canvas.offsetWidth,
                    canvas.offsetHeight,
                    scene,
                    camera
                )

                composer.addPass(toRaw(this.outlinePass))

                var that = this
                function animate() {
                    if (that.controls != null && that.controls2 != null && that.camera != null) {
                        that.controls.target.set(that.oldt.x, 2, that.oldt.z)
                        that.controls2.target.set(that.oldt.x, 2, that.oldt.z)
                        that.controls.update()
                        that.controls2.update()
                        renderer.render(toRaw(that.scene), toRaw(that.camera))

                        composer.render(toRaw(that.scene), toRaw(that.camera))
                        labelRenderer.render(toRaw(that.scene), toRaw(that.camera))

                        requestAnimationFrame(animate)
                        TWEEN.update()
                        if (resizeRendererToDisplaySize(renderer, labelRenderer)) {
                            const canvas = renderer.domElement
                            that.camera.aspect = canvas.clientWidth / canvas.clientHeight
                            that.camera.updateProjectionMatrix()
                        }
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
                        composer.setSize(width, height, false)
                        renderer.setSize(width, height, false)
                        labelRenderer.setSize(ss.clientWidth, ss.clientHeight, false)
                    }
                    return needResize
                }
            },

            addSelectedObject(object) {
                this.selectedObjects = []
                this.selectedObjects.push(object)
            },
            onMouseClick(event) {
                let intersects = this.getIntersects(event, this.group)
                if (intersects.length !== 0) {
                    var selectObject = intersects[0].object
                    selectObject = intersects[0].object.parent.parent.parent.parent
                    if (
                        selectObject.name.indexOf('World') == -1 &&
                        selectObject.name.indexOf('FloorPlan') == -1
                    ) {
                        this.addSelectedObject(selectObject)
                        this.outlinePass.selectedObjects = this.selectedObjects


                        let c = selectObject.getWorldPosition(new THREE.Vector3())


                        const earthDiv = document.createElement('div');
                        earthDiv.className = 'label';
                        earthDiv.id = 'SPI';
                        earthDiv.textContent = 'Earth';
                        earthDiv.innerHTML = "<button>test</button><table><tr><td>Input</td><td>123</td></tr></table><v-table v-if='" + this.test + "'></v-table>";
                        earthDiv.style.marginTop = '-10px';
                        earthDiv.style.backgroundColor = 'rgba(122,32,44,0.1)';
                        this.test = c

                        const earthLabel = new CSS2DObject(this.$refs.screen);
                        earthLabel.position.set(c.x, c.y + 4, c.z);
                        this.scene.add(earthLabel);


                        // Mfun.makeTextSprite(document.createElement('canvas'), this.scene, [{
                        //     scale: [20, 20, 1],
                        //     pos: [c.x, 4, c.z],

                        // }])

                        // html2canvas(this.$refs.screen, {
                        //     useCORS: true,
                        //     scale: 22, // 处理模糊问题
                        //     dpi: 600, // 处理模糊问题
                        //     backgroundColor: null
                        // }).then((canvas) => {
                        //     console.log(canvas)
                        //     Mfun.makeTextSprite(canvas, this.scene, [{
                        //         scale: [5, 10, 10],
                        //         pos: [c.x, c.y + 4, c.z],
                        //     }])
                        // })



                    }
                } else {
                    console.log('未选中 Mesh!')
                    this.outlinePass.selectedObjects = []
                }

            },

            getIntersects(event, e) {
                let rayCaster = new THREE.Raycaster()
                let mouse = new THREE.Vector2()

                const canvas = document.getElementById('threes')
                // console.log(canvas.offsetWidth, event.clientX)
                // mouse.x = ((event.clientX - canvas.getBoundingClientRect().left) / canvas.offsetWidth) * 2 - 1;
                // mouse.y = -((event.clientY - canvas.getBoundingClientRect().top) / canvas.offsetHeight) * 2 + 1; //这里为什么是-号，没有就无法点中

                let canvasBounds = canvas.getBoundingClientRect()
                mouse.x = ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1
                mouse.y = -((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1
                rayCaster.setFromCamera(mouse, toRaw(this.camera))
                let intersects = rayCaster.intersectObjects(e.children, true)
                return intersects
            },
            movecamera(oldP, oldT, newP, newT) {
                let tween = new TWEEN.Tween({
                    x1: oldP.x,
                    y1: oldP.y,
                    z1: oldP.z,
                    x2: oldT.x,
                    y2: oldT.y,
                    z2: oldT.z,
                })
                tween.to(
                    {
                        x1: newP.x,
                        y1: newP.y,
                        z1: newP.z,
                        x2: newT.x,
                        y2: newT.y,
                        z2: newT.z,
                    },
                    1000
                )
                let self = this // 每一帧执行函数 、这个地方就是核心了、每变一帧跟新一次页面元素
                tween.onUpdate((object) => {
                    self.camera.position.set(object.x1, object.y1, object.z1)
                    self.controls.target0.x = object.x2
                    self.controls.target0.y = object.y2
                    self.controls.target0.z = object.z2
                    self.controls.update()
                })

                tween.onComplete(() => {
                    // 动画完成后的执行函数
                    this.controls.enabled = true
                })
                tween.easing(TWEEN.Easing.Cubic.InOut)
                tween.start() // 这个函数必须有、这个是启动函数、不加不能启动
            },
        },
    }
</script>

<style lang="less" scoped>
    #threes {
        background-image: linear-gradient(rgb(0, 0, 0), rgb(0, 0, 0));
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.8s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
</style>

<style>
    .test {
        color: #ffe56f;
    }

    .seamless-warp {
        overflow: hidden;
    }

    .ant-descriptions-item-label {
        font-size: 20px !important;
    }
</style>