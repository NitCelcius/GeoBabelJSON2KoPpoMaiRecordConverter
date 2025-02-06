// GPSBabel で GeoJSON に変換した JSON を KoPpoMai で読み込めるようにします
// 2025.02.03 @NitCelcius.

import { warn } from "console";
import fs from "fs";

// GPSBabel で GeoJSON に変換したファイルへのパスを入れてください
const INPUT_FILE_PATH: string = "./geojson.json";

export const KoPpoMaiDateRegex =
  /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})([+-]\d{2}:\d{2})/;
export type KoPpoMaiPoint = {
  type: string;
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: number[];
  };
};

export type GPSBabelJSONObject = {
  features: any[];
  type: string;
  properties: {
    created_at: string;
  };
};

export type KoPpoMaiJSONObject = {
  features: any[];
  type: string;
  properties: {
    created_at: string;
  };
};

// ---
const data = JSON.parse(
  fs.readFileSync(INPUT_FILE_PATH, "utf8")
) as GPSBabelJSONObject; // 読み込んで
const KoPpoMaiData = GPSBabelJSONObjectToKoPpoMaiJSONObject(data); // 変換して

// ファイル名に変換
const OutFileName = KoPpoMaiDateToFileDate(KoPpoMaiData.properties.created_at);
fs.writeFileSync(`./${OutFileName}`, JSON.stringify(KoPpoMaiData));
console.log(`${OutFileName} に出力しました`);
// ---

function GPSBabelJSONObjectToKoPpoMaiJSONObject(
  data: GPSBabelJSONObject
): GPSBabelJSONObject {
  const featureLength = data.features.length;

  // geometry 最後以外の properties は空でも必要なので作る
  for (let i = 0; i < featureLength - 1; i++) {
    if (data.features[i]["properties"] === undefined) {
      data.features[i]["properties"] = {};
    }
  }

  // geometry のすべての第3要素を消す
  // 最後以外に適用する
  for (let i = 0; i < featureLength - 1; i++) {
    while (data.features[i]["geometry"]["coordinates"].length > 2) {
      data.features[i]["geometry"]["coordinates"].pop();
    }
  }
  // 続いて最後に適用する
  const tailFeature = data.features[featureLength - 1];
  for (let j = 0; j < tailFeature["geometry"]["coordinates"].length; j++) {
    while (tailFeature["geometry"]["coordinates"][j].length > 2) {
      tailFeature["geometry"]["coordinates"][j].pop();
    }
  }

  // geometry 最後の coordinates を取り出して全部KoPpoMaiの位置参照点オブジェクトにする
  let koPPoMaiPoints: KoPpoMaiPoint[] = [];
  for (let i = 0; i < tailFeature["geometry"]["coordinates"].length; i++) {
    const lat: number = parseFloat(
      tailFeature["geometry"]["coordinates"][i][0]
    );
    const lon: number = parseFloat(
      tailFeature["geometry"]["coordinates"][i][1]
    );

    if (isNaN(lat) || isNaN(lon)) {
      warn(
        "geometry.coordinates の lat または lon が数値ではありません。この要素は無視されます！"
      );
      continue;
    }

    const point = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [lat, lon],
      },
    };
    koPPoMaiPoints.push(point);
  }

  // 最後のオブジェクトが不要になったので消して
  data.features.splice(data.features.length - 1, 1);
  // 代わりに変換後のオブジェクトを追加
  data.features.push(...koPPoMaiPoints);

  // ISO8601 に変換
  if (!KoPpoMaiDateRegex.test(data.properties.created_at)) {
    // KoPpoMai で読み込める形式ではない
    const inputDate = data.properties["created_at"];
    try {
      const KoPpoMaiDateString = GPSBabelDateToKoPpoMaiDate(inputDate);
      data.properties["created_at"] = KoPpoMaiDateString;
    } catch (e) {
      warn(
        `変換できませんでした: ${e.message}\nこのままだとKoPpoMaiでは読み込めませんが、properties.created_at はそのまま出力されます。`
      );
    }
  }
  return data;
}

// TypeScript によるとISO8601形式は
// YYYY-MM-DDTHH:mm:ss.sssZ
// の形式らしいので、KoPpoMai の形式に変換する
// GPSBabel のタイムゾーンの出力形式は
// T+HH:MM
// なので T を消せばいいね
function GPSBabelDateToKoPpoMaiDate(GPSBabelDateString: string): string {
  const GPSBabelDateRegex =
    /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})T([+-]\d{2}:\d{2})/; // だいぶゆるいcaptureをして
  const matched = GPSBabelDateRegex.exec(GPSBabelDateString);
  if (matched === null) {
    throw new Error("properties.created_at がGPSBabelの形式ではありません");
  }
  // Tを抜いただけではあるんだけど
  return `${matched[1]}T${matched[2]}${matched[3]}`;
}

function KoPpoMaiDateToFileDate(KoPpoMaiDateString: string): string {
  // タイムゾーンは「Z」でも日本時間として扱うらしいので、捨てる
  const matched = KoPpoMaiDateRegex.exec(KoPpoMaiDateString);
  if (matched === null) {
    throw new Error("properties.created_at がKoPpoMaiの形式ではありません");
  }
  return `Record-${matched[1]}${matched[2]}${matched[3]}T${matched[4]}${matched[5]}${matched[6]}Z.geojson`;
}
