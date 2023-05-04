<template>
  <div
    :id="ele"
    class="container"
    :style="{ width: width + 'px', height: height + 'px' }"
  ></div>
</template>

<script>
import * as THREE from "three";
import Stats from "stats-js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
  name: "ThreeScene",
  i18n: require("./i18n"),
  props: {
    ele: { type: String, default: "container" },
    width: { type: Number, default: 800 },
    height: { type: Number, default: 500 },
  },
  data() {
    return {
      // camera: null,
      // scene: null,
      // renderer: null,
      // mesh: null,
      // controls: null,
      models: {
        id: 1,
        name: "smt",
        config: {},
        type: "group",
        kind: null,
        position: {},
        rotation: {},
        scale: {},
        size: {},
        materials: [],
        children: [
          {
            id: 2,
            name: "line1",
            config: {},
            type: "geo",
            kind: "cube",
            position: { x: 1, y: 2, z: 3 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: {},
            size: { x: 5, y: 10, z: 15 },
            meterails: [],
            children: [],
          },
        ],
      },
      r: 0,
    };
  },
  mounted() {
    this.container;
    this.scene;
    this.camera;
    this.axesHelper;
    this.renderer;
    this.lights;
    this.gui;
    this.stats;
    this.trackballControls;
    this.clock;
    this.controls;
    this.models;
    this.sprites;
    this.mesh;

    this.execute();
    this.animate();
  },
  methods: {
    
    iniContainer() {
      this.container = document.getElementById(this.ele);
      this.container.onresize = this.onContainerResize;
    },
    onContainerResize() {
      this.camera.aspect =
        this.container.innerWidth / this.container.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        this.container.innerWidth,
        this.container.innerHeight
      );
    },
    initScene() {
      this.scene = new THREE.Scene();
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        70,
        this.container.clientWidth / this.container.clientHeight,
        0.1,
        1000
      );
      this.camera.position.x = -30;
      this.camera.position.z = 40;
      this.camera.position.z = 30;
      this.camera.lookAt(this.scene.position);
    },
    initHelper() {
      this.axesHelper = new THREE.AxisHelper(10);
      this.scene.add(this.axesHelper);
    },
    initModel() {
      //网格模型添加到场景中
      let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      let material = new THREE.MeshNormalMaterial({
        color: 0xff00ff,
      });
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.x = 2;
      this.scene.add(this.mesh);
      let sphere = new THREE.SphereGeometry(0.5);
      this.scene.add(new THREE.Mesh(sphere, material));
    },
    initSprite() {
      //精靈
      let spriteMaterialNormal = new THREE.SpriteMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.2,
      });
      let spriteNormal = new THREE.Sprite(spriteMaterialNormal);
      spriteNormal.position.set(-3, 0, 0);
      spriteNormal.scale.set(2, 2, 1);
      this.scene.add(spriteNormal);
    },
    initLight() {
      this.lights = [];

      let spotLight = new THREE.SpotLight(0x0000ff);
      spotLight.position.set(0, 20, 20);
      spotLight.intensity = 50;
      this.scene.add(spotLight);
      this.lights.push(spotLight);

      let spotLight1 = new THREE.SpotLight(0xffffff);
      spotLight1.position.set(0, 0, 20);
      spotLight1.intensity = 10;
      this.scene.add(spotLight1);
      this.lights.push(spotLight1);
      console.log(this.lights);
    },
    initControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    initStats() {
      this.stats = new Stats();
      this.container.appendChild(this.stats["dom"]);
    },
    render() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      );
      this.renderer.shadowMap.enabled = true; //渲染陰影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setClearColor(new THREE.Color(0x110000));
      this.container.appendChild(this.renderer.domElement);
    },
    execute() {
      // 初始化容器
      this.iniContainer();
      // 初始化場景
      this.initScene();
      // 初始化攝像頭
      this.initCamera();
      // 初始化坐標系
      this.initHelper();
      // 初始化幀數顯示工具
      this.initStats();
      // 初始化模型
      this.initModel();
      // 初始化精靈
      this.initSprite();
      // 初始化光源
      this.initLight();
      // 執行渲染
      this.render();
      // 初始化控制器
      this.initControls();
    },

    // 动画
    animate() {
      requestAnimationFrame(this.animate);
      this.stats.update();
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.02;
      this.r += 0.01;
      this.mesh.position.x = Math.sin(this.r) * 2;
      this.mesh.position.y = Math.cos(this.r) * 2;
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style>
#container {
  position: absolute;
}
</style>