# AstronewsUI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.2.

## About

A simple web app that visualizes data from the NASA API and SpaceflightAPI.

## Table of Contents
- [Installation](#installation)
- [Run locally](#run-locally)
- [Usage](#usage)
- [License](#license)
- [List of used APIs](#list-of-used-apis)

## Installation

Download [Node.JS](https://nodejs.org/en/download/package-manager)\
Install [Angular CLI](https://angular.dev/tools/cli/setup-local): `npm install -g @angular/cli`\
Clone the repo: `git clone https://github.com/Needlide/Astronews.UI.git`\
Navigate to the project directory: `cd repo`\
Install dependencies: `npm install`

## Run locally

Obtain the API key at [NASA Open APIs](https://api.nasa.gov/#signUp)\
Create a new file `src/environments/environment.ts` and copy code from `environment.prod.ts` to newly created `environment.ts`\
Put your API key from [NASA Open APIs](https://api.nasa.gov/#signUp) in the `secrets/api_key` section like this: `api_key: YOUR_API_KEY_GOES_HERE`\
Save the file

## Usage

For advanced usage of the search bar append the prefix before the search term\
Prefix must be split from the search term by semicolon `:`\
Example: `t: NASA` - will search for titles which contain keyword `NASA`

Here is the list of prefixes used on different pages (News, Curiosity, NASA, APOD):

- **News**
  - No prefix - search by title and summary
  - `t` - search by title
  - `ns` - search by news site
  - `s` - search by summary
  - `p` - search by published before and published after dates (dates in `yyyy-mm-dd` format split with comma `,`)
  - `pb` - search by published before date (`yyyy-mm-dd` format)
  - `pa` - search by published after date (`yyyy-mm-dd` format)

## License

This project is licensed under the [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).

## List of used APIs

- [APOD](https://github.com/nasa/apod-api)
- [Mars Rover Photos](https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY)
- [NASA Image and Video Library](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)
- [Spaceflight News API](https://www.spaceflightnewsapi.net/)
