import React, { Component } from "react";
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux'
import { withStyles } from "@material-ui/core";

const styles = {
    placeholder: {
        height:5,
        backgroundColor:'#999'
    }
}

const mapStateToProps = (state) => ({
    isLoading: state.isLoading
})

const mapDispatchToProps = (dispatch) => ({
})

class LoadingIndicator extends Component {
    render() {
        const { classes } = this.props;
        return (
            this.props.isLoading ? <LinearProgress color="secondary" /> : <div className={classes.placeholder}></div>
        )
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LoadingIndicator))