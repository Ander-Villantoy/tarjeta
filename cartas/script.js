document.addEventListener("DOMContentLoaded", async () => {
  const sobre = document.getElementById("sobre");
  const solapas = document.querySelectorAll(".solapaSuperior, .solapaInferior, .solapaLaterales, .solapaFondo");
  const textoSobre = document.querySelector(".solapaSuperior h2");
  const textoCarta = document.querySelector(".carta .texto h2");
  const buttons = document.querySelectorAll("button");
  let loopAudio = new Audio("/cartas/audio/loop.mp3");
  let formalAudio = new Audio("/cartas/audio/formal.wav");
  loopAudio.loop = true;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (id) {
    try {
      const url = `https://github.com/Ander-Villantoy/tarjeta/tree/main/data/tarjetas.json`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('No se pudo cargar el archivo JSON.');
      const data = await response.json();

      const tarjeta = data[id];
      if (!tarjeta) throw new Error('No se encontró la tarjeta con el ID proporcionado.');

      textoSobre.textContent = `De: ${tarjeta.from}`;
      textoCarta.textContent = `Para: ${tarjeta.to}`;
      document.querySelector(".carta .texto p").innerHTML = tarjeta.msg.replace(/\n/g, '<br>');

      if (tarjeta.tipo === 'romantica') {
        solapas.forEach(solapa => solapa.style.backgroundColor = '');
        textoSobre.style.color = '';
        textoCarta.style.color = '';
      } else if (tarjeta.tipo === 'amistad') {
        const verdes = ['#a8d5ba', '#8fcba9', '#76bf8a', '#5eb36b'];
        solapas.forEach((solapa, index) => solapa.style.backgroundColor = verdes[index % verdes.length]);
        textoSobre.style.color = '#a17c2b';
        textoCarta.style.color = '#a17c2b';
        buttons.forEach(button => button.classList.add('boton-amistad'));
      } else if (tarjeta.tipo === 'formal') {
        const azules = ['#a8d5f2', '#8fcbea', '#76bfe2', '#5eb3da'];
        solapas.forEach((solapa, index) => solapa.style.backgroundColor = azules[index % azules.length]);
        textoSobre.style.color = '#001a57';
        textoCarta.style.color = '#001a57';
        buttons.forEach(button => button.classList.add('boton-formal'));
      } else if (tarjeta.color) {
        solapas.forEach(solapa => solapa.style.backgroundColor = tarjeta.color);
        textoSobre.style.color = '#000';
        textoCarta.style.color = '#000';
      }

      function toggleEnvelope(open) {
        if (open) {
          if (tarjeta.tipo === 'formal') {
            formalAudio.play();
          } else {
            new Audio("/cartas/audio/open.wav").play();
          }
          setTimeout(() => {
            sobre.classList.add("open");
            if (tarjeta.tipo === 'romantica') {
              loopAudio.play();
            }
          }, 250);
        } else {
          if (tarjeta.tipo !== 'formal') {
            new Audio("/cartas/audio/close.wav").play();
          }
          setTimeout(() => {
            sobre.classList.remove("open");
            loopAudio.pause();
            loopAudio.currentTime = 0;
            formalAudio.pause();
            formalAudio.currentTime = 0;
          }, 1000);
        }
      }

      buttons.forEach(button => {
        button.addEventListener("click", () => {
          const action = button.textContent === "ABRIR";
          toggleEnvelope(action);
        });
      });

    } catch (error) {
      console.error(error);
      alert("Error al cargar la tarjeta. Asegúrate de que el archivo JSON esté accesible y que el ID exista.");
    }
  } else {
    alert("No se proporcionó un ID de tarjeta.");
  }
});
