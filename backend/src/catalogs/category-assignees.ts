import { catalogNames } from './catalog-names.js';

// Especialista del seed que recibe el ticket segun la categoria de la IA. Unclassified no esta: queda sin owner.

export const categoryAssigneeNames: Record<string, string> = {
  [catalogNames.finance]: 'Sarah Johnson',
  [catalogNames.legal]: 'Michael Brown',
  [catalogNames.procurement]: 'Daniel Martinez',
  [catalogNames.operations]: 'Emily Davis',
};
