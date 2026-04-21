import type {
  EnergyLevel,
  EnvironmentSize,
  IndependenceLevel,
  PetAge,
  PetSize,
} from './api'

export const ageLabel: Record<PetAge, string> = {
  PUPPY: 'Filhote',
  ADULT: 'Adulto',
  SENIOR: 'Idoso',
}

export const sizeLabel: Record<PetSize, string> = {
  SMALL: 'Pequeno',
  MEDIUM: 'Médio',
  LARGE: 'Grande',
}

export const energyLabel: Record<EnergyLevel, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
}

export const independenceLabel: Record<IndependenceLevel, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
}

export const environmentLabel: Record<EnvironmentSize, string> = {
  SMALL: 'Ambiente pequeno',
  MEDIUM: 'Ambiente médio',
  LARGE: 'Ambiente amplo',
}
