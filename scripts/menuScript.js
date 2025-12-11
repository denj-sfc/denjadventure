function startGame() {
    window.location.href = "game.html";
}

function showOptions() {
    document.getElementById("optionsPanel").classList.remove("hidden");
}

function closeOptions() {
    document.getElementById("optionsPanel").classList.add("hidden");
}

function quitGame() {
    alert("There is no escape.");
    window.close();
    window.location.href = "about:blank";
}

function enableMenuMusic() {
    let music = document.getElementById("menuMusic");
    function unlockAudio() {
        music.muted = false;
        let savedVolume = localStorage.getItem("musicVolume");
        music.volume = savedVolume !== null ? savedVolume : 0.7;
        music.play();
        document.removeEventListener("keydown", unlockAudio);
        document.removeEventListener("click", unlockAudio);
    }
    document.addEventListener("keydown", unlockAudio, { once: true });
    document.addEventListener("click", unlockAudio, { once: true });
}


function setVolume(value) {
    let music = document.getElementById("menuMusic");
    music.volume = value;
    localStorage.setItem("musicVolume", value);
}

function loadVolume() {
    let savedVolume = localStorage.getItem("musicVolume");
    if (savedVolume !== null) {
        document.getElementById("volumeSlider").value = savedVolume;
    }
}

function menu() {
    window.location.href = "index.html";
}
