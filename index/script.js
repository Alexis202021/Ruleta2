// Variables para almacenar los participantes y premios
let participantes = [];
let premios = [];
let girando = false;
let indiceGanador = 0;
let tiempoGiro = 5000; // milisegundos
let premiosGanados = {}; // Objeto para almacenar los premios ganados por cada participante

// Función para agregar un participante
function agregarParticipante() {
  const nombre = prompt("Ingrese el nombre del participante:");
  if (nombre) {
    participantes.push(nombre);
    premiosGanados[nombre] = []; // Inicializar el objeto de premios ganados para el participante
    actualizarListaParticipantes();
  }
}

// Función para quitar un participante
function quitarParticipante() {
  const indice = parseInt(prompt("Ingrese el número del participante a quitar:")) - 1;
  if (indice >= 0 && indice < participantes.length) {
    const participante = participantes.splice(indice, 1)[0];
    delete premiosGanados[participante]; // Eliminar el objeto de premios ganados para el participante
    actualizarListaParticipantes();
  }
}

// Función para agregar un premio
function agregarPremio() {
  const nombre = prompt("Ingrese el nombre del premio:");
  const cantidad = parseInt(prompt("Ingrese la cantidad de premios:"));
  if (nombre && cantidad) {
    premios.push({ nombre, cantidad });
    actualizarListaPremios();
  }
}

// Función para quitar un premio
function quitarPremio() {
  const indice = parseInt(prompt("Ingrese el número del premio a quitar:")) - 1;
  if (indice >= 0 && indice < premios.length) {
    premios.splice(indice, 1);
    actualizarListaPremios();
  }
}

// Función para actualizar la lista de participantes
function actualizarListaParticipantes() {
  const lista = document.getElementById("participantes-lista");
  lista.innerHTML = "";
  participantes.forEach((participante, indice) => {
    const item = document.createElement("li");
    const recuadroPremios = document.createElement("span");
    recuadroPremios.style.border = "1px solid black";
    recuadroPremios.style.padding = "2px";
    recuadroPremios.style.marginRight = "10px";
    recuadroPremios.textContent = `Premios: ${premiosGanados[participante].length}`;
    item.appendChild(recuadroPremios);
    item.appendChild(document.createTextNode(` ${participante}`));
    lista.appendChild(item);
  });
}

// Función para actualizar la lista de premios
function actualizarListaPremios() {
  const lista = document.getElementById("premios-lista");
  lista.innerHTML = "";
  premios.forEach((premio, indice) => {
    const item = document.createElement("li");
    const recuadroCantidad = document.createElement("span");
    recuadroCantidad.style.border = "1px solid black";
    recuadroCantidad.style.padding = "2px";
    recuadroCantidad.style.marginRight = "10px";
    recuadroCantidad.textContent = `Cantidad: ${premio.cantidad}`;
    item.appendChild(recuadroCantidad);
    item.appendChild(document.createTextNode(` ${premio.nombre}`));
    lista.appendChild(item);
  });
}

// Función para girar la ruleta
function girarRuleta() {
  if (!girando) {
    girando = true;
    const canvas = document.getElementById("ruleta-canvas");
    const ctx = canvas.getContext("2d");
    const inicioGiro = Date.now();
    const intervalo = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, 2 * Math.PI);
      ctx.stroke();
      const angulo = (Date.now() % 360) * Math.PI / 180;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angulo);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(150, 0);
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.restore();
      const texto = ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      participantes.forEach((participante, indice) => {
        const textoAngulo = (indice * 360 / participantes.length) * Math.PI / 180;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(textoAngulo);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(120, 0);
        ctx.stroke();
        ctx.font = "18px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(participante, 120, 0);
        ctx.restore();
      });
      if (Date.now() - inicioGiro >= tiempoGiro) {
        clearInterval(intervalo);
        girando = false;
        indiceGanador = Math.floor(Math.random() * participantes.length);
        const ganador = participantes[indiceGanador];
        const premioGanado = premios[Math.floor(Math.random() * premios.length)];
        premiosGanados[ganador].push(premioGanado.nombre);
        premioGanado.cantidad--;
        actualizarListaParticipantes();
        actualizarListaPremios();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, 2 * Math.PI);
        ctx.stroke();
        const anguloGanador = (indiceGanador * 360 / participantes.length) * Math.PI / 180;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(anguloGanador);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(150, 0);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.restore();
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText(`El ganador es: ${ganador} - Premio: ${premioGanado.nombre}`, canvas.width / 2, canvas.height / 2);
      }
    }, 16);
  }
}

// Eventos
document.getElementById("agregar-participante").addEventListener("click", agregarParticipante);
document.getElementById("quitar-participante").addEventListener("click", quitarParticipante);
document.getElementById("agregar-premio").addEventListener("click", agregarPremio);
document.getElementById("quitar-premio").addEventListener("click", quitarPremio);
document.getElementById("girar-ruleta").addEventListener("click", girarRuleta);