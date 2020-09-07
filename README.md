<!--
*** Thanks for checking out this README Template. If you have a suggestion that would
*** make this better, please fork the repo and create a pull request or simply open
*** an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->





<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LINK -->
## Project Link


<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Welcome to Flow, a service designed to curate a playlist based on your current mood and Spotify history. Simply capture a selfie showing how you feel, and we’ll do the work for you!

Flow utilizes Azure Cognitive Services to detect the user’s dominant mood and Spotify’s Web API to collect the user’s Spotify history such as their favourite songs, recently played, relevant albums/artists and more. Once all the necessary information is collected, the data is passed to a machine learning algorithm we implemented, K-means, to find clusters of songs relevant to the user’s mood and Spotify history.

### Built With
This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.
* [Express](https://expressjs.com/)
* [Azure Cognitive Servces](https://docs.microsoft.com/en-us/azure/cognitive-services/)
* [Spotify for Developers](https://developer.spotify.com/documentation/web-api/)
* [Mocha](https://mochajs.org/)
* [Chai](https://www.chaijs.com/)
* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)
* [Chart.js](https://www.chartjs.org/)



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
```sh
npm install npm@latest -g
```

### Installation

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
```sh
git clone https://github.com/your_username_/Project-Name.git
```
3. Install NPM packages
```sh
npm install
```
4. Enter your API in `config.js`
```JS
const API_KEY = 'ENTER YOUR API';
```



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_



<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Lily Du - [@LinkedIn](linkedin.com/in/lilyydu) - lilyyduu@gmail.com

Eric Kuo - [@LinkedIn](https://www.linkedin.com/in/eric-k-1198b6192/) - ericrkuo@gmail.com

Project Link: [https://github.com/ericrkuo/Flow](https://github.com/ericrkuo/Flow)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Pages](https://pages.github.com)
* [Animate.css](https://daneden.github.io/animate.css)
* [Loaders.css](https://connoratherton.com/loaders)
* [Slick Carousel](https://kenwheeler.github.io/slick)
* [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
* [Sticky Kit](http://leafo.net/sticky-kit)
* [JVectorMap](http://jvectormap.com)
* [Font Awesome](https://fontawesome.com)





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/ericrkuo/Flow.svg?style=flat-square
[contributors-url]: https://github.com/ericrkuo/Flow/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ericrkuo/Flow.svg?style=flat-square
[forks-url]: https://github.com/ericrkuo/Flow/network/members
[stars-shield]: https://img.shields.io/github/stars/ericrkuo/Flow.svg?style=flat-square
[stars-url]: https://github.com/ericrkuo/Flow/stargazers
[issues-shield]: https://img.shields.io/github/issues/ericrkuo/Flow?style=flat-square
[issues-url]: https://github.com/ericrkuo/Flow/issues
[license-shield]: https://img.shields.io/github/license/ericrkuo/Flow?style=flat-square
[license-url]: https://github.com/ericrkuo/Flow/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
