let board;
let boardWidth = 360;
let boardHeight = 570;
let context;

// Coder avatar (bird replacement)
let birdWidth = 50;
let birdHeight = 55;
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
    { name: "About Me", details: ["I am a developer.", "I love programming.","Phone: +91 9887030122","Email: satakshichoudhary03@gmail.com", "Check my GitHub.", "Level Complete"] },
    { name: "Academics", details: ["MBM University, Jodhpur", "SGPA-9.78","CGPA-9.15","Hind Zinc School","XII-93%","X:90.40%", "Level Complete"] },
    { name: "Projects", details: ["Hostel Management Website", "Flappy Bird Game", "Dynamic Blog Website", "Level Complete"] },
    { name: "Skills", details: ["C/C++", "JAVA", "Python","MERN Stack","JavaScript","PHP","MySQL","MongoDB","Level Complete"] },
    { name: "Experience", details: ["ISRO-Research Intern", "Celebal Technologies-NodeJS Intern", "GSSoC- Contributor", "Level Complete"] },
    { name: "Certificates & Achievements", details: ["RHCSA Certified", "Campus Ambassador- IIT Bombay", "Head Coordinator-Kalakriti", "Level Complete"] },
    { name: "Languages", details: ["English", "Hindi","German", "Level Complete"] },
    { name: "Thank You"}
];

let currentLevelIndex = 0;
let inLevelMode = false;  // Flag to determine if we're inside a level
let levelBlocksRemaining = 0;

let images = {};
let imageSources = {
    "About Me": "aboutMe.png",
    "Academics": "academics.png",
    "Projects": "projects.png",
    "Skills": "skills.png",
    "Experience": "experience.png",
    "Certificates & Achievements": "certificates.png",
    "Languages": "languages.png",
    "Thank You": "thankyou.png"
};

function loadImages() {
    for (let key in imageSources) {
        let img = new Image();
        img.src = imageSources[key];
        images[key] = img;
    }
}

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

    loadImages();  // Load all block images

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", moveBird);
}

function update() {
    requestAnimationFrame(update);

    if (!gameStarted) {
        context.fillStyle = "white";
        context.font = "20px sans-serif";
        context.fillText("Hello Everyone!!", 20, boardHeight / 5);
        context.fillText("I am Shatakshi Choudhary", 20, boardHeight / 4);
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
        context.drawImage(block.img, block.x, block.y, block.width, block.height); // Draw the block's image

        context.fillStyle = "white";
        context.font = "16px sans-serif";
        let textWidth = context.measureText(block.text).width; // Get the width of the text
        context.fillText(block.text, block.x + (block.width - textWidth) / 2, block.y + (block.height + 5) / 2); // Center the text

        // context.fillText(block.text, block.x + 40, block.y + block.height / 2); // Display text on each block

        if (!block.passed && bird.x > block.x + block.width) {
            score += 1;
            block.passed = true;
        }

        if (detectCollision(bird, block)) {
            if (block.text === "Level Complete") {
                endLevel(); // End the level if the block is "Level Complete"
                break;
            }
            else if (block.text === "Thank You") {
                gameOver = true;  // Trigger game over immediately
                showThankYouMessage(); // Show thank you message
                break;
            }
             else if (!inLevelMode) {
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
        context.fillText("Entering into level", 5, 90);
    }

    // End of level detection: If in level mode, level blocks are finished
    if (inLevelMode && blockArray.length === 0 && levelBlocksRemaining === 0) {
        endLevel();
    }
}


let lastBlockY = blockY;
let minGap = 100; 
let index=0;

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
            let blockDetail = level.details.shift();  
            levelBlocksRemaining--;

            currentBlock = {
                img: images[level.name], // Assign corresponding image based on level
                x: blockX,
                y: randomBlockY,
                width: blockWidth,
                height: blockHeight,
                text: blockDetail, 
                passed: false
            };
        }
    } else {
        let blockType = levels[index].name;
        index++;
        currentBlock = {
            img: images[blockType], // Assign corresponding image
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
            setInterval(placeBlocks, 1500); // This will now work correctly after level completion
        }

        velocityY = -6;

        if (gameOver) {
            bird.y = birdY;
            blockArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

let savedBlocks = [];
function startLevel(levelName) {
    inLevelMode = true;
    currentLevelIndex = levels.findIndex(level => level.name === levelName);
    levelBlocksRemaining = levels[currentLevelIndex].details.length;
    savedBlocks = blockArray.slice(); // Save a copy of the current blocksv
    blockArray = []; // Clear existing blocks for the new level
    transitioning = false; // Start immediately without transition
}

function endLevel() {
    if (levels[currentLevelIndex].name === "Thank You") {
        gameOver = true;  // End the game
        showThankYouMessage();
        setTimeout(() => {
            location.reload(); // Restart the game by reloading the page
        }, 3000); // Delay the reload so the user can see the Thank You message
        return;
    }
    inLevelMode = false; // Exit level mode
    blockArray = savedBlocks.slice(); // Restore saved blocks after the level
    savedBlocks = []; // Clear the saved blocks after restoring
    // blockArray = []; // Clear blocks
    
    setTimeout(() => {
        transitioning = false; // Resume game
        levelBlocksRemaining = 0; // Reset blocks remaining for new game
    }, 1000); // Pause briefly before resuming original game

}

function showThankYouMessage() {
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText("Thank You for Playing!", 20, boardHeight / 3);
    context.fillText("Game Over", 20, boardHeight / 2);
    
    // Adjust the y-coordinate to move the contact text to a new line
    context.fillText("Contact me:", 20, (boardHeight / 1.5) - 20); // Adjusted y-coordinate
    context.font = "20px sans-serif";
    context.fillText("satakshichoudhary03@gmail.com", 20, (boardHeight / 1.5)); // Original y-coordinate

    document.getElementById("replayButton").style.display = "block";
    
    // Add click event to replay button
    document.getElementById("replayButton").onclick = function() {
        location.reload(); // Reload the page to restart the game
    };

}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
