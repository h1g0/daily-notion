# Daily Notion

A simple daily notes application using Notion API.

## Features

- Just open the application and take notes immediately.
- Real-time saving to Notion automatically.
- Create / Load pages automatically for each date.
- Real-time Markdown preview available.

## Screenshots

Screenshot of the main screen:
![Screenshot of the main screen](./doc/screenshot_v020_light.png)

Dark theme available (Light and dark themes can be switched based on system settings):
![dark theme of the main screen](./doc/screenshot_v020_dark.png)

<!--
GIF video of the main screen (Left window. Notice the real-time saving in Notion on the right):
![Screenshot animation of the main screen](./doc/screenshot_gif.gif)
-->

## Usage

For detailed instructions in Japanese, please see [here](https://zenn.dev/hg/articles/dd9399406f04da).

(日本語での詳細な使い方は[こちら](https://zenn.dev/hg/articles/dd9399406f04da)をご覧下さい。
)

### 1. Install (for non-developers)

#### Windows

1. Download `Daily.Notion_x.x.x_x64_en-US.msi` from [here](https://github.com/h1g0/daily-notion/releases).
2. Run the downloaded msi file.
3. If Microsoft Defender SmartScreen prevents installation, click "More info" then "Run anyway".

#### macOS

1. Download `Daily.Notion.app.tar.gz` from [here](https://github.com/h1g0/daily-notion/releases).
2. Run `xattr -c ./Daily.Notion.app.tar.gz` to avoid "unknown developer" warning.
3. Run `tar xzvf ./Daily.Notion.app.tar.gz` to extract.
4. Execute `Daily Notion.app`.

#### Linux

##### Debian

1. Download `daily-notion_x.x.x_amd64.deb` from [here](https://github.com/h1g0/daily-notion/releases).
2. Run `sudo apt install ./daily-notion_x.x.x_amd64.deb` to install.

##### AppImage

1. Download `daily-notion_x.x.x_amd64.AppImage` from [here](https://github.com/h1g0/daily-notion/releases).
2. Run `chmod u+x daily-notion_x.x.x_amd64.AppImage && ./daily-notion_x.x.x_amd64.AppImage` to execute.

Note: If you want to build from source code for reasons such as building for ARM64 (e.g. Apple Silicon), try [building from source code](#install).

### 2. Authentication on Notion

![Screenshot of the authentication screen](./doc/screenshot_v020_auth.png)

When the program is launched for the first time, a dialog box will appear asking for authentication.

Please refer to [this page](https://developers.notion.com/docs/create-a-notion-integration) to create an integration in your Notion working space.

After you get an integration token and a database ID, enter them and press the "Authentication" button.

### 3. Taking notes

Enjoy.

- The notes you write will be saved automatically.
- The location of the notes is the database you have selected in Notion.
- Saved on a page titled with a date in the format "YY-MM-DD".

## For developers

Any contributions are welcome!

This application is built with the following structure:

- [Rust](https://www.rust-lang.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tauri](https://tauri.app)
- [React](https://reactjs.org)
- [Blueprint](https://blueprintjs.com)
- [react-md-editor](https://uiwjs.github.io/react-md-editor/)
- [Notion API](https://developers.notion.com)

### Install

1. Install [Rust, Cargo](https://rustup.rs), [Node.js](https://nodejs.org/en/), and [yarn](https://yarnpkg.com)
2. Install Tauri dependencies (cf. <https://tauri.app/v1/guides/getting-started/prerequisites>)
3. Clone this repository like `git clone git@github.com:h1g0/daily-notion.git`
4. `cd daily-notion`
5. `yarn`

### Commands

- Run: `yarn tauri dev`
- Build: `yarn tauri build`
