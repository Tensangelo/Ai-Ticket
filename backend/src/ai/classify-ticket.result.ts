/* Resultado ya normalizado para guardar en el ticket.
 * SUCCESS: la IA devolvio categoria/prioridad validas del catalogo.
 * FAILED: no hubo respuesta usable (sin clave, timeout, JSON invalido, nombre inventado).*/

export type ClassificationResult =
  | {
      readonly status: 'SUCCESS';
      readonly categoryId: number;
      readonly priorityId: number;
      readonly summary: string;
    }
  | {
      readonly status: 'FAILED';
      readonly error: string;
    };
