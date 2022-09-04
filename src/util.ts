// 向量点乘 v就是vector
export function dotProduct(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

// 向量减法 指向被减向量
export function subtract(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

// 带入球体的方程，就是向量op的点积等于半径的平方
export function intersectRaySphere(origin, direction, sphere) {
  const co = subtract(origin, sphere.center);

  const k1 = dotProduct(direction, direction);
  const k2 = 2 * dotProduct(co, direction);
  const k3 = dotProduct(co, co) - sphere.radius * sphere.radius;

  const discriminant = k2 * k2 - 4 * k1 * k3;
  if (discriminant < 0) return [Infinity, Infinity];

  const t1 = ((-k2 + Math.sqrt(discriminant)) / 2) * k1;
  const t2 = ((-k2 - Math.sqrt(discriminant)) / 2) * k1;

  return [t1, t2];
}
