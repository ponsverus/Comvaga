import { supabase } from '../supabase';

export const profissionalService = {
  async getByBusiness(negocioId) {
    const { data, error } = await supabase
      .from('profissionais')
      .select('*')
      .eq('negocio_id', negocioId)
      .order('nome', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getById(profissionalId) {
    const { data, error } = await supabase
      .from('profissionais')
      .select('*')
      .eq('id', profissionalId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(profissional) {
    if (!profissional.negocio_id) {
      throw new Error('negocio_id é obrigatório');
    }
    
    const { data, error } = await supabase
      .from('profissionais')
      .insert([profissional])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(profissionalId, updates) {
    const { data, error } = await supabase
      .from('profissionais')
      .update(updates)
      .eq('id', profissionalId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(profissionalId) {
    const { error } = await supabase
      .from('profissionais')
      .delete()
      .eq('id', profissionalId);
    
    if (error) throw error;
  },

  async toggleStatus(profissionalId, ativo) {
    return this.update(profissionalId, { ativo });
  },

  async getServices(profissionalId, options = {}) {
    const { limit = null, offset = 0 } = options;
    
    let query = supabase
      .from('entregas')
      .select('*')
      .eq('profissional_id', profissionalId)
      .order('nome', { ascending: true });
    
    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createService(entrega) {
    if (!entrega.profissional_id || !entrega.negocio_id) {
      throw new Error('profissional_id e negocio_id são obrigatórios');
    }
    
    const { data, error } = await supabase
      .from('entregas')
      .insert([entrega])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateService(entregaId, updates) {
    const { data, error } = await supabase
      .from('entregas')
      .update(updates)
      .eq('id', entregaId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteService(entregaId) {
    const { error } = await supabase
      .from('entregas')
      .delete()
      .eq('id', entregaId);
    
    if (error) throw error;
  },

  async toggleServiceStatus(entregaId, ativo) {
    return this.updateService(entregaId, { ativo });
  },
};
