# Daily Notion

A simple daily notes application using Notion API

![](./doc/screenshot1.png)

## Features

- You can start taking notes as soon as you open the application.
- Create / Load pages automatically for each date.
- Simple screen
- Real-time saving to Notion automatically.

## Usage

### Install　(for non-developers)

Executables and installers for each OS (Windows, macOS, Linux) will be available soon.

### Authentication on Notion

![](./doc/screenshot_auth.png)

When the program is launched for the first time, a dialog box will appear asking for authorization.

Please refer to [this page](https://developers.notion.com/docs/create-a-notion-integration) to create an integration in your Notion working space.

After you get an integration token and a database ID, enter them and press the "Authentication" button.

### Taking notes

Enjoy.

The notes you write will be saved automatically.

The location of the notes is the database you have selected in Notion.

Saved on a page titled with a date in the format "YY-MM-DD".

## For developers

## Install

1. Install [Rust, Cargo](https://rustup.rs), [Node.js](https://nodejs.org/en/), and [yarn](https://yarnpkg.com)
2. Install Tauri dependencies (cf. <https://tauri.app/v1/guides/getting-started/prerequisites>)
3. Clone this repository like `git clone git@github.com:h1g0/daily-notion.git`
4. `cd daily-notion`
5. `yarn`

## Commands

- Run: `yarn tauri dev`
- Build: `yarn tauri build`
