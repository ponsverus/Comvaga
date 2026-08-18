import { supabase } from '../supabase';

export const bookingService = {
  async getByProfessional(professionalId, options = {}) {
    const { limit = null, offset = 0 } = options;
    
    let query = supabase
      .from('agendamentos')
      .select('*, profissionais(*), entregas(*), negocios(nome, slug)')
      .eq('profissional_id', professionalId)
      .order('data', { ascending: false })
      .order('horario_inicio', { ascending: false });
    
    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getByBusiness(negocioId, options = {}) {
    const { limit = null, offset = 0 } = options;
    
    let query = supabase
      .from('agendamentos')
      .select('*, profissionais(*), entregas(*), clientes(*)')
      .eq('negocio_id', negocioId)
      .order('data', { ascending: false })
      .order('horario_inicio', { ascending: false });
    
    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getByClient(clienteId, options = {}) {
    const { limit = null, offset = 0 } = options;
    
    let query = supabase
      .from('agendamentos')
      .select(`
        *,
        profissionais(nome),
        entregas(nome, preco, preco_promocional),
        negocios(nome, slug, logo_path, tipo_negocio)
      `)
      .eq('cliente_id', clienteId)
      .order('data', { ascending: false });
    
    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(bookingId) {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*, profissionais(*), entregas(*), clientes(*), negocios(*)')
      .eq('id', bookingId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(booking) {
    if (!booking.profissional_id || !booking.negocio_id) {
      throw new Error('profissional_id e negocio_id são obrigatórios');
    }
    
    const { data, error } = await supabase
      .from('agendamentos')
      .insert([booking])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(bookingId, updates) {
    const { data, error } = await supabase
      .from('agendamentos')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(bookingId) {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', bookingId);
    
    if (error) throw error;
  },

  async cancel(bookingId, motivo = '') {
    return this.update(bookingId, {
      status: 'cancelado',
      motivo_cancelamento: motivo || null,
      data_cancelamento: new Date().toISOString(),
    });
  },

  async confirm(bookingId) {
    return this.update(bookingId, {
      status: 'confirmado',
    });
  },

  async countByBusiness(negocioId) {
    const { count, error } = await supabase
      .from('agendamentos')
      .select('id', { count: 'exact', head: true })
      .eq('negocio_id', negocioId);
    
    if (error) throw error;
    return count || 0;
  },

  subscribeToBusinessBookings(negocioId, callback) {
    const channel = supabase
      .channel(`agendamentos:${negocioId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agendamentos',
          filter: `negocio_id=eq.${negocioId}`,
        },
        callback
      )
      .subscribe();
    
    return () => supabase.removeChannel(channel);
  },

  subscribeToProfessionalBookings(professionalId, callback) {
    const channel = supabase
      .channel(`agendamentos:profissional:${professionalId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agendamentos',
          filter: `profissional_id=eq.${professionalId}`,
        },
        callback
      )
      .subscribe();
    
    return () => supabase.removeChannel(channel);
  },

  subscribeToClientBookings(clienteId, callback) {
    const channel = supabase
      .channel(`agendamentos_cliente:${clienteId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agendamentos',
          filter: `cliente_id=eq.${clienteId}`,
        },
        callback
      )
      .subscribe();
    
    return () => supabase.removeChannel(channel);
  },
};
