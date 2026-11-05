# mundos-ia 🌍✨

Programa de consola en **Node.js** que genera mundos imaginarios mediante Inteligencia Artificial. A partir de una situación, un mundo y una paleta de 5 colores recibidos por argumentos de consola, el programa genera un identificador único (hash), crea un archivo JSON con los datos, solicita una descripción visual detallada a un modelo de lenguaje y finalmente sintetiza una imagen del mundo con un modelo de difusión.

---

## 🛠️ Requisitos Previos

- **Node.js** (versión 20.6.0 o superior, recomendada v24+ para soporte nativo de `process.loadEnvFile` y `fetch`).
- Una cuenta y API Key gratuita en [NVIDIA Build](https://build.nvidia.com/).

---

## ⚙️ Configuración e Instalación

1. **Clonar o descargar el repositorio**:
   Abre tu terminal en la carpeta del proyecto.

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**:
   Copia el archivo `.env.example` a un nuevo archivo llamado `.env`:
   ```bash
   cp .env.example .env
   ```
   *(En Windows PowerShell puedes usar `Copy-Item .env.example .env`)*.

4. Abre el archivo `.env` y coloca tu clave de API de NVIDIA:
   ```env
   NVIDIA_API_KEY=tu_api_key_de_nvidia_aqui
   ```

---

## 🚀 Uso del Programa

Para ejecutar el programa se pasan los argumentos en el siguiente orden:
1. **Situación** (entre comillas dobles).
2. **Mundo** (entre comillas dobles).
3. **5 Colores obligatorios** (separados por espacios).

### Ejemplo de comando:
```bash
npm start -- "Una tormenta eléctrica amenaza la ciudad flotante" "Aerópolis, un archipiélago de islas que flotan sobre las nubes" rojo azul verde dorado violeta
```

### Flujo de ejecución:
1. **Generación de ID y JSON (`src/mundo.js`)**: 
   Genera un hash SHA-1 de 8 caracteres con `object-hash` y guarda el archivo en `data/mundo_<id>.json`.
2. **Descripción de Texto con IA (`src/texto.js`)**:
   Envía los datos a la API de NVIDIA para obtener una descripción visual y la guarda en `descripciones/mundo_<id>.txt`. Si el archivo ya existe, omite la llamada.
3. **Generación de Imagen con IA (`src/imagen.js`)**:
   Envía el prompt descriptivo al modelo generador de imágenes y guarda el resultado en `imagenes/mundo_<id>.jpg`. Si ya existe, omite la llamada.

---

## 📂 Estructura del Proyecto

```text
mundos-ia/
├── data/                  # Almacena los archivos JSON generados (mundo_<id>.json)
├── descripciones/         # Almacena los textos generados por el LLM (mundo_<id>.txt)
├── imagenes/              # Almacena las imágenes generadas (mundo_<id>.jpg)
├── src/
│   ├── index.js           # Punto de entrada y orquestador del flujo
│   ├── mundo.js           # Procesamiento de argumentos, hash y guardado de JSON
│   ├── texto.js           # Consulta al LLM para la descripción visual
│   └── imagen.js          # Consulta al modelo de imágenes y guardado de archivo
├── .env                   # Variables de entorno y credenciales (ignorado por Git)
├── .env.example           # Plantilla de ejemplo para variables de entorno
├── .gitignore             # Exclusión de archivos dinámicos y credenciales
├── package.json           # Configuración del proyecto y scripts de npm
└── README.md              # Documentación técnica del proyecto
```

---

## 🤖 Servicios de Inteligencia Artificial Utilizados

Ambos servicios utilizan la misma API Key gratuita provista por la plataforma de **NVIDIA NIM**:

1. **Modelo de Lenguaje (Texto)**:
   - **Modelo:** `openai/gpt-oss-20b`
   - **Endpoint:** `https://integrate.api.nvidia.com/v1/chat/completions`
   - **Enlace:** [NVIDIA API Catalog - GPT-OSS-20B](https://build.nvidia.com/openai/gpt-oss-20b)
   - **Propósito:** Generar una descripción visual y artística en inglés optimizada para generación de imágenes respetando la paleta de colores.

2. **Modelo Generador de Imágenes**:
   - **Servicio:** `Pollinations.ai` (text-to-image gratuito)
   - **Endpoint:** `https://image.pollinations.ai/prompt/<PROMPT>?width=1024&height=1024&nologo=true`
   - **Enlace:** [Pollinations.ai](https://pollinations.ai/)
   - **Propósito:** Generar la imagen digital a partir de la descripción visual y descargar el archivo binario directo para guardarlo como `.jpg` (sustituye a FLUX por saturación y timeouts 504 en NVIDIA NIM).

