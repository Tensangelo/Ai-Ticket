export interface CatalogItem {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface TicketOwner {
  id: string;
  fullName: string;
}

export type ClassificationStatus = "PENDING" | "SUCCESS" | "FAILED";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface TicketComment {
  id: string;
  content: string;
  authorName: string;
  authorRole: string;
  ticketId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketListItem {
  id: string;
  customerName: string;
  title: string;
  status: TicketStatus;
  category: CatalogItem;
  priority: CatalogItem;
  owner: TicketOwner | null;
  classificationStatus: ClassificationStatus;
  classificationError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketDetail extends TicketListItem {
  description: string;
  attachmentUrl: string | null;
  summary: string | null;
  comments: TicketComment[];
}
