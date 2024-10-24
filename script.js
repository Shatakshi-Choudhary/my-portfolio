// let board;
// let boardWidth = 360;
// let boardHeight = 570;
// let context;

// // coder avatar
// let birdWidth = 34;
// let birdHeight = 30;
// let birdX = boardWidth / 8;
// let birdY = boardHeight / 2;
// let birdImg;

// let bird = {
//     x: birdX,
//     y: birdY,
//     width: birdWidth,
//     height: birdHeight
// };

// //portfolio blocks (code snippets)
// let blockArray = [];
// let blockWidth = 150;
// let blockHeight = 80;
// let blockX = boardWidth;
// let blockY = 0;

// let codeBlockImg;  // Load a code block image or use text overlays for sections

// //physics
// let velocityX = -2;
// let velocityY = 0;
// let gravity = 0.4;

// let gameOver = false;
// let score = 0;
// let gameStarted = false;

// window.onload = function() {
//     board = document.getElementById("board");
//     board.height = boardHeight;
//     board.width = boardWidth;
//     context = board.getContext("2d");

//     //draw avatar (bird replacement)
//     birdImg = new Image();
//     birdImg.src = "bug.png"; // Your avatar image
//     birdImg.onload = function() {
//         context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
//     }

//     codeBlockImg = new Image();
//     codeBlockImg.src = "block.png"; // Code block image or use context.fillText() for text

//     requestAnimationFrame(update);
//     document.addEventListener("keydown", moveBird);
//     document.addEventListener("touchstart", moveBird);
// }

// function update() {
//     requestAnimationFrame(update);

//     if (!gameStarted) {
//         context.fillStyle = "white";
//         context.font = "20px sans-serif";
//         context.fillText("Press Space to Start", 20, boardHeight / 3);
//         return;
//     }

//     if (gameOver) {
//         return;
//     }

//     context.clearRect(0, 0, board.width, board.height);

//     //bird movement (avatar)
//     velocityY += gravity;
//     bird.y = Math.max(bird.y + velocityY, 0);
//     context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

//     if (bird.y > board.height) {
//         gameOver = true;
//     }

//     //portfolio blocks
//     for (let i = 0; i < blockArray.length; i++) {
//         let block = blockArray[i];
//         block.x += velocityX;
//         context.drawImage(block.img, block.x, block.y, block.width, block.height);

//         context.fillStyle = "black";
//         context.font = "16px sans-serif";
//         context.fillText(block.text, block.x + 40, block.y + block.height / 2); // Display text on each block

//         if (!block.passed && bird.x > block.x + block.width) {
//             score += 1;
//             block.passed = true;
//         }

//         if (detectCollision(bird, block)) {
//             gameOver = true;
//         }
//     }

//     //clear blocks
//     while (blockArray.length > 0 && blockArray[0].x < -blockWidth) {
//         blockArray.shift();
//     }

//     //score
//     context.fillStyle = "white";
//     context.font = "30px sans-serif";
//     context.fillText(score, 5, 45);

//     if (gameOver) {
//         context.fillText("GAME OVER", 5, 90);
//     }
// }

// let lastBlockY = blockY; // Track the last block's Y position
// let minGap = 100; // Minimum vertical gap between blocks

// // Define block types with different text labels
// let blockTypes = [
//     { text: "About Me" },
//     { text: "Projects" },
//     { text: "Skills" },
//     { text: "Contact" }
// ];

// function placeBlocks() {
//     if (gameOver || !gameStarted) {
//         return;
//     }

//     // Ensure new block is placed with a minimum gap from the last block
//     let randomBlockY;

//     do {
//         randomBlockY = blockY + Math.random() * (boardHeight - blockHeight);
//     } while (Math.abs(randomBlockY - lastBlockY) < minGap); // Ensure gap is more than minGap

//     lastBlockY = randomBlockY; // Update the lastBlockY after placing the block

//     // Select a random block type from blockTypes
//     let randomBlockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];

//     // Create a new block object
//     let newBlock = {
//         img: codeBlockImg,
//         x: blockX,
//         y: randomBlockY,
//         width: blockWidth,
//         height: blockHeight,
//         text: randomBlockType.text, // Set the block's text
//         passed: false
//     };
//     blockArray.push(newBlock);
// }

// function moveBird(e) {
//     if (e.code == "Space" || e.type === "touchstart") {
//         if (!gameStarted) {
//             gameStarted = true;
//             setInterval(placeBlocks, 1500); // Place new blocks every 1.5 seconds
//         }

//         velocityY = -6;

//         if (gameOver) {
//             bird.y = birdY;
//             blockArray = [];
//             score = 0;
//             gameOver = false;
//         }
//     }
// }

// function detectCollision(a, b) {
//     return a.x < b.x + b.width &&
//            a.x + a.width > b.x &&
//            a.y < b.y + b.height &&
//            a.y + a.height > b.y;
// }





let board;
let boardWidth = 360;
let boardHeight = 570;
let context;

// Coder avatar (bird replacement)
let birdWidth = 34;
let birdHeight = 30;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// Portfolio blocks (code snippets)
let blockArray = [];
let blockWidth = 150;
let blockHeight = 80;
let blockX = boardWidth;
let blockY = 0;

let codeBlockImg;

// Physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let gameStarted = false;
let transitioning = false;  // Controls the transition

// Levels and sections
let levels = [
    { name: "About Me", details: ["I am a coder.", "I love programming.", "Check my GitHub."] },
    { name: "Projects", details: ["Project 1: Website", "Project 2: Game", "Project 3: App"] },
    { name: "Skills", details: ["JavaScript", "Python", "React"] },
    { name: "Contact", details: ["Email: example@mail.com", "Phone: +1234567890"] }
];
let currentLevelIndex = 0;
let inLevelMode = false;  // Flag to determine if we're inside a level
let levelBlocksRemaining = 0;
let levelCompleteBlockPassed = false; // Ensure the level ends correctly

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "bug.png"; // Your avatar image
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    codeBlockImg = new Image();
    codeBlockImg.src = "block.png"; // Code block image

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", moveBird);
}

function update() {
    requestAnimationFrame(update);

    if (!gameStarted) {
        context.fillStyle = "white";
        context.font = "20px sans-serif";
        context.fillText("Press Space to Start", 20, boardHeight / 3);
        return;
    }

    if (gameOver || transitioning) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Bird movement (avatar)
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // Portfolio blocks
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        block.x += velocityX; // Move blocks left
        context.drawImage(block.img, block.x, block.y, block.width, block.height);

        context.fillStyle = "black";
        context.font = "16px sans-serif";
        context.fillText(block.text, block.x + 40, block.y + block.height / 2); // Display text on each block

        if (!block.passed && bird.x > block.x + block.width) {
            score += 1;
            block.passed = true;

            // If this is the "Level Complete" block, resume the original game
            if (block.text === "Level Complete") {
                levelCompleteBlockPassed = true;
            }
        }

        if (detectCollision(bird, block)) {
            if (!inLevelMode) {
                startLevel(block.text);
                break;
            }
        }
    }

    // Clear blocks
    while (blockArray.length > 0 && blockArray[0].x < -blockWidth) {
        blockArray.shift();
    }

    // Score display
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }

    // End of level detection: If in level mode, level blocks are finished, and level complete block was passed
    if (inLevelMode && blockArray.length === 0 && levelBlocksRemaining === 0 && levelCompleteBlockPassed) {
        endLevel();
    }
}

let lastBlockY = blockY;
let minGap = 100; 

function placeBlocks() {
    if (gameOver || !gameStarted || transitioning) {
        return;
    }

    let randomBlockY;
    do {
        randomBlockY = blockY + Math.random() * (boardHeight - blockHeight);
    } while (Math.abs(randomBlockY - lastBlockY) < minGap); 

    lastBlockY = randomBlockY;

    let currentBlock;
    if (inLevelMode) {
        let level = levels[currentLevelIndex];
        
        // If there are remaining blocks in the level, show them
        if (level.details.length > 0) {
            let blockDetail = level.details.shift();  // Get the next block detail
            levelBlocksRemaining--;

            currentBlock = {
                img: codeBlockImg,
                x: blockX,
                y: randomBlockY,
                width: blockWidth,
                height: blockHeight,
                text: blockDetail, 
                passed: false
            };
        } else if (!levelCompleteBlockPassed) {
            // Place "Level Complete" block only once at the end
            currentBlock = {
                img: codeBlockImg,
                x: blockX,
                y: randomBlockY,
                width: blockWidth,
                height: blockHeight,
                text: "Level Complete", 
                passed: false
            };
        }
    } else {
        let blockType = levels[blockArray.length % levels.length].name; 
        currentBlock = {
            img: codeBlockImg,
            x: blockX,
            y: randomBlockY,
            width: blockWidth,
            height: blockHeight,
            text: blockType, 
            passed: false
        };
    }
    blockArray.push(currentBlock);
}

function moveBird(e) {
    if (e.code == "Space" || e.type === "touchstart") {
        if (!gameStarted) {
            gameStarted = true;
            setInterval(placeBlocks, 1500); 
        }

        velocityY = -6;

        if (gameOver) {
            bird.y = birdY;
            blockArray = [];
            score = 0;
            gameOver = false;
            levelCompleteBlockPassed = false; // Reset on new game
        }
    }
}

function startLevel(levelName) {
    inLevelMode = true;
    currentLevelIndex = levels.findIndex(level => level.name === levelName);
    transitioning = true;

    setTimeout(() => {
        transitioning = false;
        levelBlocksRemaining = levels[currentLevelIndex].details.length;
        blockArray = [];
    }, 1000); // Show "Entering Level" and pause briefly before starting level
}

function endLevel() {
    inLevelMode = false;
    levelCompleteBlockPassed = false; // Reset for future levels
    blockArray = [];
    score = 0; // Optional: reset score after each level
    setTimeout(() => {
        transitioning = false;
    }, 1000); // Pause briefly before resuming original game
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}