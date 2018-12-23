# Stock returns dashboard

This repo contains source code for a prototype stock returns dashboard, built using React (front-end) and Flask (Python back-end). The backend retrieves stock data using the IEX API. The front-end makes use of Material UI, React Redux for state management and Highcharts for plotting data.

![Alt text](stock_returns_app.png?raw=true "Stock returns app screenshot")

### Getting started (Windows)

* Install python 3.7
* Upgrade pip ```py -m pip install --upgrade pip```
* Install Node.js 

### Building and running Python backend (development mode)

* CD to Python source ```cd src\python```
* Create a virtualenv ```py -m virtualenv env```
* Activate virtualenv ```.\env\Scripts\activate```
* Install requirements ```pip3 install -r requirements.txt```
* Start the backend ```env FLASK_DEBUG=1 python -m flask run --port 5000```

### Building and running the front-end (development mode)

* CD to React source ```cd src\react-app```
* Install dependencies ```npm install```
* Start front-end ```npm start```
