document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");
  const popup = document.getElementById("popup");
  const submitBtn = document.getElementById("submit");
  const cerrarPopup = document.getElementById("cerrarPopup");
  const tipoTarjeta = document.querySelectorAll('input[name="tipo"]');
  const contador = document.getElementById("contador");
  const btnBajar = document.getElementById("bajarFormulario");
  const enlace = document.getElementById("enlace");
  const copiarBtn = document.getElementById("copiar");
  const whatsappBtn = document.getElementById("whatsapp");
  let tarjetasHechas = 0;

  // Smooth scroll al formulario
  btnBajar?.addEventListener("click", () => {
    document.getElementById("formulario-section")?.scrollIntoView({ behavior: "smooth" });
  });

  // Inicializar estado del popup
  popup.style.display = "none";

  // Evento de selección de tipo de tarjeta
  tipoTarjeta.forEach(radio => {
    radio.addEventListener("change", (e) => {
      formulario.dataset.theme = e.target.value;
    });
  });

  // Evento de envío del formulario con contador
  submitBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (formulario.checkValidity()) {
      tarjetasHechas++;
      contador.textContent = `Tarjetas restantes: ${7 - tarjetasHechas}`;
      if (tarjetasHechas <= 7) {
        almacenarTarjeta();
      } else {
        alert("Máximo de 7 tarjetas alcanzado.");
      }
    } else {
      alert("Completa todos los campos requeridos.");
    }
  });

  // Mostrar popup
  const mostrarPopup = () => {
    popup.classList.remove("oculto");
    popup.style.display = "block";
  };

  // Ocultar popup
  cerrarPopup?.addEventListener("click", () => {
    popup.classList.add("oculto");
    popup.style.display = "none";
  });

  // Generar enlace
  const generarEnlace = (id) => {
    const url = `https://ander-villantoy.github.io/tarjeta/index.html?id=${id}`;
    enlace.textContent = url;
    enlace.href = url;
    whatsappBtn.href = `https://wa.me/?text=${encodeURIComponent(url)}`;
  };

  // Copiar enlace al portapapeles
  copiarBtn?.addEventListener("click", () => {
    navigator.clipboard.writeText(enlace.textContent).then(() => {
      alert("Enlace copiado al portapapeles");
    });
  });

  // Almacenar tarjeta en tarjetas.json
  const almacenarTarjeta = () => {
    const remitente = formulario.remitente.value;
    const destinatario = formulario.destinatario.value;
    const mensaje = formulario.mensaje.value;
    const tipo = formulario.tipo.value;
    const nuevaTarjeta = {
      from: remitente,
      to: destinatario,
      msg: mensaje,
      tipo: tipo,
      color: tipo === "romántica" ? "#ff4b4b" : "#4baeff",
      fechaCreacion: new Date().toISOString(),
      permanente: false
    };

    fetch('https://github.com/Ander-Villantoy/tarjeta/tree/main/data/tarjetas.json', { mode: 'no-cors' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const id = `tarjeta${Math.floor(Math.random() * 10000)}`;
        data[id] = nuevaTarjeta;
        return fetch('https://github.com/Ander-Villantoy/tarjeta/tree/main/data/tarjetas.json', {
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(() => id);
      })
      .then(id => {
        console.log('Tarjeta almacenada correctamente');
        mostrarPopup();
        generarEnlace(id);
      })
      .catch(error => {
        console.error('Error al almacenar la tarjeta:', error);
        alert('Error al almacenar la tarjeta. Por favor, intenta nuevamente.');
      });
  };
});