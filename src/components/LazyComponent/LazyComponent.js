import React, { Component } from 'react';
import ReactDOM from "react-dom";


class LazyComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoader: true,
            component: React.cloneElement(this.props.children, {
                onAfterLoading: this.onAfterLoadingHandle.bind(this),
            }),
        };

        this.timer = null;
        this.hiddenBlockRef = React.createRef();
        this.childNodes = [];
        this.parentNode = null;
    }

    onAfterLoadingHandle() {
        if (this.props.delay) {
            this.timer = window.setTimeout(() => {
                this.setState({
                    showLoader: false,
                })
            }, this.props.delay);
        } else {
            this.setState({
                showLoader: false,
            })
        }
    };

    insertAfter(parentNode, node, child) {
        //get the child after child parameter

        let index = 0;
        for(let i = 0; i < parentNode.children.length; i++) {
            if(parentNode.children[i] === child) {
                index = i + 1;
                break;
            }
        }
        //debugger;
        parentNode.insertBefore(node, parentNode.children[index]);
    };

    removeHiddenBlock() {
        try {
            let lastElement = this.hiddenBlockRef.current;
            this.parentNode = ReactDOM.findDOMNode(this).parentNode;
            while (this.hiddenBlockRef.current.childNodes.length > 0) {
                const elem = this.hiddenBlockRef.current.childNodes[0];
                this.hiddenBlockRef.current.removeChild(elem);
                //lastElement.after(elem);
                this.insertAfter(this.parentNode, elem, lastElement);
                lastElement = elem;
                this.childNodes.push(elem);
            }



/*            if(this.parentNode && this.parentNode.childNodes) {
                this.parentNode.childNodes.indexOf = [].indexOf;
                if (~this.parentNode.childNodes.indexOf(this.hiddenBlockRef.current)) {
                    this.parentNode.removeChild(this.hiddenBlockRef.current);
                }
            }*/

            // if (this.parentNode) {
            //     this.parentNode.childNodes.indexOf = [].indexOf;
            //     if (~this.parentNode.childNodes.indexOf(this.hiddenBlockRef.current)) {
            //         this.parentNode.removeChild(this.hiddenBlockRef.current);
            //     }
            // }
        } catch (e) {

        }
    }

    componentDidUpdate() {
        if (this.state.showLoader === false)
            this.removeHiddenBlock();
    }

    componentWillUnmount() {
        while (this.childNodes.length > 0) {
            this.parentNode.childNodes.indexOf = [].indexOf;
            if (~this.parentNode.childNodes.indexOf(this.childNodes[0])) {
                this.parentNode.removeChild(this.childNodes[0]);
            }
            this.childNodes = this.childNodes.slice(1);
        }

        clearTimeout(this.timer);
    }

    render() {
        return (
            <>
                {
                    this.state.showLoader
                        ? ( this.props.loader ? this.props.loader : 'Loading...' )
                        : null
                }
                <div style={ { display: 'none' } } ref={ this.hiddenBlockRef }>
                    { this.state.component }
                </div>
            </>
        );

    }
}

export default LazyComponent;

