import { schools } from "../data/schools.js";
import { schoolDistricts } from "../data/schoolDistricts.js";

export function drawSchool(map, AMap) {
  const typeColor = { "小学": "#fadb14", "初中": "#1890ff" };
  const innerSize = 32;
  const infoOffsetY = 200; // infoWindow 不挡施教区

  const infoWindow = new AMap.InfoWindow({
    isCustom: true,
    offset: new AMap.Pixel(0, -infoOffsetY),
  });

  // polygon 缓存
  const districtPolygons = {};
  schoolDistricts.forEach(school => {
    districtPolygons[school.name] = new AMap.Polygon({
      path: school.path,
      fillColor: '#FCE4EC',
      fillOpacity: 0.5,
      strokeColor: '#FF33CC',
      strokeWeight: 2,
      map: null
    });
  });

  let clickedDistrict = null;

  function showDistrict(name) {
    const polygon = districtPolygons[name];
    if (!polygon) return;
    if (clickedDistrict === polygon) return;
    polygon.setMap(map);
  }

  function hideDistrict(name) {
    const polygon = districtPolygons[name];
    if (!polygon) return;
    if (clickedDistrict === polygon) return;
    polygon.setMap(null);
  }

  function clickDistrict(name) {
    // 先关闭所有 polygon
    Object.values(districtPolygons).forEach(p => p.setMap(null));

    const polygon = districtPolygons[name];
    if (!polygon) return;

    polygon.setMap(map);
    clickedDistrict = polygon;
  }

  function resetClickedDistrict() {
    Object.values(districtPolygons).forEach(p => p.setMap(null));
    clickedDistrict = null;
  }

  // 绘制 marker
  schools.forEach(school => {
    const types = Object.keys(school.type);
    const bestRank = Math.min(...Object.values(school.type));
    const positions = Array.isArray(school.pos[0]) ? school.pos : [school.pos];
    const isTop = bestRank === 1;
    const border = isTop ? "2px solid #ff6b6b" : "none";

    positions.forEach(position => {
      let innerContent = "";
      if (types.length === 1) {
        innerContent = `
          <div style="
            width:${innerSize}px;
            height:${innerSize}px;
            background:${typeColor[types[0]]};
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#fff;
            font-weight:bold;
            font-size:14px;
            border:${border};
          ">${types[0] === "小学" ? "小" : "初"}</div>
        `;
      } else {
        innerContent = `
          <div style="
            width:${innerSize}px;
            height:${innerSize}px;
            border-radius:50%;
            overflow:hidden;
            border:${border};
            display:flex;
          ">
            <div style="
              width:50%;
              background:${typeColor["小学"]};
              display:flex;
              align-items:center;
              justify-content:center;
              color:#fff;
              font-weight:bold;
              font-size:12px;
            ">小</div>
            <div style="
              width:50%;
              background:${typeColor["初中"]};
              display:flex;
              align-items:center;
              justify-content:center;
              color:#fff;
              font-weight:bold;
              font-size:12px;
            ">初</div>
          </div>
        `;
      }

      const marker = new AMap.Marker({
        position,
        map,
        offset: new AMap.Pixel(-innerSize / 2, -innerSize / 2),
        content: innerContent
      });

      marker.setLabel({
        direction: "bottom",
        offset: new AMap.Pixel(0, 6),
        content: `<div style="font-size:12px; font-weight:600; color:#333; text-align:center;">${school.name}</div>`
      });

      // hover 显示 polygon
      marker.on("mouseover", () => showDistrict(school.name));
      marker.on("mouseout", () => hideDistrict(school.name));

      // 点击 marker
      marker.on("click", (e) => {
        clickDistrict(school.name);

        const infoTypes = types.map(t => `${t} Rank ${school.type[t]}`).join("<br>");
        const infoContent = `
          <div style="
            min-width:200px;
            padding:12px;
            border-radius:8px;
            background:#fff;
            box-shadow:0 4px 12px rgba(0,0,0,0.25);
            font-size:14px;
          ">
            <div style="font-size:16px; font-weight:700; margin-bottom:6px;">
              ${school.fullName || school.name}
            </div>
            <div>类型：${types.join(" / ")}</div>
            <div>等级：${infoTypes}</div>
            ${school.tag ? `<div style="margin-top:6px;color:#666;">标签：${school.tag.join(" / ")}</div>` : ""}
          </div>
        `;
        infoWindow.setContent(infoContent);
        infoWindow.open(map, e.target.getPosition());
      });
    });
  });

  // 点击空白处关闭所有
  map.on("click", () => {
    infoWindow.close();
    resetClickedDistrict();
  });
}