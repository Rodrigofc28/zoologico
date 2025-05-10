{/*Desenvolvido por Rodrigo de Freitas Camargo*/}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditarCuidadoModal from './EditarCuidadoModal';
import Swal from 'sweetalert2';
interface Cuidado {
    id: number;
    nomeCuidado: string;
    descricao: string;
    frequencia: string;
}

interface Props {
    cuidados: Cuidado[];
    onClose: () => void;
    onRefresh: () => void;
}

const ListaCuidadosModal: React.FC<Props> = ({ cuidados, onClose, onRefresh }) => {
    const [cuidadoEditando, setCuidadoEditando] = useState<Cuidado | null>(null);
    const [filtro, setFiltro] = useState<string>('');
    const [cuidadosFiltrados, setCuidadosFiltrados] = useState<Cuidado[]>(cuidados);

    // Pega todos os tipos únicos de cuidados para preencher o select
    const tiposCuidadoUnicos = Array.from(new Set(cuidados.map(c => c.nomeCuidado)));

    const handleFiltrar = (tipoSelecionado: string) => {
        setFiltro(tipoSelecionado);
        if (tipoSelecionado === '') {
            setCuidadosFiltrados(cuidados);
        } else {
            const filtrados = cuidados.filter(cuidado =>
                cuidado.nomeCuidado === tipoSelecionado
            );
            setCuidadosFiltrados(filtrados);
        }
    };

    const handleLimparFiltro = () => {
        setFiltro('');
        setCuidadosFiltrados(cuidados);
    };

   const handleRemover = async (id: number) => {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Você não poderá reverter esta ação!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        try {
            await axios.delete(`http://127.0.0.1:5000/api/cuidado/${id}`);
            
            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Cuidado removido com sucesso!',
            });

            onClose();
            onRefresh();
        } catch (error) {
            console.error('Erro ao remover o cuidado:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao remover o cuidado.',
            });
        }
    }
};

    useEffect(() => {
        setCuidadosFiltrados(cuidados);
    }, [cuidados]);

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Lista de Cuidados</h2>

                

                {cuidadosFiltrados.length === 0 ? (
                    <p>Nenhum cuidado registrado.</p>
                ) : (
                    <ul>
                        {cuidadosFiltrados.map((cuidado) => (
                            <li className='lista' key={cuidado.id}>
                                <div className='listaCuidadosModal'>
                                    <button className='editar' onClick={() => setCuidadoEditando(cuidado)}><i className="bi bi-pencil-square"></i> Editar</button>
                                    <button className='delete' onClick={() => handleRemover(cuidado.id)}><i className="bi bi-trash3"></i> Deletar</button>
                                    <div><b>Tipo de Cuidado:</b> {cuidado.nomeCuidado}</div>
                                    <div><b>Frequência:</b> {cuidado.frequencia}</div>
                                    <div><b>Descrição:</b> {cuidado.descricao}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <div style={{ marginBottom: '15px' }}>
                    <select value={filtro} onChange={(e) => handleFiltrar(e.target.value)}>
                        <option value="">Todos os tipos de cuidado</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Exame Veterinário">Exame Veterinário</option>
                        <option value="Vacinação">Vacinação</option>
                        <option value="Treinamento">Treinamento</option>
                    </select>
                    
                </div>
                <button onClick={onClose}>Fechar</button>
                <button onClick={handleLimparFiltro}>Limpar</button>
                {cuidadoEditando && (
                    <EditarCuidadoModal
                        cuidado={cuidadoEditando}
                        onClose={() => setCuidadoEditando(null)}
                        onUpdate={onRefresh}
                    />
                )}
            </div>
        </div>
    );
};

export default ListaCuidadosModal;




