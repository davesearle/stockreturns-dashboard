import axios from "axios";

const searchTickers = search => {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/tickers/search/" + (search ? search : ""))
      .then(response => {
        const tickers = response.data.map(ticker => ({
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

const getTickers = async symbols => {
  const tasks = symbols.map(symbol => {
    return getTicker(symbol).then(ticker => {
      return {
        value: ticker.value,
        label: ticker.label
      };
    });
  });
  return await Promise.all(tasks);
};

const getTicker = symbol => {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/tickers/" + symbol)
      .then(response => {
        const ticker = response.data.map(ticker => ({
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

export default {
  searchTickers,
  getTickers,
  getTicker
};
