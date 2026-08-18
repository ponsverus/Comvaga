import { supabase } from '../supabase';

export const clientService = {
  async getCurrentClientId(userId) {
    const { data, error } = await supabase
      .from('clientes')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'ativo')
      .single();
    
    if (error) throw error;
    return data?.id || null;
  },

  async getProfile(userId) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'ativo')
      .single();
    
    if (error) throw error;
    return {
      nome: data?.nome || '',
      avatarPath: data?.avatar_path || null,
      telefone: data?.telefone || '',
    };
  },

  async updateName(userId, nome) {
    const { error } = await supabase
      .from('clientes')
      .update({ nome })
      .eq('user_id', userId)
      .eq('status', 'ativo');
    
    if (error) throw error;
  },

  async updatePhone(userId, telefone) {
    const { error } = await supabase
      .from('clientes')
      .update({ telefone: telefone || null })
      .eq('user_id', userId)
      .eq('status', 'ativo');
    
    if (error) throw error;
  },

  async updateAvatar(userId, avatarPath) {
    const { error } = await supabase
      .from('clientes')
      .update({ avatar_path: avatarPath })
      .eq('user_id', userId)
      .eq('status', 'ativo');
    
    if (error) throw error;
  },

  async getFavorites(clienteId, options = {}) {
    const { limit = null, offset = 0 } = options;
    
    let query = supabase
      .from('favoritos')
      .select(`
        id,
        cliente_id,
        tipo,
        negocio_id,
        profissional_id,
        negocio_nome,
        negocio_slug,
        negocio_logo_path,
        negocio_tipo,
        profissional_nome,
        profissional_negocio_slug,
        created_at
      `)
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async addFavorite(clienteId, tipo, negocioId = null, profissionalId = null) {
    const { data, error } = await supabase
      .from('favoritos')
      .insert([{
        cliente_id: clienteId,
        tipo,
        negocio_id: negocioId,
        profissional_id: profissionalId,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeFavorite(favoritoId) {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('id', favoritoId);
    
    if (error) throw error;
  },

  async deleteAccount(clienteId) {
    const { error } = await supabase
      .from('clientes')
      .update({ status: 'deletado' })
      .eq('id', clienteId);
    
    if (error) throw error;
  },
};
