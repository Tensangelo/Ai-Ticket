/* Texto que envia el usuario y que la IA debe clasificar.
 * No incluye category/priority: eso lo propone el modelo, no el formulario. */

export interface ClassifyTicketInput {
  readonly title: string;
  readonly description: string;
}
