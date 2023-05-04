<template>
    <ef-main :isMainPage="true">
        <a-button @click="render">Start</a-button>
        <div id="ss" style="position: relative">
            <canvas :key="cavkey" :style="{ height: pageMinHeight - 200 + 'px', width: '100%' }" id="threes"></canvas>

            <canvas id="c2d" class="c2d" width="1000" height="500"></canvas>
        </div>
    </ef-main>
</template>

<script>
    import * as Vue from 'vue'

    import EfMain from '@/components/page/main'

    import { moment } from '@/utils/util'
    import * as THREE from 'three'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

    //修改OrbitControls.js取消鼠标右键
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
    import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
    import { mapState } from 'vuex'
    import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'

    import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

    // import aas from "./model.json";

    export default {
        data() {
            return {
                moment,
                fileList: [],
                models: [],
                s_models: [],
                actionstatus: '',
                cavkey: 0,
                date: new Date(),

                x: 0,
                y: 0,
                z: 0,

                tablename: '',
                chosemodel: '',
                groups: [],
                groups_2d: [],
                scene: '',
                prevX: 0,
                prevY: 0,
                cx: 0,
                cy: 0,
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
            this.ss()
            // let loader = new GLTFLoader()
            // loader.load("/model/uploads/files/66/66e4784652b4fbb2952dc752b0dc2f3c460d852b.glb", (gltf) => {
            //     console.log(gltf.scene)
            // })
            // axios.get("/model/uploads/files/66/66e4784652b4fbb2952dc752b0dc2f3c460d852b.glb")
            //     .then(res => {
            //         console.log(res.data)

            //     })

            var that = this
            document.getElementById('threes').onmousedown = function (e) {
                that.onMouseClick(e)
            }
            this.initThree('')

            this.createLine()
        },
        methods: {
            ss() {
                const canvas = document.querySelector('#c2d')
                // 渲染器
                const renderer = new THREE.WebGLRenderer({ canvas })
                // 开启阴影渲染
                renderer.shadowMap.enabled = true

                const fov = 40 // 视野范围
                const aspect = 2 // 相机默认值 画布的宽高比
                const near = 0.1 // 近平面
                const far = 10000 // 远平面
                // 透视投影相机
                const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
                // camera.position.set(1000, 500, 1500)
                camera.position.set(0, 1000, -1000)
                camera.lookAt(0, 0, 0)

                const controls = new OrbitControls(camera, renderer.domElement)
                controls.enableDamping = false //阻尼感
                controls.enablePan = true
                controls.minPolarAngle = 0
                controls.maxPolarAngle = 0.49 * Math.PI
                controls.minDistance = 1

                // 控制相机
                // const controls = new OrbitControls(camera, canvas)
                // controls.update()

                // 场景
                const scene = new THREE.Scene()

                // 背景
                scene.background = new THREE.Color(0x87ceeb)
                // 雾
                scene.fog = new THREE.Fog(0x87ceeb, 200, 10000)

                // 辅助
                const axes = new THREE.AxisHelper(700)
                const axes1 = new THREE.AxisHelper(700)
                const axes2 = new THREE.AxisHelper(700)

                scene.add(axes)

                let mesh11 = null
                let arrowFront = null
                {
                    var geometry1 = new THREE.BoxGeometry(100, 100, 100)
                    var material1 = new THREE.MeshLambertMaterial({
                        color: 0x0000ff,
                    })
                    mesh11 = new THREE.Mesh(geometry1, material1)
                    mesh11.add(axes2)
                    scene.add(mesh11)
                }

                {
                    // 灯光
                    const skyColor = 0xffffff // 天空 白色
                    const groundColor = 0x000000 // 地面 黑色
                    const intensity = 1
                    const light = new THREE.HemisphereLight(
                        skyColor,
                        groundColor,
                        intensity
                    )
                    scene.add(light)
                }

                let dLight = null
                {
                    const light = new THREE.DirectionalLight(0xaaaaaa)
                    light.position.set(0, 200, 100)
                    light.lookAt(new THREE.Vector3())

                    light.castShadow = true
                    light.shadow.camera.top = 300
                    light.shadow.camera.bottom = -300
                    light.shadow.camera.left = -300
                    light.shadow.camera.right = 300

                    // 开启阴影投射
                    light.castShadow = true
                    dLight = light
                    scene.add(light)
                }

                {
                    // 地面
                    const loader = new THREE.TextureLoader()
                    const texture = loader.load('/model/1.jpg')
                    texture.wrapS = THREE.RepeatWrapping
                    texture.wrapT = THREE.RepeatWrapping
                    texture.magFilter = THREE.NearestFilter
                    // 纹理 重复
                    texture.repeat.set(100, 100)

                    const planeGeo = new THREE.PlaneGeometry(10000, 10000)
                    const planeMat = new THREE.MeshPhongMaterial({
                        map: texture,
                        side: THREE.DoubleSide,
                    })
                    const mesh = new THREE.Mesh(planeGeo, planeMat)
                    mesh.rotation.x = Math.PI * -0.5

                    // 开启阴影接收
                    mesh.receiveShadow = true
                    scene.add(mesh)
                }

                let meshHY = null
                let actions = [] // 所有的动画数组
                let gui = {} // 动画控制
                let mixer = null // AnimationMixer 对象
                const loader = new FBXLoader()
                loader.load('/model/Naruto.fbx', function (mesh) {
                    mesh.position.y = 110
                    mesh.add(camera)
                    mesh.add(axes1)
                    // 设置模型的每个部位都可以投影
                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.castShadow = true
                            child.receiveShadow = true
                        }
                    })

                    // 设置光线焦点模型
                    dLight.target = mesh

                    meshHY = mesh

                    scene.add(mesh)

                    mixer = new THREE.AnimationMixer(mesh)
                    for (var i = 0; i < mesh.animations.length; i++) {
                        actions[i] = mixer.clipAction(mesh.animations[i])
                    }
                    gui['action'] = function (s) {
                        for (var j = 0; j < actions.length; j++) {
                            if (j === s) {
                                actions[j].play()
                            } else {
                                actions[j].stop()
                            }
                        }
                    }
                    // 第24个动作是鸣人站立的动作
                    gui['action'](24)
                })

                let keyNum = 24 // 动作
                document.onkeydown = function (e) {
                    if (e && e.keyCode == 32) {
                        if (keyNum === 27) {
                            keyNum = 1
                        }
                        keyNum += 1
                        gui['action'](keyNum)
                    }
                }

                // 监听键盘是否按下
                let keyCodeW = false
                let keyCodeS = false
                let keyCodeA = false
                let keyCodeD = false
                let keyCodeQ = false
                let keyCodeE = false
                let mousemove = false
                let keyCodeK = false // 攻击
                document.addEventListener('mousedown', (e) => {
                    var ev = e || window.event
                    switch (ev.button) {
                        case 2:
                            console.log('点击了鼠标右键')
                            mousemove = true
                            break
                        default:
                            break
                    }
                })
                document.addEventListener('mouseup', (e) => {
                    var ev = e || window.event
                    switch (ev.button) {
                        case 2:
                            console.log('点击了鼠标右键')
                            mousemove = false
                            break
                        default:
                            break
                    }
                })

                document.addEventListener(
                    'keydown',
                    (e) => {
                        var ev = e || window.event
                        switch (ev.keyCode) {
                            case 87:
                                keyCodeW = true
                                break
                            case 83:
                                keyCodeS = true
                                break
                            case 65:
                                keyCodeA = true
                                break
                            case 81:
                                keyCodeQ = true
                                break
                            case 69:
                                keyCodeE = true
                                break
                            case 68:
                                keyCodeD = true
                                break
                            case 75:
                                keyCodeK = true
                                attack()
                                break
                            default:
                                break
                        }
                    },
                    false
                )
                document.addEventListener(
                    'keyup',
                    (e) => {
                        var ev = e || window.event
                        switch (ev.keyCode) {
                            case 87:
                                keyCodeW = false
                                break
                            case 83:
                                keyCodeS = false
                                break
                            case 65:
                                keyCodeA = false
                                break
                            case 81:
                                keyCodeQ = false
                                break
                            case 69:
                                keyCodeE = false
                                break
                            case 68:
                                keyCodeD = false
                                break
                            default:
                                break
                        }
                    },
                    false
                )
                //var that = this
                // 控制 移动
                function onCodeMove(mesh) {
                    if (keyCodeW) {
                        let vect = mesh.getWorldDirection(new THREE.Vector3())

                        mesh.position.z += vect.dot(new THREE.Vector3(0, 0, 2)) * 1.5
                        mesh.position.x += vect.dot(new THREE.Vector3(2, 0, 0)) * 1.5
                        dLight.position.z += vect.dot(new THREE.Vector3(0, 0, 2)) * 1.5
                        dLight.position.x += vect.dot(new THREE.Vector3(2, 0, 0)) * 1.5
                    }
                    if (keyCodeA) {
                        mesh.rotation.y += Math.PI * 0.05
                        //    camera.rotateOnAxis(mesh.getWorldDirection(new THREE.Vector3()), Math.PI * 0.05);
                    }
                    if (keyCodeS) {
                        let vect = mesh.getWorldDirection(new THREE.Vector3())

                        mesh.position.z -= vect.dot(new THREE.Vector3(0, 0, 2)) * 1.5
                        mesh.position.x -= vect.dot(new THREE.Vector3(2, 0, 0)) * 1.5
                        dLight.position.z -= vect.dot(new THREE.Vector3(0, 0, 2)) * 1.5
                        dLight.position.x -= vect.dot(new THREE.Vector3(2, 0, 0)) * 1.5
                    }
                    if (keyCodeD) {
                        mesh.rotation.y -= Math.PI * 0.05
                        // camera.rotateOnAxis(mesh.getWorldDirection(new THREE.Vector3()), Math.PI * 0.05);
                    }

                    if (keyCodeQ) {
                        let vect = mesh.getWorldDirection(new THREE.Vector3())
                        let x2 =
                            vect.x * Math.cos(-Math.PI * 0.5) -
                            vect.z * Math.sin(-Math.PI * 0.5)
                        let y2 =
                            vect.z * Math.cos(-Math.PI * 0.5) +
                            vect.x * Math.sin(-Math.PI * 0.5)
                        let tt = new THREE.Vector3(x2, 0, y2)
                        mesh.position.z += tt.dot(new THREE.Vector3(0, 0, 2)) * 1.5
                        mesh.position.x += tt.dot(new THREE.Vector3(2, 0, 0)) * 1.5
                        dLight.position.z += tt.dot(new THREE.Vector3(0, 0, 2)) * 1.5
                        dLight.position.x += tt.dot(new THREE.Vector3(2, 0, 0)) * 1.5
                    }
                    if (keyCodeE) {
                        let vect = mesh.getWorldDirection(new THREE.Vector3())
                        let x2 =
                            vect.x * Math.cos(Math.PI * 0.5) - vect.z * Math.sin(Math.PI * 0.5)
                        let y2 =
                            vect.z * Math.cos(Math.PI * 0.5) + vect.x * Math.sin(Math.PI * 0.5)
                        let tt = new THREE.Vector3(x2, 0, y2)
                        mesh.position.z += tt.dot(new THREE.Vector3(0, 0, 2)) * 1.5
                        mesh.position.x += tt.dot(new THREE.Vector3(2, 0, 0)) * 1.5
                        dLight.position.z += tt.dot(new THREE.Vector3(0, 0, 2)) * 1.5
                        dLight.position.x += tt.dot(new THREE.Vector3(2, 0, 0)) * 1.5
                    }
                    if (mousemove) {
                        //   let c = camera.getWorldPosition(new THREE.Vector3());
                        // let c = camera.getWorldDirection(new THREE.Vector3());
                        let m = mesh.getWorldDirection(new THREE.Vector3())
                        //  console.log(camera.rotation)
                        // mesh11.rotation = camera.rotation
                        // mesh11.position.set(c.x, c.y, c.z)

                        let aaa = new THREE.Vector3()
                        aaa.copy(camera.position)

                        let aaa1 = new THREE.Vector3()
                        aaa1.copy(camera.getWorldPosition(new THREE.Vector3()))

                        aaa.y = 0
                        arrowFront = new THREE.ArrowHelper(
                            aaa.normalize(),
                            mesh.position,
                            150,
                            0xff0000
                        )
                        // arrowFront.setDirection(camera.getWorldPosition(new THREE.Vector3()).normalize());
                        //  arrowFront.position.copy(camera.position);
                        scene.add(arrowFront)

                        //  console.log(aaa)
                        let a1 = aaa.normalize()
                        //  a1.angleTo(m)
                        //  console.log(a1.cross(m).z)
                        //  console.log(a1.angleTo(m))

                        let tttt = m.angleTo(a1)
                        a1.cross(m)
                        if (tttt != Math.PI && tttt != 0) {
                            if (a1.z === 0 && 1 / a1.z === -Infinity) {
                                console.log(aaa.normalize())
                                mesh.rotation.y = Math.PI - tttt
                                // camera.position.set(aaa1.x, aaa1.y, aaa1.z)
                                //camera.rotateOnAxis(mesh.getWorldDirection(new THREE.Vector3()), tttt);
                                console.log('1')
                            } else {
                                mesh.rotation.y = tttt

                                //   camera.rotateOnAxis(mesh.getWorldDirection(new THREE.Vector3()), -tttt);
                                // mesh.rotation.y = Math.PI - tttt
                                // camera.rotateOnAxis(a1, Math.PI - tttt);
                                // console.log("1")
                                console.log('2')
                            }
                        }
                        //    console.log(Math.PI + "-" + tttt + "=" + (Math.PI - tttt))

                        // const vectorAngle = (x, y) => {
                        //     let mX = Math.sqrt(x.reduce((acc, n) => acc + Math.pow(n, 2), 0));
                        //     let mY = Math.sqrt(y.reduce((acc, n) => acc + Math.pow(n, 2), 0));
                        //     return Math.acos(x.reduce((acc, n, i) => acc + n * y[i], 0) / (mX * mY));
                        // }

                        //  console.log(new THREE.Vector3(c.x, 0, c.z).angleTo(new THREE.Vector3(m.x, 0, m.z)))

                        // let m = mesh.getWorldDirection(new THREE.Vector3());
                        //  mesh.rotation.y = c.angleTo(m)
                        // console.log(mesh.rotation.y)
                        // console.log(c, m)
                        // console.log(c.x, c.z)
                        // console.log(m.x, m.z)
                        //     var aa = Number(new THREE.Vector3(c.x, 0, c.z).angleTo(new THREE.Vector3(m.x, 0, m.z))).toFixed(2)
                        // console.log(aa)
                        // if (aa < Math.PI / 2) {
                        //     //   console.log(new THREE.Vector3(c.x, 0, c.z).angleTo(new THREE.Vector3(m.x, 0, m.z)))
                        //     mesh.rotation.y = aa
                        //     //   camera.rotateOnAxis(mesh.getWorldDirection(new THREE.Vector3()), aa);

                        //     //   console.log(mesh.rotation.y)
                        // }
                        // else {
                        //     mesh.rotation.y = aa
                        //     //  camera.rotateOnAxis(mesh.getWorldDirection(new THREE.Vector3()),aa);

                        // }

                        //camera.rotateOnAxis(mesh.getWorldDirection(new THREE.Vector3()), new THREE.Vector3(c.x, 0, c.z).angleTo(new THREE.Vector3(m.x, 0, m.y)));

                        //let aa = m.cross(c)
                        // if (aa.z > 0) {
                        //     mesh.rotation.y = - m.angleTo(c) * Math.PI
                        //     camera.rotateOnAxis(mesh.getWorldDirection(new THREE.Vector3()), - m.angleTo(c) * Math.PI);
                        // }
                        // else {
                        //     mesh.rotation.y = m.angleTo(c) * Math.PI
                        //     camera.rotateOnAxis(mesh.getWorldDirection(new THREE.Vector3()), m.angleTo(c) * Math.PI);
                        // }
                    }

                    // if (keyCodeW && keyCodeD) {
                    //     mesh.rotation.y = Math.PI * 0.25
                    // }
                    // if (keyCodeW && keyCodeA) {
                    //     mesh.rotation.y = Math.PI * 0.75
                    // }
                    // if (keyCodeA && keyCodeS) {
                    //     mesh.rotation.y = Math.PI * 1.25
                    // }
                    // if (keyCodeS && keyCodeD) {
                    //     mesh.rotation.y = Math.PI * 1.75
                    // }

                    if (keyCodeK) {
                        //
                    } else {
                        resetMove()
                    }

                    //     var temp = mesh.getWorldDirection(new THREE.Vector3())

                    //     var x = mesh.position.x * temp.x;
                    // //    var y = mesh.position.y * temp.y;
                    //     var z = mesh.position.z * temp.z;

                    // let vect = mesh.getWorldDirection(new THREE.Vector3());
                    // console.log(vect)

                    camera.lookAt(mesh.position.x, mesh.position.y, mesh.position.z)

                    //controls.target.set(mesh.position.x, mesh.position.y, -mesh.position.z);
                    // console.log(mesh.getWorldDirection(new THREE.Vector3()))
                    // console.log(camera.position)
                }

                let moveNum = false
                // 重置移动
                function resetMove() {
                    // 按下键盘 跑步动画
                    if (
                        keyCodeW ||
                        keyCodeS ||
                        keyCodeA ||
                        keyCodeD ||
                        keyCodeQ ||
                        keyCodeE ||
                        mousemove
                    ) {
                        gui['action'](3)
                        moveNum = true
                    } else {
                        // 只执行一次
                        if (moveNum) {
                            moveNum = false
                            gui['action'](24)
                        }
                    }
                }

                // 踢 8 9 10
                let attackList = [12, 8, 9, 10] // 连招的循序
                let attackCombo = true
                let skills = 0 // 下标
                let clickNum = 0 // 点击次数

                // 模型攻击
                function attack() {
                    clickNum++
                    if (attackCombo) {
                        attackCombo = false

                        // 执行第一个动画
                        gui['action'](attackList[skills])
                        timeCallback()
                    }
                }

                function timeCallback() {
                    setTimeout(function () {
                        // 进行下一个动作
                        skills++
                        // 判断点击次数是否还有下一个动作，如果全部动作完成结束循环
                        if (skills === clickNum || skills > attackList.length - 1) {
                            skills = 0
                            clickNum = 0
                            attackCombo = true
                            keyCodeK = false
                            moveNum = true
                            resetMove()
                        } else {
                            gui['action'](attackList[skills])
                            timeCallback()
                        }
                    }, meshHY.animations[attackList[skills]].duration * 1000)
                }

                const clock = new THREE.Clock()
                // 渲染
                function render() {
                    controls.update()

                    const time = clock.getDelta()
                    if (mixer) {
                        mixer.update(time)
                    }

                    if (meshHY) {
                        onCodeMove(meshHY)
                    }

                    renderer.render(scene, camera)
                    requestAnimationFrame(render)
                }
                requestAnimationFrame(render)
            },
            //解析json
            // handle_json(e, level) {
            //     if (e.constructor == Object) {
            //         var temp_arr = Object.keys(e)
            //         temp_arr.map(a => {
            //             this.handle_json(e[a], level + 1)

            //             console.log(level + "：" + a)
            //         })
            //     }
            //     else if (e.constructor == Array) {
            //         e.map(b => {
            //             this.handle_json(b, level + 1)
            //         })
            //     }
            //     else {
            //         //
            //     }
            // },

            moveCamera(oldP, oldT, newP, newT) {
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

                let self = this
                // 每一帧执行函数 、这个地方就是核心了、每变一帧跟新一次页面元素
                tween.onUpdate((object) => {
                    self.camera.position.set(object.x1, object.y1, object.z1)
                    self.controls.target0.x = object.x2
                    self.controls.target0.y = object.y2
                    self.controls.target0.z = object.z2
                    self.controls.update()
                })

                // 动画完成后的执行函数
                tween.onComplete(() => {
                    this.controls.enabled = true
                })

                tween.easing(TWEEN.Easing.Cubic.InOut)
                // 这个函数必须有、这个是启动函数、不加不能启动
                tween.start()
            },

            initThree(e) {
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
                // aas.buildings.map(b => {
                //     temp.push({
                //         id: b.facades[0].gltfid,
                //         pos: b.position
                //     });
                // })
                let loader = new GLTFLoader()
                //loader.load(e, (gltf) => {
                console.log(e)
                loader.load(
                    '/model/uploads/files/66/66e4784652b4fbb2952dc752b0dc2f3c460d852b.glb',
                    (gltf) => {
                        let model = gltf.scene

                        model.traverse((o) => {
                            console.log(o)
                            // if (o.name == 'line1') {
                            //     console.log(o)
                            // }

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
                        group.add(model)
                        scene.add(group)
                    }
                )

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
            onMouseClick(event) {
                let intersects = this.getIntersects(event, this.group)
                if (intersects.length !== 0) {
                    //	console.log(intersects[0].object.parent.name)
                    var selectObject = intersects[0].object
                    if (intersects[0].object.parent.name != 'Scene') {
                        selectObject = intersects[0].object.parent
                    } else {
                        selectObject = intersects[0].object
                    }

                    //console.log(selectObject.parent.parent.name)
                    // aas.buildings.some(m => {
                    //     if (m.facades[0].gltfid == selectObject.parent.parent.name) {
                    //         console.log(m.name)
                    //     }
                    // })

                    this.addSelectedObject(selectObject)
                    if (['node__-105882'].includes(selectObject.name)) {
                        //
                        let test = this.getIntersects(event, selectObject)
                        selectObject = test[0].object
                        this.addSelectedObject(selectObject)
                        console.log(selectObject)
                        this.outlinePass.selectedObjects = this.selectedObjects
                    } else {
                        this.outlinePass.selectedObjects = this.selectedObjects
                    }

                    // if (selectObject.name != '') {
                    //     this.outlinePass.selectedObjects = this.selectedObjects;
                    // }
                    // var myAppendTo = Vue.extend({
                    // 	template: '<div>Hello World</div>'
                    // });
                    this.moveCamera(
                        this.camera.position,
                        { x: this.x, y: 0, z: 0 },
                        { x: 0 + selectObject.position.x, y: 1, z: 5 },
                        { x: selectObject.position.x, y: selectObject.position.y + 3, z: 0 }
                    )
                    this.x = selectObject.position.x

                    // switch (selectObject.name) {
                    //     case "reflow":
                    //     case "node_id3":
                    //         this.showDrawer(selectObject.name);
                    //         break;
                    //     case "SPI":
                    //         this.test = true;
                    //         //new myAppendTo().$mount().$appendTo('#SPI');//appendTo
                    //         break;
                    //     default:
                    //         console.log(selectObject.position.x)
                    //         //this.camera.position.set(0 + selectObject.position.x, 1, 5);
                    //         //this.camera.lookAt(0 + selectObject.position.x, 1, 4);

                    //         break;
                    // }
                } else {
                    console.log('未选中 Mesh!')
                }
            },

            getIntersects(event, e) {
                // event.preventDefault();// 阻止默认的点击事件执行, https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault

                let rayCaster = new THREE.Raycaster()
                let mouse = new THREE.Vector2()

                const canvas = document.getElementById('threes')

                // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                // mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
                mouse.x =
                    ((event.clientX - canvas.getBoundingClientRect().left) /
                        canvas.offsetWidth) *
                    2 -
                    1
                mouse.y =
                    -(
                        (event.clientY - canvas.getBoundingClientRect().top) /
                        canvas.offsetHeight
                    ) *
                    2 +
                    1 //这里为什么是-号，没有就无法点中

                //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
                rayCaster.setFromCamera(mouse, this.camera)

                //获取与射线相交的对象数组， 其中的元素按照距离排序，越近的越靠前。
                //+true，是对其后代进行查找，这个在这里必须加，因为模型是由很多部分组成的，后代非常多。
                let intersects = rayCaster.intersectObjects(e.children, true)

                //返回选中的对象
                return intersects
            },

            createLine() {
                //创建样条曲线，作为运动轨迹
                this.curve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-80, 0, 10),
                    new THREE.Vector3(-25, 0, 10),
                    new THREE.Vector3(-25, 0, 16),
                    new THREE.Vector3(60, 0, 16),
                    new THREE.Vector3(60, 0, -15),
                    new THREE.Vector3(-80, 0, -15),
                    new THREE.Vector3(-80, 0, 10),
                ])
                const geometry = new THREE.BufferGeometry().setFromPoints(
                    this.curve.getPoints(5000)
                )
                // 材质对象
                var material = new THREE.LineBasicMaterial({
                    color: 'red',
                })
                // 线条模型对象
                var line = new THREE.Line(geometry, material)
                this.scene.add(line) // 线条对象添加到场景中
                //this.render();
            },

            render() {
                requestAnimationFrame(this.render)
                if (this.progress <= 1 - 0.0003 * 20) {
                    const point = this.curve.getPointAt(this.progress) //获取样条曲线指定点坐标，作为相机的位置
                    const pointBox = this.curve.getPointAt(this.progress + 0.0003 * 20) //获取样条曲线指定点坐标
                    this.camera.position.set(point.x, point.y + 3, point.z)
                    this.camera.lookAt(pointBox.x, pointBox.y + 3, pointBox.z)
                    this.controls.position0.set(point.x, point.y + 3, point.z) //非必要，场景有控件时才加上
                    this.controls.target.set(pointBox.x, pointBox.y + 3, pointBox.z) //非必要，场景有控件时才加上
                    this.progress += 0.0003
                } else {
                    this.progress = 0
                }
                this.renderer.render(this.scene, this.camera)
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