const audio = document.getElementById('audio');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const volumeSlider = document.getElementById('volume');
const playlistElement = document.getElementById('playlist');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const albumArt = document.getElementById('album-art');
const searchInput = document.getElementById('search');
const currentTimeElement = document.getElementById('current-time');
const totalTimeElement = document.getElementById('total-time');
const progressBar = document.getElementById('progress'); // Add this to HTML as well

const songs = [
    {
        title: 'Tauba Tauba',
        artist: 'Vicky Kaushal | Triptii Dimri | Karan Aujla',
        src: 'music/song1.mp3',
        albumArt: 'images/album1.jpg'
    },
    {
        title: 'Maan Meri Jaan',
        artist: 'King',
        src: 'music/song2.mp3',
        albumArt: 'images/album2.jpg'
    },
    {
        title: 'Manike',
        artist: 'Yohani, Satheeshan Rathnayaka and Chamath Sangeeth',
        src: 'music/song3.mp3',
        albumArt: 'images/album3.jpg'
    }
];

let currentSongIndex = 0;
let isDragging = false;  // Track if the user is dragging the progress bar

function loadSong(song) {
    audio.src = song.src;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumArt.src = song.albumArt;
    audio.load();
}

function playSong() {
    audio.play().catch(error => console.error("Error playing audio:", error));
    playButton.style.display = 'none';
    pauseButton.style.display = 'inline';
}

function pauseSong() {
    audio.pause();
    playButton.style.display = 'inline';
    pauseButton.style.display = 'none';
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    playSong();
}

function createPlaylist() {
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = `${song.title} - ${song.artist}`;
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(songs[currentSongIndex]);
            playSong();
        });
        playlistElement.appendChild(li);
    });
}

function updateVolume() {
    audio.volume = volumeSlider.value;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateTimeProgress() {
    if (!isDragging) {  // Only update if the user is not dragging the progress bar
        currentTimeElement.textContent = formatTime(audio.currentTime);
        totalTimeElement.textContent = formatTime(audio.duration);
        progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function startDragging() {
    isDragging = true;
}

function stopDragging(e) {
    isDragging = false;
    setProgress(e);  // Set the progress when the dragging stops
    playSong();  // Automatically play the song from the new position
}

progressBar.addEventListener('mousedown', startDragging);
progressBar.addEventListener('mouseup', stopDragging);  // Trigger setProgress and play song when drag ends
progressBar.addEventListener('input', (e) => {
    if (isDragging) {
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
        currentTimeElement.textContent = formatTime(audio.currentTime);  // Update the current time display
    }
});

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    playlistElement.innerHTML = '';
    songs.forEach((song, index) => {
        if (song.title.toLowerCase().includes(searchTerm) || song.artist.toLowerCase().includes(searchTerm)) {
            const li = document.createElement('li');
            li.textContent = `${song.title} - ${song.artist}`;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(songs[currentSongIndex]);
                playSong();
            });
            playlistElement.appendChild(li);
        }
    });
});

audio.addEventListener('timeupdate', updateTimeProgress);
audio.addEventListener('loadedmetadata', updateTimeProgress);
volumeSlider.addEventListener('input', updateVolume);
playButton.addEventListener('click', playSong);
pauseButton.addEventListener('click', pauseSong);
prevButton.addEventListener('click', prevSong);
nextButton.addEventListener('click', nextSong);

loadSong(songs[currentSongIndex]);
createPlaylist();
