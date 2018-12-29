import axios from "axios";

export const searchTickers = search => {
  return new Promise((resolve, reject) => {
    axios
      .get("/tickers/search/" + (search ? search : ""))
      .then(response => {
        var tickers = response.data.map(ticker => ({
          value: ticker.symbol,
          label: ticker.name + " (" + ticker.symbol + ")"
        }));

        resolve(tickers);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      })
      .then(() => {});
  });
};

export const getPrices = (symbol, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    axios
      .get("/prices/" + symbol + "/" + startDate + "/" + endDate)
      .then(response => {
        var data = response.data.map(item => [item.date, item.close]);
        resolve(data);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

export const getTickers = async symbols => {
  var tasks = symbols.map(symbol => {
    return getTicker(symbol).then(ticker => {
      return {
        value: ticker.value,
        label: ticker.label
      };
    });
  });
  return await Promise.all(tasks);
};

export const getTicker = symbol => {
  return new Promise((resolve, reject) => {
    axios
      .get("/tickers/" + symbol)
      .then(response => {
        var ticker = response.data.map(ticker => ({
          value: ticker.symbol,
          label: ticker.name + " (" + ticker.symbol + ")"
        }))[0];

        resolve(ticker);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      })
      .then(() => {});
  });
};

export const getReturns = (symbol, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    axios
      .get("/returns/" + symbol + "/" + startDate + "/" + endDate)
      .then(response => {
        var data = response.data.map(item => [item.date, item.return]);
        resolve(data);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

export const getStatistics = (symbol, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    axios
      .get("/statistics/" + symbol + "/" + startDate + "/" + endDate)
      .then(response => {
        var data = response.data;
        resolve(data[0]);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};
