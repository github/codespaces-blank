import api from '../utils/axiosConfig';
import { LoginData, RegisterData, User } from '../types/types';

export const login = async (data: LoginData): Promise<{ user: User; token: string }> => {
  const response = await api.post('auth/login/', data);
  return response.data as { user: User; token: string };
};

export const register = async (data: RegisterData): Promise<User> => {
  const response = await api.post('auth/register/', data);
  return response.data as User;
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get('auth/profile/');
  return response.data as User;
};

type AuthResponse = { user: User; token: string };

function authenticate(): AuthResponse {
  const response = someFunctionThatReturnsUnknown(); // Example source of the issue

  // Validate or cast the response to the expected type
  if (isAuthResponse(response)) {
    return response;
  }

  throw new Error('Invalid response format');
}

// Type guard to validate the structure of the response
function isAuthResponse(response: any): response is AuthResponse {
  return (
    response &&
    typeof response === 'object' &&
    'user' in response &&
    'token' in response &&
    typeof response.token === 'string'
  );
}
function someFunctionThatReturnsUnknown(): unknown {
    // Simulating an API response or some external data source
    return {
        user: {
            id: '123',
            name: 'John Doe',
            email: 'john.doe@example.com',
        },
        token: 'abc123token',
    };
}
