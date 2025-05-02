import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {useLocation} from "react-router-dom";
import './ImageGallery.css'

const SearchResult = () => {
    const  data  = useLocation();
    const params = new URLSearchParams(data.search);
    const type = params.get('type'); // "name" or "id"
    const [cardList, setCardList] = useState([]);
    const [imgList, setImgList] = useState({});
    const [total, setTotal] = useState(0);
    const [rulebox, setRulebox] = useState(0);
    const [rare, setRare] = useState(0);
    useEffect(() => {
        let endpoint = '';
        if (type === 'name') {
            endpoint = `/searchname/${params.get('name')}`
        } else if (type === 'set') {
            endpoint = `/searchset/${params.get('set')}`
        }else if (type === 'hp') {
            endpoint = `/searchhp?min=${params.get('min')}&max=${params.get('max')}`
        }
        fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
            setCardList(data.cardlist || []);
            setTotal(data.total || 0);
            setRulebox(data.rulebox || 0);
            setRare(data.rare || 0);
        })
        .catch((error) => console.error('Error fetching cardlist', error));
    }, [data]);
    useEffect(() => {
        cardList.forEach((card) => {
          fetchImage(card.id);
        });
    }, [cardList]);
    const fetchImage = async (cardId) => {
        try {
            const response = await fetch(`/getimage/${cardId}`);
            if (response.ok) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setImgList(prevImages => ({ ...prevImages, [cardId]: imageUrl }));
            }
        } catch (error) {
            console.error('Error fetching image for card', cardId, error);
        }
    };
    return (
        <div>{!cardList ? (
        <p>Loading cards...</p>
        ) : (
        <div><h1>Search Result</h1>
        <h2>Total: {total}</h2>
        <h2>Rule Box Cards: {rulebox}</h2>
        <h2>High Rarity: {(rare/total * 100).toFixed(2)}%</h2></div>)}
        <div className="image-gallery">
        {!cardList ? (
        <p>Loading cards...</p>
        ) : (
            cardList.map((card) => (
            <div key={card.id} className="card">
                <Link to={`/info/${card.id}`} key={card.id} className="image-link">
                <img src={imgList[card.id]} alt={`${card.code} ${card.number}`} title={`${card.code} ${card.number}`} className="image"/>
                </Link>
            </div>
            ))
        )}
        </div>
        </div>
    );
}
export default SearchResult;