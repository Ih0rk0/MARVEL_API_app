



import PropTypes from 'prop-types';

import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 255,
        charEnded: false,
        active:false
    }

    marvelService = new MarvelService();
    
    componentDidMount() {
        
        this.onRequest();
        
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

     onCharListLoaded =  (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

         this.setState(({ offset, charList }) =>  ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))

        console.log(newCharList)
        
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    changeActive(item,e){
        this.setState({
            active: true,
            
        })
        this.props.onCharSelected(item.id)
        if(e.target.tagName==="LI"){
            Array.from(e.target.parentNode.children).forEach(item=>{
                item.style=null
            })
            e.target.style.cssText="position:relative; bottom:15px; box-shadow: 0px 3px 13px red;"
        }else{
            Array.from(e.target.parentNode.parentNode.children).forEach(item=>{
                item.style=null
            })
            e.target.parentNode.style.cssText="position:relative; bottom:15px ; box-shadow: 0px 3px 13px red;  "
        }
         
        console.log(e.target)
    }
    renderItems(arr) {
        const items = arr.map((item) => {
            
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <li
                    className="char__item"
                    key={item.id}
                    onClick={(e) =>this.changeActive(item,e) }
                    >
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // для центровки спінера/помилки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    
    render() {

        const { charList, loading, error, offset, newItemLoading, charEnded } = this.state;

        const items = this.renderItems(charList);
        console.log(items)
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
CharList.propTypes={
    onCharSelected:PropTypes.func
}
export default CharList;