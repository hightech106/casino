import React, { useMemo } from 'react';

const GameCardsRow = () => {
  // Функция для генерации случайных данных
  const generateRandomGameData = () => {
    const names = ['Alex', 'Mike', 'Sarah', 'John', 'Emma', 'David', 'Lisa', 'Tom', 'Anna', 'Chris', 'Kate', 'Max', 'Sofia', 'Ryan', 'Mia', 'Oliver', 'Liam', 'Noah', 'Elijah', 'Mason', 'Logan', 'Jacob', 'Lucas', 'Henry', 'Player777', 'Winner88', 'Lucky123', 'Gamer99', 'Slot777', 'BigWin', 'Casino21'];
    const multipliers = [1.5, 2.1, 3.7, 4.2, 5.8, 7.3, 8.9, 10.5, 12.1, 15.0, 20.5, 25.2, 30.8, 45.5, 50.0, 75.3, 100.0];
    const amounts = [50, 75, 120, 200, 350, 500, 750, 1200, 2000, 3500, 5000, 7500, 10000, 15000, 25000, 50000];

    const slotGames = [
      { name: 'Starburst', image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=80&h=80&fit=crop', color: '#9C27B0' },
      { name: 'Book of Dead', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop', color: '#8B4513' },
      { name: 'Gonzo Quest', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=80&h=80&fit=crop', color: '#FF6B35' },
      { name: 'Mega Moolah', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop', color: '#24ee89' },
      { name: 'Sweet Bonanza', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=80&h=80&fit=crop', color: '#FF4500' },
      { name: 'Gates of Olympus', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=80&h=80&fit=crop', color: '#32CD32' },
      { name: 'Wolf Gold', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=80&h=80&fit=crop', color: '#FFD700' },
      { name: 'Dead or Alive', image: 'https://images.unsplash.com/photo-1533651819408-626cd2c24974?w=80&h=80&fit=crop', color: '#FF5722' },
      { name: 'Reactoonz', image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=80&h=80&fit=crop', color: '#00BCD4' },
      { name: 'Big Bass Bonanza', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=80&h=80&fit=crop', color: '#4CAF50' }
    ];

    return {
      username: names[Math.floor(Math.random() * names.length)],
      multiplier: multipliers[Math.floor(Math.random() * multipliers.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      game: slotGames[Math.floor(Math.random() * slotGames.length)]
    };
  };

  // Генерируем случайные данные один раз при рендере компонента
  const games = useMemo(() =>
    Array.from({ length: 10 }, (_, index) => {
      const randomData = generateRandomGameData();
      return {
        id: index + 1,
        title: randomData.game.name,
        multiplier: `x${randomData.multiplier}`,
        username: randomData.username,
        amount: `$${randomData.amount}`,
        image: randomData.game.image,
        bgColor: randomData.game.color
      };
    })
    , []);

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '16px 0',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      className="hide-scrollbar"
    >
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {games.map((game) => (
        <div
          key={game.id}
          style={{
            minWidth: '140px',
            height: '80px',
            backgroundColor: '#2B2F3D',
            borderRadius: '10px',
            border: '2px solid #2B2F3D',
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        //   onMouseEnter={(e) => {
        //     e.target.style.transform = 'scale(1.05)';
        //     e.target.style.borderColor = '#FFD700';
        //   }}
        //   onMouseLeave={(e) => {
        //     e.target.style.transform = 'scale(1)';
        //     e.target.style.borderColor = '#333';
        //   }}
        >
          {/* Game Icon */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: game.bgColor,
              backgroundImage: `url(${game.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              flexShrink: 0,
              marginRight: '8px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Overlay for game icon */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(45deg, ${game.bgColor}80, ${game.bgColor}40)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Game symbol placeholder - you can replace with actual game icons */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: game.bgColor,
                }}
              >
                {game.title.charAt(0)}
              </div>
            </div>
          </div>

          {/* Game Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Multiplier */}
            <div
              style={{
                color: '#FFD700',
                fontSize: '16px',
                fontWeight: 'bold',
                lineHeight: '1.2',
                marginBottom: '2px',
              }}
            >
              {game.multiplier}
            </div>

            {/* Username */}
            <div
              style={{
                color: '#CCCCCC',
                fontSize: '10px',
                lineHeight: '1.2',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {game.username}
            </div>

            {/* Amount */}
            <div
              style={{
                color: '#FFD700',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '1.2',
              }}
            >
              {game.amount}
            </div>
          </div>

          {/* Subtle glow effect */}
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              background: 'linear-gradient(45deg, transparent, rgba(138,43, 226, 0.1), transparent)',
              borderRadius: '12px',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
              zIndex: -1,
            }}
            className="glow-effect"
          />
        </div>
      ))}

      <style>
        {`
          .hide-scrollbar:hover .glow-effect {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
};

export default GameCardsRow;