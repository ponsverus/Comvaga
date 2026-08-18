import { supabase } from '../supabase';

export const negocioService = {
  async getByOwner(ownerId) {
    const { data, error } = await supabase
      .from('negocios')
      .select('*')
      .eq('owner_id', ownerId);
    
    if (error) throw error;
    return data || [];
  },

  async countByOwner(ownerId) {
    const { count, error } = await supabase
      .from('negocios')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', ownerId);
    
    if (error) throw error;
    return count || 0;
  },

  async getById(negocioId) {
    const { data, error } = await supabase
      .from('negocios')
      .select('*')
      .eq('id', negocioId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('negocios')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(negocio) {
    if (!negocio.owner_id) {
      throw new Error('owner_id é obrigatório');
    }
    
    const { data, error } = await supabase
      .from('negocios')
      .insert([negocio])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(negocioId, updates) {
    const { data, error } = await supabase
      .from('negocios')
      .update(updates)
      .eq('id', negocioId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(negocioId) {
    const { error } = await supabase
      .from('negocios')
      .delete()
      .eq('id', negocioId);
    
    if (error) throw error;
  },

  async updateInfo(negocioId, info) {
    return this.update(negocioId, {
      nome: info.nome,
      descricao: info.descricao,
      telefone: info.telefone,
      endereco_cep: info.endereco_cep,
      endereco_rua: info.endereco_rua,
      endereco_numero: info.endereco_numero,
      endereco_complemento: info.endereco_complemento,
      endereco_bairro: info.endereco_bairro,
      endereco_cidade: info.endereco_cidade,
      endereco_estado: info.endereco_estado,
      instagram: info.instagram,
      facebook: info.facebook,
    });
  },

  async updateLogo(negocioId, logoPath) {
    return this.update(negocioId, { logo_path: logoPath });
  },

  async updateTheme(negocioId, tema) {
    return this.update(negocioId, { tema });
  },
};
