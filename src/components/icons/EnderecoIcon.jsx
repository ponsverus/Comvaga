import React from 'react';
import svg from '../../assets/icons/endereco.svg?raw';
import InlineSvgIcon from './InlineSvgIcon';

export default function EnderecoIcon(props) {
  return <InlineSvgIcon svg={svg} {...props} />;
}
