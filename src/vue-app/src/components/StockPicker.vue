<template>
  <v-autocomplete
    v-model="select"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    :filter="filter"
    chips
    clearable
    hide-details
    hide-selected
    item-text="name"
    item-value="symbol"
    label="Search for a stock..."
    multiple
    outline
    cache-items
    deletable-chips
  >
    <template slot="no-data">
      <v-list-tile>
        <v-list-tile-title>
          Search for your favourite
          <strong>Stock</strong>
        </v-list-tile-title>
      </v-list-tile>
    </template>
    <template slot="selection" slot-scope="{ item, selected }">
      <v-chip
        :selected="selected"
        color="blue-grey"
        class="white--text"
        close
        small
        @input="remove(item)"
      >
        <span v-text="item.name"></span>
      </v-chip>
    </template>
    <template slot="item" slot-scope="{ item }">
      <v-list-tile-avatar
        color="indigo"
        class="headline font-weight-light white--text"
      >{{ item.name.charAt(0) }}</v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title v-text="item.name"></v-list-tile-title>
        <v-list-tile-sub-title v-text="item.symbol"></v-list-tile-sub-title>
      </v-list-tile-content>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: "StockPicker",
  data: () => ({
    isLoading: false,
    items: [],
    select: null,
    search: null
  }),
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
  methods: {
    querySelections(val) {
      this.loading = true;
      fetch("/api/tickers/search/" + (val ? val : ""))
        .then(res => res.json())
        .then(res => {
          this.items = res;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
    remove(item) {
      const index = this.select.indexOf(item.symbol);
      if (index >= 0) this.select.splice(index, 1);
    },
    filter(item, queryText, itemText) {
      const hasValue = val => (val != null ? val : "");

      const text = hasValue(itemText);
      const value = hasValue(item.symbol);
      const query = hasValue(queryText);

      const textContainsQuery =
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1;

      const valueContainsQuery =
        value
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1;

      return textContainsQuery || valueContainsQuery;
    }
  }
};
</script>

<style>
</style>
