import React, { Component } from 'react';

class LazyImage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showLoader: true,
            showError: false,
            src: '',
        };
    }

    componentDidMount() {
        if (this.props.onBeforeLoading) this.props.onBeforeLoading();
    }

    shouldComponentUpdate(props, state) {
        if (this.props.src !== props.src) {
            if (this.props.onBeforeLoading) this.props.onBeforeLoading();
            this.setState({
                showLoader: true,
                showError: false,
            });
        }

        return true;
    }

    static getDerivedStateFromProps(props, state) {
        if (props.src === state.src) return {};
        return {
            src: props.src,
            showLoader: true,
            showError: false,
        }
    }

    render() {
        const imgHiddenStyle = {
            display: 'none',
        };

        return (
            <>
                {
                    this.state.showLoader
                        ? ( this.props.loader ? this.props.loader : 'Loading...' )
                        : null
                }
                {
                    this.state.showError
                        ? ( this.props.error ? this.props.error : 'Error...' )
                        : null
                }
                <img
                    style={ this.state.showLoader || this.state.showError ? imgHiddenStyle : ( this.props.style ? this.props.style : null ) }
                    src={ this.state.src }
                    alt={ this.props.alt ? this.props.alt : null }
                    className={ this.props.className ? this.props.className : null }
                    onClick={ this.props.onClick ? this.props.onClick : null }
                    onLoad={ (event) => {
                        if (this.props.delay) {
                            window.setTimeout(() => {
                                if (this.props.onLoad) this.props.onLoad(event);
                                if (this.props.onAfterLoading) this.props.onAfterLoading();
                                this.setState({
                                    showLoader: false,
                                })
                            }, this.props.delay)
                        } else {
                            if (this.props.onLoad) this.props.onLoad(event);
                            if (this.props.onAfterLoading) this.props.onAfterLoading();
                            this.setState({
                                showLoader: false,
                            })
                        }
                    } }
                    onError={ (event) => {
                        if (this.state.src !== '') {
                            if (this.props.delay) {
                                window.setTimeout(() => {
                                    if (this.props.onLoadingError) this.props.onLoadingError();
                                    this.setState({
                                        showLoader: false,
                                        showError: true,
                                    })
                                }, this.props.delay)
                            } else {
                                if (this.props.onLoadingError) this.props.onLoadingError();
                                this.setState({
                                    showLoader: false,
                                    showError: true,
                                })
                            }
                        }
                    } }
                />
            </>
        );

    }
}

export default LazyImage;
