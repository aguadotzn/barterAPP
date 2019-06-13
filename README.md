>### ⚠This repository was part of my final CS Degree and is not longer on maintenance. 



# BarterAPP: Multiplatform's app for manage business time.


[![Build Status](https://img.shields.io/scrutinizer/build/g/filp/whoops.svg)](https://travis-ci.org/aag0121/barterAPP)
[![GitHub license](https://img.shields.io/hexpm/l/plug.svg)](https://github.com/aag0121/barterAPP/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/npm.svg)]()



[![BarterAPPLogo](./docs/img/barterapp_logo_nobackground.png)](https://github.com/aag0121/barterapp_logo_nobackground)

> http://barterapp.nanoapp.io/


## Built With

This project uses the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)):
* [**M**ongoose.js](http://www.mongoosejs.com) ([MongoDB](https://www.mongodb.com)): database
* [**E**xpress.js](http://expressjs.com): backend framework
* [**A**ngular 4](https://angular.io): frontend framework
* [**N**ode.js](https://nodejs.org): runtime environment

[![angular_node](./docs/img/angular_node.png)](https://github.com/aag0121/angular_node)

Other open source technologies I used in this application are:

* [Ionic 2](https://ionicframework.com/) - Hybrid mobile framework
* [Angular CLI](https://cli.angular.io/) - Tools
* [Angular Material 2](https://material.angular.io/) - Tools
* [Ionic CLI](https://ionicframework.com/docs/cli/) - Tools
* [Ionic Material 2](http://ionicmaterial.com/) - Tools
* [Boostrap 4](https://v4-alpha.getbootstrap.com/) - Tools

## Prerequisites

A device with IOS, Android or Windows Phone for the `/BarterApp-Smartphone` folder (Available one realease for Android).   A computer with internet access for the `/BarterApp-Browser`  folder.

### Prerequisites (Web: BarterAPP-Browser)
1. Install [Node.js](https://nodejs.org) and [MongoDB](https://www.mongodb.com)
2. Install Angular CLI: `npm i -g @angular/cli`
3. From project root folder (BarterAppBrowser) install all the dependencies: `npm i`

### Prerequisites (Hybrid App: BarterAPP-Smartphone)
1. Install [Node.js](https://nodejs.org)
2. Install Ionic: `npm install -g ionic@latest` 
3. Install Cordova: `npm install -g cordova`
3. From project root folder (BarterAppSmartphone) install all the dependencies: `npm i`

## Installation (Both folders)

```sh
$ cd folderwhatyouwant
$ npm install 
```

## Run

### Angular (BarterAPP-Browser)
#### Normal mode
After install packages `npm i` run the following command.
```
npm run start
```

#### Development mode
[Concurrently](https://github.com/kimmobrunfeldt/concurrently) execute MongoDB, Angular build, TypeScript compiler and Express server.
```
npm run dev
```

#### Production mode
Run the project in production mode.
```
npm run prod
```
### Ionic 2 (BarterAPP-Smartphone)
#### Normal mode
After install packages `npm i` run this command:
```
ionic serve
```
#### Development mode
Execute server, compiler and Ionic Builder at the same time. 
```
ionic serve -l -i -c
```




## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

Version 1.0

## Authors

* **A. Aguado** - *Main Work* - [Personal Website](https://about.me/aaguado)
* **Luis R.Izquierdo** - *Main Idea* - [Personal Website](http://www.luis.izqui.org/)


## License
This project is licensed under Apache 2-0 - see the [Apache 2.0 site](https://choosealicense.com/licenses/apache-2.0/) for details

## Acknowledgments

Thanks to all that contribute to this project.

## Notes

Landing page in [english](https://aguadotzn.github.io/barterAPP/) 






