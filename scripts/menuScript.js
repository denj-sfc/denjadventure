// start  game
function startGame() {
    window.location.href = "game.html";
}

// show options panel
function showOptions() {
    document.getElementById("optionsPanel").classList.remove("hidden");
}

// close options panel
function closeOptions() {
    document.getElementById("optionsPanel").classList.add("hidden");
}

// quit game
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
        music.muted = false; // unmute music
        let savedVolume = localStorage.getItem("musicVolume");
        music.volume = savedVolume !== null ? savedVolume : 0.7; // set volume
        music.play(); // play music
        document.removeEventListener("keydown", unlockAudio); // remove event listener
        document.removeEventListener("click", unlockAudio); // ^^
    }
    
    // add event listeners
    document.addEventListener("keydown", unlockAudio, { once: true });
    document.addEventListener("click", unlockAudio, { once: true });
}

// set volume of music
function setVolume(value) {
    let music = document.getElementById("menuMusic");
    music.volume = value; // set the volume
    localStorage.setItem("musicVolume", value); // save volume to local storage
}

// load saved volume from local storage
function loadVolume() {
    let savedVolume = localStorage.getItem("musicVolume");
    if (savedVolume !== null) {
        document.getElementById("volumeSlider").value = savedVolume; // set slider value
    }
}

// navigate back to menu
function menu() {
    window.location.href = "index.html";
}
