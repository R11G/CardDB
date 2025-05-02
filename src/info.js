import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Info = () => {
    const { id } = useParams(); // Get card ID from URL parameters
    const [card, setCard] = useState(null);
    const [format, setFormat] = useState([]);
    const [image, setImage] = useState({});
    const navigate = useNavigate();
    const mw = 500
    const gridspace = mw/3
    useEffect(() => {
        const fetchCardAndImage = async () => {
          try {
            // Step 1: Fetch card data
            const cardResponse = await fetch(`/card/${id}`);
            const data = await cardResponse.json();
            setCard(data.card || []);
            setFormat(data.formats || []);
            // Step 2: Fetch image using something from card (e.g. id)
            const imageResponse = await fetch(`/getimage/${id}`);
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setImage(imageUrl);
          } catch (error) {
            console.error('Error fetching card or image:', error);
          }
        };
    
        fetchCardAndImage();
      }, [id]); // Only runs once on mount
    if (!card) {
        return <div>Loading...</div>;
    }
    console.log(format)
    return (
        <div style={{
            width: `${mw}px`,
            margin: '0 auto'
          }}>
            <h2>Card Info</h2>
                {card.image ? (
                    <div>
                        <img
                            src={image}
                            alt={`${card.code} ${card.number}`}
                            title={`${card.code} ${card.number}`}
                            style={{ maxWidth: `${mw}px`, display: "block", marginBottom: "10px" }}
                        />
                    </div>
                ) : 
                (
                    <p>Loading image...</p>
                )}
                {card.subtype.length > 0 && (
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{card.subtype.map(t => t.subtype).join(', ')}</p>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: `${gridspace}px ${gridspace}px ${gridspace}px`, gap: '12px' }}>
                {card.name != null && (
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{card.name}</p>
                )}
                {card.hp != null && (
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{card.hp}HP</p>
                )}
                {card.type.length > 0 && (
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{card.type.map(t => t.type).join(', ')}</p>
                )}
                </div>
                {card.evolves != null && (
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>Evolves from {card.evolves}</p>
                )}
                {card.atname != null && card.attext != null && (
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{card.atname}: {card.attext}</p>
                )}
                {card.ability.length > 0 && (
                    <div>
                        {card.ability.map((ability) => (
                            <div key={ability.id}>
                                <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{ability.name}</p>
                                <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{ability.text} </p>
                            </div>
                        ))}
                    </div>
                )}
                {card.attack.length > 0 && (
                    <div>
                        {card.attack.map((attack) => (
                            <div key={attack.id}>
                                <div style={{ display: 'grid', gridTemplateColumns: `${gridspace}px ${gridspace}px ${gridspace}px`, gap: '12px' }}>
                                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{attack.cost}</p>
                                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{attack.name}</p>
                                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{attack.damage}</p>
                                </div>
                                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{attack.text}</p>
                            </div>
                        ))}
                    </div>
                )}
                {card.rules.length > 0 && (
                    <div>
                        {card.rules.map((rule) => (
                            <div key={rule.id}>
                                <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{rule.text}</p>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: `${gridspace}px ${gridspace}px ${gridspace}px`, gap: '12px' }}>
                {card.weakness.length > 0 && (<div>
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>Weakness</p>
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word' }}>{card.weakness.map(t => t.type).join(', ')}</p>
                </div>)}
                {card.resistance.length > 0 && (<div>
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word'}}>Resistance</p>
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word'}}>{card.resistance.map(r => `${r.type} -${r.value}`).join(', ')}</p>
                </div>)}
                {card.retreat != null && (<div>
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word'}}>Retreat</p>
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word'}}>{card.retreat}</p>
                </div>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `${gridspace}px ${mw-gridspace}px`, gap: '12px' }}>
                {card.artist != null && (<div>
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word'}}>Illus. {card.artist}</p>
                </div>)}
                {card.ftext != null && (<div>
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word'}}>{card.ftext}</p>
                </div>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `${gridspace}px ${gridspace}px ${gridspace}px`, gap: '12px' }}>
                {card.reg != null && (
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word'}}>[{card.reg}]</p>
                )}
                {card.code != null && card.number != null && (
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word'}}>{card.code} {card.number}</p>
                )}
                {card.rarity != null && (
                    <p style={{ maxWidth: `${mw}px`, wordWrap: 'break-word'}}>{card.rarity}</p>
                )}
                </div>
                {format.map(format => (
                <p key={format.id}>
                    {format.format}: {card.formats.includes(format.id) ? '✓' : '✗'}
                </p>
                ))}
                {/* Return */}
                <button onClick={() => navigate("/")}>Return to Menu</button>
        </div>
    );
};

export default Info;