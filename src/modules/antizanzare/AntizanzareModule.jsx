import { useState } from 'react';
import ProgettiList from './ProgettiList';
import ProgettoEdit from './ProgettoEdit';
import ConsumiPage from './ConsumiPage';
import { puoAccedere } from '../../lib/permessi';

/**
 * Router interno del modulo antizanzare.
 * `onEsci` e' null per il tecnico: non ha una dashboard a cui tornare.
 */
export default function AntizanzareModule({ operatore, onEsci }) {
  const [vista, setVista] = useState({ nome: 'lista', progettoId: null });

  if (vista.nome === 'progetto') {
    return (
      <ProgettoEdit
        operatore={operatore}
        progettoId={vista.progettoId}
        onIndietro={() => setVista({ nome: 'lista', progettoId: null })}
      />
    );
  }

  if (vista.nome === 'consumi') {
    return <ConsumiPage onEsci={() => setVista({ nome: 'lista', progettoId: null })} />;
  }

  const vedeConsumi = puoAccedere(operatore, 'antizanzare.consumi');

  return (
    <ProgettiList
      operatore={operatore}
      onEsci={onEsci}
      onApri={(id) => setVista({ nome: 'progetto', progettoId: id })}
      onNuovo={() => setVista({ nome: 'progetto', progettoId: null })}
      onConsumi={vedeConsumi ? () => setVista({ nome: 'consumi', progettoId: null }) : null}
    />
  );
}
