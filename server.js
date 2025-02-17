const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const tarjetasFilePath = path.join(__dirname, 'data', 'tarjetas.json');

// Función para eliminar tarjetas caducadas
const eliminarTarjetasCaducadas = () => {
  fs.readFile(tarjetasFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo de tarjetas:', err);
      return;
    }
    const tarjetas = JSON.parse(data);
    const ahora = new Date();
    let tarjetasActualizadas = false;

    for (const id in tarjetas) {
      if (!tarjetas[id].permanente) {
        const fechaCreacion = new Date(tarjetas[id].fechaCreacion);
        const diferenciaDias = (ahora - fechaCreacion) / (1000 * 60 * 60 * 24);
        if (diferenciaDias > 7) {
          console.log(`Tarjeta con ID ${id} eliminada por caducidad.`);
          delete tarjetas[id];
          tarjetasActualizadas = true;
        }
      }
    }

    if (tarjetasActualizadas) {
      fs.writeFile(tarjetasFilePath, JSON.stringify(tarjetas, null, 2), 'utf8', (err) => {
        if (err) {
          console.error('Error al guardar el archivo de tarjetas:', err);
        } else {
          console.log('Tarjetas caducadas eliminadas correctamente');
        }
      });
    }
  });
};

app.get('/tarjetas', (req, res) => {
  eliminarTarjetasCaducadas();
  fs.readFile(tarjetasFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo de tarjetas');
      return;
    }
    res.send(JSON.parse(data));
  });
});

app.put('/tarjetas', (req, res) => {
  fs.writeFile(tarjetasFilePath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) {
      res.status(500).send('Error al guardar el archivo de tarjetas');
      return;
    }
    res.send('Tarjetas actualizadas correctamente');
  });
});

// Servir archivos estáticos de la carpeta 'cartas'
app.use('/cartas', express.static(path.join(__dirname, 'cartas')));

// Servir archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname)));

// Servir index.html en la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
