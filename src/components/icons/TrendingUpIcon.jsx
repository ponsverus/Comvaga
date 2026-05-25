import React from 'react';

export default function TrendingUpIcon({
  className = '',
  title,
  style = {},
  ...props
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ display: 'inline-block', ...style }}
      aria-hidden={!title}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}

      {/* O caminho original é: 
        d="M16 2h-4l1.29 1.29-4.29 4.3-3-3-6 6 v2.82 l6-6 3 3 5.71-5.7 1.28 1.29 0.010-4z"
        
        Substituímos 'v2.82' (segmento vertical afiado) por:
        A 1 1.41 0 0 1 0 13.41
        
        Este arco elíptico cria uma ponta arredondada em formato de pílula 
        que começa no ponto original (0, 10.59), desce e curva suavemente 
        até o ponto mais baixo (0, 13.41), onde o próximo segmento começa.
      */}
      <path d="M16 2h-4l1.29 1.29-4.29 4.3-3-3-6 6 A 1 1.41 0 0 1 0 13.41 l6-6 3 3 5.71-5.7 1.28 1.29 0.010-4z" />
    </svg>
  );
}
