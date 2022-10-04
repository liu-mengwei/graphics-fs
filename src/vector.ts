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

// 向量叉积
export function crossProduct(v1, v2) {}
