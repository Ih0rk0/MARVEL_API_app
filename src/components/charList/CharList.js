



import PropTypes from 'prop-types';

import { useState, useEffect , useRef } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

function CharList  (props) {
    const[charList,setCharList]=useState([])
    const[loading,setLoading]=useState(true)
    const[error,setError]=useState(false)
    const[newItemLoading,setnNewItemLoading]=useState(false)
    const[offset,setOffset]=useState(255)
    const[charEnded,setCharEnded]=useState(false)
    const[active,setActive]=useState(false)
    
    const marvelService = new MarvelService();
    useEffect(()=>{
        onRequest(255)
    }, [])
    
    

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setnNewItemLoading(true)
       
    }

    const onCharListLoaded =  (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        setCharList(charList=>[...charList, ...newCharList])
        setLoading(false)
        setnNewItemLoading(false)
        setOffset(offset=>offset+9)
        setCharEnded(ended)
        //  this.setState(({ offset, charList }) =>  ({
        //     charList: [...charList, ...newCharList],
        //     loading: false,
        //     newItemLoading: false,
        //     offset: offset + 9,
        //     charEnded: ended
        // }))

        console.log(newCharList)
        
    }

    const onError = () => {
        setError(true)
        setLoading(false)
        // this.setState({
        //     error: true,
        //     loading: false
        // })
    }

    const changeActive = (item,e)=>{
        setActive(true)
        // this.setState({
        //     active: true,
            
        // })
        props.onCharSelected(item.id)
        if(e.target.tagName==="LI"){
            Array.from(e.target.parentNode.children).forEach(item=>{
                item.classList.remove('char__item_selected')
            })
            e.target.classList.add('char__item_selected')
        }else{
            Array.from(e.target.parentNode.parentNode.children).forEach(item=>{
                item.classList.remove('char__item_selected')
            })
            e.target.parentNode.classList.add('char__item_selected')
        }
         

    }
    const renderItems = (arr) =>{
        const items = arr.map((item) => {
            
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <li
                    className="char__item"
                    key={item.id}
                    onClick={(e) =>changeActive(item,e) }
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
    const items = renderItems(charList);
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
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

CharList.propTypes={
    onCharSelected:PropTypes.func
}
export default CharList;