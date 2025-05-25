import React, { useEffect, useState } from 'react';

interface Animal {
  nome: string;
  descricao: string;
  dataNascimento: string;
  especie: string;
  habitat: string;
  paisOrigem: string;
  imagem: File | null;
}

interface Props {
  form: Animal;
  setForm: (form: Animal) => void;
  cadastrarAnimal: () => void;
  onClose: () => void;
}

const CadastroModal: React.FC<Props> = ({ form, setForm, cadastrarAnimal, onClose }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Sempre que form.imagem mudar, atualiza o preview
  useEffect(() => {
    if (form.imagem) {
      const previewUrl = URL.createObjectURL(form.imagem);
      setImagePreview(previewUrl);

      // Libera o objeto URL quando o componente desmontar ou imagem mudar
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreview(null);
    }
  }, [form.imagem]);

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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setForm({ ...form, imagem: e.target.files[0] });
            }
          }}
        />

        {/* Mostra a prévia da imagem, se existir */}
        {imagePreview && (
          <div style={{ marginTop: 10 }}>
            <img
              src={imagePreview}
              alt="Prévia da imagem"
              style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: 8 }}
            />
          </div>
        )}

        <button onClick={cadastrarAnimal}>Cadastrar</button>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default CadastroModal;

