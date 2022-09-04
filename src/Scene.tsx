import { useEffect, useRef } from "react";
import CanvasPanel, { CANVAS_HEIGHT, CANVAS_WIDTH } from "./CanvasPanel";
import Sphere from "./Sphere";
import { intersectRaySphere } from "./util";

// 场景布置
const BACKGROUND = [255, 255, 255] // 背景就定义为白色
const DISTANCE_Z = 1 // 投影平面距离摄像机的距离
const VIEWPORT_SIZE = 1 // 投影平面的长宽为1
const CAMERA_POSITION = [0, 0, 0] // 摄像机就定义在原点

// 球体设置
// 注意这里的坐标系设置，z轴正方向是摄影机的方向，右手系
const SPHERES = [
  new Sphere([0, -1, 3], 1, [255, 0, 0]),
  new Sphere([2, 0, 4], 1, [0, 0, 255]),
  new Sphere([-2, 0, 4], 1, [0, 255, 0])
];

// 将画布坐标专成视口坐标，其实就是按比例缩小就好
// 视口宽高就是1
export function canvasToViewport(canvasPoint) {
  return [
    (canvasPoint[0] * VIEWPORT_SIZE) / CANVAS_WIDTH,
    (canvasPoint[1] * VIEWPORT_SIZE) / CANVAS_HEIGHT,
    DISTANCE_Z,
  ];
}

// 这个函数的主要作用就是遍历所有的球体, 找出光线和球体相交的最近的点
// 设置一个光线的出发点（你也可以看成是结束点），设置光线的方向，其实就是摄像机朝向视口某个点的方向
function traceRay(origin, direction, min_t, max_t) {
  let closest_t = Infinity;
  let closest_sphere;

  for (let i = 0; i < SPHERES.length; i++) {
    const ts = intersectRaySphere(origin, direction, SPHERES[i]);
    for (let t of ts) {
      if (t < closest_t && isValid(t)) {
        closest_t = t;
        closest_sphere = SPHERES[i];
      }
    }
  }

  if (!closest_sphere) return BACKGROUND;
  return closest_sphere.color;

  function isValid(t) {
    return min_t < t && max_t > t;
  }
}


function Scene() {
  const canvasRef = useRef(null) as any

  useEffect(() => {
    render()
  }, [])

  // 渲染方法，把颜色数据放到缓冲区
  function render() {
    for (let x = -CANVAS_WIDTH / 2; x < CANVAS_WIDTH / 2; x++) {
      for (let y = - CANVAS_HEIGHT / 2; y < CANVAS_HEIGHT / 2; y++) {
        const direction = canvasToViewport([x, y])
        const color = traceRay(CAMERA_POSITION, direction, 1, Infinity);
        canvasRef?.current.putPixel(x, y, color)
      }
    }

    canvasRef?.current.updateCanvas();
  }

  return <CanvasPanel ref={canvasRef} />
}

export default Scene;