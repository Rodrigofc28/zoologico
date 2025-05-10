{/*Desenvolvido por Rodrigo de Freitas Camargo*/}
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
interface Cuidado {
    id: number;
    nomeCuidado: string;
    descricao: string;
    frequencia: string;
}

interface Props {
    cuidado: Cuidado;
    onClose: () => void;
    onUpdate: () => void;
}

const EditarCuidadoModal: React.FC<Props> = ({ cuidado, onClose, onUpdate }) => {
    const [formData, setFormData] = useState(cuidado);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:5000/api/cuidado/${formData.id}`, formData);
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar cuidado:', error);
            
            Swal.fire('Erro!', 'Erro ao atualizar o cuidado.', 'error'); 
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Editar Cuidado</h2>
                <form onSubmit={handleSubmit}>
                    
                    <select
                    name="nomeCuidado"
                    value={formData.nomeCuidado}
                    onChange={handleChange}
                    >
                        <option value="">Selecione um cuidado</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Exame Veterinário">Exame Veterinário</option>
                        <option value="Vacinação">Vacinação</option>
                        <option value="Treinamento">Treinamento</option>
                    </select>
                    <input
                        type="text"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        placeholder="Descrição"
                    />
                    
                    <select
                    name="frequencia"
                    value={formData.frequencia}
                    onChange={handleChange}
                    >
                        <option value="">Selecione um cuidado</option>
                        <option value="Diária">Diária</option>
                        <option value="Semanal">Semanal</option>
                        <option value="Mensal">Mensal</option>
                    </select>
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default EditarCuidadoModal;


