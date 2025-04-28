export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: any[][];
  isActive: boolean;
  isFirstLogin: boolean;
  createdAt: string;
  updatedAt: string;
}
