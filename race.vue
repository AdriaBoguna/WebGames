export default {
    data() {
      return {
        showOverlay: true,
        apuestaSeleccionada: "",
        winner: "",
        startBtnText: "PLAY",
        caballos: [
          { id: "Caballo-1", left: "0", transition: "none" },
          { id: "Caballo-2", left: "0", transition: "none" },
          { id: "Caballo-3", left: "0", transition: "none" },
          { id: "Caballo-4", left: "0", transition: "none" },
        ],
        checkWinner: null,
      };
    },
    methods: {
      apostar() {
        this.showOverlay = false;
      },
      mostrarApuestas() {
        this.showOverlay = true;
      },
      resetRace() {
        this.caballos.forEach((caballo) => {
          caballo.left = "0";
          caballo.transition = "none";
        });
      },
      startRace() {
        if (this.checkWinner) {
          clearInterval(this.checkWinner);
        }
        if (this.startBtnText === "Replay") {
          this.resetRace();
          this.mostrarApuestas();
        }
        this.startBtnText = "PLAY";
        this.startBtnText = this.startBtnText === "PLAY" ? "Replay" : "PLAY";
  
        setTimeout(() => {
          this.caballos.forEach((caballo) => {
            let duration = (Math.random() * 3) + 2;
            caballo.transition = `left ${duration}s linear`;
            caballo.left = "calc(100% - 80px)";
          });
        }, 100);
  
        const raceTrack = document.getElementById("raceTrack");
        const raceTrackRight = raceTrack.getBoundingClientRect().right;
  
        this.checkWinner = setInterval(() => {
          let maxPosition = -1;
          let winningHorse = null;
  
          this.caballos.forEach((caballo) => {
            const horse = document.getElementById(caballo.id);
            let currentPosition = horse.getBoundingClientRect().right;
            if (currentPosition > maxPosition) {
              maxPosition = currentPosition;
              winningHorse = horse;
            }
        });
  
        if (winningHorse.getBoundingClientRect().right >= raceTrackRight) {
          clearInterval(this.checkWinner);
          this.checkWinner = null;
          this.caballos.forEach((caballo) => {
            caballo.transition = "none";
          });
          this.winner = `Ganador: ${winningHorse.id}`;
  
          if (winningHorse.id === this.apuestaSeleccionada) {
            alert("¡Felicidades! Tu apuesta es correcta. Ganaste.");
          } else {
            alert("Lo siento, perdiste. El ganador es " + winningHorse.id);
          }
  
          this.startBtnText = "Replay";
        }
      }, 100);
    },
  },
};