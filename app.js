const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const play = document.querySelector("#controls #play");
const prev = document.querySelector("#controls #prev");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");




const player = new MusicPlayer(musicList);



window.addEventListener("load", () => { // sayfa yüklendiği anda şarkı sanatçı görünür
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
});




function displayMusic(music) {
    title.innerText = music.getName(); // şarkı adı
    singer.innerText = music.singer; // sanatçı adı
    image.src = "img/" + music.img; // resim
    audio.src = "mp3/" + music.file; // ve music sayfa içerisine eklendi
}

play.addEventListener("click", () => { // şarkının başlaması için play e click event ekledik
    const isMusicPlay = container.classList.contains("playing")
    isMusicPlay ? pauseMusic() : playMusic();
});

const pauseMusic = () => { // container içerisinde playing class ı varsa siler ve audio.pause metodu sayesinde şarkı durdurulur
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play" // play iconu eklendi
    audio.pause();
}
/* next ve prev metotları start */
prev.addEventListener("click", () => { prevMusic(); });

next.addEventListener("click", () => { nextMusic(); });

const prevMusic = () => {
    player.prev();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}

const nextMusic = () =>  {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}
/* next ve prev metotları end */


const playMusic = () => { // container içerisine playing classı eklenir ve audio.play sayesinde çalmaya başlar
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause" // pause iconu eklendi
    audio.play();
}

/* süre kontrol start */
const calculateTime = (toplamSaniye) => {
    const dakika = Math.floor(toplamSaniye / 60 );
    const saniye = Math.floor(toplamSaniye % 60);
    const guncellenenSaniye = saniye < 10 ? `0${saniye}`: `${saniye}`;
    const sonuc = `${dakika}:${guncellenenSaniye}`;
    return sonuc;
}

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration)
});




audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});

//  süreyle kullanıcı oynaması için
progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime("progressBar.value");
    audio.currentTime = progressBar.value;
})

/* süre kontrol end */

/* ses kontrol start */

let sesDurumu = "sesli";

volumeBar.addEventListener("input", (e) => {
    const value = e.target.value;
    audio.volume = value / 100;
    if(value == 0) {
        audio.muted = true;
        sesDurumu= "sessiz";
        volume.classList = "fa-solid fa-volume-xmark";
    } else {
        audio.muted = false;
        sesDurumu= "sesli";
        volume.classList = "fa-solid fa-volume-high";
        
    }
});

volume.addEventListener("click", () => {
    if(sesDurumu==="sesli") {
        audio.muted = true;
        sesDurumu= "sessiz";
        volume.classList = "fa-solid fa-volume-xmark";
        volumeBar.value = 0;
    }else {
        audio.muted = false;
        sesDurumu= "sesli";
        volume.classList = "fa-solid fa-volume-high";
        volumeBar.value = 100;
    }
});

/* ses kontrol end */

/* şarkıların liste halinde eklenmesi start */
const displayMusicList = (list) => {
    for(let i=0; i < list.length; i++) {
        let liTag = `
            <li li-index='${i}' onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
                <span>${list[i].getName()}</span>
                <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
                <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
            </li>
        `;
        ul.insertAdjacentHTML("beforeend", liTag);

        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudiTag = ul.querySelector(`.music-${i}`);

        liAudiTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudiTag.duration)
        })
    }
};

/* şarkıların liste halinde eklenmesi end */

/* listedeki şarkılara tıklandığında başlaması */

const selectedMusic = (li) => {
    player.index = li.getAttribute("li-index");
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
}

const isPlayingNow = () => {
    for(let li of ul.querySelectorAll("li")) {
        if(li.classList.contains("playing")) {
            li.classList.remove("playing");
        }
        if(li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        }
    }
}


/* listedeki şarkılara tıklandığında başlaması */
audio.addEventListener("ended", () => {
    nextMusic();
})