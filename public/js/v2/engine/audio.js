function playAudio(url) {
    if (!gameConfig.mute) {
        new Audio(url).play();
    }
}

function playGongSound() {
    const gongUrl = 'audio/v2/gong.wav';
    playAudio(gongUrl);
}

function playSwordSound() {
    playAudio('audio/v2/sword.mp3');
}

function playDragonFire() {
    playAudio('audio/v2/dragon-roar-high-intensity-36564.mp3');
}