import { supabase } from '../supabase';

export const reviewService = {
  async getByBooking(agendamentoId) {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .eq('agendamento_id', agendamentoId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async getByBookings(agendamentoIds) {
    if (!agendamentoIds || agendamentoIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .in('agendamento_id', agendamentoIds);
    
    if (error) throw error;
    return data || [];
  },

  async create(agendamentoId, nota, comentario = '') {
    const { data, error } = await supabase
      .from('avaliacoes')
      .insert([{
        agendamento_id: agendamentoId,
        nota,
        comentario: comentario || null,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(avaliacaoId, nota, comentario = '') {
    const { data, error } = await supabase
      .from('avaliacoes')
      .update({
        nota,
        comentario: comentario || null,
      })
      .eq('id', avaliacaoId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(avaliacaoId) {
    const { error } = await supabase
      .from('avaliacoes')
      .delete()
      .eq('id', avaliacaoId);
    
    if (error) throw error;
  },
};
