import React, { Component } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import SettingsBackupRestore from "@material-ui/icons/SettingsBackupRestore";
import { DateRangePicker } from "react-date-range";
import enGb from "react-date-range/dist/locale/en-GB";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import DateRange from "@material-ui/icons/DateRange";
import { withStyles } from "@material-ui/core/styles";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const styles = {
  root: {},
  popperPaper: {
    marginTop: 0,
    zIndex: 100
  }
};

class DateRangeSelector extends Component {
  state = {
    open: false
  };
  handleClick = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open
    }));
  };
  handleSelect(ranges) {
    this.props.onDateRangeSelected(
      ranges.selection.startDate.toISOString().slice(0, 10),
      ranges.selection.endDate.toISOString().slice(0, 10)
    );
  }
  handleReset = e => {
    this.props.onDateRangeReset();
    e.stopPropagation();
  };
  handleClickAway = () => {
    this.setState({
      open: false
    });
  };
  render() {
    const selectionRange = {
      startDate: new Date(this.props.startDate),
      endDate: new Date(this.props.endDate),
      key: "selection"
    };
    const { anchorEl, open } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <TextField
          id="outlined-read-only-input"
          label="Date range"
          style={{ width: "100%" }}
          value={this.props.startDate + " - " + this.props.endDate}
          onClick={this.handleClick}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <DateRange />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                <IconButton
                  aria-label="Reset"
                  className={classes.margin}
                  onClick={this.handleReset.bind(this)}
                >
                  <SettingsBackupRestore />
                </IconButton>
              </InputAdornment>
            )
          }}
          variant="outlined"
        />
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <Paper className={classes.popperPaper}>
              <DateRangePicker
                ranges={[selectionRange]}
                onChange={this.handleSelect.bind(this)}
                locale={enGb}
              />
            </Paper>
          </ClickAwayListener>
        </Popover>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(DateRangeSelector);
