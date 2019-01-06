<template>
  <v-app>
    <v-toolbar absolute color="primary" dark app clipped-left></v-toolbar>
    <v-card color="white" class="stock-picker" app clipped-left>
      <v-container fluid class="pa-3">
        <StockPicker/>
      </v-container>
    </v-card>
    <v-content style="padding:0">
      <v-navigation-drawer width="240">
        <v-list>
          <template v-for="(item, index) in items">
            <v-list-tile
              :key="item.title"
              :to="{name: item.route}"
              ripple
              exact
              active-class="active-link"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider :key="index"></v-divider>
          </template>
        </v-list>
      </v-navigation-drawer>
      <main>
        <router-view/>
      </main>
    </v-content>
  </v-app>
</template>

<script>
import StockPicker from "./components/StockPicker";
export default {
  name: "App",
  components: {
    StockPicker
  },
  data() {
    return {
      items: [
        { title: "Returns", route: "Home" },
        { title: "Closing prices", route: "ClosingPrices" }
      ]
    };
  }
};
</script>

<style lang="scss">
.v-toolbar {
  position: static;
}
.stock-picker {
  width: 100%;
  min-height: 64px;
  z-index: 5;
}
.v-content__wrap {
  display: flex;
}
.v-navigation-drawer {
  flex-shrink: 0;
  top: 10px;
  box-shadow: 12px -24px 32px -22px rgba(0, 0, 0, 0.75);
}
main {
  flex-grow: 1;
}
html {
  overflow: auto;
}
</style>