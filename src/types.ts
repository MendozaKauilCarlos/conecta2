
export type UserRole = 'admin' | 'student';

export interface AcademicStats {
  careerProgress: number; // Percentage
  complementaryCredits: number; // Count
}

export interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UserData {
  id: string;
  name: string;
  role: UserRole;
  controlNumber?: string;
  academicStats?: AcademicStats;
  address?: AddressData;
  gender?: string;
  profilePicture?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  semester?: string;
  career?: string;
  nss?: string;
  id_dependencia?: string;
  dependencia_seleccionada?: string;
  perfil_confirmado?: boolean;
}

export interface Dependency {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  location: string;
  vacancies: number;
  maxVacancies: number;
  status: 'Alta Disponibilidad' | 'Lugares Limitados' | 'Disponible' | 'Últimos Lugares' | 'Pocos Lugares' | 'Disponibilidad Media';
  image: string;
  oculta?: boolean;
  objective?: string;
  activities?: string[];
  contact?: {
    titular: string;
    phone: string;
    email: string;
    schedule: string;
    address: string;
    puesto_titular?: string;
    responsable_del_programa?: string;
    modalidad?: string;
    ubicacion_maps?: string;
  };
}
