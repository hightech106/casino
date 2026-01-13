import React, { useRef, useState } from 'react';
import { Box, Button, Stack, Typography, styled } from '@mui/material';
import chipBoard from 'src/assets/images/games/chipboard.svg';

// Function to format chip values
export const formatChipValue = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(0)}b`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(0)}m`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(0)}k`;
  }
  return value.toString();
};

// Function to map chip values to colors
const getChipColor = (value: number): string => {
  if (value < 100) return '#5176a7';
  if (value < 1000) return '#2679e7';
  if (value < 10000) return '#8a5bed';
  if (value < 100000) return '#51e4ed';
  if (value < 1000000) return '#ed5151 ';
  if (value < 10000000) return '#CD7F32';
  return '#e7c651';
};

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const ChipScrollArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  overflowX: 'auto',
  scrollbarWidth: 'none',
  padding: theme.spacing(1),
  border: `2px solid ${theme.palette.divider}`,
  '&:hover': {
    borderColor: theme.palette.action.hover,
  },
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

const ChipButtonGroup: React.FC<{
  chipValues: number[];
  onChooseChip: (value: number) => void;
  selected: number;
  label?: any;
}> = ({ chipValues, onChooseChip, selected, label }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -50 : 50;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (scrollRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <Stack>
      <Typography>{label}</Typography>
      <ScrollContainer>
        <Button
          onClick={() => scroll('left')}
          sx={{
            minWidth: '40px',
            height: 1,
            color: 'white',
            '& svg': {
              width: 24,
              height: 24,
            },
          }}
        >
          <svg fill="currentColor" viewBox="0 0 64 64">
            <path d="M36.998 53.995 16 32.998 36.998 12l6.306 6.306L28.61 33l14.694 14.694L36.998 54v-.005Z" />
          </svg>
        </Button>
        <ChipScrollArea
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {chipValues.map((value, index) => (
            <ChipButton
              key={index}
              value={value}
              selected={index === selected}
              onClick={() => onChooseChip(index)}
            />
          ))}
        </ChipScrollArea>
        <Button
          onClick={() => scroll('right')}
          sx={{
            minWidth: '40px',
            height: 1,
            color: 'white',
            '& svg': {
              width: 24,
              height: 24,
            },
          }}
        >
          <svg fill="currentColor" viewBox="0 0 64 64">
            <path d="m26.307 53.995 20.998-20.997L26.307 12 20 18.306 34.694 33 20.001 47.694 26.307 54v-.005Z" />
          </svg>
        </Button>
      </ScrollContainer>
    </Stack>
  );
};

export default ChipButtonGroup;

interface ChipButtonProps {
  onClick?: () => void;
  value: number;
  selected?: boolean;
  style?: any;
}

const StyledChipButton = styled(Button)(({ theme }) => ({
  aspectRatio: '1',
  width: '40px',
  minWidth: '40px',
  fontSize: '12px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  color: '#fff',
  borderRadius: '50%',
  padding: 0,
  '&.selected': {
    outline: `2px solid ${theme.palette.success.main}`,
  },
  '&:not(.selected)': {
    outline: '2px solid rgba(0, 0, 0, 0.3)',
  },
}));

export const ChipButton: React.FC<ChipButtonProps> = ({ onClick, value, selected, style = {} }) => {
  const color = getChipColor(value);
  return (
    <StyledChipButton
      onClick={onClick}
      className={selected ? 'selected' : ''}
      sx={{
        backgroundImage: `url(${chipBoard})`,
        backgroundColor: color,
        ...style,
      }}
    >
      {formatChipValue(value)}
    </StyledChipButton>
  );
};
