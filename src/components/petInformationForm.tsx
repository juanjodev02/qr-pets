export type PetInformationFields = {
  type: 'dog' | 'cat' | 'other',
  name: string,
  breed: string,
  color: string,
  age: number,
  medicalConditions: string,
  photo: File,
}

const PetInformationForm = () => {}

export default PetInformationForm