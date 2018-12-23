import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AsyncSelect from 'react-select/lib/Async'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { connect } from 'react-redux'

const styles = (theme) => ({
    root: {
        width: '100%'
    },
    input: {
        display: 'flex',
        padding: 0
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
        padding: 10,
        minHeight: 36
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
        height: 28,
        fontSize: 14,
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1)',
        borderRadius: 0,
        fontWeight: '500'
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    placeholder: {
        left: 2,
        fontSize: 16
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing.unit * 2,
    }
});

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            variant="outlined"
            InputProps={{
                inputComponent,

                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={classNames(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            style={{backgroundColor:getColour(props.selectProps.colours, props.children.match(/\((.*)\)/).pop()), color:'#fff'}}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon fontSize="small" style={{color:'#fff'}} {...props.removeProps} />}
        />
    );
}

const getColour = (colours, symbol) => {
    var colourCode = colours.filter((colour) => colour.symbol === symbol)[0].colour;
    return colourCode;
}


function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer,
};

const mapStateToProps = (state) => ({
    colours: state.colours
})

const mapDispatchToProps = (dispatch) => ({
})

class AutoComplete extends Component {

    state = {
        multi: null,
    };

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                multi: this.props.value,
            });
        }
    }

    handleChange = value => {
        this.setState({
            multi: value,
        });

        this.props.onChange(value);
    };

    render() {
        const { classes, theme, placeholder } = this.props;

        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                    font: 'inherit'
                }
            }),
        };

        return (
            <div className={classes.root}>
                <NoSsr>
                    <AsyncSelect
                        ref={this.componentRef}
                        classes={classes}
                        styles={selectStyles}
                        defaultOptions
                        loadOptions={this.props.loadOptions}
                        components={components}
                        onChange={this.handleChange}
                        colours={this.props.colours}
                        textFieldProps={{
                            label: this.props.label,
                            InputLabelProps: {
                                shrink: true,
                            },
                        }}
                        placeholder={placeholder}
                        isMulti
                        value={this.state.multi}
                    />
                </NoSsr>
            </div>
        );
    }
}

AutoComplete.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    placeholder: PropTypes.string.isRequired,
    loadOptions: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(AutoComplete));
