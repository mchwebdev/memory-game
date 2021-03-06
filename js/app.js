// Variable declarations
// Array of cards
const cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
const doubledCards = cards.concat(cards);
let openCards = [];

// Utils stores shuffle and startTimer functions
const utils = {};
const game = {
	moves: 0,
	matchesFound: 0,
	starRating: 3
};
let timer;
let sec = 0;
const seconds = document.querySelectorAll('.seconds');
const minutes = document.querySelectorAll('.minutes');
const card = document.getElementsByClassName('card');

// Shuffle function from http://stackoverflow.com/a/2450976
utils.shuffle = function(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

// Function to start the timer on the first click
utils.startTimer = function() {
	// Remove the event listener to prevent timer to trigger more than once
	for (let i = 0; i < card.length; i++) {
		card[i].removeEventListener('click', utils.startTimer);
	}

	function time(val) {
		return val > 9 ? val : '0' + val;
	}
	timer = setInterval(function () {

		// Updates the innerText of the timer during playing
		seconds[0].innerText = time(++sec % 60);
		minutes[0].innerText = time(parseInt(sec / 60, 10));

		// Updates the innerText of the popup when the game is won
		seconds[1].innerText = seconds[0].innerText;
		minutes[1].innerText = minutes[0].innerText;
	}, 1000);
};

// Create a new board adding html to the DOM
function newBoard() {
	const shuffledDeck = utils.shuffle(doubledCards);
	let output = '';
	const deck = document.querySelector('.deck');
	for (let i = 0; i < shuffledDeck.length; i++) {
		output += `<li class="card"><i class="fa ${shuffledDeck[i]}"></i></li>`;
	}
	deck.innerHTML = output;
	return deck;
}

// Find matching cards
function displayCard() {
	// Adds a click event to each card
	for (let i = 0; i < card.length; i++) {
		card[i].addEventListener('click', playMemory);
	}
}

function playMemory(e) {
	const target = e.target;
	if (target.className === 'card open show') {
		return;
	} else {
		target.className = 'card open show';
	}
	openCards.push(target);

	// Check if openCards contains 2 cards
	if (openCards.length === 2) {

		// Remove the event listener to avoid opening new cards before the end of the setTimeout
		for (let i = 0; i < card.length; i++) {
			card[i].removeEventListener('click', playMemory);
		}

		// Check if the classlist matches
		if (openCards[0].firstChild.classList[1] === openCards[1].firstChild.classList[1]) {

			// If classes match, add 'match' class to display the card permanently
			openCards[0].classList.add('match');
			openCards[1].classList.add('match');

			// Reset the click event listener
			for (let i = 0; i < card.length; i++) {
				card[i].addEventListener('click', playMemory);
			}

			// Update the matches found and the move count (two cards turned equals 1 move)
			game.matchesFound += 1;
			game.moves += 1;

			// Reset the openCards array
			resetOpenCards();

			// Checks if the game is won
			popupWinner();

		} else {

			// If classes don't match, add "no-match" class
			openCards[0].classList.add('no-match');
			openCards[1].classList.add('no-match');

			// Set timeout to remove "show", "open" and "no-match" classes; reset the openCards array and add 1 to the move count
			setTimeout(function () {
				openCards[0].classList.remove('show', 'open', 'no-match');
				openCards[1].classList.remove('show', 'open', 'no-match');
				resetOpenCards();
			}, 800);
			game.moves += 1;

			// setTimeout to reset the eventListener
			setTimeout(function () {
				for (let i = 0; i < card.length; i++) {
					card[i].addEventListener('click', playMemory);
				}
			}, 800);
		}
	}

	// Update the number of moves and the star rating
	updateMoves();
	updateStarRating();
}

// Reset openCards function
function resetOpenCards() {
	openCards = [];
}

// Update HTML with the number of moves
function updateMoves() {
	const moveCounter = document.querySelector('.moves');
	if (game.moves === 1) {
		moveCounter.innerText = `${game.moves} Move`;
	} else {
		moveCounter.innerText = `${game.moves} Moves`;
	}
}

// Function to update the star rating
function updateStarRating() {
	const star = document.querySelectorAll('.star');
	if (game.moves > 0 && game.moves < 14) {
		game.starRating = game.starRating;
	} else if (game.moves >= 14 && game.moves <= 19) {
		star[2].firstChild.classList.remove('fa-star');
		game.starRating = '2';
	} else if (game.moves > 19) {
		star[1].firstChild.classList.remove('fa-star');
		game.starRating = '1';
	}
}


// Checks if game is won and open popup accordingly
function popupWinner() {
	if (game.matchesFound === 8) {
		const popup = document.querySelector('.win-popup');
		const totalMoves = document.querySelector('.total-moves');
		const totalStars = document.querySelector('.total-stars');
		const playAgainBtn = document.querySelector('.play-again-btn');

		// Stops the timer when the game is won
		clearInterval(timer);

		// Prints the number of moves and the star rating to the popup
		totalMoves.innerText = game.moves;
		totalStars.innerText = game.starRating;

		// Changes the display:none to flex in order for the popup to be visible
		popup.style.display = 'flex';

		// Add click event to the play again button to restart the game
		playAgainBtn.addEventListener('click', () => location.reload());
	}
}

// Function to restart the game when icon is clicked
function restartGame() {
	const restart = document.querySelector('.restart');
	restart.addEventListener('click', () => location.reload());
}

// Call functions
newBoard();
displayCard();
restartGame();

// Click event to call the startTimer function when first card is clicked
for (let i = 0; i < card.length; i++) {
	card[i].addEventListener('click', utils.startTimer);
}
