// Lógica centralizada del tateti5x5 (sin Express)
const {
    identificarJugador,
    obtenerPosicionesVacias,
    obtenerMejorMovimiento
} = require('../utils/tateti5x5.js');

// Manejador de la función serverless
export default function handler(req, res) {
    // Permitir CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Manejo de preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Solo aceptar GET y POST
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    let parametroTablero;
    
    // Obtener el parámetro board de query o body
    if (req.method === 'GET') {
        parametroTablero = req.query.board;
    } else {
        parametroTablero = req.body?.board;
    }

    let tablero;
    try {
        tablero = JSON.parse(parametroTablero);
    } catch (e) {
        return res.status(400).json({ error: 'Parámetro board inválido. Debe ser un array JSON.' });
    }

    if (!Array.isArray(tablero) || tablero.length !== 25) {
        return res.status(400).json({ error: 'El tablero debe ser un array de 25 posiciones.' });
    }

    const posicionesVacias = tablero
        .map((valor, indice) => valor === 0 ? indice : null)
        .filter(indice => indice !== null);

    if (posicionesVacias.length === 0) {
        return res.status(400).json({ error: 'No hay movimientos disponibles.' });
    }

    try {
        const movimiento = obtenerMejorMovimiento(tablero);
        res.status(200).json({ movimiento: movimiento });
    } catch (error) {
        console.error('Error en obtenerMejorMovimiento:', error);
        res.status(500).json({ error: 'Error interno al procesar el movimiento' });
    }
}
