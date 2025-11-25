# Number One - UPC - Capilla del Monte

## Autores

- **Santiago Luna**
- **Martin Sanchez** 
- **Nicolas Fernandez**
- **Ivo Guiliano Capetto**
- **Joaquin Grosso**

---

## Descripción del Proyecto

Este repositorio contiene el servidor y la lógica de IA para un juego de Ta-Te-Ti (tic-tac-toe). El proyecto fue extendido para soportar tablero 5x5 donde la condición de victoria es formar 4 en línea.

En esta rama se incorporó una re-implementación del "Bot2" para hacerlo mucho más robusto: detección de amenazas, bloqueo preventivo, y búsqueda Minimax con poda alfa-beta.

---

## Novedades principales (últimos cambios)

- Re-implementación de `utils/tateti5x5.js` para el Bot2.
- Detección de amenazas inmediatas (3 en línea + 1 vacío) y bloqueo prioritario.
- Detección de amenazas potenciales (2 en línea + 2 vacios) y bloqueo preventivo.
- Prevención de doble-amenaza: se evalua que bloqueo genera menos victorias inmediatas al rival.
- Minimax con poda alfa-beta para toma de decisiones cuando no hay amenazas inmediatas.
- Heuristica de evaluación mejorada (prioriza centro, formar 2/3 en linea y bloquear al rival).
- **NUEVO**: Configurado para despliegue en Vercel con funciones serverless (sin error 404).

---

## Archivos y funciones clave

- `utils/tateti5x5.js` — Nueva implementación del Bot2 y utilidades.
  - `LINEAS_4` — Todas las combinaciones de 4 casilleros que forman lineas posibles en 5x5.
  - `detectarAmenazasInmediatas(tablero, simbolo)` — retorna posiciones que completarian 4 en linea para `simbolo`.
  - `detectarAmenazasPotenciales(tablero, simbolo)` — posiciones en lineas con 2 fichas del `simbolo` y 2 vacios.
  - `contarVictoriasInmediatas(tablero, simbolo)` — cuenta victorias inminentes.
  - `victoriasRivalDespuesDe(tablero, pos, simboloIA)` — simula un movimiento y cuenta victorias del rival.
  - `obtenerMejorMovimiento(tablero, profundidadMaxima = 4)` — devuelve el indice (0-24) del mejor movimiento.
  - `evaluarTablero(tab)` — heuristica usada por Minimax.

- `utils/tateti3x3.js` — bot para tablero 3x3 (sin cambios mayores).
- `api/index.js` — Función serverless para Vercel.
- `vercel.json` — Configuración para Vercel.
- `__tests__/tateti5x5_tests` — tests de integracion/ unidad para tateti 5x5.

---

## Flujo de decisión del Bot (resumen)

1. Si es el primer movimiento: tomar centro (posicion 12) si está libre, sino una esquina.
2. Jugar victoria inmediata propia si existe (completar 4 en línea).
3. Bloquear victorias inmediatas del rival (3 fichas + 1 vacío). Evaluar doble-amenaza al seleccionar el bloqueo.
4. Bloquear amenazas potenciales (rival con 2 fichas en una línea y 2 vacios) escogiendo la posición que minimice victorias inmediatas post-bloqueo.
5. Si ninguna amenaza aplica, ejecutar Minimax con poda alfa-beta hasta la profundidad configurada y seleccionar el movimiento con mejor evaluación heuristica.

---

## Cómo ejecutar localmente

1. Instalar dependencias:

```powershell
npm install
```

2. Ejecutar tests:

```powershell
npm test
```

3. Iniciar el servidor (opcional):

```powershell
node utils/tateti5x5.js
```

- Endpoint disponible: `GET /move?board=[...]` donde `board` es un array JSON de 25 valores (0=vacío, 1=X, 2=O). El servidor retorna `{ movimiento: <indice> }`.

---

## Despliegue en Vercel

### Configuración

El proyecto está configurado para ejecutarse en **Vercel con funciones serverless**. No es necesario hacer nada especial:

1. Conecta este repositorio a Vercel:
   - Ve a [vercel.com](https://vercel.com)
   - Autoriza con GitHub
   - Selecciona este repositorio

2. Vercel detectará automáticamente la configuración en `vercel.json` y desplegará correctamente.

### Usar la API

Una vez desplegado, la URL será algo como: `https://tu-proyecto.vercel.app`

**Realizar una solicitud:**

```bash
curl "https://tu-proyecto.vercel.app/api?board=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]"
```

O con POST:

```bash
curl -X POST https://tu-proyecto.vercel.app/api \
  -H "Content-Type: application/json" \
  -d '{"board":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}'
```

**Respuesta:**

```json
{
  "movimiento": 12
}
```

---

## Resultados de pruebas

- Suite completa: 5 test suites, 30 tests — todos pasados en el entorno donde se implementaron los cambios.

---

## Solución de problemas

### Error 404 en Vercel

Si recibés error 404 al desplegar:

1. Asegúrate de que existe `vercel.json` en la raíz del proyecto.
2. Asegúrate de que existe la carpeta `api/` con `index.js`.
3. Limpia el caché de Vercel: en el dashboard de Vercel, ve a Settings → Git → Redeploy y selecciona "Clear Cache".
4. Haz un nuevo push al repositorio para triggear un redeploy.

### Errores de módulos

Si hay errores de módulos faltantes:

1. Ejecuta `npm install` localmente para verificar que todo funciona.
2. Haz commit de `package-lock.json` para que Vercel instale las mismas versiones.
