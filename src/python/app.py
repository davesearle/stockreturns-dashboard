from flask import Flask
from flask_cors import CORS
import pandas as pd
import json
import datetime
from iexfinance.stocks import get_historical_data
from iexfinance import get_available_symbols

app = Flask(__name__)
CORS(app)

@app.route('/prices/timeseries/<symbol>/<start>/<end>', methods=['GET', 'OPTIONS'])
def prices_timeseries(symbol, start, end):

    df = get_historical_data(symbol, start, end, output_format='pandas')
    df = df["close"]
    
    return df.reset_index().to_json(orient='records')

@app.route('/prices/metrics/<symbol>/<date>', methods=['GET', 'OPTIONS'])
def prices_metrics(symbol, date):

    close_prices = get_historical_data(symbol, date, date, output_format='pandas')
    close_prices = close_prices.tail(1)

    df = pd.read_json("symbols.json", orient='columns')
    df = df.loc[df['symbol'] == symbol]

    close_prices["symbol"] = symbol
    close_prices["name"] = df.iloc[0]['name']
    close_prices["date"] = date

    return close_prices.to_json(orient='records')

@app.route('/returns/timeseries/<symbol>/<start>/<end>', methods=['GET', 'OPTIONS'])
def returns_timeseries(symbol, start, end):

    df = get_historical_data(symbol, start, end, output_format='pandas')

    close_prices = pd.DataFrame({"return": df["close"]})
    stock_returns = close_prices.apply(lambda x: x / x[0]) - 1
    stock_returns = (stock_returns * 100).round(2)

    return stock_returns.reset_index().to_json(orient='records')

@app.route('/returns/metrics/<symbol>/<start>/<end>', methods=['GET', 'OPTIONS'])
def returns_metrics(symbol, start, end):

    df = get_historical_data(symbol, start, end, output_format='pandas')

    close_prices = pd.DataFrame({"return": df["close"]})
    stock_returns = close_prices.apply(lambda x: x / x[0]) - 1
    stock_returns = (stock_returns * 100).round(2)
    stock_returns = stock_returns.tail(1)

    df = pd.read_json("symbols.json", orient='columns')
    df = df.loc[df['symbol'] == symbol]

    stock_returns["symbol"] = symbol
    stock_returns["name"] = df.iloc[0]['name']
    stock_returns["startDate"] = start
    stock_returns["endDate"] = end

    return stock_returns.to_json(orient='records')

@app.route('/tickers/search/', methods=['GET', 'OPTIONS'])
@app.route('/tickers/search/<search>', methods=['GET', 'OPTIONS'])
def search_tickers(search = None):

    df = pd.read_json("symbols.json", orient='columns')

    if(search != None):
        df = df[df['name'].str.contains(search, case=False)]

    return df.head(20).to_json(orient='records')

@app.route('/tickers/<ticker>', methods=['GET', 'OPTIONS'])
def get_ticker(ticker):

    df = pd.read_json("symbols.json", orient='columns')
    df = df.loc[df['symbol'] == ticker]

    return df.to_json(orient='records')

if(__name__ == "__main__"):
    app.run(port=5000)
