export const ptBR = {
  alerts: {
    action_failed_support: {
      title: 'Algo fugiu do esperado',
      body:
        'Houve um erro inesperado durante o processamento.\n' +
        'Isso pode ser uma instabilidade temporária.\n' +
        'Se o problema persistir, acesse SUPORTE no rodapé da página para falar com a gente.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    request_timeout: {
      title: 'Demorou demais',
      body: 'O carregamento levou mais tempo que o normal.\nTente novamente em instantes.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    rate_limit_exceeded: {
      title: 'Muitas tentativas',
      body: 'Você realizou muitas tentativas em pouco tempo.\nAguarde um minuto e tente novamente.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    business_not_loaded: {
      title: 'Falha ao ler os dados do negócio',
      body: 'Ocorreu um erro técnico durante o carregamento dos dados.\nRecarregue a página e tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
  },

  dashboard: {
    business_delete_confirm: {
      title: 'Excluir negócio?',
      body:
        'Tem certeza que deseja excluir este negócio?\n' +
        'Este comando encerra e apaga os registros do negócio para sempre.',
      variant: 'warning',
      screen: 'dark',
      confirmText: 'EXCLUIR',
      cancelText: 'CANCELAR',
      buttonText: 'EXCLUIR',
    },
    business_deleted: {
      title: 'Negócio excluído',
      body: 'O negócio foi excluído com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    business_delete_error: {
      title: 'Erro ao excluir',
      body: 'Erro ao excluir negócio. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    logo_updated: {
      title: 'Logo atualizada',
      body: 'Sua logo foi atualizada com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    logo_update_error: {
      title: 'Erro ao atualizar logo',
      body: 'Tente atualizar sua logo novamente em instantes.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },

    business_info_updated: {
      title: 'Salvo',
      body: 'Os dados do negócio foram salvos com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    address_format_invalid: {
      title: 'Endereço inválido',
      body: 'Use o formato: "RUA, NÚMERO - CIDADE, ESTADO".',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    address_format_invalid_inline: {
      body: 'Use o formato: RUA, NÚMERO - CIDADE, ESTADO.',
    },
    business_info_update_error: {
      title: 'Erro ao salvar',
      body: 'Erro ao salvar os dados do negócio agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },

    gallery_invalid_format: {
      title: 'Formato inválido',
      body: 'Envie apenas PNG, JPG ou WEBP.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    gallery_too_large: {
      title: 'Arquivo grande',
      body: 'Cada imagem pode ter no máximo 4 MB.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    gallery_upload_error: {
      title: 'Erro no upload',
      body: 'Erro ao enviar uma das imagens. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    gallery_updated: {
      title: 'Galeria atualizada',
      body: 'As imagens foram adicionadas.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    gallery_update_error: {
      title: 'Erro',
      body: 'Erro ao concluir o envio das imagens. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    gallery_load_warning: {
      title: 'Galeria indisponível no momento',
      body:
        'Erro ao carregar as imagens da galeria agora.\n' +
        'O restante do painel continua disponível.\n' +
        'Tente novamente em instantes.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    history_load_error: {
      title: 'Histórico indisponível',
      body: 'Histórico indisponível no momento. Tente novamente em instantes.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    gallery_remove_confirm: {
      title: 'Remover imagem?',
      body: 'Tem certeza que deseja remover esta imagem da galeria?',
      variant: 'warning',
      screen: 'dark',
      confirmText: 'REMOVER',
      cancelText: 'CANCELAR',
      buttonText: 'REMOVER',
    },
    gallery_image_removed: {
      title: 'Imagem removida',
      body: 'A imagem foi removida da galeria.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    gallery_remove_error: {
      title: 'Erro',
      body: 'Erro ao remover esta imagem agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },

    entrega_promo_invalid: {
      title: 'Oferta inválida',
      body: 'O preço de oferta precisa ser menor que o preço normal.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    entrega_price_invalid: {
      title: 'Preço inválido',
      body: 'Informe um valor válido para continuar.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    entrega_duration_invalid: {
      title: 'Tempo inválido',
      body: 'Informe o tempo em minutos.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },

    business: {

      tab_title: {
        servicos:  'SERVS',
        consultas: 'Consultas',
        aulas:     'Aulas',
      },

      button_add: {
        servicos:  'ADD SERV',
        consultas: 'CONSULTA',
        aulas:     'AULA',
      },

      modal_new: {
        servicos:  'NOVO SERV',
        consultas: 'NOVA CONSULTA',
        aulas:     'NOVA AULA',
      },

      modal_edit: {
        servicos:  'EDITAR SERV',
        consultas: 'EDITAR CONSULTA',
        aulas:     'EDITAR AULA',
      },

      counter_singular: {
        servicos:  'SERV',
        consultas: 'CONSULTA',
        aulas:     'AULA',
      },
      counter_plural: {
        servicos:  'SERVS',
        consultas: 'CONSULTAS',
        aulas:     'AULAS',
      },

      empty_list: {
        servicos:  ':(',
        consultas: 'Sem consultas para este profissional.',
        aulas:     'Sem aulas para este profissional.',
      },

      servicos: {
        entrega_created: {
          title: 'Serv. criado',
          body: 'O novo serv. já está disponível para agendamento.',
          variant: 'success', screen: 'light', buttonText: 'OK',
        },
        entrega_updated: {
          title: 'Serv. atualizado',
          body: 'Os ajustes foram salvos com sucesso.',
          variant: 'success', screen: 'light', buttonText: 'OK',
        },
        entrega_create_error: {
          title: 'Erro ao criar',
          body: 'Ocorreu uma falha ao criar este serv. Tente novamente.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
        entrega_update_error: {
          title: 'Erro ao salvar',
          body: 'Ocorreu uma falha ao atualizar este serv. Tente novamente.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
        entrega_duplicate_name: {
          title: 'Nome repetido',
          body: 'Este profissional já possui um serv. com este nome.',
          variant: 'warning', screen: 'dark', buttonText: 'OK',
        },
        entrega_delete_confirm: {
          title: 'Excluir serv?',
          body: 'Tem certeza que deseja excluir este serv?',
          variant: 'warning', screen: 'dark',
          confirmText: 'EXCLUIR', cancelText: 'CANCELAR', buttonText: 'EXCLUIR',
        },
        entrega_deleted: {
          title: 'Serv. excluído',
          body: 'O serv. foi removido da lista.',
          variant: 'success', screen: 'light', buttonText: 'OK',
        },
        entrega_delete_error: {
          title: 'Erro',
          body: 'Houve um erro ao excluir o serv. Tente novamente.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
        entrega_prof_required: {
          title: 'Selecione um profissional',
          body: 'Escolha um profissional para o serv.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
      },

      consultas: {
        entrega_created: {
          title: 'Consulta criada',
          body: 'A nova consulta já está disponível para agendamento.',
          variant: 'success', screen: 'light', buttonText: 'OK',
        },
        entrega_updated: {
          title: 'Consulta atualizada',
          body: 'Os ajustes foram salvos com sucesso.',
          variant: 'success', screen: 'light', buttonText: 'OK',
        },
        entrega_create_error: {
          title: 'Erro ao criar',
          body: 'Ocorreu uma falha ao criar esta consulta. Tente novamente.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
        entrega_update_error: {
          title: 'Erro ao salvar',
          body: 'Ocorreu uma falha ao atualizar esta consulta. Tente novamente.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
        entrega_duplicate_name: {
          title: 'Nome repetido',
          body: 'Este profissional já possui uma consulta com este nome.',
          variant: 'warning', screen: 'dark', buttonText: 'OK',
        },
        entrega_delete_confirm: {
          title: 'Excluir consulta?',
          body: 'Tem certeza que deseja excluir esta consulta?',
          variant: 'warning', screen: 'dark',
          confirmText: 'EXCLUIR', cancelText: 'CANCELAR', buttonText: 'EXCLUIR',
        },
        entrega_deleted: {
          title: 'Consulta excluída',
          body: 'A consulta foi removida da lista.',
          variant: 'success', screen: 'light', buttonText: 'OK',
        },
        entrega_delete_error: {
          title: 'Erro',
          body: 'Houve um erro ao excluir a consulta. Tente novamente.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
        entrega_prof_required: {
          title: 'Selecione um profissional',
          body: 'Escolha um profissional para esta consulta.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
      },

      aulas: {
        entrega_created: {
          title: 'Aula criada',
          body: 'A nova aula já está disponível para agendamento.',
          variant: 'success', screen: 'light', buttonText: 'OK',
        },
        entrega_updated: {
          title: 'Aula atualizada',
          body: 'Os ajustes foram salvos com sucesso.',
          variant: 'success', screen: 'light', buttonText: 'OK',
        },
        entrega_create_error: {
          title: 'Erro ao criar',
          body: 'Ocorreu uma falha ao criar esta aula. Tente novamente.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
        entrega_update_error: {
          title: 'Erro ao salvar',
          body: 'Ocorreu uma falha ao atualizar esta aula. Tente novamente.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
        entrega_duplicate_name: {
          title: 'Nome repetido',
          body: 'Este profissional já possui uma aula com este nome.',
          variant: 'warning', screen: 'dark', buttonText: 'OK',
        },
        entrega_delete_confirm: {
          title: 'Excluir aula?',
          body: 'Tem certeza que deseja excluir esta aula?',
          variant: 'warning', screen: 'dark',
          confirmText: 'EXCLUIR', cancelText: 'CANCELAR', buttonText: 'EXCLUIR',
        },
        entrega_deleted: {
          title: 'Aula excluída',
          body: 'A aula foi removida da lista.',
          variant: 'success', screen: 'light', buttonText: 'OK',
        },
        entrega_delete_error: {
          title: 'Erro',
          body: 'Houve um erro ao excluir a aula. Tente novamente.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
        entrega_prof_required: {
          title: 'Selecione um profissional',
          body: 'Escolha um profissional para esta aula.',
          variant: 'danger', screen: 'dark', buttonText: 'OK',
        },
      },
    },

    professional_updated: {
      title: 'Profissional atualizado',
      body: 'Os ajustes foram salvos com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    professional_update_error: {
      title: 'Erro',
      body: 'Erro ao atualizar o profissional agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    professional_delete_confirm: {
      title: 'Excluir profissional?',
      body: 'Tem certeza que deseja excluir este profissional?',
      variant: 'warning',
      screen: 'dark',
      confirmText: 'EXCLUIR',
      cancelText: 'CANCELAR',
      buttonText: 'EXCLUIR',
    },
    professional_deleted: {
      title: 'Profissional excluído',
      body: 'O profissional foi removido.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    professional_delete_error: {
      title: 'Erro',
      body: 'Erro ao excluir o profissional agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    professional_inactivate_reason: {
      title: 'Motivo',
      body: 'Se quiser, escreva um motivo (opcional).',
      variant: 'warning',
      screen: 'dark',
      placeholder: 'Ex.: Férias, indisponível...',
      confirmText: 'SALVAR',
      cancelText: 'CANCELAR',
      buttonText: 'SALVAR',
    },
    professional_activated: {
      title: 'Ativado',
      body: 'O profissional foi ativado com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    professional_inactivated: {
      title: 'Inativado',
      body: 'O profissional foi inativado com sucesso.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    professional_toggle_error: {
      title: 'Erro',
      body: 'Erro ao alterar o status agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    professional_almoco_blocked: {
      title: 'Horário de almoço bloqueado',
      body: 'Há horários futuros que entram em conflito com o novo horário de almoço.\nCancele esses horários antes de salvar esta mudança.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    professional_dia_blocked: {
      title: 'Dia de trabalho bloqueado',
      body: 'Existe um agendamento futuro no dia que você está tentando desativar.\nCancele ou reagende esse atendimento antes de remover este dia.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    professional_schedule_blocked: {
      title: 'Horário de trabalho bloqueado',
      body: 'Há agendamentos futuros fora do novo horário de trabalho que você está tentando salvar.\nCancele ou reagende esses atendimentos antes de alterar a abertura ou o fechamento.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },

    booking_confirmed: {
      title: 'Concluído',
      body: 'O atendimento foi concluído.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    booking_confirm_error: {
      title: 'Erro',
      body: 'Erro ao concluir o atendimento agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    booking_cancel_confirm: {
      title: 'Cancelar agendamento?',
      body: 'Tem certeza que deseja cancelar este agendamento?',
      variant: 'warning',
      screen: 'dark',
      confirmText: 'CANCELAR',
      cancelText: 'VOLTAR',
      buttonText: 'CANCELAR',
    },
    booking_canceled: {
      title: 'Agendamento cancelado',
      body: 'O agendamento foi cancelado com sucesso.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    booking_cancel_error: {
      title: 'Erro',
      body: 'Erro ao cancelar o agendamento agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },

    account_email_invalid: {
      title: 'E-mail inválido',
      body: 'Digite um e-mail válido para continuar.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    account_email_update_sent: {
      title: 'Acesso enviado',
      body: 'Confira seu e-mail para confirmar a troca.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    account_email_update_error: {
      title: 'Erro',
      body: 'Erro ao solicitar a troca de e-mail agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    account_password_too_short: {
      title: 'Senha fraca',
      body: 'A senha deve ter no mínimo 7 caracteres.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    account_password_mismatch: {
      title: 'Senhas diferentes',
      body: 'As senhas digitadas divergem. Revise e tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    account_password_updated: {
      title: 'Senha atualizada',
      body: 'Sua senha foi alterada com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    account_password_update_error: {
      title: 'Erro',
      body: 'Erro ao alterar a senha agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },

    parceiro_acao_proibida: {
      title: 'Acesso restrito',
      body: 'Gerencie apenas itens referentes a você.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    professional_approved: {
      title: 'Parceiro aprovado',
      body: 'O acesso do profissional foi liberado com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    partner_approve_error: {
      title: 'Erro ao aprovar',
      body: 'Erro ao aprovar o parceiro agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    partner_plan_unavailable: {
      title: 'Parceria indisponível',
      body: 'Parcerias desabilitadas neste negócio.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'OK',
    },
    plan_professional_limit_reached: {
      title: 'Limite do plano',
      body: 'Limite de profissionais atingido para a capacidade atual. Reduza os profissionais ativos ou pendentes antes de continuar.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'OK',
    },
    plan_feature_offers_unavailable: {
      title: 'Oferta indisponível',
      body: 'Recurso de ofertas restrito. Remova o valor promocional antes de continuar.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'OK',
    },
  },

  parceiroCadastro: {
    nome_required:        { body: 'Informe seu nome para continuar.', variant: 'erro' },
    email_invalid:        { body: 'Informe um e-mail válido para continuar.', variant: 'erro' },
    senha_too_short:      { body: 'A senha deve ter pelo menos 7 caracteres.', variant: 'erro' },
    slug_required:        { body: 'Informe o slug do negócio para continuar.', variant: 'erro' },
    negocio_not_found:    { body: 'Negócio ausente. Verifique o slug informado e tente novamente.', variant: 'erro' },
    partner_plan_unavailable: { body: 'Parcerias desabilitadas neste negócio.', variant: 'erro' },
    email_registered_client: { body: 'Este e-mail já pertence a uma conta de cliente. Use outro e-mail para solicitar acesso profissional.', variant: 'erro' },
    email_registered_professional: { body: 'Este e-mail já pertence a uma conta profissional. Acesse como parceiro para solicitar ou acompanhar acessos.', variant: 'erro' },
    email_registered_unknown: { body: 'Este e-mail já está vinculado a uma conta existente. Acesse sua conta ou use outro e-mail.', variant: 'erro' },
    email_check_rate_limit: { body: 'Muitas tentativas em pouco tempo. Aguarde um minuto e tente novamente.', variant: 'aviso' },
    access_unavailable:   { body: 'Erro ao solicitar acesso com este e-mail. Acesse sua conta de parceiro ou fale com o responsável pelo negócio.', variant: 'erro' },
    account_create_error: { body: 'Erro ao criar sua conta agora. Tente novamente.', variant: 'erro' },
    access_inactive:      { body: 'Seu acesso está inativo. Entre em contato com o responsável pelo negócio.', variant: 'erro' },
    owner_cannot_request_partner_access: { body: 'Esta conta já gerencia este negócio. Acesse pela área profissional.', variant: 'erro' },
    unexpected_error:     { body: 'Ocorreu um erro inesperado. Tente novamente.', variant: 'erro' },
    success_title:        'Confirme seu e-mail',
    success_body:         'Enviamos um link para seu e-mail.\nClique no link para concluir o seu cadastro de parceria.',
  },

  parceiroLogin: {
    email_invalid:                  { body: 'Informe um e-mail válido para continuar.', variant: 'erro' },
    senha_too_short:                { body: 'A senha deve ter pelo menos 7 caracteres.', variant: 'erro' },
    slug_required:                  { body: 'Informe o slug do negócio para continuar.', variant: 'erro' },
    negocio_not_found:              { body: 'Negócio ausente. Verifique o slug informado e tente novamente.', variant: 'erro' },
    credentials_invalid:            { body: 'E-mail ou senha incorretos.', variant: 'erro' },
    auth_error:                     { body: 'Erro ao autenticar agora. Tente novamente.', variant: 'erro' },
    not_partner:                    { body: 'Este login pertence a outro tipo de conta para este negócio.', variant: 'erro' },
    access_inactive:                { body: 'Seu acesso está inativo. Entre em contato com o responsável pelo negócio.', variant: 'erro' },
    unexpected_error:               { body: 'Ocorreu um erro inesperado. Tente novamente.', variant: 'erro' },
    reset_email_required:           { body: 'Digite seu e-mail antes de solicitar o resgate de senha.', variant: 'aviso' },
    reset_sent:                     { body: 'Link enviado. Confira sua caixa de entrada para redefinir a senha.', variant: 'sucesso' },
    reset_error:                    { body: 'Erro ao enviar o link agora. Tente novamente.', variant: 'erro' },
    recovery_password_too_short:    { body: 'A nova senha deve ter pelo menos 7 caracteres.', variant: 'erro' },
    recovery_password_mismatch:     { body: 'As senhas divergem. Revise e tente novamente.', variant: 'erro' },
    recovery_password_updated:      { body: 'Senha atualizada com sucesso. Acesse sua conta com a nova senha.', variant: 'sucesso' },
    recovery_password_update_error: { body: 'Erro ao atualizar a senha agora. Tente novamente.', variant: 'erro' },
  },

  clientArea: {
    load_data_error: {
      title: 'Erro ao carregar a área do cliente',
      body:
        'Houve uma falha ao carregar seus dados.\n' +
        'Recarregue a página e tente novamente.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    load_more_agendamentos_error: {
      title: 'Erro ao carregar agendamentos',
      body:
        'O carregamento de novos agendamentos falhou neste momento.\n' +
        'Tente novamente em instantes.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    load_more_favoritos_error: {
      title: 'Erro ao carregar favoritos',
      body:
        'O carregamento da lista de favoritos falhou agora.\n' +
        'Tente novamente em instantes.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    rebook_unavailable: {
      title: 'Reagendamento indisponível',
      body:
        'Dados insuficientes para reagendar.\n' +
        'Tente abrir o negócio pela vitrine novamente.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    avatar_invalid_format: {
      title: 'Formato inválido',
      body: 'Use PNG, JPG ou WEBP.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    avatar_too_large: {
      title: 'Imagem muito grande',
      body: 'A imagem excede o limite permitido. Escolha um arquivo menor e tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    avatar_updated: {
      title: 'Foto atualizada',
      body: 'Sua foto de perfil foi atualizada com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    avatar_update_error: {
      title: 'Erro ao atualizar foto',
      body: 'Erro ao atualizar sua foto agora. Tente novamente em instantes.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    profile_name_required: {
      title: 'Nome obrigatório',
      body: 'Preencha seu nome para salvar.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    profile_name_updated: {
      title: 'Nome atualizado',
      body: 'Seu nome foi atualizado com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    profile_name_update_error: {
      title: 'Erro ao salvar nome',
      body: 'Erro ao salvar seu nome agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    account_email_invalid: {
      title: 'E-mail inválido',
      body: 'Digite um e-mail válido para continuar.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    account_email_update_sent: {
      title: 'Código de acesso enviado',
      body: 'Confira seu e-mail para validar a troca.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    account_email_update_error: {
      title: 'Erro ao alterar e-mail',
      body: 'Erro ao alterar seu e-mail agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    account_password_too_short: {
      title: 'Senha muito curta',
      body: 'A senha precisa ter pelo menos 7 caracteres.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    account_password_mismatch: {
      title: 'Senhas diferentes',
      body: 'As senhas divergem entre si. Revise e tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    account_password_updated: {
      title: 'Senha atualizada',
      body: 'Sua senha foi atualizada com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    account_password_update_error: {
      title: 'Erro ao alterar senha',
      body: 'Erro ao alterar sua senha agora. Tente novamente em alguns instantes.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    account_delete_confirm: {
      title: 'Excluir conta',
      body: 'Tem certeza que deseja excluir sua conta de cliente?\nIsso removerá permanentemente seus dados de acesso.',
      variant: 'danger',
      screen: 'dark',
      confirmText: 'EXCLUIR CONTA',
      cancelText: 'VOLTAR',
      buttonText: 'EXCLUIR CONTA',
    },
    account_deleted: {
      title: 'Conta excluída',
      body: 'Sua conta de cliente foi excluída com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    account_delete_error: {
      title: 'Erro ao excluir conta',
      body: 'Houve um erro ao tentar excluir sua conta. Tente novamente em alguns instantes.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    booking_cancel_confirm: {
      title: 'Cancelar agendamento',
      body: 'Tem certeza que deseja cancelar este agendamento?',
      variant: 'warning',
      screen: 'dark',
      confirmText: 'CONFIRMAR',
      cancelText: 'VOLTAR',
      buttonText: 'CONFIRMAR',
    },
    booking_canceled: {
      title: 'Agendamento cancelado',
      body: 'Seu agendamento foi cancelado com sucesso.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    booking_cancel_error: {
      title: 'Erro ao cancelar',
      body: 'Erro ao concluir o cancelamento agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    favorite_removed: {
      title: 'Removido',
      body: 'Favorito removido com sucesso.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    favorite_remove_error: {
      title: 'Erro ao remover',
      body: 'Erro ao remover o favorito agora. Tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    depoimento_send_error: {
      title: 'Erro ao enviar depoimento',
      body: 'Erro ao enviar seu depoimento: {msg}',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    depoimento_rate_limit: {
      title: 'Limite de depoimentos atingido',
      body: 'Você já enviou muitos depoimentos hoje. Tente novamente amanhã.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
  },

  home: {
    search_failed_support: {
      title: 'Houve uma falha ao concluir a busca agora',
      body:
        'Parece que ocorreu uma instabilidade temporária.\n' +
        'Tente novamente em alguns segundos.\n' +
        'Persistindo a dificuldade, utilize o SUPORTE no rodapé da página para falar com a gente.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
  },

  login: {
    auth_error: {
      title: 'Acesso indisponível no momento.',
      body:
        '{msg}\n' +
        'Confira seu e-mail, sua senha e o tipo selecionado.\n' +
        'Se o problema persistir, acesse SUPORTE no rodapé da página para falar com a gente.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    reset_email_required: {
      title: 'Informe seu e-mail',
      body:
        'Digite seu e-mail para receber o link de resgate.\n' +
        'Se precisar, acesse SUPORTE no rodapé da página.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'OK',
    },
    reset_sent: {
      title: 'Link enviado',
      body:
        'Confira sua caixa de entrada para redefinir a senha.\n' +
        'Caso demore, busque o link na pasta de spam.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    reset_error: {
      title: 'Houve um erro ao enviar o link agora.',
      body:
        '{msg}\n' +
        'Tente novamente em instantes.\n' +
        'Se persistir, acesse SUPORTE no rodapé da página.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    recovery_password_too_short: {
      title: 'Senha muito curta',
      body: 'A nova senha precisa ter pelo menos 7 caracteres.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    recovery_password_mismatch: {
      title: 'Senhas diferentes',
      body: 'O código diverge do esperado. Revise e tente novamente.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    recovery_password_updated: {
      title: 'Senha atualizada',
      body:
        'Sua senha foi atualizada com sucesso.\n' +
        'Agora você pode entrar novamente.',
      variant: 'success',
      screen: 'light',
      buttonText: 'OK',
    },
    recovery_password_update_error: {
      title: 'Erro ao atualizar senha',
      body:
        '{msg}\n' +
        'Tente novamente.\n' +
        'Se persistir, acesse SUPORTE no rodapé da página.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
  },

  signupChoice: {
    navigate_error: {
      title: 'Houve um erro ao avançar. Tente novamente.',
      body:
        'Ocorreu uma falha ao abrir esta fase.\n' +
        'Tente novamente em alguns instantes.\n' +
        'Persistindo o erro, use o SUPORTE no rodapé da página para falar com a gente.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
  },

  signupClient: {
    name_required: {
      title: 'Nome obrigatório',
      body: 'Informe seu nome para continuar.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    email_invalid: {
      title: 'E-mail inválido',
      body: 'Informe um e-mail válido para continuar.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    email_already_exists: {
      title: 'E-mail já cadastrado',
      body:
        'Este e-mail já possui uma conta.\n' +
        'Use a tela de login para entrar ou recupere o acesso, se necessário.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    password_too_short: {
      title: 'Senha muito curta',
      body: 'A senha deve ter no mínimo 7 caracteres.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    created_confirm_email: {
      title: 'Conta criada :)',
      body:
        'Agora confirme seu e-mail para ativar o acesso.\n' +
        'Verifique a caixa de entrada e o spam.\n' +
        'Depois disso, realize o login normalmente.',
      variant: 'success',
      screen: 'light',
      buttonText: 'ENTENDI',
    },
    profile_not_ready: {
      title: 'Quase lá...',
      body:
        'Seu perfil está ausente no sistema.\n' +
        'Aguarde alguns segundos e tente fazer login.\n' +
        'Se persistir, acesse SUPORTE no rodapé da página.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
  },

  signupProfessional: {
    name_required: {
      title: 'Nome obrigatório',
      body: 'Informe seu nome para continuar.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    phone_required: {
      title: 'Telefone obrigatório',
      body: 'Informe seu WhatsApp para continuar.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    email_invalid: {
      title: 'E-mail inválido',
      body: 'Informe um e-mail válido para continuar.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    email_already_exists: {
      title: 'E-mail já cadastrado',
      body:
        'Este e-mail já possui uma conta.\n' +
        'Use a tela de login do parceiro ou recupere o acesso, se necessário.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    password_too_short: {
      title: 'Senha muito curta',
      body: 'A senha deve ter no mínimo 7 caracteres.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    business_name_required: {
      title: 'Nome do negócio obrigatório',
      body: 'Informe o nome do seu negócio para continuar.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    business_slug_invalid: {
      title: 'URL inválida',
      body: 'A URL do negócio precisa ter pelo menos 3 caracteres ou mais, usando apenas letras, números e traços.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    business_type_required: {
      title: 'Tipo de negócio obrigatório',
      body: 'Informe o tipo do seu negócio (ex.: barbearia, clínica...).',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    experience_invalid: {
      title: 'Experiência inválida',
      body: 'Informe um número válido de anos de experiência.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    address_street_required: {
      title: 'Endereço incompleto',
      body: 'Informe a RUA do negócio.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    address_number_required: {
      title: 'Endereço incompleto',
      body: 'Informe o NÚMERO do endereço.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    address_city_required: {
      title: 'Endereço incompleto',
      body: 'Informe a CIDADE.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    address_state_required: {
      title: 'Endereço incompleto',
      body: 'Informe o ESTADO.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'OK',
    },
    business_slug_taken: {
      title: 'URL já está em uso',
      body: 'Esta URL já está em uso. Escolha outro nome para o negócio.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    confirm_email_needed: {
      title: 'Confirme seu e-mail',
      body:
        'Sua conta foi criada. Confirme seu e-mail para ativar o acesso.\n' +
        'Verifique a caixa de entrada e o spam.\n' +
        'Depois disso, realize o login normalmente.',
      variant: 'success',
      screen: 'light',
      buttonText: 'ENTENDI',
    },
    profile_not_created: {
      title: 'Perfil ausente',
      body:
        'Seu perfil está ausente no sistema.\n' +
        'Aguarde alguns segundos e tente fazer login.\n' +
        'Se persistir, acesse SUPORTE no rodapé da página.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    profile_wrong_type: {
      title: 'Cadastro inconsistente',
      body:
        'Seu perfil foi criado com tipo incorreto.\n' +
        'Acesse SUPORTE no rodapé da página para resolver.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    business_create_error: {
      title: 'Erro ao criar negócio',
      body:
        'Erro ao criar o negócio agora. ' +
        'Tente novamente em alguns instantes.\n' +
        'Se persistir, acesse SUPORTE no rodapé da página.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    professional_create_error: {
      title: 'Erro ao criar profissional',
      body:
        'Erro ao concluir o cadastro do profissional. ' +
        'Tente novamente.\n' +
        'Se persistir, acesse SUPORTE no rodapé da página.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    resume_load_error: {
      title: 'Erro ao carregar a retomada',
      body:
        'Houve uma falha ao carregar os dados de retomada.\n' +
        'Recarregue a página e tente novamente.',
      variant: 'warning',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
    resume_error: {
      title: 'Erro na retomada do cadastro',
      body:
        'O processo de retomada falhou neste momento. ' +
        'Tente novamente em alguns instantes.',
      variant: 'danger',
      screen: 'dark',
      buttonText: 'ENTENDI',
    },
  },

  vitrine: {
    generic_title: 'Aviso',
    common_ok: 'ENTENDI',

    load_timeout: 'A vitrine demorou demais para carregar. Tente novamente.',
    load_error: 'Erro ao carregar a vitrine.',

    favorite_need_login: {
      title: 'Login necessário',
      body: 'Realize o login para favoritar este negócio.',
      buttonText: 'ENTENDI',
    },
    favorite_only_client: {
      title: 'Acesso restrito',
      body: 'Apenas contas do tipo CLIENTE podem favoritar negócios.',
      buttonText: 'ENTENDI',
    },
    favorite_invalid_business: {
      title: 'Negócio inválido',
      body: 'Negócio inválido.',
      buttonText: 'ENTENDI',
    },
    favorite_toggle_error: {
      title: 'Erro',
      body: 'Erro ao atualizar o favorito agora. Tente novamente.',
      buttonText: 'OK',
    },
    schedule_need_login_confirm: {
      title: 'Login necessário',
      body: 'Você precisa fazer login para agendar. Deseja fazer login agora?',
      confirmText: 'IR PARA LOGIN',
      cancelText: 'TALVEZ DEPOIS',
    },
    schedule_only_client: {
      title: 'Acesso restrito',
      body: 'Você está logado como PROFISSIONAL.\nPara agendar, entre com uma conta CLIENTE.',
      buttonText: 'ENTENDI',
    },
    schedule_billing_required: {
      title: 'Agenda indisponível',
      body: 'Este negócio precisa ativar um plano para receber novos agendamentos.',
      buttonText: 'ENTENDI',
    },
    schedule_time_unavailable: {
      title: 'Horário oficial indisponível',
      body: 'Ainda estamos sincronizando o horário oficial. Tente novamente em instantes.',
      buttonText: 'ENTENDI',
    },

    business: {
      section_title: {
        servicos:  'SERVS',
        consultas: 'Consultas',
        aulas:     'Aulas',
      },
      counter_singular: {
        servicos:  'SERV',
        consultas: 'CONSULTA',
        aulas:     'AULA',
      },
      counter_plural: {
        servicos:  'SERVS',
        consultas: 'CONSULTAS',
        aulas:     'AULAS',
      },
      empty_list: {
        servicos:  ':(',
        consultas: 'Sem consultas para este profissional.',
        aulas:     'Sem aulas para este profissional.',
      },
    },

    depoimento_need_login_confirm: {
      title: 'Login necessário',
      body: 'Você precisa fazer login para deixar um depoimento. Deseja fazer login agora?',
      confirmText: 'IR PARA LOGIN',
      cancelText: 'TALVEZ DEPOIS',
    },
    depoimento_only_client: {
      title: 'Acesso restrito',
      body: 'Apenas contas do tipo CLIENTE podem deixar depoimentos.',
      buttonText: 'ENTENDI',
    },
    depoimento_invalid_business: {
      title: 'Negócio inválido',
      body: 'Negócio inválido.',
      buttonText: 'ENTENDI',
    },
    depoimento_sent: {
      title: 'Depoimento registrado',
      body: 'Seu depoimento foi enviado com sucesso.',
      buttonText: 'OK',
    },
    depoimento_rate_limit: {
      title: 'Limite de depoimentos atingido',
      body: 'Você já enviou muitos depoimentos hoje. Tente novamente amanhã.',
      buttonText: 'ENTENDI',
    },
    depoimento_send_error_title: 'Erro ao enviar depoimento',
    depoimento_send_error_body: 'Erro ao enviar seu depoimento:',
  },
};
