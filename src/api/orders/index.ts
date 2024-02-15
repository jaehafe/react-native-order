import { Order } from '@/@types';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';

export const useAdminOrderList = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*');

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useMyOrderList = () => {
  const { session } = useAuthContext();
  const id = session?.user.id;

  // if (!id) return null;

  return useQuery<Order[]>({
    queryKey: ['orders', { userId: id }],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').eq('user_id', id!);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
