// 定义一个球体
// 主要属性就是中心点，半径，颜色
class Sphere {
  center: number[];
  radius: number;
  color: number[];
  specular: number;

  constructor(center, radius, color, specular) {
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.specular = specular;
  }
}

export default Sphere;
