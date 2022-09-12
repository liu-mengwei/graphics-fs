class Light {
  // 光照类型
  public type: number = 0
  // 光照抢断
  public intensity: number = 0
  // 光的位置, 针对点光源来说，就是光的位置，针对方向光源，就是光的方向
  public position?: number[] = null

  constructor(type, intensity, position?) {
    this.type = type
    this.intensity = intensity
    this.position = position
  }
}

export enum LightType {
  AMBIENT, // 假定空间中有强度相同的光源，各种光线会散射使空间均匀分布环境光，是一种近似
  POINT, // 点光源
  DIRECTIONAL // 方向光源
}

export default Light