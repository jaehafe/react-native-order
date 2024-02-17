import { Order } from '@/@types';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InsertTables } from '@/@types';

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

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuthContext();

  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: InsertTables<'orders'>) {
      const { error, data: newProduct } = await supabase
        .from('orders')
        .insert({ ...data, user_id: userId! })
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct[0];
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError(error) {
      console.log(error);
    },
  });
};
