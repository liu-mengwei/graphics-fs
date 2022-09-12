// 定义一个球体
// 主要属性就是中心点，半径，颜色
class Sphere {
  center: number[];
  radius: number;
  color: number[];
  specular: number;
  reflective: number;
  radius2: number;

  constructor(center, radius, color, specular, reflective) {
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.specular = specular;
    this.reflective = reflective;

    // 缓存
    this.radius2 = radius * radius;
  }
}

export default Sphere;
