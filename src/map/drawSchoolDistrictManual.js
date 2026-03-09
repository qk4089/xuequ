// drawSchoolDistrictManual.js
// 适配高德 2.0
export function drawSchoolDistrictManual(map, AMap, callback) {
  AMap.plugin(['AMap.MouseTool'], () => {
    const mouseTool = new AMap.MouseTool(map);

    // 开启多边形绘制模式
    mouseTool.polygon({});

    // 绘制完成事件
    mouseTool.on('draw', function(e) {
      const polygon = e.obj;          // 绘制完成的 polygon 对象
      const path = polygon.getPath(); // 获取坐标数组（AMap.LngLat 对象数组）

      // 转成经纬度数组 [[lng, lat], [lng, lat], ...]
      const pos = path.map(p => [p.lng, p.lat]);

      console.log('施教区 pos:', pos);

      // 返回坐标
      if (callback && typeof callback === 'function') {
        callback(pos);
      }

      // 关闭鼠标绘制模式
      mouseTool.close();

      // 不在地图上显示 polygon
      map.remove(polygon);
    });
  });
}