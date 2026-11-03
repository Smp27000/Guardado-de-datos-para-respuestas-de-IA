const [situacion, mundo, ...colores] = process.argv.slice(2);
const { error } = require("console");
const fs = require("fs")
const NameFolderTXT = "FolderTXT"
const path = require("path");

if (!situacion || !mundo || colores.length !== 5) {
  console.log('Uso: node parámetros.js "<situacion>" "<mundo>" <color1> <color2> <color3> <color4> <color5>');
  console.log('Ejemplo: node parámetros.js "Una persecución" "Ciudad futurista" rojo azul verde amarillo negro');
  process.exit(1);
}
 
const datos = {
  situacion,
  mundo,
  colores,
};

const datosJSON = JSON.stringify(datos)

fs.mkdirSync(NameFolderTXT, { recursive: true });

const archivo = path.join(NameFolderTXT, "datos.json");

let registros = [];
if (fs.existsSync(archivo)) {
  registros = JSON.parse(fs.readFileSync(archivo, "utf8"));
}

registros.push(datosJSON);
fs.writeFileSync(archivo, JSON.stringify(registros));

console.log(`Registro #${registros.length} guardado en ${archivo}`);