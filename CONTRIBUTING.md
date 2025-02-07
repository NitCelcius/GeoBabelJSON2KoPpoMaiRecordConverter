# CONTRIBUTING.md

このファイルは Contribution を行う際のガイドラインを規定しています。

## 基本方針

このリポジトリは GeoBabel v1.10.0 で出力される GeoJSON 形式を限定的に KoPpoMai の Travel Record で読み取れるように変換するスクリプトを含んでいます。

> [!IMPORTANT]
> 動作環境外 (GPSログを取るのに別のアプリを使う、GeoBabel のバージョンが異なるなど...) での動作は一切保障していません。

これらの前提を保った上でのコードの変更を受け付けます。ただし、バージョンアップによる仕様変更に対応するなどの変更は歓迎します。

## 困ったことがあったら？

- バグや問題点、改善すべき点などは [issues](https://github.com/NitCelcius/GeoBabelJSON2KoPpoMaiRecordConverter/issues) に記載してください。
- コードの変更を行う際 **``main`` ブランチへ直接 commit を行うことはできません**。新しいブランチを作成したのち [Pull Request を開く](https://github.com/NitCelcius/GeoBabelJSON2KoPpoMaiRecordConverter/pulls)ことで main ブランチへコミットを追加できます。

## 開発を始めるには

以下の手順で開発環境をインストールしてください。

1. この [git リポジトリ](https://github.com/NitCelcius/GeoBabelJSON2KoPpoMaiRecordConverter.git)を git clone コマンドなどでダウンロードします
2. [Node.js](https://nodejs.org/) を導入します (npm も同時にインストールされますが、使いません)
3. [PNPm](https://pnpm.io/) を導入します
4. このリポジトリのディレクトリでターミナルを開き ``pnpm install`` を実行します

## 前提とする使い方

1. [GPSBabel](https://www.gpsbabel.org) を用いて、GPSログを GeoJSON の形式に変換します
2. このリポジトリの ``GPSBabelToKoPpoMaiConverter.ts`` を開き、``INPUT_FILE_PATH`` に変換後ファイルのパスを入力します
3. このリポジトリにカレントディレクトリを移動した上で、ターミナルより ``tsc`` を実行します
  (``/dist`` ディレクトリが作成されているはずです)
4. そのまま ``node .\dist\GPSBabelToKoPpoMaiConverter.js`` を実行します
5. 変換後のファイルの出力先が表示されます

