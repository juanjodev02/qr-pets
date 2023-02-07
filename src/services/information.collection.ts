import { FormFields } from "../pages/[id]";

import {db} from '../utils/firebase'
import { updateDoc, doc, addDoc, collection } from 'firebase/firestore'
import { QrState } from '../models/qrState.model'
import { findQr } from "./qr.collection";


export const registerInformation = async (params:
  {id: string,
  data: FormFields}
) => {
  await updateDoc(doc(db, 'qr', params.id), {
    data: params.data,
    state: QrState.IN_USE
  })
}

export const sendHelperInformation = async (params: {
  id: string;
  latitude: string;
  longitude: string;
  helperName: string;
  helperPhone: string;
  helperEmail: string;
}) => {
  await addDoc(collection(db, 'qr', params.id, 'helpers'), {
    latitude: params.latitude,
    longitude: params.longitude,
    helperName: params.helperName,
    helperPhone: params.helperPhone,
    helperEmail: params.helperEmail,
  })

  const data = await findQr(params.id)
  await fetch('/api/send-mail', {
    method: 'POST',
    keepalive: true,

    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      latitude: params.latitude,
      longitude: params.longitude,
      helperName: params.helperName,
      helperPhone: params.helperPhone,
      helperEmail: params.helperEmail,
      ownerPhone: data.data?.phone,
      ownerEmail: data.data?.email
    }),
  })
}