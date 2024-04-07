import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Heading, keyframes } from "@chakra-ui/react";

const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 600;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const BALL_SPEED = 5;

const Index = () => {
  const [player1Y, setPlayer1Y] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [player2Y, setPlayer2Y] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ballX, setBallX] = useState(BOARD_WIDTH / 2 - BALL_SIZE / 2);
  const [ballY, setBallY] = useState(BOARD_HEIGHT / 2 - BALL_SIZE / 2);
  const [ballSpeedX, setBallSpeedX] = useState(BALL_SPEED);
  const [ballSpeedY, setBallSpeedY] = useState(BALL_SPEED);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const gameLoop = useRef();

  const moveBall = () => {
    setBallX((prevX) => prevX + ballSpeedX);
    setBallY((prevY) => prevY + ballSpeedY);
  };

  const checkCollision = () => {
    if (ballY <= 0 || ballY >= BOARD_HEIGHT - BALL_SIZE) {
      setBallSpeedY((prevSpeed) => -prevSpeed);
    }

    if ((ballX <= PADDLE_WIDTH && ballY >= player1Y && ballY <= player1Y + PADDLE_HEIGHT) || (ballX >= BOARD_WIDTH - PADDLE_WIDTH - BALL_SIZE && ballY >= player2Y && ballY <= player2Y + PADDLE_HEIGHT)) {
      setBallSpeedX((prevSpeed) => -prevSpeed);
    }

    if (ballX <= 0) {
      setPlayer2Score((prevScore) => prevScore + 1);
      resetBall();
    } else if (ballX >= BOARD_WIDTH - BALL_SIZE) {
      setPlayer1Score((prevScore) => prevScore + 1);
      resetBall();
    }
  };

  const resetBall = () => {
    setBallX(BOARD_WIDTH / 2 - BALL_SIZE / 2);
    setBallY(BOARD_HEIGHT / 2 - BALL_SIZE / 2);
    setBallSpeedX((prevSpeed) => -prevSpeed);
  };

  const startGame = () => {
    setGameStarted(true);
    gameLoop.current = setInterval(() => {
      moveBall();
      checkCollision();
    }, 1000 / 60);
  };

  const resetGame = () => {
    setGameStarted(false);
    setPlayer1Score(0);
    setPlayer2Score(0);
    resetBall();
    clearInterval(gameLoop.current);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && player2Y > 0) {
        setPlayer2Y((prevY) => prevY - 20);
      } else if (e.key === "ArrowDown" && player2Y < BOARD_HEIGHT - PADDLE_HEIGHT) {
        setPlayer2Y((prevY) => prevY + 20);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameLoop.current);
    };
  }, [player2Y]);

  useEffect(() => {
    const player1Move = () => {
      if (ballY < player1Y + PADDLE_HEIGHT / 2 && player1Y > 0) {
        setPlayer1Y((prevY) => prevY - 5);
      } else if (ballY > player1Y + PADDLE_HEIGHT / 2 && player1Y < BOARD_HEIGHT - PADDLE_HEIGHT) {
        setPlayer1Y((prevY) => prevY + 5);
      }
    };

    if (gameStarted) {
      player1Move();
    }
  }, [ballY, gameStarted, player1Y]);

  const bounce = keyframes`
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  `;

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Heading mb={8}>Pong Game</Heading>
      <Box position="relative" width={BOARD_WIDTH} height={BOARD_HEIGHT} bg="gray.100" borderWidth={2}>
        <Box position="absolute" left={0} top={player1Y} width={PADDLE_WIDTH} height={PADDLE_HEIGHT} bg="blue.500" />
        <Box position="absolute" right={0} top={player2Y} width={PADDLE_WIDTH} height={PADDLE_HEIGHT} bg="red.500" />
        <Box position="absolute" left={ballX} top={ballY} width={BALL_SIZE} height={BALL_SIZE} borderRadius="50%" bg="green.500" animation={`${bounce} 0.5s ease-in-out infinite`} />
      </Box>
      <Flex mt={4} align="center">
        <Heading as="h2" size="xl" mr={8}>
          {player1Score} : {player2Score}
        </Heading>
        {!gameStarted ? (
          <Button colorScheme="green" onClick={startGame}>
            Start Game
          </Button>
        ) : (
          <Button colorScheme="red" onClick={resetGame}>
            Reset Game
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Index;
