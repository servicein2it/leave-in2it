import { useContext } from 'react';
import { useAuth as useAuthFromContext } from '@/context/SimpleAuthContext';

export const useAuth = useAuthFromContext;
