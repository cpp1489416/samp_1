
export default {
  environment: {
    mirrorEnabled: true,
    ambientLightIntensity: 0.1,
    directionLight: {
      enabled: true,
      direction: [0, 0, 1],
      color: [1, 1, 1],
      intensity: 0.8
    }
  },
  camera: {
    projectionType: 'perspective',
    moveType: 'land_object',
    position: [80, 30, -80],
    up: [0, 1, 0],
    target: [0, 30, 0],
    fovy: 3.14 / 4,
    near: 0.01,
    far: 10000
  },
  models: [
    {
      name: 'mesh',
      type: 'obj_mesh',
      url: './static/models/tails/Tails.obj',
      transform: {
        position: [20, 0, 0],
        scaling: [3, 3, 3]
      }
    },
    {
      name: 'mirror',
      type: 'obj_mesh_mirror',
      url: './static/models/mirror/mirror.obj',
      transform: {
        scaling: [2, 2, 1],
        position: [-40, 0, 0],
        rotation: [0, 100, 0]
      }
    },
    {
      name: 'mirror2',
      type: 'obj_mesh_mirror',
      url: './static/models/mirror2/mirror.obj',
      visible: false,
      transform: {
        position: [21.0, 10.0, 20.0],
        scaling: [20, 4, 1],
        rotation: [-20.0, 5.0, 5.0]
      }
    },
    {
      name: 'anchor',
      type: 'anchor',
      transform: {
        scaling: [50, 50, 50],
        scaling_back: [50, 50, 50]
      }
    },
    {
      name: 'pancateee',
      type: 'obj_mesh',
      url: './static/models/stair/stair.obj',
      transform: {
        position: [10, 0, 40],
        rotation: [0, 45, 45]
      }
    },
    {
      name: 'pancat',
      type: 'obj_mesh',
      url: './static/models/pancat/pancat.obj',
      transform: {
        position: [40, 0, 0],
        rotation: [0, 45, 45]
      }
    },
    {
      name: 'pancat',
      type: 'obj_mesh',
      visible: false,
      url: './static/models/loco1/loco1.obj',
      transform: {
        //    position: [40, 0, 0],
        // rotation: [-90, 0, 90]
        scaling: [4, 4, 4],
        rotation: [0, -45, 0]
      }
    },
    {
      visible: true,
      name: 'sphere',
      type: 'obj_mesh',
      url: './static/models/sphere/sphere.obj'
    }
  ]
}
