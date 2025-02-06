# KoPpoMai の移動ログデータを GPSBabel で生成した GeoJSONから生成するスクリプト

このリポジトリは [KoPpoMai](https://ica-abs.copernicus.org/articles/6/220/2023/) のコンテンツに対して使う移動軌跡データ (``Records``) を、GPSBabel で生成された GeoJSON から変換するものです。

## テスト済み動作環境

- GPSログの取得には Android 端末を用いました
  - Google Pixel 8a, Android 15
  - アプリは[GPS Logger](https://play.google.com/store/ap/details?id=eu.basicairdata.graziano.gpslogger)」を用いて、``.gpx`` ファイルとして出力
- 続いて .gpx ファイル(XML) を [GPSBabel](https://www.gpsbabel.org) に読み込ませて、GeoJSON に変換
  - Windows 11 23H2 (Build 22635.3737)
  - GPSBabel 1.10.0
- 最後に、``src\GPSBabelToKoPpoMaiConverter.ts`` を実行します
  - Node.js 20.11.0
  - typescript 5.7.3

## インストール

1. この git リポジトリを clone などでダウンロードします
2. [Node.js](https://nodejs.org/) を導入します (npm も同時にインストールされます)
3. このリポジトリのディレクトリでターミナルを開き ``npm install`` を実行します

## 使い方

1. GPSBabel で、GPSログを GeoJSON の形式に変換します
2. このリポジトリの ``GPSBabelToKoPpomaiConverter.ts`` を開き、``INPUT_FILE_PATH`` に変換後ファイルのパスを入力します
3. ``tsc`` を実行します
  (``/dist`` ディレクトリが作成されているはずです)
4. ``node .\dist\GPSBabelToKoPpoMaiConverter.js`` を実行します
5. 変換後のファイルの出力先が表示されます

## トラブルシューティング

### ``OutFileName`` の生成でエラーが発生する

- GeoBabel で変換後のファイルの ``properties.created_at`` が存在しないことが原因です。
  - ``properties`` キーの中に ``created_at`` キーを作成し、GPSログの作成日時を以下の形式で書いてください。
  - ``YYYY-MM-DDThh:mm:ssStt:mm``
    - ``S`` は対UTCタイムゾーンの符号です
    - ``tt:mm`` はUTCタイムゾーンに対する時差の時間と分で、例えば ``Asia/Tokyo`` なら ``+09:00`` です
  - 例: ``2025-02-03T12:34:56+09:00``

### Error: ENOENT: no such file or directory が出る

- エラーの通り、GeoBabel で変換後のファイルの場所が間違っています。
  - ``src/GPSBabelToKoPpoMaiConverter.ts`` において、``INPUT_FILE_PATH: string`` の値を書き換えてください。
  - その後 ``tsc`` を実行してください。
