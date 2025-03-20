import { initializeApp } from "./node_modules/firebase/app";
import { getFirestore, collection, addDoc } from "./node_modules/firebase/firestore";
import { getAnalytics } from "./node_modules/firebase/analytics";

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

  // Configuración de Firebase
  const firebaseConfig = {
  apiKey: "AIzaSyCu36C03AgU9fKJQZF_nc5Vcxl_ISV6Tjw",
  authDomain: "tarjeta-100.firebaseapp.com",
  projectId: "tarjeta-100",
  storageBucket: "tarjeta-100.firebasestorage.app",
  messagingSenderId: "1096191018262",
  appId: "1:1096191018262:web:14d2e5867eb64e9b6bbc37",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Inicializar Analytics
  const analytics = getAnalytics(app);

  console.log("Firebase inicializado correctamente:", app.name);

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

  // Validar longitud del mensaje en tiempo real
  const mensajeInput = formulario.mensaje;
  mensajeInput.addEventListener("input", () => {
    const maxLength = 144;
    const currentLength = mensajeInput.value.length;

    if (currentLength > maxLength) {
      mensajeInput.value = mensajeInput.value.slice(0, maxLength);
    }

    const aviso = document.querySelector(".aviso");
    if (aviso) {
      aviso.textContent = `Caracteres restantes: ${maxLength - currentLength}`;
    }
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
    const url = `https://ander-villantoy.github.io/tarjeta/cartas/index.html?id=${id}`;
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

  // Almacenar tarjeta en Firestore
  const almacenarTarjeta = async () => {
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

    try {
      const docRef = await addDoc(collection(db, "tarjetas"), nuevaTarjeta);
      console.log("Tarjeta almacenada con ID:", docRef.id);
      mostrarPopup();
      generarEnlace(docRef.id);
    } catch (error) {
      console.error("Error al almacenar la tarjeta:", error);
      alert("Error al almacenar la tarjeta. Por favor, intenta nuevamente.");
    }
  };
});