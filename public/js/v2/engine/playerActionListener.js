function listenForInput() {
    window.addEventListener("keydown", (e) => {
        if (!e.repeat) {
            //console.log(`Key "${e.key}" pressed [event: keydown]`);
            gameloop(e.key);
        } else {
          //console.log(`Key "${e.key}" repeating [event: keydown]`);
        }
      });
}