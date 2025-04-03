const request = require('supertest');
const app = require('../app');

describe('Multilingual Support', () => {
    test('should return messages in English by default', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Welcome to the Event Locator API');
        expect(response.body.translations).toEqual({
            event_created: 'Event created successfully',
            event_not_found: 'Event not found',
            missing_fields: 'Missing required fields',
            categories_required: 'Categories field is required',
        });
    });

    test('should return messages in Spanish when "Accept-Language" header is set to "es"', async () => {
        const response = await request(app)
            .get('/')
            .set('Accept-Language', 'es');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Bienvenido a la API de Localizador de Eventos');
        expect(response.body.translations).toEqual({
            event_created: 'Evento creado con éxito',
            event_not_found: 'Evento no encontrado',
            missing_fields: 'Faltan campos obligatorios',
            categories_required: 'El campo de categorías es obligatorio',
        });
    });

    test('should fall back to English for unsupported languages', async () => {
        const response = await request(app)
            .get('/')
            .set('Accept-Language', 'fr'); // Unsupported language
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Welcome to the Event Locator API');
    });
});
