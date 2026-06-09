import { supabase } from '../../../supabase';
import { withTimeout } from '../../../utils/withTimeout';

export async function fetchClientePerfil(userId) {
  const { data, error } = await withTimeout(
    supabase
      .from('users')
      .select('nome, avatar_path')
      .eq('id', userId)
      .maybeSingle(),
    6000,
    'cliente-perfil'
  );

  if (error) throw error;
  return { nome: String(data?.nome || '').trim(), avatarPath: data?.avatar_path || null };
}

export async function fetchCurrentClienteId() {
  const { data, error } = await withTimeout(
    supabase.rpc('get_current_cliente_id'),
    6000,
    'cliente-atual'
  );

  if (error) throw error;
  return data || null;
}

export async function fetchAgendamentosCliente({ clienteId, limit, offset }) {
  const { data, error } = await withTimeout(
    supabase.rpc('get_agendamentos_cliente', {
      p_cliente_id: clienteId,
      p_limit: limit,
      p_offset: offset,
    }),
    7000,
    'agendamentos-cliente'
  );

  if (error) throw error;
  return data || [];
}

export async function fetchFavoritosCliente({ clienteId, limit, offset }) {
  const { data, error } = await withTimeout(
    supabase.rpc('get_favoritos_cliente', {
      p_cliente_id: clienteId,
      p_limit: limit,
      p_offset: offset,
    }),
    7000,
    'favoritos-cliente'
  );

  if (error) throw error;
  return data || [];
}

export async function fetchReviewedBookings(agendamentoIds) {
  const ids = Array.isArray(agendamentoIds) ? agendamentoIds.filter(Boolean) : [];
  if (!ids.length) return [];

  const { data, error } = await withTimeout(
    supabase
      .from('depoimentos')
      .select('id, agendamento_id')
      .in('agendamento_id', ids),
    6000,
    'depoimentos-avaliados'
  );

  if (error) throw error;
  return data || [];
}

export async function createBookingReview({ agendamentoId, nota, comentario }) {
  const { data, error } = await withTimeout(
    supabase.rpc('create_depoimento_agendamento', {
      p_agendamento_id: agendamentoId,
      p_nota: nota,
      p_comentario: comentario ?? null,
    }),
    6500,
    'enviar-depoimento'
  );

  if (error) throw error;
  return data;
}

export async function cancelarAgendamentoCliente(agendamentoId) {
  const { data, error } = await withTimeout(
    supabase.rpc('cancelar_agendamento', { p_agendamento_id: agendamentoId }),
    6500,
    'cancelar-agendamento'
  );

  if (error) throw error;
  return data;
}

export async function removerContaCliente() {
  const { data, error } = await withTimeout(
    supabase.rpc('remove_cliente_seguro'),
    6500,
    'excluir-conta'
  );

  if (error) throw error;
  return data;
}

export async function removerFavoritoCliente({ favoritoId, clienteId }) {
  const { error } = await withTimeout(
    supabase
      .from('favoritos')
      .delete()
      .eq('id', favoritoId)
      .eq('cliente_id', clienteId),
    6000,
    'remover-favorito-cliente'
  );

  if (error) throw error;
}
