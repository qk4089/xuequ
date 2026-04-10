import {drawDistrict} from "./map/drawDistrict.js";
import {drawSchool} from "./map/drawSchool.js";
// import { drawSchoolDistrictManual } from './map/drawSchoolDistrictManual.js';

AMapLoader.load({
  key: '__AMAP_API_KEY__',
  version: '2.0'
})
.then(AMap => {
  const map = new AMap.Map('container', {
    viewMode: '3D',
    center: [120.657002, 31.317526],
    zoom: 13
  });

  // drawDistrict(map, AMap); // 绘制行政区
  drawSchool(map, AMap);   // 绘制学校
  // drawSchoolDistrictManual(map, AMap, (path, polygon) => {
  //   // path 是手工绘制的经纬度数组
  //   // polygon 是绘制好的对象，可在后续 hover/click 控制显示/隐藏
  //   console.log("回调获取坐标:", path);
  // });
  // AMap.plugin(['AMap.AutoComplete', 'AMap.PlaceSearch'], function () {
  //   // 搜索框自动补全
  //   const autoComplete = new AMap.AutoComplete({
  //     city: '苏州',        // 限定城市
  //     input: 'my_input',    // 输入框 ID
  //   });
  //
  //   // PlaceSearch 设置
  //   const placeSearch = new AMap.PlaceSearch({
  //     pageSize: 5,
  //     pageIndex: 1,
  //     city: '苏州',
  //     citylimit: true,
  //     map: map,
  //     panel: 'my-panel',
  //     autoFitView: true,
  //   });
  //
  //   // 选择某个搜索结果
  //   autoComplete.on('select', function (e) {
  //     // e.poi 里面有基本信息
  //     if (!e.poi) return;
  //
  //     const name = e.poi.name;
  //     const location = e.poi.location; // AMap.LngLat 对象
  //     const pos = [location.lng, location.lat]; // [经度, 纬度]
  //
  //     console.log('选中地点：', name);
  //     console.log('坐标 pos：', pos);
  //
  //     // 调用 PlaceSearch 搜索并显示结果
  //     placeSearch.search(name, function (status, result) {
  //       if (status === 'complete' && result.poiList && result.poiList.pois.length) {
  //         console.log('PlaceSearch 结果：', result.poiList.pois);
  //         result.poiList.pois.forEach(poi => {
  //           console.log('名称:', poi.name, '坐标:', [poi.location.lng, poi.location.lat]);
  //         });
  //       }
  //     });
  //   });
  // });
})
.catch(e => console.error(e));
