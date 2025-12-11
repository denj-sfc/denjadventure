// start the game by redirecting to game.html
function startGame() {
    window.location.href = "game.html";
}

// show the options panel
function showOptions() {
    document.getElementById("optionsPanel").classList.remove("hidden");
}

// close the options panel
function closeOptions() {
    document.getElementById("optionsPanel").classList.add("hidden");
}

// quit the game with an alert and close the window
function quitGame() {
    alert("There is no escape.");
    window.close();
    window.location.href = "about:blank";
}

// enable menu music and set volume
function enableMenuMusic() {
    let music = document.getElementById("menuMusic");
    
    // unlock audio playback
    function unlockAudio() {
        music.muted = false; // unmute the music
        let savedVolume = localStorage.getItem("musicVolume");
        music.volume = savedVolume !== null ? savedVolume : 0.7; // set volume
        music.play(); // play the music
        document.removeEventListener("keydown", unlockAudio); // remove event listener
        document.removeEventListener("click", unlockAudio); // remove event listener
    }
    
    // add event listeners to unlock audio on keydown or click
    document.addEventListener("keydown", unlockAudio, { once: true });
    document.addEventListener("click", unlockAudio, { once: true });
}

// set the volume of the music
function setVolume(value) {
    let music = document.getElementById("menuMusic");
    music.volume = value; // set the volume
    localStorage.setItem("musicVolume", value); // save volume to local storage
}

// load the saved volume from local storage
function loadVolume() {
    let savedVolume = localStorage.getItem("musicVolume");
    if (savedVolume !== null) {
        document.getElementById("volumeSlider").value = savedVolume; // set slider value
    }
}

// navigate back to the main menu
function menu() {
    window.location.href = "index.html";
}
