import { addDoc, collection, doc, getDoc } from 'firebase/firestore'
import {db} from '../utils/firebase'
import { Qr } from '../models/qr.model'

export const addQr = async (qr: Omit<Qr, 'id'>): Promise<{
  id: string
}> => {
  const data = await addDoc(collection(db, 'qr'), {
    ...qr,
  })

  return {
    id: data.id
  }
}

export const findQr = async (id: string): Promise<Qr> => {
  const result = await getDoc(doc(db, 'qr', id))
  if (!result.exists()) {
    throw new Error('QR not found')
  }

  const data = result.data()

  return {
    id: result.id,
    state: data.state,
    userId: data.userId ?? null,
    data: data.data ?? null
  }
}