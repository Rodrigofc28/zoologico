// {/*Desenvolvido por Rodrigo de Freitas Camargo*/}
import React from 'react';

interface Animal {
    id?: number;
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
    setForm: React.Dispatch<React.SetStateAction<Animal>>;
    atualizarAnimal: () => void;
    onClose: () => void;
}

const EditarModal: React.FC<Props> = ({ form, setForm, atualizarAnimal, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Editar Animal</h2>

                <span>Nome</span>
                <input
                    type="text"
                    placeholder="Nome"
                    value={form.nome}
                    onChange={e => setForm({ ...form, nome: e.target.value })}
                />

                <span>Descrição</span>
                <input
                    type="text"
                    placeholder="Descrição"
                    value={form.descricao}
                    onChange={e => setForm({ ...form, descricao: e.target.value })}
                />

                <span>Data de Nascimento</span>
                <input
                    type="date"
                    value={form.dataNascimento}
                    onChange={e => setForm({ ...form, dataNascimento: e.target.value })}
                />

                <span>Espécie</span>
                <input
                    type="text"
                    placeholder="Espécie"
                    value={form.especie}
                    onChange={e => setForm({ ...form, especie: e.target.value })}
                />

                <span>Habitat</span>
                <input
                    type="text"
                    placeholder="Habitat"
                    value={form.habitat}
                    onChange={e => setForm({ ...form, habitat: e.target.value })}
                />

                <span>País de Origem</span>
                <input
                    type="text"
                    placeholder="País de Origem"
                    value={form.paisOrigem}
                    onChange={e => setForm({ ...form, paisOrigem: e.target.value })}
                />

                <span>Nova Imagem (opcional)</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                        const file = e.target.files?.[0] || null;
                        setForm({ ...form, imagem: file });
                    }}
                />

                <button onClick={atualizarAnimal}>Salvar Alterações</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default EditarModal;

