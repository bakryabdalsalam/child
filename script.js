// Coloring Activity
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentColor = 'red';

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        function startDrawing(e) {
            isDrawing = true;
            draw(e);
        }

        function draw(e) {
            if (!isDrawing) return;
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = currentColor;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }

        function stopDrawing() {
            isDrawing = false;
            ctx.beginPath();
        }

        function setColor(color) {
            currentColor = color;
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Memory Game
        const memoryGame = document.getElementById('memory-game');
        let cards = ['😺', '😺', '🐶', '🐶', '🐘', '🐘', '🦒', '🦒'];
        let flippedCards = [];
        let matchedPairs = 0;

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function createBoard() {
            memoryGame.innerHTML = '';
            shuffle(cards);
            cards.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.symbol = symbol;
                card.addEventListener('click', flipCard);
                memoryGame.appendChild(card);
            });
        }

        function flipCard() {
            if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
                this.classList.add('flipped');
                this.textContent = this.dataset.symbol;
                flippedCards.push(this);
                if (flippedCards.length === 2) {
                    setTimeout(checkMatch, 1000);
                }
            }
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;
            if (card1.dataset.symbol === card2.dataset.symbol) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                if (matchedPairs === cards.length / 2) {
                    alert('مبروك! لقد وجدت كل الأزواج!');
                }
            } else {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '';
                card2.textContent = '';
            }
            flippedCards = [];
        }

        function resetGame() {
            matchedPairs = 0;
            flippedCards = [];
            createBoard();
        }

        // Puzzle Game
        const puzzleGame = document.getElementById('puzzle-game');
        let puzzleTiles = [1, 2, 3, 4, 5, 6, 7, 8, null];

        function createPuzzle() {
            puzzleGame.innerHTML = '';
            puzzleTiles.forEach((tile, index) => {
                const piece = document.createElement('div');
                piece.classList.add('puzzle-piece');
                if (tile) {
                    piece.textContent = tile;
                    piece.addEventListener('click', () => moveTile(index));
                } else {
                    piece.style.backgroundColor = '#f0f8ff';
                }
                puzzleGame.appendChild(piece);
            });
            if (isPuzzleSolved()) {
                alert('مبروك! لقد حللت الأحجية!');
            }
        }

        function moveTile(index) {
            const emptyIndex = puzzleTiles.indexOf(null);
            const validMoves = [
                index - 1 >= 0 && Math.floor((index - 1) / 3) === Math.floor(index / 3) ? index - 1 : null,
                index + 1 < 9 && Math.floor((index + 1) / 3) === Math.floor(index / 3) ? index + 1 : null,
                index - 3 >= 0 ? index - 3 : null,
                index + 3 < 9 ? index + 3 : null
            ];
            if (validMoves.includes(emptyIndex)) {
                [puzzleTiles[index], puzzleTiles[emptyIndex]] = [puzzleTiles[emptyIndex], puzzleTiles[index]];
                createPuzzle();
            }
        }

        function isPuzzleSolved() {
            return puzzleTiles.slice(0, 8).every((tile, i) => tile === i + 1) && puzzleTiles[8] === null;
        }

        function resetPuzzle() {
            puzzleTiles = [1, 2, 3, 4, 5, 6, 7, 8, null];
            shuffle(puzzleTiles);
            createPuzzle();
        }

        // --- Tic-Tac-Toe Game ---
        const ticTacToe = document.getElementById('tic-tac-toe');
        let ticBoard, ticCurrent, ticGameOver;

        function createTicTacToe() {
            ticBoard = Array(9).fill('');
            ticCurrent = '❌';
            ticGameOver = false;
            renderTicTacToe();
        }

        function renderTicTacToe() {
            ticTacToe.innerHTML = '';
            ticBoard.forEach((cell, i) => {
                const div = document.createElement('div');
                div.className = 'tic-cell';
                div.textContent = cell;
                div.onclick = () => ticClick(i);
                ticTacToe.appendChild(div);
            });
        }

        function ticClick(i) {
            if (ticBoard[i] || ticGameOver) return;
            ticBoard[i] = ticCurrent;
            renderTicTacToe();
            if (checkTicWin(ticCurrent)) {
                setTimeout(() => alert('مبروك! فزت!'), 100);
                ticGameOver = true;
                return;
            }
            if (!ticBoard.includes('')) {
                setTimeout(() => alert('تعادل!'), 100);
                ticGameOver = true;
                return;
            }
            ticCurrent = ticCurrent === '❌' ? '⭕' : '❌';
            if (ticCurrent === '⭕') setTimeout(ticBot, 500);
        }

        function ticBot() {
            let empty = ticBoard.map((v, i) => v === '' ? i : null).filter(i => i !== null);
            if (empty.length === 0) return;
            let move = empty[Math.floor(Math.random() * empty.length)];
            ticBoard[move] = '⭕';
            renderTicTacToe();
            if (checkTicWin('⭕')) {
                setTimeout(() => alert('الكمبيوتر فاز!'), 100);
                ticGameOver = true;
            }
            ticCurrent = '❌';
        }

        function checkTicWin(player) {
            const wins = [
                [0,1,2],[3,4,5],[6,7,8],
                [0,3,6],[1,4,7],[2,5,8],
                [0,4,8],[2,4,6]
            ];
            return wins.some(line => line.every(i => ticBoard[i] === player));
        }

        function resetTicTacToe() {
            createTicTacToe();
        }

        // --- Rock Paper Scissors Game ---
        const rpsGame = document.getElementById('rps-game');
        const rpsChoices = [
            {emoji: '🪨', name: 'حجر'},
            {emoji: '📄', name: 'ورقة'},
            {emoji: '✂️', name: 'مقص'}
        ];
        let rpsResultBox;

        function createRPS() {
            rpsGame.innerHTML = '';
            rpsChoices.forEach((c, i) => {
                const btn = document.createElement('button');
                btn.className = 'rps-btn';
                btn.textContent = c.emoji + ' ' + c.name;
                btn.onclick = () => playRPS(i);
                rpsGame.appendChild(btn);
            });
            rpsResultBox = document.createElement('div');
            rpsResultBox.style.fontSize = '1.5em';
            rpsResultBox.style.marginTop = '15px';
            rpsGame.appendChild(rpsResultBox);
        }

        function playRPS(playerIdx) {
            const compIdx = Math.floor(Math.random() * 3);
            let result;
            if (playerIdx === compIdx) result = 'تعادل!';
            else if ((playerIdx + 1) % 3 === compIdx) result = 'خسرت!';
            else result = 'فزت!';
            rpsResultBox.textContent = `أنت اخترت ${rpsChoices[playerIdx].emoji}، الكمبيوتر اختار ${rpsChoices[compIdx].emoji} — ${result}`;
        }

        function resetRPS() {
            createRPS();
        }

        // --- Surprise Me Button ---
        const surprises = [
            'هل تعلم؟ الضفدع يستطيع القفز لمسافة 20 ضعف طوله!',
            'نكتة: لماذا لا يذهب السمك إلى المدرسة؟ لأنه يسبح في البحر!',
            'هل تعلم؟ البطريق لا يستطيع الطيران لكنه سباح ماهر!',
            'نكتة: لماذا الفيل لا يستخدم الكمبيوتر؟ لأنه يخاف من الفأرة!',
            'هل تعلم؟ الحلزون يمكنه النوم لمدة 3 سنوات متواصلة!'
        ];
        function showSurprise() {
            const box = document.getElementById('surprise-box');
            const idx = Math.floor(Math.random() * surprises.length);
            box.textContent = surprises[idx];
            box.style.color = ['#ff4500','#4682b4','#ff69b4','#32cd32','#ffd700'][idx%5];
        }

        // Initialize games
        createBoard();
        resetPuzzle();
        createTicTacToe();
        createRPS();