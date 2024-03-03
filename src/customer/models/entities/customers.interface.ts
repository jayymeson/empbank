export interface Customers {
  id: string;
  code: string;
  name: string;
  network: string;
  commercialAssistant?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
}
