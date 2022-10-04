import { useEffect, useRef } from "react";
import CanvasPanel, { CANVAS_HEIGHT, CANVAS_WIDTH } from "./CanvasPanel";
import Light, { LightType } from "./Light";
import Sphere from "./Sphere";
import {
  Clamp,
  closestIntersection,
  computeLight,
  MIN_T,
  reflectRay,
  vlength
} from "./util";
import { add, multiply, subtract } from "./vector";

// 场景布置
const BACKGROUND = [0, 0, 0] // 背景就定义为白色
const DISTANCE_Z = 1 // 投影平面距离摄像机的距离
const VIEWPORT_SIZE = 1 // 投影平面的长宽为1
const CAMERA_POSITION = [0, 0, 0] // 摄像机就定义在原点
const DEPTH = 2 // 反射递归深度

// 球体设置
// 注意这里的坐标系设置，z轴正方向是摄影机的方向，右手系
export const SPHERES = [
  new Sphere([0, -1, 3], 1, [255, 0, 0], 500, 0.2),
  new Sphere([-2, 0, 4], 1, [0, 255, 0], 10, 0.4),
  new Sphere([2, 0, 4], 1, [0, 0, 255], 500, 0.3),
  new Sphere([0, -5001, 0], 5000, [255, 255, 0], 1000, 0.5)
];

export const LIGHTS = [
  new Light(LightType.AMBIENT, 0.2),
  new Light(LightType.POINT, 0.6, [2, 1, 0]),
  new Light(LightType.DIRECTIONAL, 0.2, [1, 4, 4])
]

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
function traceRay(origin, direction, min_t, max_t, depth) {
  const [closest_sphere, closest_t] = closestIntersection({
    origin,
    direction,
    min_t,
    max_t,
    spheres: SPHERES
  })

  if (!closest_sphere) return BACKGROUND;

  // 求得交点P
  const point = add(origin, multiply(closest_t, direction))

  // 求得球体的法向量
  let normal = subtract(point, closest_sphere.center)
  // 除以向量的模等于单位向量
  normal = multiply(1 / vlength(normal), normal)

  const view = multiply(-1, direction)
  // 计算光的强度
  const light = computeLight(
    point,
    normal,
    view,
    closest_sphere.specular
  )
  const local_color = multiply(light, closest_sphere.color)
  // 如果到了递归深度或者不反射
  if (depth === 0 || closest_sphere.reflective === 0) return local_color

  // 计算反射效果
  const reflect_ray = reflectRay(normal, view)
  const reflect_color = traceRay(point, reflect_ray, MIN_T, Infinity, depth - 1)

  // 标量颜色乘法, 本球体颜色和反射颜色取加权
  return add(multiply(1 - closest_sphere.reflective, local_color),
    multiply(closest_sphere.reflective, reflect_color));
}

function Scene() {
  const canvasRef = useRef(null) as any
  const positionRef = useRef(CAMERA_POSITION)
  const STEP = 0.1

  useEffect(() => {
    render()
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      const po = positionRef.current
      switch (e.key) {
        case 'ArrowUp':
          positionRef.current = [po[0], po[1] + STEP, po[2]]
          break
        case 'ArrowDown':
          positionRef.current = [po[0], po[1] - STEP, po[2]]
          break
        case 'ArrowLeft':
          positionRef.current = [po[0] - STEP, po[1], po[2]]
          break
        case 'ArrowRight':
          positionRef.current = [po[0] + STEP, po[1], po[2]]
          break
      }
      console.log(positionRef.current, 'current')
      render()
    })
  }, [])


  // 渲染方法，把颜色数据放到缓冲区
  function render() {
    for (let x = -CANVAS_WIDTH / 2; x < CANVAS_WIDTH / 2; x++) {
      for (let y = - CANVAS_HEIGHT / 2; y < CANVAS_HEIGHT / 2; y++) {
        const direction = canvasToViewport([x, y])
        const color = traceRay(positionRef.current, direction, 1, Infinity, DEPTH);
        canvasRef?.current.putPixel(x, y, Clamp(color))
      }
    }

    canvasRef?.current.updateCanvas();
  }

  return <CanvasPanel ref={canvasRef} />
}

export default Scene;