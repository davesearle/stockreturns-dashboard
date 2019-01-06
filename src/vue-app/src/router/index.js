import Vue from "vue";
import Router from "vue-router";
import StockPrices from "../components/StockPrices";
import StockReturns from "../components/StockReturns";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: StockReturns
    },
    {
      path: "/closing-prices",
      name: "ClosingPrices",
      component: StockPrices
    }
  ]
});
