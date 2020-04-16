import React, { Component } from 'react';
import "./Tabs.sass";


class Tabs extends Component {

    constructor(props) {
        super(props);

        this.changeHandle = this.changeHandle.bind(this);
    }

    state = {
        itemActive: this.props.itemActive ? this.props.itemActive : 0,
        classes: {
            itemClass: 'TabsLb-Item',
            itemActiveClass: 'TabsLb-Item_active',
            itemActiveRightClass: 'TabsLb-Item_activeRight',
            itemActiveLeftClass: 'TabsLb-Item_activeLeft',
            itemRightClass: 'TabsLb-Item_right',
            itemLeftClass: 'TabsLb-Item_left',
        },
        list: [...this.props.tabs],
    }

    changeHandle(event) {
        const itemId = event.target.dataset.id;
        this.setState({
            itemActive: itemId,
        });

        if (this.props.onChange) this.props.onChange(event);
    }

    render() {
        return (
            <div className={ 'TabsLb ' + (this.props.className ? this.props.className : '') }>
                <div className="TabsLb-Body">
                    { this.state.list.map((item, index, array) => {
                        let classes = this.state.classes.itemClass;
                        if (index == 0) classes += ' ' + this.state.classes.itemLeftClass;
                        if (index == ( array.length - 1 )) classes += ' ' + this.state.classes.itemRightClass;
                        if (index == this.state.itemActive) classes += ' ' + this.state.classes.itemActiveClass;
                        if (index == this.state.itemActive && index == 0) classes += ' ' + this.state.classes.itemActiveLeftClass;
                        if (index == this.state.itemActive && index == ( array.length - 1 )) classes += ' ' + this.state.classes.itemActiveRightClass;


                        return <div
                            key={ item.label + index }
                            data-id={ index }
                            className={ classes }
                            onClick={ this.changeHandle }

                        >
                            { item.label }
                        </div>
                    }) }
                    { /*<div className="TabsLb-Item TabsLb-Item_left TabsLb-Item_active TabsLb-Item_activeLeft">Платно</div>*/ }
                    { /*<div className="TabsLb-Item TabsLb-Item_right">Бесплатно</div>*/ }
                </div>
            </div>
        );
    }
}

export default Tabs;
