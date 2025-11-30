/**
 * aiService.js
 * 
 * Servicio de Inteligencia Artificial para sugerencias de reemplazo de turnos
 * Utiliza Google Gemini AI para analizar miembros disponibles y sugerir
 * el mejor candidato para cubrir ausencias laborales
 * 
 * Modelo utilizado: Gemini 2.5 Flash Lite (tier gratuito)
 * Límites: 15 RPM / 1500 RPD
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar cliente de Google Gemini con API Key
const genAI = new GoogleGenerativeAI('AIzaSyBy2x9ltsSNdURlqCM4ip9WINFXj9LKb_A');

/**
 * Sugiere el mejor miembro para sustituir usando IA
 * 
 * Analiza una lista de miembros disponibles y los criterios de la ausencia
 * para determinar el candidato más adecuado para cubrir el turno
 * 
 * @param {Array} members - Lista de miembros disponibles con sus datos
 *   - id: Identificador único del miembro
 *   - name: Nombre completo
 *   - position: Puesto/cargo
 *   - status: Estado (Disponible/Ocupado/etc)
 *   - availableDays: Días disponibles
 *   - startTime/endTime: Horario de trabajo
 *   - experience: Nivel de experiencia
 * 
 * @param {Object} request - Datos de la petición de ausencia
 *   - userName: Nombre del empleado ausente
 *   - position: Puesto del ausente
 *   - date: Fecha de la ausencia
 *   - startTime: Hora de inicio del turno
 *   - reason: Motivo de la ausencia
 * 
 * @returns {Promise<Object>} Objeto con resultado de la sugerencia:
 *   - success: true/false indica si se generó una sugerencia
 *   - suggestion: { memberId, memberName, confidence, reason }
 *   - noSuitableMembers: true si no hay candidatos adecuados
 *   - error: mensaje de error si algo falló
 */
export const suggestBestReplacement = async (members, request) => {
  try {
    // Normalizar datos de los miembros para enviar a la IA
    // Se asegura que todos los campos estén presentes aunque sean 'N/A'
    const membersData = members.map(m => ({
      id: m.id,
      name: m.name || 'Sin nombre',
      position: m.position || 'Sin posición',
      status: m.status || 'Desconocido',
      availableDays: m.availableDays || 'N/A',
      startTime: m.startTime || 'N/A',
      endTime: m.endTime || 'N/A',
      experience: m.experience || 'N/A'
    }));

    // Construir prompt estructurado para la IA
    // Incluye información de la ausencia, lista de candidatos y criterios de evaluación
    const prompt = `
Eres un asistente experto en gestión de turnos laborales. Analiza la siguiente información y sugiere el MEJOR miembro para reemplazar al empleado ausente.

**INFORMACIÓN DE LA AUSENCIA:**
- Empleado ausente: ${request.userName}
- Puesto: ${request.position}
- Fecha de ausencia: ${request.date}
- Horario: ${request.startTime}
- Razón: ${request.reason}

**MIEMBROS DISPONIBLES PARA SUSTITUCIÓN:**
${JSON.stringify(membersData, null, 2)}

**CRITERIOS DE EVALUACIÓN (en orden de importancia):**
1. Estado "Disponible" (CRÍTICO - descarta si no está disponible)
2. Mismo puesto o experiencia relevante
3. Disponibilidad en el día de la semana solicitado
4. Compatibilidad de horarios (inicio y fin)
5. Nivel de experiencia

**INSTRUCCIONES:**
- Analiza TODOS los miembros disponibles
- Si NINGÚN miembro está "Disponible", selecciona el que tenga más compatibilidad
- Considera la disponibilidad de días de la semana
- Prioriza experiencia similar o del mismo puesto

Responde ÚNICAMENTE en formato JSON válido (sin markdown, sin bloques de código):
{
  "memberId": "id_del_miembro_sugerido",
  "memberName": "nombre_completo_del_miembro",
  "confidence": "alta",
  "reason": "Explicación clara de por qué es la mejor opción (máximo 2 líneas)"
}

IMPORTANTE: Responde SOLO el JSON, sin texto adicional.
`;

    // Configurar modelo de IA Gemini 2.5 Flash Lite
    // Temperature 0.3 = respuestas más consistentes y determinísticas
    // maxOutputTokens 200 = suficiente para la respuesta JSON esperada
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 200,
      }
    });

    // Ejecutar generación de contenido con el prompt
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Limpiar respuesta: la IA puede devolver JSON envuelto en bloques markdown
    // Se debe extraer solo el contenido JSON válido
    let jsonText = responseText.trim();
    
    // Eliminar bloques de código markdown (```json ... ```)
    // La IA a veces envuelve el JSON en formato markdown
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    // Extraer objeto JSON usando regex si hay texto adicional
    // Busca el patrón { ... } en la respuesta
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    // Parsear JSON a objeto JavaScript
    const suggestion = JSON.parse(jsonText);

    // Validación 1: Verificar si la IA encontró candidatos adecuados
    // Si no hay memberId o memberName, significa que no hay opciones viables
    if (!suggestion.memberId || !suggestion.memberName) {
      return {
        success: false,
        noSuitableMembers: true,
        reason: suggestion.reason || 'No se encontraron miembros adecuados para esta sustitución',
        confidence: suggestion.confidence || 'baja'
      };
    }

    // Validación 2: Asegurar que la respuesta incluye explicación
    // La razón es importante para que el admin entienda la sugerencia
    if (!suggestion.reason) {
      throw new Error('Respuesta de IA sin razón explicativa');
    }

    // Retornar sugerencia exitosa con todos los datos normalizados
    return {
      success: true,
      suggestion: {
        memberId: suggestion.memberId,
        memberName: suggestion.memberName,
        confidence: suggestion.confidence || 'media',
        reason: suggestion.reason
      }
    };

  } catch (error) {
    // Manejo de errores:
    // - Errores de red al llamar a la API de Gemini
    // - Errores de parsing JSON (respuesta mal formateada)
    // - Errores de validación (respuesta sin campos requeridos)
    // - Errores de límite de tasa (15 RPM excedido)
    
    // Los errores SyntaxError indican que la IA devolvió JSON inválido
    // En producción, se puede implementar retry o fallback a selección manual
    
    return {
      success: false,
      error: error.message || 'Error desconocido'
    };
  }
};
