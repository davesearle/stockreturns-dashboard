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

    data = quandl.get("WIKI/" + symbol, start_date=start, end_date=end)
 
    return data.reset_index().to_json(orient='records')

@app.route('/tickers/search/', methods=['GET', 'OPTIONS'])
@app.route('/tickers/search/<search>', methods=['GET', 'OPTIONS'])
def search_tickers(search = None):

    # nasdaq, nyse, amex
    # from http://www.nasdaq.com/screening/companies-by-name.aspx?letter=0&exchange=nasdaq&render=download
    stocks = "EOD_metadata.csv"
    df = pd.read_csv(stocks, sep=',', header=0)

    if(search != None):
        df = df[df['name'].str.contains(search, case=False)]

    return df.head(20).to_json(orient='records')

@app.route('/tickers/<ticker>', methods=['GET', 'OPTIONS'])
def get_ticker(ticker):

    # nasdaq, nyse, amex
    # from http://www.nasdaq.com/screening/companies-by-name.aspx?letter=0&exchange=nasdaq&render=download
    stocks = "EOD_metadata.csv"
    df = pd.read_csv(stocks, sep=',', header=0)
    df = df.loc[df['code'] == ticker]

    return df.to_json(orient='records')

if(__name__ == "__main__"):
    app.run(port=5000)
