// app/agendamento/page.jsx
'use client'
import { useForm } from 'react-hook-form'
import { db } from '../../../src/lib/firebase'
import { useState } from 'react'
import { collection,
  addDoc,
  getDocs,
  query,
  where,Timestamp } from 'firebase/firestore'
import { useRouter } from "next/navigation"

export default function FormularioAgendamento() {
  const router = useRouter()
  const { register, handleSubmit, reset, formState: { errors }, } = useForm()

  const onSubmit = async (data) => {
  try {
    const agendamentosRef = collection(db, 'agendamentos')

    // Consulta para verificar se já existe agendamento na mesma data e hora
    const q = query(
      agendamentosRef,
      where('data', '==', data.data),
      where('hora', '==', data.hora)
    )

    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      alert('Já existe um agendamento nesse horário!')
      return
    }

    // Se não existir, adiciona o novo agendamento
    await addDoc(agendamentosRef, {
      ...data,
      criadoEm: Timestamp.now(),
    })

    alert('Agendamento enviado com sucesso!')
    reset()
    router.push('/')
  } catch (error) {
    console.error('Erro ao enviar agendamento:', error)
    alert('Erro ao enviar. Verifique a conexão.')
  }
}
  const gerarHorarios = () => {
  const horarios = []
  const inicio = 9 * 60 // 09:00 em minutos
  const fim = 18 * 60   // 18:00 em minutos
  const intervalo = 40

  for (let i = inicio; i <= fim; i += intervalo) {
    const h = String(Math.floor(i / 60)).padStart(2, '0')
    const m = String(i % 60).padStart(2, '0')
    horarios.push(`${h}:${m}`)
  }

  return horarios
}

  const [horariosDisponiveis, setHorariosDisponiveis] = useState([])

const verificarHorariosDisponiveis = async (dataSelecionada) => {
  const agendamentosRef = collection(db, 'agendamentos')
  const q = query(agendamentosRef, where('data', '==', dataSelecionada))
  const snapshot = await getDocs(q)

  const horariosOcupados = snapshot.docs.map(doc => doc.data().hora)
  const todosHorarios = gerarHorarios()
  const agora = new Date()
const hojeStr = agora.toISOString().split("T")[0]

const disponiveis = todosHorarios
  .filter(h => {
    if (horariosOcupados.includes(h)) return false

    // Se a data for hoje, filtra horários já passados
    if (dataSelecionada === hojeStr) {
      const [hPart, mPart] = h.split(":")
      const horarioEmMinutos = parseInt(hPart) * 60 + parseInt(mPart)
      const agoraEmMinutos = agora.getHours() * 60 + agora.getMinutes()
      return horarioEmMinutos > agoraEmMinutos
    }

    return true // Se não for hoje, todos são válidos (exceto os ocupados)
  })


  setHorariosDisponiveis(disponiveis)
}


  return (  
    <section>
    <h1 className='text-5xl text-center font-bebas py-3.5'>Precisao e qualidade</h1>
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow">
      <h1 className="text-center text-xl font-bold mb-4">Agende seu Corte</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
        {...register("nome", { required: "O nome é obrigatório" })}
        placeholder="Nome"
          className="w-full p-2 border rounded text-center text-white bg-black"
        />
         {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
          <input
        {...register("telefone", {
          required: "O telefone é obrigatório",
          pattern: {
            value: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
            message: "Formato de telefone inválido",
          },
        })}
        placeholder="Telefone"
        className="w-full p-2 border bg-black text-white"
      />
      {errors.telefone && (
        <p className="text-red-500">{errors.telefone.message}</p>
      )}
        <input
         {...register("data", { required: "A data é obrigatória" })}
          type="date"
          placeholder="Horarios disponiveis"
          className="w-full p-2 border rounded text-white bg-black"
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => {
          verificarHorariosDisponiveis(e.target.value)
      }}
        />
         {errors.data && <p className="text-red-500">{errors.data.message}</p>}
        <select
            {...register("hora", { required: "A hora é obrigatória" })}
             className="w-full p-2 border rounded text-white bg-black"
        >
        <option 
        className='bg-black text-white'
        value="">Selecione um horário</option>
          {horariosDisponiveis.map((hora) => (
        <option key={hora} value={hora}>
         {hora}
         </option>
      ))}
      </select>
        {horariosDisponiveis.length === 0 && (
          <p className="text-red-500">Nenhum horário disponível para essa data.</p>
      )}

        {errors.hora && <p className="text-red-500">{errors.hora.message}</p>}

        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Enviar
        </button>
      </form>
    </div>
    </section>  
  )
}
