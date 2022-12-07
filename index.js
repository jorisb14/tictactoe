
window.addEventListener('DOMContentLoaded', () => {
	const tiles = Array.from(document.querySelectorAll('.cell'));
	const playerDisplay = document.querySelector('.display-player');
	const resetButton = document.querySelector('#reset');
	const announcer = document.querySelector('.announcer');
	const clearButton = document.querySelector('#clear');

	const xName = document.querySelector('#xName');
	const oName = document.querySelector('#oName');
	
	if (xName.value == '')
		xName.value = "Player 1"

	if (oName.value == '')
		oName.value = "Player 2"

	const xScore = document.getElementById('xScore');
	const oScore = document.getElementById('oScore');

	if (xScore.innerText == '')
		xScore.innerText = "0"

	if (oScore.innerText == '')
		oScore.innerText = "0"

	const X = document.querySelector('.x');
	const O = document.querySelector('.o');

	X.innerText = xName.value
	O.innerText = oName.value

	xScore.innerText = sessionStorage.getItem(xName.value)
	oScore.innerText = sessionStorage.getItem(oName.value)

	playerDisplay.innerText = X.innerText;

	let board = ['', '', '', '', '', '', '', '', ''];
	let currentPlayer = 'X';
	let isGameActive = true;

	const PLAYERX_WON = 'PLAYERX_WON';
	const PLAYERO_WON = 'PLAYERO_WON';
	const TIE = 'TIE';

	const winningConditions =
	[
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	function handleResultValidation()
	{
		let roundWon = false;
		for (let i = 0; i <= 7; i++)
		{
			const winCondition = winningConditions[i];
			const a = board[winCondition[0]];
			const b = board[winCondition[1]];
			const c = board[winCondition[2]];
			if (a === '' || b === '' || c === '') {
				continue;
			}
			if (a === b && b === c) {
				roundWon = true;
				break;
			}
		}

		if (roundWon)
		{
			var ptw = ''

			if (currentPlayer === 'X')
			{
				ptw = xName.value
			}
			else
			{
				ptw = oName.value
			}

			announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON, ptw);
			isGameActive = false;

			if (currentPlayer === 'X')
			{
				var p = Number(sessionStorage.getItem(xName.value)) + 1;
				sessionStorage.setItem(xName.value, p.toString());
				xScore.innerText = p.toString()
			}
			else
			{
				var p = Number(sessionStorage.getItem(oName.value)) + 1;
				sessionStorage.setItem(oName.value, p.toString());
				oScore.innerText = p.toString()
			}

			return;
		}

		if (!board.includes(''))
		{
			announce(TIE, '');
		}
	}

	const announce = (type, playerName) =>
	{
		switch(type)
		{
			case PLAYERO_WON:
				announcer.innerHTML = 'Player <span class="playerO">' + playerName + '</span> Won';
				break;
			case PLAYERX_WON:
				announcer.innerHTML = 'Player <span class="playerX">' + playerName + '</span> Won';
				break;
			case TIE:
				announcer.innerText = 'Tie';
		}

		announcer.classList.remove('hide');
	};

	const isValidAction = (cell) =>
	{
		if (cell.innerText === 'X' || cell.innerText === 'O')
		{
			return false;
		}

		return true;
	};

	const updateBoard =  (index) =>
	{
		board[index] = currentPlayer;
	}

	const changePlayer = () =>
	{
		playerDisplay.classList.remove(`player${currentPlayer}`);
		currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
		playerDisplay.innerText = currentPlayer === 'X' ? xName.value : oName.value;
		playerDisplay.classList.add(`player${currentPlayer}`);
	}

	const userAction = (cell, index) =>
	{
		if (isValidAction(cell) && isGameActive)
		{
			cell.innerText = currentPlayer;
			cell.classList.add(`player${currentPlayer}`);
			updateBoard(index);
			handleResultValidation();
			changePlayer();
		}
	}
	
	const resetBoard = () =>
	{
		board = ['', '', '', '', '', '', '', '', ''];
		isGameActive = true;
		announcer.classList.add('hide');

		if (currentPlayer === 'O')
		{
			changePlayer();
		}

		tiles.forEach(cell =>
		{
			cell.innerText = '';
			cell.classList.remove('playerX');
			cell.classList.remove('playerO');
		});
	}

	tiles.forEach( (cell, index) =>
	{
		cell.addEventListener('click', () => userAction(cell, index));
	});

	const clearCache = () =>
	{
		sessionStorage.setItem(xName.value, "0");
		sessionStorage.setItem(oName.value, "0");

		xScore.innerText = "0";
		oScore.innerText = "0";

		xName.value = "Player 1";
		oName.value = "Player 2";
	}

	const onXNameChange = (event) => 
	{
		X.innerText = event.target.value
	}

	const onONameChange = (event) => 
	{
		O.innerText = event.target.value
	}

	resetButton.addEventListener('click', resetBoard);
	clearButton.addEventListener('click', clearCache);
	xName.addEventListener('change', onXNameChange);
	oName.addEventListener('change', onONameChange);
});
