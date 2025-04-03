export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
  }
  
  export const mockUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      password: 'admin1234',
      email: 'testuser@example.com'
    }
  ];