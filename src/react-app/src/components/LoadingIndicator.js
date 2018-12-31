import React, { Component } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core";
import { createLoadingSelector } from "../helpers/loadingSelector";

const styles = {
  placeholder: {
    height: 5,
    backgroundColor: "rgba(49, 56, 71, 0.8)"
  }
};

const mapStateToProps = state => ({
  isLoading: loadingSelector(state)
});

const mapDispatchToProps = dispatch => ({});

class LoadingIndicator extends Component {
  render() {
    const { classes } = this.props;
    return this.props.isLoading ? (
      <LinearProgress color="secondary" />
    ) : (
      <div className={classes.placeholder} />
    );
  }
}
const loadingSelector = createLoadingSelector([
  "FETCH_SERIES",
  "FETCH_RETURNS_METRICS"
]);

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoadingIndicator)
);
