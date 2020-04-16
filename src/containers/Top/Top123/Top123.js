import React, { Component } from 'react';
import LazyImage from "../../../components/LazyImage/LazyImage";
import Preloader from "../../../components/Preloader/Preloader";
import { Link } from "react-router-dom";

class Top123 extends Component {
    render() {
        const clsDiv = [
            'Top3-User',
            'User',
        ];

        if (( this.props.user.number === 2 ) || ( this.props.user.number === 3 )) clsDiv.push('Top3-UserSmall');

        return (
            <Link to={ "/id" + this.props.user.id }
               style={ { display: 'contents', textDecoration: 'none' } }
            >
                <div className={ clsDiv.join(' ') }>
                    <LazyImage
                        className={ "User-Avatar " + ( ( ( this.props.user.number === 2 ) || ( this.props.user.number === 3 ) ) ? 'User-AvatarSmall' : '' ) }
                        src={ this.props.user.photo }
                        alt="User-Avatar"
                        onAfterLoading={ () => {
                            if (this.props.onAfterLoading) this.props.onAfterLoading()
                        } }
                        onLoadingError={() => {
                            if (this.props.onAfterLoading) this.props.onAfterLoading()
                        }}
                        loader={
                            <Preloader
                                className={ 'User-Avatar ' + ( ( ( this.props.user.number === 2 ) || ( this.props.user.number === 3 ) ) ? 'User-AvatarSmall' : '' ) + ' UserItem-AvatarPreloader' }
                            />
                        }
                        error={ <div  className={ 'User-Avatar ' + ( ( ( this.props.user.number === 2 ) || ( this.props.user.number === 3 ) ) ? 'User-AvatarSmall' : '' ) + ' UserItem-AvatarError' }
                        /> }
                    />
                    <span
                        className={ 'User-TopNumber User-TopNumber-' + this.props.user.number }>{ this.props.user.number }</span>
                    <span className="User-Name">{ this.props.user.name }</span>
                    <span
                        className="User-LikesCount">{ String(this.props.user.likesCount).replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, "$1") }</span>
                </div>
            </Link>
        );

    }
}

export default Top123;
