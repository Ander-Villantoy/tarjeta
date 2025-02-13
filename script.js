document.addEventListener("DOMContentLoaded", () => {
    const sobre = document.getElementById("sobre");
    const buttons = document.querySelectorAll("button");
    let loopAudio = new Audio("audio/loop.mp3"); // Sonido en bucle
    loopAudio.loop = true; // Hacer que el sonido se repita

    function playSound(filename) {
        let audio = new Audio(`audio/${filename}`);
        audio.play();
    }

    function toggleEnvelope(open) {
        if (open) {
            playSound("open.wav"); // Sonido de abrir
            setTimeout(() => {
                sobre.classList.add("open"); // Espera 1 segundo antes de abrir
                loopAudio.play(); // Inicia el sonido en bucle
            }, 250);
        } else {
            playSound("close.wav"); // Sonido de cerrar
            setTimeout(() => {
                sobre.classList.remove("open");
                loopAudio.pause(); // Detiene el sonido en bucle
                loopAudio.currentTime = 0; // Reinicia el audio para la próxima vez
            }, 1000);
        }
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const action = button.textContent === "OPEN";
            toggleEnvelope(action);
        });
    });
});
