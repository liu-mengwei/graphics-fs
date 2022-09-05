import React from "react"

export const CANVAS_WIDTH = 200
export const CANVAS_HEIGHT = 200

export class CanvasPanel extends React.Component {
  private canvasRef = React.createRef<HTMLCanvasElement>()
  private buffer
  private ctx
  private pitch

  componentDidMount() {
    // 获取像素缓冲
    // 这里就是一个600 * 600的内存缓冲， 其中每个像素占4个字节，有rgba4个通道值、
    // 是一个一维的长数组
    this.ctx = this.canvasRef.current?.getContext('2d');
    this.buffer = this.ctx?.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.pitch = this.buffer?.width * 4; // 每一行占多少个数组个单项 一共是 600 * 4 = 2400个
  }

  putPixel = (_x, _y, color) => {
    // 注意这里的坐标系的转换 ，因为原来的坐标系是画布中心，而canvas是从左上角开始渲染的
    // 但是左上角依然对应着左上角，左下角依然对应着左下角

    const x = CANVAS_WIDTH / 2 + _x;
    const y = CANVAS_HEIGHT / 2 - _y - 1;

    // 边界条件， 因为是从0开始，所以最大的点不会超过599
    if (x < 0 || x >= CANVAS_WIDTH || y < 0 || y >= CANVAS_HEIGHT) {
      return;
    }

    // 算数组的偏移, 先算y轴的偏移，每一行偏移2400，然后再算x轴的偏移
    var offset = 4 * x + this.pitch * y;
    this.buffer.data[offset++] = color[0];
    this.buffer.data[offset++] = color[1];
    this.buffer.data[offset++] = color[2];
    this.buffer.data[offset++] = 255; // 不是透明的
  }

  // 将缓存更新到屏幕上
  updateCanvas = () => {
    this.ctx.putImageData(this.buffer, 0, 0);
  }

  render() {
    return (
      <canvas ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    )
  }
}

export default CanvasPanel