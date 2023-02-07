import { QrState } from "./qrState.model"

export interface Qr {
  id: string
  state: QrState
  userId?: string
  data: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    phone: string;

    petName: string;
    petType: string;
    petBreed: string;
    petAge: string;
    petSize: string;
    petGender: string;
    petColor: string;
  }
}