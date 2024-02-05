document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const startGameButton = document.getElementById('startGame');
    const restartGameButton = document.getElementById('restartGame');
    const scoreDisplay = document.getElementById('score');
    const completionMessage = document.getElementById('completionMessage');
    
    let matchesFound = 0;
    let score = 0;
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'red', 'blue', 'green', 'orange', 'purple', 'pink'];

    startGameButton.addEventListener('click', startGame);
    restartGameButton.addEventListener('click', restartGame);

    function createCard(color) {
        const card = document.createElement('div');
        card.classList.add('memory-card');

        const frontFace = document.createElement('div');
        frontFace.classList.add('front');

        const backFace = document.createElement('div');
        backFace.classList.add('back', color);

        card.appendChild(frontFace);
        card.appendChild(backFace);
        card.addEventListener('click', flipCard);

        return card;
    }

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
        return array;
    }

    function startGame() {
        gameBoard.innerHTML = '';
        shuffle(colors).forEach(color => {
            gameBoard.appendChild(createCard(color));
        });
        score = 0;
        scoreDisplay.textContent = score;
        lockBoard = false;
        matchesFound = 0;
    }

    function flipCard() {
        if (lockBoard || this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.querySelector('.back').className === secondCard.querySelector('.back').className;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        matchesFound++;
        checkGameCompletion();

        score++;
        scoreDisplay.textContent = score;

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');

            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function triggerConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    function checkGameCompletion() {
        if (matchesFound === colors.length / 2) {
            completionMessage.classList.add('show');
            triggerConfetti();
            completionMessage.addEventListener('click', hideCompletionMessage);
        }
    }

    function hideCompletionMessage() {
        completionMessage.classList.remove('show');
        completionMessage.removeEventListener('click', hideCompletionMessage); // Optional: Remove the event listener
    }

    function restartGame() {
        gameBoard.innerHTML = '';
        score = 0;
        matchesFound = 0;
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        scoreDisplay.textContent = score;
        completionMessage.classList.remove('show');

        startGame();
    }
});
