from flask import Flask
from flask_cors import CORS
import pandas as pd
import json
import datetime
from iexfinance.stocks import get_historical_data
from iexfinance import get_available_symbols

app = Flask(__name__)

# enable cross-origin requests for all domains
CORS(app)

@app.route('/api/prices/timeseries/<symbol>/<start>/<end>', methods=['GET', 'OPTIONS'])
def prices_timeseries(symbol, start, end):

    # fetch historical data from iex for the specified symbol 
    df = get_historical_data(symbol, start, end, output_format='pandas')

    # we just want the close prices
    df = df["close"]
    
    # we are using reset_index here to include the date column in the json response
    return df.reset_index().to_json(orient='records')

@app.route('/api/prices/metrics/<symbol>/<date>', methods=['GET', 'OPTIONS'])
def prices_metrics(symbol, date):

    # get the symbol metadata
    symbols = pd.read_json("symbols.json", orient='columns')
    symbols = symbols.loc[symbols['symbol'] == symbol]

    # fetch the close prices and add the symbol metadata
    close_prices = get_historical_data(symbol, date, date, output_format='pandas')
    close_prices = close_prices.tail(1)
    close_prices["symbol"] = symbol
    close_prices["name"] = symbols.iloc[0]['name']
    close_prices["date"] = date

    return close_prices.to_json(orient='records')

@app.route('/api/returns/timeseries/<symbol>/<start>/<end>', methods=['GET', 'OPTIONS'])
def returns_timeseries(symbol, start, end):

    # fetch historical data
    df = get_historical_data(symbol, start, end, output_format='pandas')

    # create a new data frame using the close price
    close_prices = pd.DataFrame({"return": df["close"]})

    # calculate the cumulative returns
    stock_returns = close_prices.apply(lambda x: x / x[0]) - 1

    # convert to percentage and round to 2dp
    stock_returns = (stock_returns * 100).round(2)

    return stock_returns.reset_index().to_json(orient='records')

@app.route('/api/returns/metrics/<symbol>/<start>/<end>', methods=['GET', 'OPTIONS'])
def returns_metrics(symbol, start, end):

    # fetch historical data
    df = get_historical_data(symbol, start, end, output_format='pandas')

    # create a new data frame using the close price
    close_prices = pd.DataFrame({"return": df["close"]})

    # we are just interested in the first and last rows
    close_prices = close_prices.iloc[[0, -1]]

    # calculate the cumulative return
    stock_returns = close_prices.apply(lambda x: x / x[0]) - 1
    stock_returns = (stock_returns * 100).round(2)

    # we just want the last row 
    stock_returns = stock_returns.tail(1)

    # get symbol metadata
    symbols = pd.read_json("symbols.json", orient='columns')
    symbols = symbols.loc[symbols['symbol'] == symbol]

    # add symbol metadata to response
    stock_returns["symbol"] = symbol
    stock_returns["name"] = symbols.iloc[0]['name']
    stock_returns["startDate"] = start
    stock_returns["endDate"] = end

    return stock_returns.to_json(orient='records')

@app.route('/api/tickers/search/', methods=['GET', 'OPTIONS'])
@app.route('/api/tickers/search/<search>', methods=['GET', 'OPTIONS'])
def search_tickers(search = None):

    df = pd.read_json("symbols.json", orient='columns')

    # search the symbol and name columns
    if(search != None):
        df = df[df['symbol'].str.contains(search, case=False) | df['name'].str.contains(search, case=False)]

    # return the 1st 20 matches, sort by the symbol ascending
    return df.sort_values(['symbol'], ascending=[1]).head(20).to_json(orient='records')

@app.route('/api/tickers/<ticker>', methods=['GET', 'OPTIONS'])
def get_ticker(ticker):

    # get symbol metadata for specified ticker
    df = pd.read_json("symbols.json", orient='columns')
    df = df.loc[df['symbol'] == ticker]

    return df.to_json(orient='records')

if(__name__ == "__main__"):
    app.run(port=5000,host='0.0.0.0')
