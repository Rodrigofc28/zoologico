{/*Desenvolvido por Rodrigo de Freitas Camargo*/}
import React from 'react';

interface Animal {
  nome: string;
  descricao: string;
  dataNascimento: string;
  especie: string;
  habitat: string;
  paisOrigem: string;
}

interface Props {
  form: Animal;
  setForm: (form: Animal) => void;
  cadastrarAnimal: () => void;
  onClose: () => void;
}

const CadastroModal: React.FC<Props> = ({ form, setForm, cadastrarAnimal, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Descrição do Animal</h2>
        <span>Nome</span>
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
        />
        <span>Descrição</span>
        <input
          placeholder="Descrição"
          value={form.descricao}
          onChange={e => setForm({ ...form, descricao: e.target.value })}
        />
        <span>Data de nascimento</span>
        <input
          placeholder="Data Nascimento"
          type="date"
          value={form.dataNascimento}
          onChange={e => setForm({ ...form, dataNascimento: e.target.value })}
        />
        <span>Espécie</span>
        <input
          placeholder="Espécie"
          value={form.especie}
          onChange={e => setForm({ ...form, especie: e.target.value })}
        />
        <span>Habitat</span>
        <input
          placeholder="Habitat"
          value={form.habitat}
          onChange={e => setForm({ ...form, habitat: e.target.value })}
        />
        <span>País de Origem</span>
        <input
          placeholder="País de Origem"
          value={form.paisOrigem}
          onChange={e => setForm({ ...form, paisOrigem: e.target.value })}
        />
        <button onClick={cadastrarAnimal}>Cadastrar</button>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default CadastroModal;
