import { LightType } from "./Light";
import { LIGHTS, SPHERES } from "./Scene";

// 向量点乘 v就是vector
export function dotProduct(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

// 向量减法 指向被减向量
export function subtract(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

// 向量加法
export function add(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

// 向量的标量乘法
export function multiply(k, v) {
  return [k * v[0], k * v[1], k * v[2]];
}

// 计算反射向量
export function reflectRay(v1, v2) {
  return subtract(multiply(2 * dotProduct(v1, v2), v1), v2);
}

// 向量的长度 就等于向量的点积开根号
export function vlength(v) {
  return Math.sqrt(dotProduct(v, v));
}

// 让颜色在正常的范围内
export function Clamp(vec) {
  return [
    Math.min(255, Math.max(0, vec[0])),
    Math.min(255, Math.max(0, vec[1])),
    Math.min(255, Math.max(0, vec[2])),
  ];
}

// 带入球体的方程，就是向量op的点积等于半径的平方
export function intersectRaySphere(origin, direction, sphere) {
  const co = subtract(origin, sphere.center);

  const k1 = dotProduct(direction, direction);
  const k2 = 2 * dotProduct(co, direction);
  const k3 = dotProduct(co, co) - sphere.radius * sphere.radius;

  const discriminant = k2 * k2 - 4 * k1 * k3;
  if (discriminant < 0) return [Infinity, Infinity];

  const t1 = (-k2 + Math.sqrt(discriminant)) / (2 * k1);
  const t2 = (-k2 - Math.sqrt(discriminant)) / (2 * k1);

  return [t1, t2];
}

export const MIN_T = 0.1;

// 返回光照强度
export function computeLight(point, normal, view, specular) {
  let intensity = 0;
  let l;

  for (let light of LIGHTS) {
    // 如果是环境光则直接相加就好
    let max_t;
    if (light.type === LightType.AMBIENT) {
      intensity += light.intensity;
      continue;
    }

    // 点光源
    if (light.type === LightType.POINT) {
      l = subtract(light.position, point);
      max_t = 1;
    }

    // 方向光
    if (light.type === LightType.DIRECTIONAL) {
      l = light.position;
      max_t = Infinity;
    }

    // 计算阴影，查看光线是否被遮挡
    // 这个MIN_T的意思其实就是不能报括本球体
    const blocker = closestIntersection({
      origin: point,
      direction: l,
      spheres: SPHERES,
      min_t: MIN_T,
      max_t,
    });

    if (blocker[0]) continue;

    // 漫反射
    const _intensity =
      (light.intensity * dotProduct(normal, l)) /
      (vlength(normal) * vlength(l));
    // 忽略负值 相当于是球体里面照进来的，忽略
    if (_intensity > 0) intensity += _intensity;

    // 镜面反射
    if (specular !== -1) {
      // 计算反射r向量
      const r = reflectRay(normal, l);
      const r_dot_v = dotProduct(r, view);
      if (r_dot_v > 0) {
        intensity +=
          light.intensity *
          Math.pow(r_dot_v / (vlength(r) * vlength(view)), specular);
      }
    }
  }

  // 最大不超过1
  if (intensity > 1) intensity = 1;

  return intensity;
}

// 计算光线和球体的交点
export function closestIntersection({
  origin,
  direction,
  spheres,
  min_t,
  max_t,
}) {
  function isValid(t) {
    return min_t < t && max_t > t;
  }

  let closest_t = Infinity;
  let closest_sphere;

  for (let i = 0; i < spheres.length; i++) {
    const ts = intersectRaySphere(origin, direction, spheres[i]);
    for (let t of ts) {
      if (t < closest_t && isValid(t)) {
        closest_t = t;
        closest_sphere = spheres[i];
      }
    }
  }

  if (closest_sphere) {
    return [closest_sphere, closest_t];
  }

  return [null, null];
}
