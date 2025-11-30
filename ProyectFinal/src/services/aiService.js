// Servicio de IA para sugerencias de reemplazo usando Google Gemini
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar Gemini con la API Key
const genAI = new GoogleGenerativeAI('AIzaSyBy2x9ltsSNdURlqCM4ip9WINFXj9LKb_A');

/**
 * Sugiere el mejor miembro para sustituir usando IA
 * @param {Array} members - Lista de miembros disponibles
 * @param {Object} request - Datos de la petición de ausencia
 * @returns {Promise<Object>} - Sugerencia con memberId, nombre y razón
 */
export const suggestBestReplacement = async (members, request) => {
  try {
    console.log('🤖 Iniciando sugerencia de IA...');
    
    // Preparar datos de los miembros para la IA
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

    // Crear el prompt para la IA
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

    // Llamar a la API de Gemini - Usando Gemini 2.5 Flash Lite (modelo más reciente, tier gratuito: 15 RPM / 1500 RPD)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.3, // Respuestas más determinísticas
        maxOutputTokens: 200,
      }
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('📝 Respuesta de IA:', responseText);

    // Extraer JSON de la respuesta (por si viene con markdown)
    let jsonText = responseText.trim();
    
    // Remover bloques de código markdown si existen
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    // Intentar extraer JSON si hay texto antes o después
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const suggestion = JSON.parse(jsonText);

    // Validar que tenga los campos requeridos
    if (!suggestion.memberId || !suggestion.memberName || !suggestion.reason) {
      throw new Error('Respuesta de IA incompleta');
    }

    console.log('✅ Sugerencia procesada:', suggestion);

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
    console.error('❌ Error en sugerencia de IA:', error);
    
    // Si es error de parsing JSON, dar más detalles
    if (error instanceof SyntaxError) {
      console.error('Error de JSON. Texto recibido:', error.message);
    }
    
    return {
      success: false,
      error: error.message || 'Error desconocido'
    };
  }
};
