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


Welcome to Flow, a service designed to curate a playlist based on your current mood and Spotify history. Simply capture a selfie showing how you feel, and we’ll do the work for you!

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

![Flow Logo][product-screenshot]

We love music and are avid Spotify users, however, we wanted a more personalized experience and we thought this was the perfect opportunity to gain firsthand experience in machine learning as well! Flow is inspired by our passion for creating innovative and exciting software projects- specifically our desire to learn new concepts, frameworks, libraries, and tools used in the present tech industry. 

Flow utilizes Azure Cognitive Services to detect the user’s dominant mood and Spotify Developer's Web API to collect the user’s Spotify history such as their favourite songs, recently played, relevant albums/artists and more. Once all the necessary information is collected, the data is passed to a machine learning algorithm we implemented, known as K-means, to find clusters of songs relevant to the user’s mood and Spotify history.

Certain optimizations made to K-means include using K-means++ to ensure better initialization of the centroids, as well as implementing the silhouette method to find the optimal value of k (number of clusters).




### Built With

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

To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
```sh
npm install npm@latest -g
```

* Spotify Developer Account
```sh
Follow the steps at https://developer.spotify.com/documentation/web-api/quick-start/
```

* Spotify User Account
```sh
Register here https://www.spotify.com/
```

* Azure Cognitive Services Face API
```sh
Create an Azure subscription and head to https://portal.azure.com/#create/Microsoft.CognitiveServicesFace in the Azure Portal to get your key and endpoint
```

### Installation

1. Clone the repo
```sh
git clone https://github.com/ericrkuo/Flow.git
```
2. Install NPM packages
```sh
npm install
```
4. Enter your Azure Face API key and Spotify credentials in a new file called `.env` in the root directory of the code
```JS
AZUREKEY= 'ENTER YOUR AZURE FACE API KEY';
SPOTIFY_API_ID= 'ENTER THE API ID ASSOCIATED WITH YOUR SPOTIFY DEVELOPERS ACCOUNT'
SPOTIFY_CLIENT_SECRET= 'ENTER THE CLIENT SECRET ASSOCIATED WITH YOUR SPOTIFY DEVELOPERS ACCOUNT'
CALLBACK_URL= '<WEB SERVICE URL>/SPOTIFY/CALLBACK'
ACCESS_TOKEN='ENTER THE ACCESS TOKEN ASSOCIATED WITH YOUR SPOTIFY ACCOUNT. THIS IS FOR TESTING PURPOSES'
REFRESH_TOKEN='ENTER THE REFRESH TOKEN ASSOCIATED WTIH YOUR SPOTIFY ACCOUNT. THIS IS FOR TESTING PURPOSES'
```


<!-- USAGE EXAMPLES -->
## Usage

This section is currently unavailable, please refer to the Tutorial tab in our web service for instructions! 


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/ericrkuo/Flow/issues) for a list of proposed features (and known issues).



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

Lily Du - [@LinkedIn](https://www.linkedin.com/in/lilyydu) - lilyyduu@gmail.com

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
[product-screenshot]: https://user-images.githubusercontent.com/54044854/92350204-1d3fd900-f08d-11ea-92e5-05371bf51032.png
