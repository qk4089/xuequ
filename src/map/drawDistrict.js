import {yuanqu} from '../data/poi.js'; // 相对路径

export function drawDistrict(map, AMap) {
  AMap.plugin(['AMap.DistrictSearch'], function () {
    const district = new AMap.DistrictSearch({
      level: 'district',
      extensions: 'all'
    });
    district.search('姑苏区', function (status, result) {
      if (status === "complete" && result.districtList.length) {
        const bounds = result.districtList[0].boundaries;
        for (let i = 0; i < bounds.length; i++) {
          const polygon = new AMap.Polygon({
            map: map, //显示该覆盖物的地图对象
            bubble: true,
            strokeWeight: 2, //轮廓线宽度
            path: bounds[i], //多边形轮廓线的节点坐标数组
            fillOpacity: 0.5, //多边形填充透明度
            fillColor: '#CCF3FF', //多边形填充颜色
            strokeColor: '#2b8cbe', //线条颜色
          })
        }
      }
    });

    const poi = yuanqu.coordinates[0]
    for (let i = 0; i < poi.length; i++) {
      const polygon = new AMap.Polygon({
        map: map, //显示该覆盖物的地图对象
        bubble: true,
        strokeWeight: 2, //轮廓线宽度
        path: poi[i], //多边形轮廓线的节点坐标数组
        fillOpacity: 0.5, //多边形填充透明度
        fillColor: '#FCE4EC', //多边形填充颜色
        strokeColor: '#FF33CC', //线条颜色
      })
    }
  })

}
