import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export { getGroup, loadModel, getModel, getLight, getMaterial };

function getGroup() {

}

function loadModel(model) {
  let m;
  const p = model.para;
  switch (model.type) {
    case 'gltf':
      break;
    case 'json':
      break;
    case 'obj':
      break;
    default:
      m = false;
  }
  return m;
}

function loadGltf(model) {
  const loader = new GLTFLoader();
  const scene = new THREE.Scene();
  loader.load(
    // resource URL
    'models/gltf/duck/duck.gltf',
    // called when the resource is loaded
    function (gltf) {
      scene.add(gltf.scene);
      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
      console.log('An error happened');
    }
  )
  return scene;
}

function getModel(model) {
  let m;
  const p = model.para;
  switch (model.type) {
    case 'BoxGeometry':             // 立方體
      m = new THREE.BoxGeometry(p.width, p.height, p.depth);
      break;
    case 'CircleGeometry':          // 圓形
      m = new THREE.CircleGeometry(p.radius, p?.segments ?? 8);
      break;
    case 'ConeGeometry':            // 圓錐
      m = new THREE.ConeGeometry(p.radius, p.height, p?.radialSegments ?? 8);
      break;
    case 'CylinderGeometry':        // 圓柱
      m = new THREE.CylinderGeometry(p.radiusTop, p.radiusBottom, p?.radialSegments ?? 8);
      break;
    case 'DodecahedronGeometry':    // 十二面體
      m = new THREE.DodecahedronGeometry(p.radius, p?.detail ?? 0);
      break;
    case 'EdgesGeometry':           // 邊緣幾何體
      //todo
      m = new THREE.EdgesGeometry();
      break;
    case 'ExtrudeGeometry':         // 擠壓幾何體 https://threejs.org/docs/#api/zh/geometries/ExtrudeGeometry
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(0, p.width);
      shape.lineTo(p.length, p.width);
      shape.lineTo(p.length, 0);
      shape.lineTo(0, 0);

      const extrudeSettings = {
        steps: p?.steps ?? 2,
        depth: p?.depth ?? 16,
        bevelEnabled: !!p?.bevelenabled ?? true,
        bevelThickness: p?.bevelthickness ?? 0.2,
        bevelSize: (p?.bevelthickness ?? 0.2) - 0.1,
        bevelOffset: p?.beveloffset ?? 0,
        bevelSegments: p?.bevelsegments ?? 1
      };
      m = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      break;
    case 'IcosahedronGeometry':     // 十二面幾何體
      m = new THREE.IcosahedronGeometry(p.radius, p?.detail ?? 0);
      break;
    case 'LatheGeometry':           // 車削幾何體
      const points = p.points;
      for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
      }
      m = new THREE.LatheGeometry(points, p?.segments ?? 12);
      break;
    case 'OctahedronGeometry':      // 八面體
      m = new THREE.OctahedronGeometry(p.radius, p?.detail ?? 0);
      break;
    case 'PlaneGeometry':           // 平面體
      m = new THREE.PlaneGeometry(p.width, p.height);
      break;
    case 'PolyhedronGeometry':      // 多面體 vertices:定點數組 indices:面的索引數組
      m = new THREE.PolyhedronGeometry(p.vertices, p.indices, p.radius, p?.detail ?? 2);
      break;
    case 'RingGeometry':            // 圓環
      m = new THREE.RingGeometry(
        p.innerradius, p.outerradius,
        p?.thetasegments ?? 8, p?.phisegments ?? 8,
        p?.thetastart ?? 0, (p?.thetalength ?? 360) / 180 * Math.PI
      );
      break;
    case 'ShapeGeometry':           // 單面多邊形幾何體
      const x = 0, y = 0;
      const heartShape = new THREE.Shape();

      heartShape.moveTo(x + 5, y + 5);
      heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
      heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
      heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
      heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
      heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
      heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

      m = new THREE.ShapeGeometry(heartShape);
      break;
    case 'SphereGeometry':          // 球
      m = new THREE.SphereGeometry(p.radius,
        p?.widthsegments ?? 32, p?.heightsegments ?? 16,
        p?.phistart ?? 0, (p?.philength ?? 360) / 180 * Math.PI,
        p?.thetastart ?? 0, (p?.thetalength ?? 180) / 180 * Math.PI);
      break;
    case 'TetrahedronGeometry':     // 四面體
      m = new THREE.TetrahedronGeometry(p.radius, p?.detail ?? 0);
      break;
    case 'TorusGeometry':           // 圓環體
      m = new THREE.TorusGeometry(p.radius, p.tube,
        p?.radiussegments ?? 8, p?.tubularsegments ?? 6,
        (p?.arc ?? 0) / 180 * Math.PI);
      break;
    case 'TorusKnotGeometry':       // 圓環扭結體
      m = new THREE.TorusKnotGeometry(p.radius, p.tube,
        p?.radiussegments ?? 8, p?.tubularsegments ?? 6,
        p?.p ?? 2, p?.q ?? 3);
      break;
    case 'TubeGeometry':            // 管道幾何體 https://threejs.org/docs/#api/zh/geometries/TubeGeometry
      m = new THREE.TubeGeometry(p.radius, p?.detail ?? 0);
      break;
    case 'WireframeGeometry':       // 網格幾何體
      m = new THREE.WireframeGeometry(p.radius, p?.detail ?? 0);
      break;
    default:
      m = false;
  }
  if (!m) return m;
  mesh = new THREE.Mesh(m, getMaterial(model.material))
  return mesh;
}

function getLight(light) {
  if (Array.isArray(light)) {
    return light.map(e => getLight(e)).filter(e => e !== false)
  }
  let l;
  const p = light.para;
  switch (light.type) {
    case '':
      break;
    case '':
      break;
    default:
      l = false;
  }
  return l;
}

function getMaterial(material) {
  if (Array.isArray(material)) {
    return material.map(e => getMaterial(e)).filter(e => e !== false)
  }
  let m;
  const p = material.para;
  switch (material.type) {
    case 'LineBasicMaterial':       // 基礎線條
      m = new THREE.LineBasicMaterial({
        color: p?.color ?? 0xffffff,
        linewidth: p?.linewidth ?? 1,
      });
      break;
    case 'LineDashedMaterial':      // 虛線條
      m = new THREE.LineDashedMaterial({
        color: p?.color ?? 0xffffff,
        linewidth: p?.linewidth ?? 1,
        scale: p?.scale ?? 1,
        dashSize: p?.dashsize ?? 3,
        gapSize: p?.gapsize ?? 1,
      });
      break;
    case 'MeshBasicMaterial':       // 基礎網格材質,不受光照的影响
      m = new THREE.MeshBasicMaterial(p);
      break;
    case 'MeshDepthMaterial':       // 按深度绘制几何体的材质。深度基于相机远近平面。白色最近，黑色最远。
      m = new THREE.MeshDepthMaterial(p);
      break;
    case 'MeshDistanceMaterial':
      m = new THREE.MeshDistanceMaterial(p);
      break;
    case 'MeshLambertMaterial':     // Lambert网格材质,非光泽表面的材质，没有镜面高光
      m = new THREE.MeshLambertMaterial(p);
      break;
    case 'MeshMatcapMaterial':
      m = new THREE.MeshMatcapMaterial(p);
      break;
    case 'MeshNormalMaterial':      // 法线网格材质,一种把法向量映射到RGB颜色的材质。
      m = new THREE.MeshNormalMaterial(p);
      break;
    case 'MeshPhongMaterial':       // Phong网格材质,一种用于具有镜面高光的光泽表面的材质。
      m = new THREE.MeshPhongMaterial(p);
      break;
    case 'MeshPhysicalMaterial':    // 物理网格材质
      m = new THREE.MeshPhysicalMaterial(p);
      break;
    case 'MeshStandardMaterial':    // 标准网格材质
      m = new THREE.MeshStandardMaterial(p);
      break;
    case 'MeshToonMaterial':
      m = new THREE.MeshToonMaterial(p);
      break;
    case 'PointsMaterial':          // 點材質
      m = new THREE.PointsMaterial(p);
      break;
    case 'RawShaderMaterial':       // 原始著色器
      m = new THREE.RawShaderMaterial(p);
      break;
    case 'ShaderMaterial':          // 著色器材質
      m = new THREE.ShaderMaterial(p);
      break;
    case 'ShadowMaterial':          // 陰影材質
      m = new THREE.ShadowMaterial(p);
      m.opacity = p?.opacity ?? 0.2;
      break;
    case 'SpriteMaterial':          // 点精灵材质
      const map = new THREE.TextureLoader().load(p.texture);
      p.map = map
      m = new THREE.SpriteMaterial(p);
      break;
  }
  return m;
}