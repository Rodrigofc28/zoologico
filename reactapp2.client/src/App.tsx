 {/*Desenvolvido por Rodrigo de Freitas Camargo*/}
 
import { useEffect, useState } from 'react';
import './App.css';
import CadastroModal from './CadastroModal'; // Cadastro
import EditarModal from './EditarModal'; // Editar
import CuidadoModal from './CuidadoModal';
import ListaCuidadosModal from './ListaCuidadosModal';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import axios from 'axios';

interface Animal {
    id?: number;
    nome: string;
    descricao: string;
    dataNascimento: string;
    especie: string;
    habitat: string;
    paisOrigem: string;
}

interface Cuidado {
    id: number;
    nomeCuidado: string;
    descricao: string;
    frequencia: string;
    animalId: number;  // Associar o cuidado a um animal específico
}

function App() {
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [form, setForm] = useState<Animal>({
        nome: '', descricao: '', dataNascimento: '',
        especie: '', habitat: '', paisOrigem: ''
    });
    //modal cadastro
    const [showModal, setShowModal] = useState(false); // Controle da visibilidade do modal

    const [editModal, setEditModal] = useState(false);
    const [animalEditando, setAnimalEditando] = useState<Animal | null>(null);

    const [showCuidadoModal, setShowCuidadoModal] = useState(false); // Modal de Cadastro de Cuidado
    const [cuidadoForm, setCuidadoForm] = useState<Cuidado>({
        id: 0,
        nomeCuidado: '',
        descricao: '',
        frequencia: '',
        animalId: 0
    });
    //lista de cuidados
    const [cuidadosAnimal, setCuidadosAnimal] = useState<Cuidado[]>([]);
    const [showListaCuidadosModal, setShowListaCuidadosModal] = useState(false);
    // Função para carregar os animais do backend
    const [animalSelecionadoId, setAnimalSelecionadoId] = useState<number | null>(null);
    const [buscaNome, setBuscaNome] = useState('');

   useEffect(() => {
    fetchAnimais();
}, []);
    function abrirEdicao(animal: Animal) {
        setAnimalEditando(animal);
        setForm(animal); // usa o mesmo form do cadastro
        setEditModal(true);
    }
async function fetchAnimais() {
    try {
        const res = await axios.get('http://127.0.0.1:5000/api/animals');
        console.log('Animais carregados:', res.data); // Verifique os dados aqui

        // Verifique se os dados têm a estrutura correta antes de atualizar o estado
        if (Array.isArray(res.data)) {
            setAnimais(res.data);
            var teste = animais.map(a=>(a.nome))
            console.log(teste)
        } else {
            console.error('Os dados não são um array:', res.data);
        }
    } catch (error: any) {
        if (error.response) {
            console.error('Erro do backend:', error.response.data);
        } else {
            console.error('Erro ao carregar animais:', error.message);
        }
       Swal.fire('Erro!', 'Não foi possível carregar os animais.', 'error'); 
    }
}

async function buscarPorNome() {
    try {
        const res = await axios.get(`http://127.0.0.1:5000/api/animals`);
        if (Array.isArray(res.data)) {
            const filtrados = res.data.filter((a: Animal) =>
                a.nome.toLowerCase().includes(buscaNome.toLowerCase())
            );
            setAnimais(filtrados);
        }
    } catch (error: any) {
        
        Swal.fire('Erro!', 'Erro ao buscar animais.', 'error'); 
        console.error(error.message);
    }
}


async function carregarCuidados(animalId: number) {
    try {
        const res = await axios.get(`http://127.0.0.1:5000/api/cuidado/lista/${animalId}`);
        setCuidadosAnimal(res.data);
        setAnimalSelecionadoId(animalId);
        setShowListaCuidadosModal(true);
    } catch (error: any) {
        
        Swal.fire('Erro!', 'Lista vazia de cuidados do animal.', 'error'); 
        console.error(error.message);
    }
}

async function cadastrarAnimal() {
    if (!form.nome || !form.descricao || !form.dataNascimento || !form.especie || !form.habitat || !form.paisOrigem) {
        
        Swal.fire('Erro!', 'Por favor, preencha todos os campos.', 'error'); 
        return;
    }

    try {
        console.log("Enviando dados para o backend:", form);

        const res = await axios.post('http://127.0.0.1:5000/api/animals', form);

        if (res.data) {
            console.log("Animal salvo:", res.data);
        }

        setForm({ nome: '', descricao: '', dataNascimento: '', especie: '', habitat: '', paisOrigem: '' });
        fetchAnimais(); // Recarrega os animais após o cadastro
      
        Swal.fire({
                title: "Animal cadastrado com sucesso!",
                icon: "success",
                draggable: true
                });
    } catch (error: any) {
        if (error.response) {
            console.error('Erro do backend:', error.response.data);
        } else {
            console.error('Erro ao enviar a requisição:', error.message);
        }
        Swal.fire('Erro!', 'Não foi possível salvar o animal. Verifique os dados e tente novamente.', 'error'); 
        
    }
}
async function removerAnimal(id?: number) {
    if (!id) return;

   

try {
    const res = await axios.delete(`http://127.0.0.1:5000/api/animals/${id}`);
    
    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: res.data.mensagem || 'Animal removido com sucesso!',
    });

    fetchAnimais();  // Recarrega a lista de animais
} catch (error: any) {
    const mensagemErro = error.response?.data?.erro || error.message || 'Erro desconhecido.';

    Swal.fire({
        icon: 'error',
        title: 'Erro ao remover',
        text: mensagemErro,
    });
}

}


async function atualizarAnimal() {
    if (!form.id) return;

    try {
    const res = await axios.put(`http://127.0.0.1:5000/api/animals/${form.id}`, form);

    Swal.fire({
        icon: 'success',
        title: 'Atualizado!',
        text: res.data.mensagem || "Animal atualizado com sucesso.",
    });

    fetchAnimais();
    setEditModal(false);
} catch (error: any) {
    const msg = error.response?.data?.erro || error.message || "Erro ao atualizar.";

    Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: msg,
    });
}
}

 // Função para abrir o modal de cadastro de cuidado
    function abrirCadastroCuidado(animalId: number) {
        setCuidadoForm({ ...cuidadoForm, animalId });
        setShowCuidadoModal(true);
    }

   

async function cadastrarCuidado() {
    if (!cuidadoForm.nomeCuidado || !cuidadoForm.descricao || !cuidadoForm.frequencia || !cuidadoForm.animalId) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obrigatórios',
            text: 'Por favor, preencha todos os campos.',
        });
        return;
    }

    try {
        const res = await axios.post('http://127.0.0.1:5000/api/cuidado', cuidadoForm);

        console.log("Cuidado registrado:", res.data);
        setShowCuidadoModal(false);
        fetchAnimais(); // Recarrega os animais após o cadastro

        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Cuidado cadastrado com sucesso!',
        });
    } catch (error: any) {
        console.error('Erro ao cadastrar o cuidado:', error.message);

        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao cadastrar o cuidado.',
        });
    }
}



    return (
        <div className='menu'>
            <h1>Zoológico</h1>
            <p>Sistema de cuidados de animais no zoológico.</p>
             <div className='filtro'>

                
                <form className='menuForm'
                    onSubmit={(e) => {
                        e.preventDefault(); // evita o reload da página
                        buscarPorNome();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Buscar por Nome do Animal"
                        value={buscaNome}
                        onChange={(e) => setBuscaNome(e.target.value)}
                    />
                    
                    <button className='todosAnimais' type="button" onClick={fetchAnimais}>Lista Todos Animais</button>
                </form>
            </div>
            {/*Botão para abrir a Modal de cadastro*/}
            <button
            className='cadastrar'
                onClick={() => {
                    // Limpa o formulário ANTES de mostrar o modal
                    setForm({
                        nome: "",
                        descricao: "",
                        dataNascimento: "",
                        especie: "",
                        habitat: "",
                        paisOrigem: ""
                    });
                    setShowModal(true);
                }}
            >
             <i className="bi bi-file-earmark-plus"></i> Cadastrar Novo Animal
            </button>

             {/* Modal de Cadastro de Animais*/}
            {showModal && (
                <CadastroModal
                    form={form}
                    setForm={setForm}
                    cadastrarAnimal={cadastrarAnimal}
                    onClose={() => {
                    setForm({
                        nome: "",
                        descricao: "",
                        dataNascimento: "",
                        especie: "",
                        habitat: "",
                        paisOrigem: ""
                    });
                    setShowModal(false);
                }}
                />
                )}
            {/* Modal de Editar Animais*/}
            {editModal && animalEditando && (
                <EditarModal
                    form={form}
                    setForm={setForm}
                    atualizarAnimal={atualizarAnimal}
                    onClose={() => setEditModal(false)}
                />
            )}
           {/* Modal Cuidados*/} 
            {showCuidadoModal && (
                <CuidadoModal
                    form={cuidadoForm}
                    setForm={setCuidadoForm}
                    cadastrarCuidado={cadastrarCuidado}
                    onClose={() => setShowCuidadoModal(false)}
                />
            )}
        {showListaCuidadosModal && animalSelecionadoId !== null && (
    <ListaCuidadosModal
        cuidados={cuidadosAnimal}
        onClose={() => setShowListaCuidadosModal(false)}
        onRefresh={() => carregarCuidados(animalSelecionadoId)} // aqui está resolvido
    />
)}
            

            <table className="tabela-com-borda">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Data Nasc.</th>
                        <th>Espécie</th>
                        <th>Habitat</th>
                        <th>País Origem</th>
                        <th >Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {animais.length === 0 ? (
                        <tr>
                            <td colSpan={6}>Nenhum animal cadastrado.</td>
                        </tr>
                    ) : (
                        animais.map(a => (
                            <tr key={a.id}>
                                <td>{a.nome}</td>
                                <td>{a.descricao}</td>
                                <td>{format(new Date(a.dataNascimento), 'dd/MM/yyyy')}</td>
                                <td>{a.especie}</td>
                                <td>{a.habitat}</td>
                                <td>{a.paisOrigem}</td>
                                <td>
                                    

                                    <button onClick={() => abrirCadastroCuidado(a.id!)}>Adicionar Cuidado</button>
                                    <button onClick={() => carregarCuidados(a.id!)}>Lista de Cuidados</button>
                                    <button className='editar' onClick={() => abrirEdicao(a)}><i className="bi bi-pencil-square"></i> Editar</button>
                                    <button className='delete' onClick={() => removerAnimal(a.id!)}><i className="bi bi-trash3"></i> Deletar </button>

                                </td>
                                
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
           

            
        </div>
    );
}

export default App;



