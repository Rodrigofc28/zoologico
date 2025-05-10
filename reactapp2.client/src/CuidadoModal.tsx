{/*Desenvolvido por Rodrigo de Freitas Camargo*/}
import React, { useState } from 'react';

interface CuidadoModalProps {
    form: {
        nomeCuidado: string;
        descricao: string;
        frequencia: string;
        animalId: number;
    };
    setForm: React.Dispatch<React.SetStateAction<any>>;
    cadastrarCuidado: () => void;
    onClose: () => void;
}

const CuidadoModal: React.FC<CuidadoModalProps> = ({ form, setForm, cadastrarCuidado, onClose }) => {
    const [mostrarOutroInput, setMostrarOutroInput] = useState(false);

    const handleFrequenciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valor = e.target.value;
        if (valor === 'Outros') {
            setMostrarOutroInput(true);
            setForm({ ...form, frequencia: '' }); // limpa para digitação
        } else {
            setMostrarOutroInput(false);
            setForm({ ...form, frequencia: valor });
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Cadastro de Cuidado</h2>
                <span>Tipo de Cuidado</span>
                <select
                    value={form.nomeCuidado}
                    onChange={(e) => setForm({ ...form, nomeCuidado: e.target.value })}
                >
                    <option value="">Selecione um cuidado</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Exame Veterinário">Exame Veterinário</option>
                    <option value="Vacinação">Vacinação</option>
                    <option value="Treinamento">Treinamento</option>
                </select>
                <span>Frequência</span>
                <select
                    value={mostrarOutroInput ? 'Outros' : form.frequencia}
                    onChange={handleFrequenciaChange}
                >
                    <option value="">Selecione frequência</option>
                    <option value="Diária">Diária</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensal">Mensal</option>
                    <option value="Outros">Outros</option>
                </select>
                <span>Descrição do Cuidado</span>
                <input
                    type="text"
                    placeholder="Descrição"
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                />
                

                {mostrarOutroInput && (
                    <input
                        type="text"
                        placeholder="Digite a frequência"
                        value={form.frequencia}
                        onChange={(e) => setForm({ ...form, frequencia: e.target.value })}
                    />
                )}

                <button onClick={cadastrarCuidado}>Salvar</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default CuidadoModal;



