import { Order, OrderItem } from '@/@types';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];

  return useQuery<Order[]>({
    queryKey: ['orders', { archived }],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').in('status', statuses);

      if (error) {
        console.log(error);

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

export const useOrderDetails = (id: number) => {
  return useQuery<Order>({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
