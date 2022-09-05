import Light, { LightType } from "./Light";

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

// 向量的长度 就等于向量的点积开根号
export function vlength(v) {
  return Math.sqrt(dotProduct(v, v));
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

// 返回光照强度
export function computeLight(point, normal, lights: Light[]) {
  let intensity = 0;
  let l;

  for (let light of lights) {
    // 如果是环境光则直接相加就好
    if (light.type === LightType.AMBIENT) {
      intensity += light.intensity;
      continue;
    }

    // 点光源
    if (light.type === LightType.POINT) {
      l = subtract(light.position, point);
    }

    // 方向光
    if (light.type === LightType.DIRECTIONAL) {
      l = light.position;
    }

    const _intensity =
      (light.intensity * dotProduct(normal, l)) /
      (vlength(normal) * vlength(l));
    // 忽略负值 相当于是球体里面照进来的，忽略
    if (_intensity > 0) intensity += _intensity;
  }

  // 最大不超过1
  if (intensity > 1) intensity = 1;

  return intensity;
}
