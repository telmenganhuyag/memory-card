import React, { useState, useEffect } from 'react';
import { shuffle } from 'lodash';

export default function App() {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
      try {
        const response = await fetch(
          `https://api.giphy.com/v2/emoji?api_key=${apiKey}&limit=15`
        );
        const data = await response.json();
        const newCards = data.data.map((item, index) => ({
          id: index + 1,
          title: item.title,
          image: item.images.fixed_height.url,
        }));
        setCards(shuffle(newCards));
      } catch (error) {
        console.error('Error fetching data from Giphy:', error);
      }
    };

    fetchCards();
  }, []);

  const handleCardClick = (id) => {
    if (selectedCards.includes(id)) {
      // Game over - card already selected
      setSelectedCards([]);
      if (currentScore > bestScore) {
        setBestScore(currentScore);
      }
      setCurrentScore(0);
    } else {
      // Continue game
      setSelectedCards([...selectedCards, id]);
      setCurrentScore(currentScore + 1);
    }
    // Shuffle cards
    setCards(shuffle([...cards]));
  };

  return (
    <div className="container mx-auto p-4 bg-base-200 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">
        Memory Card Game
      </h1>

      <div className="flex justify-evenly mb-5">
        <div className="stat flex flex-col items-center bg-primary text-primary-content rounded-box w-1/3">
          <div className="stat-title text-primary-content font-semibold">Current Score</div>
          <div className="stat-value">{currentScore}</div>
        </div>
        <div className="stat flex flex-col items-center bg-secondary text-secondary-content rounded-box w-1/3">
          <div className="stat-title text-secondary-content font-semibold">Best Score</div>
          <div className="stat-value">{bestScore}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow duration-300"
            onClick={() => handleCardClick(card.id)}
          >
            <figure>
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-36 object-contain"
              />
            </figure>
            <div className="card-body p-4">
              <h2 className="card-title text-sm">{card.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
