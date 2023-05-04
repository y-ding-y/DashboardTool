<template>
  <div :class="' combtn animated ' + animated" :style="[styleSet,click_style]">
    <div v-if="curdiv" :style="[styleclick]"></div>
    {{ result }}
    <canvas
      Lkey="cavi"
      :style="{ width: ss.width + 'px', height: ss.height + 'px' }"
      id="showmodelid"
    ></canvas>
  </div>
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { mapState } from 'vuex'
export default {
  props: {
    ss: {
      type: Object,
      default: () => ({
        left: 10,
        top: 10,
        width: 100,
        height: 100,
        fontSize: 20,
      }),
    },
    curdiv: { type: Boolean, default: false },
  },
  data() {
    return {
      cavi: 0,
      click_style:{},
      isshow: true,
      result: null,
      animated: this.ss.inanimate,
    }
  },
  watch: {
    isshow(vnew, vold) {
      if (this.isshow) {
        this.animated = this.ss.inanimate
      } else if (vnew != vold && !this.isshow) {
        this.animated = this.ss.outanimate
      }
    },
    datebind(vnew, vold) {
      if (this.datebind && vnew != vold) {
        this.handle_search()
      } else {
        this.result = this.ss.content
      }
    },
    datedetail() {
      this.handle_search()
    },
    datesource() {
      this.handle_search()
    },
  },
  computed: {
    ...mapState('setting', ['lang', 'pageMinHeight']),
    maincontent() {
      if (this.ss.datebind) {
        return this.result
      } else if (this.ss.content) {
        return this.ss.content
      } else {
        return ''
      }
    },
    datebind() {
      return this.ss.datebind
    },
    datesource() {
      return this.ss.datesource
    },
    datedetail() {
      return this.ss[this.ss.datesource]
    },

    styleSet: function () {
      var style = {
        //  border: this.curdiv ? '5px solid blue' : '0px',
        position: 'absolute',
        top: this.ss.top + 'px',
        left: this.ss.left + 'px',
        width: this.ss.width + 'px',
        height: this.ss.height + 'px',
        fontSize: this.ss.fontSize + 'px',
        lineHeight: this.ss.height + 'px',
        zIndex: this.ss.zindex,
        color: this.ss.color,
        textAlign: this.ss.textAlign,
        letterSpacing: this.ss.spacing + 'px',
        fontWeight: this.ss.fontweight,
        textDecoration: this.ss.decoration,
        fontStyle: this.ss.fontstyle,
        //transform:this.ss.transform
      }
      //console.log(merge(this.ss, style))
      return style
    },
    styleclick() {
      var style = {
        border: this.curdiv ? '5px solid blue' : '0px',
        position: 'absolute',
        width: this.ss.width + 'px',
        height: this.ss.height + 'px',
      }
      return style
    },
  },
  created() {
    if (this.datebind) {
      this.handle_search()
    }
    this.isshow = this.ss.isshow
    if (this.ss.isshow) {
      this.animated = this.ss.inanimate
    } else {
      this.animated = this.ss.outanimate
    }
  },
  methods: {
    initThree(e) {
      this.cavi++
      const group = new THREE.Group()
      const scene = new THREE.Scene()

      const canvas = document.getElementById('showmodelid')
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
        100
      )

      camera.position.x = 0
      camera.position.y = 1
      camera.position.z = 3

      // var axis = new THREE.AxisHelper(3); // 3表示轴的长度  显示坐标轴
      // scene.add(axis);
      let loader = new GLTFLoader()
      if (e != '') {
        //loader.load(process.env.VUE_APP_API_MODEL_URL + e, (gltf) => {
        loader.load('/modelapi/uploads/' + e, (gltf) => {
          let model = gltf.scene
          group.add(model)
          scene.add(group)
        })
      }

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
        controls.target.set(0, 0, 0)
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
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
    handle_search() {
      let dtype = this.ss.datetype
      let dsource = this.ss.datesource
      switch (dsource) {
        case 'phpapi':
          this.handle_phpapi(dsource, dtype)
          break
        case 'publicdata':
          this.handle_publicdata(dsource, dtype)
          break
        default:
          break
      }
    },

    handle_phpapi(dsource, dtype) {
      let temp = eval('(' + this.ss[dsource] + ')')
      if (temp.url != '') {
        this.$funAxios
          .reqPost(temp.url, temp.params)
          .then((res) => {
            if (typeof res.data == dtype) {
              this.result = res.data
            } else {
              this.$message.error(this.ss.componentname + '数据格式错误')
            }
          })
          .catch((error) => {
            console.log(error)
            this.result = null
            this.$message.error(this.ss.componentname + 'NetWork Error')
          })
      }
    },

    handle_publicdata(dsource, dtype) {
      let temp = eval('(' + this.ss[dsource] + ')')
      let publicdatatab = Array(this.$localForage.getItem('3dpublicdata'))
      Promise.all(publicdatatab).then((value) => {
        if (value[0] != null) {
          if (value[0].length > 0) {
            if (dtype == 'string') {
              var table = value[0][Number(temp.key)].tabledata
              this.result = URL.createObjectURL(
                table[Number(temp.row) - 1][temp.colname]
              )

              this.initThree(this.result)
            } else if (dtype == 'array') {
              this.result = value[0][Number(temp.key)].tabledata
            }
          }
        }
      })
    },
  },
}
</script>

<style lang="less">
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 500px;
}
#showmodelid {
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0));
}
img:hover {
  cursor: pointer;
}
</style>
