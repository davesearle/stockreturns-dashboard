from flask import Flask
from flask_cors import CORS
import pandas as pd
import quandl
import datetime
import json

app = Flask(__name__)
CORS(app)

with open("quandl-key.txt") as f:
    quandl.ApiConfig.api_key = f.read()

@app.route('/prices/<symbol>', methods=['GET', 'OPTIONS'])
def prices(symbol):
    start = datetime.datetime(2018,1,1)
    end = datetime.date.today()

    df = quandl.get("WIKI/" + symbol, start_date=start, end_date=end)
    df.index.names = ['date']
    df.rename(columns={"Adj. Close": "close"}, inplace=True)
    df = df["close"]
    
    return df.reset_index().to_json(orient='records')

@app.route('/returns/<symbol>', methods=['GET', 'OPTIONS'])
def returns(symbol):
    start = datetime.datetime(2018,1,1)
    end = datetime.date.today()

    df = quandl.get("WIKI/" + symbol, start_date=start, end_date=end)
    df.index.names = ['date']
    df.rename(columns={"Adj. Close": "close"}, inplace=True)

    close_prices = pd.DataFrame({"return": df["close"]})
    stock_returns = close_prices.apply(lambda x: x / x[0]) - 1
    stock_returns = (stock_returns * 100).round(2)

    return stock_returns.reset_index().to_json(orient='records')

@app.route('/tickers/search/', methods=['GET', 'OPTIONS'])
@app.route('/tickers/search/<search>', methods=['GET', 'OPTIONS'])
def search_tickers(search = None):
    stocks = "quandl-tickers.csv"
    df = pd.read_csv(stocks, sep=',', header=0)

    if(search != None):
        df = df[df['name'].str.contains(search, case=False)]

    return df.head(20).to_json(orient='records')

@app.route('/tickers/<ticker>', methods=['GET', 'OPTIONS'])
def get_ticker(ticker):
    stocks = "quandl-tickers.csv"
    df = pd.read_csv(stocks, sep=',', header=0)
    df = df.loc[df['code'] == ticker]

    return df.to_json(orient='records')

if(__name__ == "__main__"):
    app.run(port=5000)
