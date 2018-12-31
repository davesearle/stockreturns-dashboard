export const SYMBOLS_SELECTED = "SYMBOLS_SELECTED";
export const DATE_RANGE_SELECTED = "DATE_RANGE_SELECTED";
export const DATE_SELECTED = "DATE_SELECTED";
export const DATE_RANGE_RESET = "DATE_RANGE_RESET";

export const symbolsSelected = symbols => ({
  type: SYMBOLS_SELECTED,
  payload: {
    symbols: symbols
  }
});

export const dateSelected = date => ({
  type: DATE_SELECTED,
  payload: {
    selectedDate: date
  }
});

export const dateRangeSelected = (startDate, endDate) => ({
  type: DATE_RANGE_SELECTED,
  payload: {
    startDate: startDate,
    endDate: endDate
  }
});

export const dateRangeReset = () => ({
  type: DATE_RANGE_RESET
});
