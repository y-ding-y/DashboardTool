<template>
    <div>
        <my-table ref="table" :tableData="videos" :size="'middle'" :columns="columns" :scroll="scroll">

            <template #baseurl>
                <span> /modelapi/uploads/</span>
            </template>
            <template #action="{text, record}">
                <a-button type="link" size="small" @click="show_model(record)">
                    <search-outlined :class="'success'" />
                </a-button>
            </template>
        </my-table>


        <a-modal :title="title" :visible="visible" :bodyStyle="{ height: '440px' }" width="440px" @cancel="handle_close"
            :footer="null">
            <div>
                <canvas :key="cavi" style="width: 400px; height: 400px" :id="modelid"></canvas>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import MyTable from '@/components/table/index.vue'
    import * as THREE from 'three'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
    import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
    import { mapState } from 'vuex'
    export default {
        components: { MyTable },
        props: {
            videos: Array,
        },
        data() {
            return {
                cavi: 0,
                visible: false,
                modelid: null,
                title: '',
            }
        },
        watch: {},
        computed: {
            ...mapState('setting', ['lang', 'pageMinHeight']),
            scroll() {
                return { y: this.pageMinHeight - 200 }
            },

            columns() {
                return [
                    { key: 'no', align: 'center', title: '序号', width: 80 },
                    { key: 'name', align: 'left', title: '名称', width: 200 },
                    { key: 'baseurl', align: 'left', title: '前缀', width: 200 },
                    { key: 'note', align: 'left', title: '路径' },
                    { key: 'action', align: 'left', title: '行为', width: 100 },
                ].map((e) => {
                    e.dataIndex = e.key
                    return e
                })
            },
        },
        methods: {
            handle_close() {
                this.visible = false
            },
            show_model(e) {
                this.visible = true
                this.modelid = e.id + '-' + e.name
                this.cavi++
                this.title = e.name
                this.$nextTick(() => {
                    this.initThree(e)
                })
            },
            initThree(e) {
                const group = new THREE.Group()
                const scene = new THREE.Scene()
                scene.fog = new THREE.Fog('#B9E6F2', 20, 100)
                scene.background = new THREE.Color('#B9E6F2')
                const canvas = document.getElementById(this.modelid)

                const renderer = new THREE.WebGLRenderer({
                    canvas,
                    antialias: true,
                    alpha: true,
                })
                renderer.shadowMap.enabled = true

                const camera = new THREE.PerspectiveCamera(
                    50,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    1000
                )

                camera.position.x = 0
                camera.position.y = 0
                camera.position.z = 2

                // var axis = new THREE.AxisHelper(3); // 3表示轴的长度  显示坐标轴
                // scene.add(axis);
                let loader = new GLTFLoader()
                loader.load(e.glbsrc, (gltf) => {
                    let model = gltf.scene
                    group.add(model)
                    scene.add(group)
                })

                const ambient = new THREE.AmbientLight('#fff', 1)
                scene.add(ambient) //将环境光添加到场景中

                const pointLight = new THREE.PointLight('#fff', 0.8, 5)
                pointLight.position.set(3, 3, 3)
                scene.add(pointLight)

                const pointLight2 = new THREE.PointLight('#fff', 0.8, 5)
                pointLight2.position.set(-3, 3, 3)
                scene.add(pointLight2)

                const pointLight3 = new THREE.PointLight('#fff', 0.8, 5)
                pointLight3.position.set(-3, 3, -3)
                scene.add(pointLight3)

                const pointLight4 = new THREE.PointLight('#fff', 0.8, 8)
                pointLight4.position.set(3, 3, -3)
                scene.add(pointLight4)

                const dirLight = new THREE.DirectionalLight('#fff', 1)
                //光源等位置
                dirLight.position.set(10, 5, 5)
                //可以产生阴影
                //dirLight.castShadow = true
                dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
                scene.add(dirLight)

                const controls = new OrbitControls(camera, renderer.domElement)
                controls.enableDamping = true //阻尼感
                controls.enablePan = true
                controls.minPolarAngle = 0
                controls.maxPolarAngle = 0.49 * Math.PI
                controls.minDistance = 1

                function animate() {
                    controls.target.set(0, 1, 0)
                    controls.update()
                    renderer.render(scene, camera)
                    requestAnimationFrame(animate)
                    TWEEN.update()
                    if (resizeRendererToDisplaySize(renderer)) {
                        const canvas = renderer.domElement
                        camera.aspect = canvas.clientWidth / canvas.clientHeight
                        camera.updateProjectionMatrix()
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
                        renderer.setSize(width, height, false)
                    }
                    return needResize
                }
            },
        },
    }
</script>

<style lang="less">
    .success,
    .success:hover,
    .success:visited {
        color: @success-color;
    }

    .demo-infinite-container {
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: auto;
        padding: 8px 24px;
        height: 500px;
    }

    .demo-loading-container {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
    }

    img:hover {
        cursor: pointer;
    }

    *::-webkit-scrollbar {
        width: 7px;
        height: 10px;
        background-color: transparent;
    }

    *::-webkit-scrollbar-track {
        background-color: @primary-4;
    }

    *::-webkit-scrollbar-thumb {
        background-color: @primary-color;
        border-radius: 6px;
    }

    .scrollbarHide::-webkit-scrollbar {
        display: none;
    }

    .scrollbarShow::-webkit-scrollbar {
        display: block;
    }
</style>