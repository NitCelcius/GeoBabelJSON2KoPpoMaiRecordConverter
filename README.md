# KoPpoMai の移動ログデータを GPSBabel で生成した GeoJSONから生成するスクリプト

このリポジトリは [KoPpoMai](https://ica-abs.copernicus.org/articles/6/220/2023/) のコンテンツに対して使う移動軌跡データ (``Records``) を、GPSBabel で生成された GeoJSON から変換するものです。

## テスト済み動作環境

- GPSログの取得には Android 端末を用いました
  - Google Pixel 8a, Android 15 (Build AP4A.250205.002)
  - アプリは[GPS Logger](https://play.google.com/store/ap/details?id=eu.basicairdata.graziano.gpslogger)」を用いて、``.gpx`` ファイルとして出力しました
- 続いて .gpx ファイル(XML) を [GPSBabel](https://www.gpsbabel.org) に読み込ませて、GeoJSON に変換します
  - Windows 11 23H2 (Build 22635.3737)
  - GPSBabel 1.10.0
- 最後に、``src\GPSBabelToKoPpoMaiConverter.ts`` を実行します
  - Node.js 20.11.0
  - typescript 5.7.3

## インストール

1. この git リポジトリを git clone コマンドなどでダウンロードします
2. [Node.js](https://nodejs.org/) を導入します (npm も同時にインストールされます)
3. このリポジトリのディレクトリでターミナルを開き ``npm install`` を実行します

なお、このリポジトリでの開発には [PNPm](https://pnpm.io/) を利用しています。コードの編集が必要な際はこちらも導入してください。

## 使い方

1. [GPSBabel](https://www.gpsbabel.org) を用いて、GPSログを GeoJSON の形式に変換します
2. このリポジトリの ``GPSBabelToKoPpoMaiConverter.ts`` を開き、``INPUT_FILE_PATH`` に変換後ファイルのパスを入力します
3. このリポジトリにカレントディレクトリを移動した上で、ターミナルより ``tsc`` を実行します
  (``/dist`` ディレクトリが作成されているはずです)
4. そのまま ``node .\dist\GPSBabelToKoPpoMaiConverter.js`` を実行します
5. 変換後のファイルの出力先が表示されます

## トラブルシューティング

### ``OutFileName`` の生成でエラーが発生する

```plaintext
Error: properties.created_at がKoPpoMaiの形式ではありません
```

- GeoBabel で変換後のファイルの ``properties.created_at`` が存在しないか読み込めない形式であることが原因です。
  - ``properties`` キーの中に ``created_at`` キーを作成し、GPSログの作成日時を以下の形式で書いてください。
  - ``YYYY-MM-DDThh:mm:ssStt:mm``
    - ``S`` は対UTCタイムゾーンの符号です
    - ``tt:mm`` はUTCタイムゾーンに対する時差の時間と分で、例えば ``Asia/Tokyo`` なら ``+09:00`` です
  - 例: ``2025-02-03T12:34:56+09:00``

### ファイルやディレクトリが見当たらないエラーが出る

```plaintext
Error: ENOENT: no such file or directory
```

- エラーの通り、GeoBabel で変換後のファイルの場所が間違っています。
  - ``src/GPSBabelToKoPpoMaiConverter.ts`` において、``INPUT_FILE_PATH: string`` の値を書き換えてください。
  - その後 ``tsc`` を実行してください。
