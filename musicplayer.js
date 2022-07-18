class MusicPlayer {
    constructor(musicList) {
        this.musicList = musicList;
        this.index = 0;
    }


    getMusic() {
        return this.musicList[this.index]; // index numarasındaki music listesi gelecek
    }
    next() { // bir sonraki şarkı
        if(this.index + 1 < this.musicList.length) {
            this.index++;

        }
        else {
            this.index = 0
        }
    }
    prev() { // bir önceki
        if(this.index != 0) {
            this.index--;
        } else {
            this.index = this.musicList.length - 1;
        }
    }
}