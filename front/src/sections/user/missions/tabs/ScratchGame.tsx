/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Box, IconButton, Button, Dialog, DialogContent, Typography, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locales';
import toast from 'react-hot-toast';
import useApi from 'src/hooks/use-api';
import { API_URL } from 'src/config-global';
import { throttle, debounce } from 'lodash';
import type { UserStats } from 'src/types/mission';

interface ScratchGameProps {
  setActiveTab?: (tab: string) => void;
  setActiveMiniGame?: Dispatch<SetStateAction<string | null>>;
  userPoints?: number;
  refreshUserStats?: () => Promise<void>;
  userStats: UserStats;
  setUserStats: Dispatch<SetStateAction<UserStats>>;
}

interface GridCell {
  _id: string | null;
  banner_path: string;
  eraze: boolean;
}

const SCRATCH_LINE_WIDTH = 25;
const SCRATCH_THRESHOLD = 0.25;
const THROTTLE_DELAY_MS = 100;
const PIXEL_SAMPLE_RATE = 10;

const ScratchGame: React.FC<ScratchGameProps> = ({
  setActiveTab,
  setActiveMiniGame,
  userPoints,
  refreshUserStats,
  userStats,
  setUserStats,
}) => {
  const { t } = useLocales();
  const { get_scratch_game, check_scratch_game, check_win_scratch_game } = useApi();
  const [soundOn, setSoundOn] = useState(true);
  const [openRules, setOpenRules] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [scratchedCells, setScratchedCells] = useState<boolean[]>(Array(9).fill(false));
  const [revealedItems, setRevealedItems] = useState<string[]>(Array(9).fill(''));
  const [visiblePhotos, setVisiblePhotos] = useState<string[]>(Array(9).fill(''));
  const [grid, setGrid] = useState<GridCell[]>(
    Array(9).fill({ _id: null, banner_path: '', eraze: false })
  );
  const [scratchedCount, setScratchedCount] = useState(0);
  const [timeUntilNextPlay, setTimeUntilNextPlay] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [hasNotifiedResult, setHasNotifiedResult] = useState(false);
  const [startedFields, setStartedFields] = useState<number[]>([]);
  const [scratchCost, setScratchCost] = useState<number>(2);
  const [winningIndices, setWinningIndices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayButtonLocked, setIsPlayButtonLocked] = useState(false);
  const overlayCanvasRefs = useRef<(HTMLCanvasElement | null)[]>(Array(9).fill(null));
  const isScratchingRef = useRef<boolean[]>(Array(9).fill(false));
  const lastPositionRef = useRef<(null | { x: number; y: number })[]>(Array(9).fill(null));
  const scratchedPixelsRef = useRef<number[]>(Array(9).fill(0));
  const totalPixelsRef = useRef<number[]>(Array(9).fill(0));
  const [winDetails, setWinDetails] = useState<any>(null);

  const requiredFieldsToScratch = 3;

  const gameRules = {
    title: 'LuckVerse777 Scratch Rules',
    rules: [
      'Scratch 3 fields to win!',
      'Match 3 identical photos in a row, column, or diagonal to win.',
      'Winning combinations reward additional points or bonuses.',
    ],
  };

  const iconButtonSx = {
    color: '#FFF',
    width: 40,
    height: 40,
  };

  const backButtonSx = {
    width: '132px',
    height: '41px',
    background: '#232626',
    border: 'none',
    borderRadius: '0px',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textTransform: 'uppercase',
    fontFamily: 'FONTSPRING DEMO - Blunt Con It, sans-serif',
    fontSize: '16px',
    fontWeight: 400,
    fontStyle: 'italic',
    lineHeight: '100%',
    letterSpacing: '5%',
    textAlign: 'center',
    color: '#A0A3A7',
    transform: 'skew(-5deg)',
    whiteSpace: 'nowrap',
    '&:hover': {
      background: '#232626',
    },
  };

  const mobileBackIconSx = {
    background: 'linear-gradient(90deg, #142214 0%, #357035 100%)',
    border: '1px solid #2E602E',
    color: '#FFF',
    borderRadius: '50%',
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      background: 'linear-gradient(90deg, #1A2A1A 0%, #406A40 100%)',
    },
  };

  const dialogSx = {
    '& .MuiDialog-paper': {
      bgcolor: '#313545',
      borderRadius: '8px',
      border: '1px solid #24ee89',
      width: { xs: '90%', sm: '400px' },
      maxWidth: '400px',
      padding: '16px',
      boxSizing: 'border-box',
    },
  };

  const closeButtonSx = {
    position: 'absolute',
    top: 8,
    right: 8,
    color: '#FFF',
    bgcolor: '#3c4050ff',
    border: '1px solid #313545',
    borderRadius: '50%',
    width: 32,
    height: 32,
    '&:hover': {
      bgcolor: '#406A40',
    },
  };

  const playButtonSx = {
    position: { xs: 'relative', sm: 'absolute' },
    top: { xs: 'auto', sm: '82%', md: '480px' },
    left: { xs: 'auto', sm: '47.79%', md: '410px' },
    width: { xs: '60%', sm: '48%', md: '390px' },
    height: { xs: '12%', sm: '9%', md: '50px' },
    background: isLoading || isPlayButtonLocked || timeUntilNextPlay ? '#2E5A2E' : '#24ee89',
    border: 'none',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#141722',
    fontFamily: 'FONTSPRING DEMO - Blunt Con It',
    fontWeight: 400,
    fontStyle: 'italic',
    fontSize: '24px',
    lineHeight: '100%',
    letterSpacing: '5%',
    textAlign: 'center',
    textTransform: 'uppercase',
    transform: 'skew(-5deg)',
    zIndex: 1,
    cursor: isLoading || isPlayButtonLocked || timeUntilNextPlay ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    opacity: isLoading || isPlayButtonLocked || timeUntilNextPlay ? 0.7 : 1,
  };

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if ((e.target as HTMLElement).tagName.toLowerCase() === 'canvas') {
        e.preventDefault();
      }
    };
    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => {
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const response = await get_scratch_game();
        setScratchCost(response.data.cost || 2);
        setTimeUntilNextPlay(response.data.timeUntilNextPlay || null);
      } catch (error: any) {
        console.error('Error fetching initial state:', error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        }
      }
    };
    fetchInitialState();
  }, [get_scratch_game, userStats.username]);

  const checkScratchGame = async () => {
    try {
      if (userPoints! < scratchCost) {
        toast.error(t('insufficient_points'));
        return [];
      }
      const response = await check_scratch_game();
      const gridData = response?.data?.data;
      if (!Array.isArray(gridData) || gridData.length !== 9) {
        throw new Error('Invalid grid data from server');
      }
      setScratchCost(response.data?.cost || 2);
      setTimeUntilNextPlay(response.data?.timeUntilNextPlay || null);
      setGrid(gridData);
      if (refreshUserStats) {
        try {
          await refreshUserStats();
        } catch (refreshError) {
          console.error('Failed to refresh user stats:', refreshError);
          setUserStats((prevStats) => ({
            ...prevStats,
            points: prevStats.points - scratchCost,
          }));
          console.warn(t('stats_update_failed_locally_updated'));
        }
      } else {
        setUserStats((prevStats) => ({
          ...prevStats,
          points: prevStats.points - scratchCost,
        }));
      }
      return gridData;
    } catch (error: any) {
      console.error('Check scratch game error:', error);
      let errorMessage = t('failed_to_start_scratch_game');
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) errorMessage = t('invalid_request');
        else if (status === 401) errorMessage = t('unauthorized');
        else if (status === 403) errorMessage = t('forbidden');
        else if (status === 402 && data?.message === 'You can play again after 24 hours') {
          errorMessage = data.message;
          setTimeUntilNextPlay(data.timeUntilNextPlay);
        } else if (data?.message) errorMessage = data.message;
      } else if (error.message?.includes('Network Error')) {
        errorMessage = t('network_error');
      }
      toast.error(errorMessage);
      return [];
    }
  };

  const checkWinScratchGame = async (gridData: GridCell[]) => {
    try {
      if (!Array.isArray(gridData) || gridData.length !== 9) {
        throw new Error('Grid must be an array of 9 cells');
      }
      const response = await check_win_scratch_game(gridData);
      console.log(
        'Full response from check_win_scratch_game in checkWinScratchGame:',
        response.data
      );
      const pointsAwarded =
        response.data.result === 'win' ? response.data.reward?.pointsAwarded || 0 : 0;
      if (response.data.result === 'win') {
        const winningCombo = findWinningCombination(gridData);
        setWinningIndices(winningCombo);
      }
      if (refreshUserStats) {
        try {
          await refreshUserStats();
        } catch (refreshError) {
          console.error('Failed to refresh user stats:', refreshError);
          setUserStats((prevStats) => ({
            ...prevStats,
            points: prevStats.points + pointsAwarded,
          }));
          console.warn(t('stats_update_failed_locally_updated'));
        }
      } else {
        setUserStats((prevStats) => ({
          ...prevStats,
          points: prevStats.points + pointsAwarded,
        }));
      }
      return response.data;
    } catch (error: any) {
      console.error('Check win error details:', error);
      let errorMessage = t('failed_to_check_win');
      if (error.response) {
        const status = error.response.status;
        const dataMessage = error.response.data?.message;
        console.log('Error response details:', { status, data: error.response.data });
        if (status === 400) errorMessage = t('invalid_request');
        else if (status === 401) errorMessage = t('unauthorized');
        else if (status === 403) errorMessage = t('forbidden');
        else if (dataMessage) errorMessage = dataMessage;
      } else if (error.message?.includes('Network Error')) {
        errorMessage = t('network_error');
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const findWinningCombination = (gridData: GridCell[]): number[] => {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const winningLine = winningLines.find((line) => {
      const [a, b, c] = line;
      const images = [gridData[a].banner_path, gridData[b].banner_path, gridData[c].banner_path];
      return (
        images[0] &&
        images[0] === images[1] &&
        images[1] === images[2] &&
        scratchedCells[a] &&
        scratchedCells[b] &&
        scratchedCells[c]
      );
    });

    return winningLine || [];
  };

  const initializeOverlayCanvas = (canvas: HTMLCanvasElement, index: number) => {
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const parentWidth = canvas.parentElement?.clientWidth || 100;
    const parentHeight = canvas.parentElement?.clientHeight || 100;
    canvas.width = parentWidth;
    canvas.height = parentHeight;
    totalPixelsRef.current[index] = canvas.width * canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#313545';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.alt = 'mesh';
    img.src = '/assets/images/missions/mesh_ser.png';
    img.onload = () => {
      const imgWidth = canvas.width * 0.6;
      const imgHeight = canvas.height * 0.8;
      const x = (canvas.width - imgWidth) / 2;
      const y = (canvas.height - imgHeight) / 2;
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, x, y, imgWidth, imgHeight);
      ctx.globalCompositeOperation = 'destination-out';
    };
    img.onerror = () => console.error(`Failed to load mesh for overlay canvas ${index}`);
  };

  const clearCanvas = (canvas: HTMLCanvasElement, index: number) => {
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      scratchedPixelsRef.current[index] = 0;
      totalPixelsRef.current[index] = 0;
    }
  };

  const updateScratchedPixels = useCallback(
    (index: number) =>
      throttle(() => {
        const canvas = overlayCanvasRefs.current[index];
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        if (!canvas || !ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparentPixels = 0;

        for (let i = 3; i < imageData.data.length; i += 4 * PIXEL_SAMPLE_RATE) {
          if (imageData.data[i] === 0) {
            transparentPixels += PIXEL_SAMPLE_RATE;
          }
        }

        scratchedPixelsRef.current[index] = transparentPixels;
      }, THROTTLE_DELAY_MS),
    []
  );

  const checkScratchProgress = useCallback(
    (index: number) => {
      if (totalPixelsRef.current[index] === 0 || !gameStarted || gameResult) return;
      const scratchedPercentage = scratchedPixelsRef.current[index] / totalPixelsRef.current[index];

      if (scratchedPercentage >= SCRATCH_THRESHOLD && !scratchedCells[index]) {
        setScratchedCells((prev) => {
          const newScratched = [...prev];
          newScratched[index] = true;
          return newScratched;
        });

        setScratchedCount((prev) => prev + 1);

        setRevealedItems((prev) => {
          const newItems = [...prev];
          if (!newItems[index] && grid[index].banner_path) {
            newItems[index] = `${API_URL}/${grid[index].banner_path}`;
          }
          return newItems;
        });
      }
    },
    [gameStarted, gameResult, grid, scratchedCells]
  );

  const checkForWin = useCallback(async () => {
    const updatedGrid = grid.map((cell, index) => ({
      ...cell,
      eraze: scratchedCells[index],
    }));
    const result = await check_win_scratch_game(updatedGrid);
    console.log('CheckForWin result:', result);
    setWinDetails(result);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const resultMessage =
      result.result === 'win'
        ? t('you_won') || 'You Win!'
        : t('you_lost') || 'Game Over - No Match';
    setGameResult(resultMessage);
    setScratchedCells(Array(9).fill(true));
    setRevealedItems(
      grid.map((cell) => {
        const url = cell.banner_path ? `${API_URL}/${cell.banner_path}` : '';
        return url;
      })
    );
    setVisiblePhotos(
      grid.map((cell) => {
        const url = cell.banner_path ? `${API_URL}/${cell.banner_path}` : '';
        return url;
      })
    );
    overlayCanvasRefs.current.forEach((canvas, index) => {
      if (canvas) {
        clearCanvas(canvas, index);
      }
    });
    setIsPlayButtonLocked(false);
    setTimeUntilNextPlay(86_400_000);
  }, [grid, scratchedCells, t, check_win_scratch_game]);

  const getCoordinates = (index: number, event: React.MouseEvent | React.TouchEvent) => {
    const canvas = overlayCanvasRefs.current[index];
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let x: number;
    let y: number;

    if ('touches' in event) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }
    return { x, y };
  };

  const scratch = (index: number, event: React.MouseEvent | React.TouchEvent) => {
    const canvas = overlayCanvasRefs.current[index];
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(index, event);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = SCRATCH_LINE_WIDTH;
    ctx.lineCap = 'round';

    if (lastPositionRef.current[index]) {
      const lastPos = lastPositionRef.current[index]!;
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, SCRATCH_LINE_WIDTH / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    }

    lastPositionRef.current[index] = { x, y };
    updateScratchedPixels(index)();
  };

  const handleScratchStart = (index: number, event: React.MouseEvent | React.TouchEvent) => {
    if (!gameStarted || gameResult || scratchedCells[index]) return;
    if (!startedFields.includes(index) && startedFields.length >= requiredFieldsToScratch) return;

    if (!startedFields.includes(index)) {
      setStartedFields((prev) => [...prev, index]);
      setVisiblePhotos((prev) => {
        const newPhotos = [...prev];
        if (!newPhotos[index] && grid[index].banner_path) {
          newPhotos[index] = `${API_URL}/${grid[index].banner_path}`;
        }
        return newPhotos;
      });
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }

    isScratchingRef.current[index] = true;
    lastPositionRef.current[index] = getCoordinates(index, event);
    scratch(index, event);
  };

  const handleScratchMove = (index: number, event: React.MouseEvent | React.TouchEvent) => {
    if (!isScratchingRef.current[index] || gameResult) return;
    scratch(index, event);
  };

  const handleScratchEnd = (index: number) => {
    if (gameResult) return;
    isScratchingRef.current[index] = false;
    lastPositionRef.current[index] = null;
    checkScratchProgress(index);
  };

  useEffect(() => {
    const canvases = overlayCanvasRefs.current;
    const handleTouchStart = (index: number) => (e: TouchEvent) => {
      const syntheticEvent = { ...e, preventDefault: () => {} } as unknown as React.TouchEvent;
      handleScratchStart(index, syntheticEvent);
    };
    const handleTouchMove = (index: number) => (e: TouchEvent) => {
      const syntheticEvent = { ...e, preventDefault: () => {} } as unknown as React.TouchEvent;
      handleScratchMove(index, syntheticEvent);
    };
    const handleTouchEnd = (index: number) => () => handleScratchEnd(index);
    const handleTouchCancel = (index: number) => () => handleScratchEnd(index);

    const cleanupFuncs: Array<() => void> = [];

    canvases.forEach((canvas, index) => {
      if (canvas) {
        const startHandler = handleTouchStart(index);
        const moveHandler = handleTouchMove(index);
        const endHandler = handleTouchEnd(index);
        const cancelHandler = handleTouchCancel(index);

        canvas.addEventListener('touchstart', startHandler, { passive: false });
        canvas.addEventListener('touchmove', moveHandler, { passive: false });
        canvas.addEventListener('touchend', endHandler);
        canvas.addEventListener('touchcancel', cancelHandler);

        cleanupFuncs.push(() => {
          canvas.removeEventListener('touchstart', startHandler);
          canvas.removeEventListener('touchmove', moveHandler);
          canvas.removeEventListener('touchend', endHandler);
          canvas.removeEventListener('touchcancel', cancelHandler);
        });
      }
    });

    return () => {
      cleanupFuncs.forEach((cleanup) => cleanup());
    };
  }, [gameStarted, gameResult, scratchedCells, startedFields, grid]);

  useEffect(() => {
    if (gameResult && !hasNotifiedResult) {
      console.log('Game Result check:', gameResult, 'Win Details check:', winDetails);
      setOpenResultDialog(true);
      setHasNotifiedResult(true);
    }
  }, [gameResult, hasNotifiedResult, winDetails]);

  useEffect(() => {
    if (winDetails && !gameResult) {
      const resultMessage =
        winDetails.result === 'win'
          ? t('you_won') || 'You Win!'
          : t('you_lost') || 'Game Over - No Match';
      setGameResult(resultMessage);
    }
  }, [winDetails, t]);

  const resetGame = useCallback(() => {
    setGameStarted(false);
    setShowGrid(false);
    setScratchedCells(Array(9).fill(false));
    setRevealedItems(Array(9).fill(''));
    setVisiblePhotos(Array(9).fill(''));
    setGrid(Array(9).fill({ _id: null, banner_path: '', eraze: false }));
    setScratchedCount(0);
    setGameResult(null);
    setHasNotifiedResult(false);
    setStartedFields([]);
    setWinningIndices([]);
    isScratchingRef.current = Array(9).fill(false);
    lastPositionRef.current = Array(9).fill(null);
    scratchedPixelsRef.current = Array(9).fill(0);
    totalPixelsRef.current = Array(9).fill(0);
    overlayCanvasRefs.current.forEach((canvas, index) => {
      if (canvas) {
        clearCanvas(canvas, index);
      }
    });
    setIsPlayButtonLocked(false);
  }, []);

  useEffect(() => {
    if (gameStarted) {
      overlayCanvasRefs.current.forEach((canvas, index) => {
        if (canvas) {
          clearCanvas(canvas, index);
          initializeOverlayCanvas(canvas, index);
        }
      });
    }
  }, [gameStarted, grid]);

  useEffect(() => {
    if (scratchedCount === requiredFieldsToScratch && !gameResult) {
      checkForWin();
    }
  }, [scratchedCount, gameResult, checkForWin]);

  const handleBack = useCallback(() => {
    if (setActiveMiniGame) {
      setActiveMiniGame(null);
    }
    if (setActiveTab) {
      setActiveTab('mini-games');
    }
  }, [setActiveMiniGame, setActiveTab]);

  const handleMobileBack = useCallback(() => {
    resetGame();
    setShowGrid(false);
  }, [resetGame]);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => !prev);
  }, []);

  const handleHelp = useCallback(() => {
    setOpenRules(true);
  }, []);

  const handleCloseRules = useCallback(() => {
    setOpenRules(false);
  }, []);

  const handleCloseResultDialog = useCallback(() => {
    setOpenResultDialog(false);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setOpenResultDialog(false);
    resetGame();
  }, []);

  const handleReset = useCallback(async () => {
    if (isLoading || isPlayButtonLocked) {
      return;
    }
    setIsLoading(true);
    try {
      const gridData = await checkScratchGame();
      if (gridData.length > 0) {
        resetGame();
        setGrid(gridData);
        setGameStarted(true);
        setShowGrid(true);
      }
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [resetGame, checkScratchGame, isLoading, isPlayButtonLocked]);

  const handlePlay = useCallback(
    debounce(async () => {
      if (isPlayButtonLocked || isLoading || timeUntilNextPlay) {
        return;
      }
      setIsLoading(true);
      setIsPlayButtonLocked(true);
      try {
        const gridData = await checkScratchGame();
        if (gridData.length > 0) {
          resetGame();
          setGrid(gridData);
          setGameStarted(true);
          setShowGrid(true);
        }
      } catch (error) {
        console.error('Play failed:', error);
        setIsPlayButtonLocked(false);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [resetGame, checkScratchGame, isLoading, isPlayButtonLocked, timeUntilNextPlay]
  );

  const handlePlayButtonClick = () => {
    if (window.innerWidth < 600) {
      setShowGrid(true);
      handlePlay();
    } else {
      handlePlay();
    }
  };

  const preventDefaultInteractions = useCallback((e: React.SyntheticEvent) => {}, []);

  const cardImageStyles = {
    width: '60%',
    height: '80%',
    objectFit: 'contain',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  } as const;

  let playButtonText = 'Play';
  if (isLoading) {
    playButtonText = 'Loading...';
  } else if (isPlayButtonLocked) {
    playButtonText = 'Playing...';
  } else if (timeUntilNextPlay) {
    playButtonText = 'Locked';
  }

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeUntilNextPlay && timeUntilNextPlay > 0) {
      interval = setInterval(() => {
        setTimeUntilNextPlay((prev) => (prev! > 1000 ? prev! - 1000 : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeUntilNextPlay]);

  return (
    <Box
      sx={{
        bgcolor: '#1a2a1a',
        pt: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 3, md: 4 },
        height: 'auto',
        minHeight: '100%',
        borderRadius: 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url('/assets/images/missions/scratch_background1.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        boxSizing: 'border-box',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      onDragStart={preventDefaultInteractions}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url('/assets/images/missions/scratch_background1.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />

      {timeUntilNextPlay && timeUntilNextPlay > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            color: '#FFF',
            padding: 2,
            borderRadius: 1,
            filter: 'none',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Impact, sans-serif',
              fontSize: { xs: 18, sm: 24 },
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Timer till next game: {formatTime(timeUntilNextPlay)}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: { xs: 'static', sm: 'sticky' },
          top: { sm: 0 },
          zIndex: { xs: 'auto', sm: 1000 },
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            onClick={window.innerWidth < 600 && showGrid ? handleMobileBack : handleBack}
            sx={
              window.innerWidth < 600 && showGrid
                ? {
                    ...mobileBackIconSx,
                    width: 48,
                    height: 48,
                    minWidth: 48,
                    padding: 0,
                  }
                : backButtonSx
            }
            aria-label={
              window.innerWidth < 600 && showGrid
                ? t('back_to_start') || 'Back to Start'
                : t('back_button') || 'Back to Games'
            }
          >
            {!(window.innerWidth < 600 && showGrid) && (
              <>
                <Box
                  sx={{
                    width: 0,
                    height: 0,
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderRight: '8px solid #A0A3A7',
                    marginRight: '0px',
                  }}
                />
                Back to Games
              </>
            )}
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            background: 'transparent',
            border: '1px solid #24ee89',
            borderRadius: '8px',
            padding: '4px 8px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
            WebkitFilter: timeUntilNextPlay ? 'blur(2px) brightness(0.8)' : 'none',
            filter: timeUntilNextPlay ? 'blur(2px) brightness(0.8)' : 'none',
          }}
        >
          <IconButton
            onClick={handleHelp}
            sx={iconButtonSx}
            aria-label={t('help_button') || 'Help'}
            disabled={!!timeUntilNextPlay}
          >
            <Iconify icon="mdi:help-circle" sx={{ width: 24, height: 24 }} />
          </IconButton>
          <Box sx={{ height: '24px', width: '1px', border: '1px solid #fdf901ff' }} />
          <IconButton
            onClick={handleReset}
            sx={iconButtonSx}
            aria-label={t('reset_button') || 'Reset game'}
            disabled={!!timeUntilNextPlay}
          >
            <Iconify icon="mdi:refresh" sx={{ width: 24, height: 24 }} />
          </IconButton>
          <Box sx={{ height: '24px', width: '1px', border: '1px solid #fdf901ff' }} />
          <IconButton
            onClick={toggleSound}
            sx={iconButtonSx}
            aria-label={
              soundOn ? t('mute_sound') || 'Mute sound' : t('unmute_sound') || 'Unmute sound'
            }
            disabled={!!timeUntilNextPlay}
          >
            <Iconify
              icon={soundOn ? 'mdi:volume-high' : 'mdi:volume-off'}
              sx={{ width: 24, height: 24 }}
            />
          </IconButton>
        </Box>
      </Box>

      <Dialog open={openRules} onClose={handleCloseRules} sx={dialogSx}>
        <IconButton onClick={handleCloseRules} sx={closeButtonSx}>
          <Iconify icon="mdi:close" width={20} height={20} />
        </IconButton>
        <DialogContent sx={{ p: 3 }}>
          <Typography
            sx={{
              color: '#FFF',
              fontFamily: 'Impact, sans-serif',
              fontSize: { xs: '20px', sm: '24px' },
              fontWeight: 400,
              textTransform: 'uppercase',
              mb: 2,
              textAlign: 'center',
            }}
          >
            {t(gameRules.title.toLowerCase()) || gameRules.title}
          </Typography>
          <Stack spacing={1}>
            {gameRules.rules.map((rule, index) => (
              <Typography
                key={index}
                sx={{
                  color: '#FFF',
                  fontFamily: 'Cera Pro, sans-serif',
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: '1.5',
                }}
              >
                {index + 1}. {t(rule.toLowerCase()) || rule}
              </Typography>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog
        open={openResultDialog}
        onClose={handleCloseResultDialog}
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: '#232626',
            borderRadius: '16px',
            border: '2px solid #24ee89',
            width: { xs: '90%', sm: '450px' },
            maxWidth: '450px',
            padding: '32px 24px',
            boxSizing: 'border-box',
            textAlign: 'center',
          },
        }}
      >
        <IconButton
          onClick={handleCloseResultDialog}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: '#FFF',
            bgcolor: '#2B2F3D',
            border: '1px solid #24ee89',
            borderRadius: '50%',
            width: 36,
            height: 36,
            '&:hover': {
              bgcolor: '#3B3F4D',
            },
          }}
        >
          <Iconify icon="mdi:close" width={20} height={20} />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          {/* Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background:
                winDetails?.result === 'win'
                  ? 'linear-gradient(135deg, #24ee89 0%, #FFC700 100%)'
                  : 'linear-gradient(135deg, #FF4444 0%, #CC0000 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '48px',
            }}
          >
            {winDetails?.result === 'win' ? '🏆' : '😔'}
          </Box>

          {/* Title */}
          <Typography
            sx={{
              color: '#FFF',
              fontFamily: 'Geogrotesque Cyr',
              fontSize: { xs: '28px', sm: '32px' },
              fontWeight: 700,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            {winDetails?.result === 'win' ? t('you_won') || 'You Win!' : t('you_lost') || 'Try Again!'}
          </Typography>

          {/* Points/Rewards */}
          {winDetails?.result === 'win' && winDetails?.reward && (
            <Box sx={{ mb: 3 }}>
              {winDetails.reward.pointsAwarded && (
                <Box
                  sx={{
                    background: '#24ee89',
                    color: '#141722',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    fontFamily: 'Geogrotesque Cyr',
                    fontWeight: 600,
                    fontSize: '24px',
                  }}
                >
                  <span>+{winDetails.reward.pointsAwarded}</span>
                  <span style={{ fontSize: '18px' }}>points</span>
                </Box>
              )}
              {winDetails.reward.purchases && winDetails.reward.purchases.length > 0 && (
                <Typography
                  sx={{
                    color: '#24ee89',
                    fontFamily: 'Geogrotesque Cyr',
                    fontSize: '16px',
                    fontWeight: 500,
                    mt: 2,
                  }}
                >
                  + {winDetails.reward.purchases.length} store rewards
                </Typography>
              )}
            </Box>
          )}

          {/* Message */}
          <Typography
            sx={{
              color: '#A0A3A7',
              fontFamily: 'Geogrotesque Cyr',
              fontSize: '16px',
              fontWeight: 400,
              mb: 4,
              lineHeight: 1.5,
            }}
          >
            {winDetails?.result === 'win'
              ? t('congratulations_you_matched_3_items') || 'Congratulations! You matched 3 items!'
              : t('no_match_this_time') || 'No match this time. Come back in 24 hours!'}
          </Typography>

          {/* Action Buttons */}
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
            <Button
              onClick={handleCloseResultDialog}
              sx={{
                background: 'transparent',
                border: '1px solid #24ee89',
                borderRadius: '8px',
                padding: '12px 32px',
                color: '#24ee89',
                fontFamily: 'Geogrotesque Cyr',
                fontWeight: 600,
                fontStyle: 'italic',
                fontSize: '16px',
                textTransform: 'uppercase',
                '&:hover': {
                  background: 'rgba(138, 43, 226, 0.1)',
                },
              }}
            >
              {t('close') || 'Close'}
            </Button>
            {!timeUntilNextPlay && (
              <Button
                onClick={handlePlayAgain}
                sx={{
                  background: '#24ee89',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 32px',
                  color: '#141722',
                  fontFamily: 'Geogrotesque Cyr',
                  fontWeight: 600,
                  fontStyle: 'italic',
                  fontSize: '16px',
                  textTransform: 'uppercase',
                  '&:hover': {
                    background: '#FFC700',
                  },
                }}
              >
                {t('play_again') || 'Play Again'}
              </Button>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'flex-start', sm: 'center' },
          alignItems: 'center',
          minHeight: { xs: 'calc(100% - 48px)', sm: 'calc(100% - 56px)', md: 'calc(100% - 60px)' },
          mt: { xs: 2, sm: 2, md: '20px' },
          WebkitFilter: timeUntilNextPlay ? 'blur(2px) brightness(0.8)' : 'none',
          filter: timeUntilNextPlay ? 'blur(2px) brightness(0.8)' : 'none',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', sm: '90%', md: '858px' },
            height: { xs: '0', sm: '0', md: '571px' },
            paddingTop: { xs: '66.55%', sm: '66.55%', md: 0 },
            maxWidth: '858px',
            margin: '0 auto',
            WebkitFilter: timeUntilNextPlay ? 'blur(2px) brightness(0.8)' : 'none',
            filter: timeUntilNextPlay ? 'blur(2px) brightness(0.8)' : 'none',
          }}
        >
          <Box
            sx={{
              position: { xs: 'absolute', sm: 'absolute', md: 'relative' },
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(26, 29, 41, 0.5)',
              border: { xs: 'none', sm: '2px solid #313545', md: '2px solid #313545' },
              borderRadius: '2px',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              display: { xs: 'flex', sm: 'block' },
              flexDirection: { xs: 'column', sm: 'unset' },
              alignItems: { xs: 'center', sm: 'unset' },
              gap: { xs: 2, sm: 0 },
            }}
            onDragStart={preventDefaultInteractions}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(26, 29, 41, 0.5)',
                zIndex: 0,
                borderRadius: '2px',
                display: { xs: 'none', sm: 'block' },
              }}
            />

            {!(window.innerWidth < 600 && showGrid) && (
              <>
                <Box
                  component="img"
                  src="/assets/images/missions/scratch.png"
                  alt="Scratch Game Logo"
                  draggable={false}
                  sx={{
                    position: { xs: 'relative', sm: 'absolute' },
                    top: { xs: 'auto', sm: '-20%', md: '-80px' },
                    left: { xs: 'auto', sm: '-2%', md: '5px' },
                    width: { xs: '40%', sm: '368px', md: '368px' },
                    height: { xs: 'auto', sm: '199px', md: '199px' },
                    zIndex: 2,
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    pointerEvents: 'none',
                  }}
                  onDragStart={preventDefaultInteractions}
                />

                <Box
                  sx={{
                    position: { xs: 'relative', sm: 'absolute' },
                    top: { xs: 'auto', sm: '15%', md: '100px' },
                    left: { xs: 'auto', sm: '0%', md: '0px' },
                    width: { xs: '55%', sm: '50%', md: '380px' },
                    height: { xs: '15%', sm: '14%', md: '80px' },
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingLeft: { xs: '16px', sm: '20px', md: '24px' },
                    fontFamily: 'Geogrotesque Cyr',
                    fontWeight: 600,
                    fontStyle: 'italic',
                    fontSize: { xs: '24px', sm: '28px', md: '32px' },
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    zIndex: 1,
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    whiteSpace: 'nowrap',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'linear-gradient(258.63deg, #24ee89 73.92%, #24ee89 77.74%)',
                      clipPath: 'polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%)',
                      zIndex: -2,
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '1px',
                      left: '1px',
                      right: '1px',
                      bottom: '1px',
                      background: '#232626',
                      clipPath:
                        'polygon(0 0, calc(100% - 1px) 0, calc(100% - 31px) calc(100% - 1px), 0 calc(100% - 1px))',
                      zIndex: -1,
                    },
                  }}
                >
                  <span style={{ color: '#24ee89' }}>LuckVerse777</span>
                  <span style={{ color: '#FFFFFF', marginLeft: '8px' }}>scratch</span>
                </Box>

                <Box
                  sx={{
                    position: { xs: 'relative', sm: 'absolute' },
                    top: { xs: 'auto', sm: '28%', md: '190px' },
                    left: { xs: 'auto', sm: '3%', md: '38px' },
                    width: { xs: '80%', sm: '40%', md: '318px' },
                    height: { xs: 'auto', sm: '42%', md: '237px' },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                  }}
                >
                  <img
                    src="/assets/images/missions/reward1.png"
                    alt="Reward"
                    draggable={false}
                    style={{
                      width: '100%',
                      height: 'auto',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'none',
                      pointerEvents: 'none',
                    }}
                    onDragStart={preventDefaultInteractions}
                  />
                </Box>
              </>
            )}

            <Box
              sx={{
                position: { xs: 'relative', sm: 'absolute' },
                top: { xs: 'auto', sm: '7%', md: '50px' },
                left: { xs: 'auto', sm: '47.79%', md: '410px' },
                width: { xs: '100%', sm: '48%', md: '390px' },
                fontFamily: 'Geogrotesque Cyr',
                fontWeight: 600,
                fontStyle: 'italic',
                lineHeight: '100%',
                textAlign: 'center',
                textTransform: 'uppercase',
                zIndex: 1,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                whiteSpace: 'normal',
                display: { xs: showGrid ? 'block' : 'none', sm: 'block' },
                mt: { xs: showGrid ? 4 : 2, sm: 0 },
              }}
            >
              <span style={{ color: '#FFF' }}>scratch and match </span>
              <span style={{ color: '#24ee89' }}>3 items</span>
              <span style={{ color: '#FFF' }}> to win</span>
            </Box>

            <Box
              sx={{
                position: 'relative',
                width: { xs: '90%', sm: '48%', md: '390px' },
                height: { xs: 'auto', sm: '65%', md: '390px' },
                maxWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: { xs: window.innerWidth < 600 && showGrid ? 1 : 2, sm: 0 },
              }}
            >
              <Box
                sx={{
                  position: { xs: 'relative', sm: 'absolute' },
                  top: { xs: 'auto', sm: '15%', md: '80px' },
                  left: { xs: 'auto', sm: '47.79%', md: '410px' },
                  transform: { xs: 'none', sm: 'none' },
                  width: '100%',
                  height: { xs: 'auto', sm: '65%', md: '390px' },
                  maxWidth: '100%',
                  background: '#232626',
                  border: '2px solid #313545',
                  borderRadius: { xs: '8px', sm: '12px', md: '16px' },
                  display: { xs: showGrid ? 'grid' : 'none', sm: 'grid' },
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap: { xs: '8px', sm: '10px', md: '14px' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: { xs: '8px', sm: '10px', md: '14px' },
                  zIndex: 1,
                  boxSizing: 'border-box',
                }}
              >
                {[...Array(9)].map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      background:
                        (index === 4 && !gameStarted && !gameResult) ||
                        (gameResult && winningIndices.includes(index))
                          ? 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)'
                          : '#313545',
                      border:
                        (index === 4 && !gameStarted && !gameResult) ||
                        (gameResult && winningIndices.includes(index))
                          ? '1px solid #24ee89'
                          : '1px solid #888888',
                      borderRadius: '5.82px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor:
                        gameStarted &&
                        !gameResult &&
                        (startedFields.includes(index) ||
                          startedFields.length < requiredFieldsToScratch)
                          ? 'pointer'
                          : 'default',
                    }}
                  >
                    {!gameStarted && !gameResult && (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          background: '#313545',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}
                      >
                        <img
                          src="/assets/images/missions/mesh_ser.png"
                          alt={`Mesh bag ${index + 1}`}
                          style={{
                            width: '60%',
                            height: '80%',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            objectFit: 'contain',
                          }}
                          onDragStart={preventDefaultInteractions}
                        />
                      </Box>
                    )}

                    {gameStarted && visiblePhotos[index] && (
                      <img
                        src={visiblePhotos[index]}
                        alt={`Background Item ${index + 1}`}
                        style={{
                          ...cardImageStyles,
                          zIndex: 1,
                        }}
                        onDragStart={preventDefaultInteractions}
                        onError={() =>
                          console.error(
                            `Failed to load visible photo at index ${index}: ${visiblePhotos[index]}`
                          )
                        }
                      />
                    )}

                    {gameStarted &&
                      !scratchedCells[index] &&
                      (startedFields.includes(index) ||
                        startedFields.length < requiredFieldsToScratch) &&
                      !gameResult && (
                        <canvas
                          ref={(el) => {
                            overlayCanvasRefs.current[index] = el;
                          }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                            zIndex: 2,
                          }}
                          onMouseDown={(e) => handleScratchStart(index, e)}
                          onMouseMove={(e) => handleScratchMove(index, e)}
                          onMouseUp={() => handleScratchEnd(index)}
                          onMouseLeave={() => handleScratchEnd(index)}
                          onTouchStart={(e) => handleScratchStart(index, e)}
                          onTouchMove={(e) => handleScratchMove(index, e)}
                          onTouchEnd={() => handleScratchEnd(index)}
                          onTouchCancel={() => handleScratchEnd(index)}
                        />
                      )}

                    {(scratchedCells[index] || gameResult) && revealedItems[index] && (
                      <img
                        src={revealedItems[index]}
                        alt={`Item ${index + 1}`}
                        style={{
                          ...cardImageStyles,
                          zIndex: 1,
                        }}
                        onDragStart={preventDefaultInteractions}
                        onError={() =>
                          console.error(
                            `Failed to load revealed item at index ${index}: ${revealedItems[index]}`
                          )
                        }
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {!(window.innerWidth < 600 && showGrid) && (
              <>
                <Button
                  sx={playButtonSx}
                  onClick={handlePlayButtonClick}
                  disabled={isLoading || isPlayButtonLocked || !!timeUntilNextPlay}
                >
                  {playButtonText}
                </Button>

                <Box
                  sx={{
                    position: { xs: 'relative', sm: 'absolute' },
                    top: { xs: 'auto', sm: '85.81%', md: '490px' },
                    left: { xs: 'auto', sm: '3%', md: '38px' },
                    transform: { xs: 'none', sm: 'none' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: { xs: '4px', sm: '2px', md: '4px' },
                    zIndex: 1,
                    WebkitFilter: timeUntilNextPlay ? 'blur(2px) brightness(0.8)' : 'none',
                    filter: timeUntilNextPlay ? 'blur(2px) brightness(0.8)' : 'none',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#FFF',
                      fontFamily: 'Impact',
                      fontWeight: 400,
                      fontSize: { xs: '14px', sm: '14px', md: '17px' },
                      lineHeight: '100%',
                      letterSpacing: 0,
                      textTransform: 'uppercase',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#FFF',
                        fontFamily: 'Geogrotesque Cyr',
                        fontWeight: 500,
                        fontSize: { xs: '14px', sm: '14px', md: '17px' },
                        lineHeight: '100%',
                        letterSpacing: '0px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Attempt cost:
                    </Typography>
                    <Box
                      sx={{
                        background: '#24ee89',
                        color: '#141722',
                        borderRadius: '4px',
                        padding: { xs: '2px 4px', sm: '3px 6px', md: '4px 8px' },
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {scratchCost}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#FFF',
                      fontFamily: 'Impact',
                      fontWeight: 400,
                      fontSize: { xs: '14px', sm: '14px', md: '17px' },
                      lineHeight: '100%',
                      letterSpacing: 0,
                      textTransform: 'uppercase',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#FFF',
                        fontFamily: 'Geogrotesque Cyr',
                        fontWeight: 500,
                        fontSize: { xs: '14px', sm: '14px', md: '17px' },
                        lineHeight: '100%',
                        letterSpacing: '0px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Balance:
                    </Typography>
                    <Box
                      sx={{
                        background: '#24ee89',
                        color: '#141722',
                        borderRadius: '4px',
                        padding: { xs: '2px 4px', sm: '3px 6px', md: '4px 8px' },
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {userPoints}
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ScratchGame;