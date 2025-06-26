'use client'
import { useEffect, useState } from 'react'
import {
  deleteDoc, doc, collection, getDocs, query,
  where, Timestamp, getDoc, setDoc
} from 'firebase/firestore'
import { onAuthStateChanged } from "firebase/auth"
import { db, auth } from '../../../src/lib/firebase'
import { Button } from '../../../src/shadcn/components/ui/button'

// Componentes reutilizáveis
import AgendamentoCard from '../../../src/app/components/admin/AgendamentoCard'
import ConcluidoCard from '../../../src/app/components/admin/ConcluidoCard'
import HistoricoResumo from '../../../src/app/components/admin/HistoricoResumo'

export default function AdminPage() {
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [historico, setHistorico] = useState({})
  const [showConcluidos, setShowConcluidos] = useState(false)
  const [agendamentosConcluidos, setAgendamentosConcluidos] = useState([])

  // Autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        window.location.href = '/login'
      }
    })
    return () => unsubscribe()
  }, [])

  // Buscar agendamentos ativos
  useEffect(() => {
    if (!user) return

    const fetchAgendamentos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'agendamentos'))
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setAgendamentos(lista)
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgendamentos()
  }, [user])

  // Buscar agendamentos concluídos
  const fetchConcluidos = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'agendamentos_concluidos'))
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAgendamentosConcluidos(lista)
    } catch (error) {
      console.error('Erro ao buscar agendamentos concluídos:', error)
    }
  }

  // Marcar agendamento como concluído
  const concluirAgendamento = async (id) => {
    const confirmar = confirm("Deseja marcar este agendamento como concluído?")
    if (!confirmar) return

    try {
      const agendamentoRef = doc(db, 'agendamentos', id)
      const snapshot = await getDoc(agendamentoRef)

      if (snapshot.exists()) {
        const dados = snapshot.data()
        const dadosComConcluido = { ...dados, concluidoEm: Timestamp.now() }
        await setDoc(doc(db, 'agendamentos_concluidos', id), dadosComConcluido)
        await deleteDoc(agendamentoRef)

        setAgendamentos(prev => prev.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error("Erro ao concluir agendamento:", error)
    }
  }

  // Buscar histórico (ativos + concluídos)
  useEffect(() => {
    if (!user) return

    const fetchHistorico = async () => {
      try {
        const hoje = new Date()
        const doisMesesAtras = new Date()
        doisMesesAtras.setMonth(hoje.getMonth() - 2)

        const qAtivos = query(
          collection(db, 'agendamentos'),
          where('criadoEm', '>=', Timestamp.fromDate(doisMesesAtras))
        )
        const qConcluidos = query(
          collection(db, 'agendamentos_concluidos'),
          where('concluidoEm', '>=', Timestamp.fromDate(doisMesesAtras))
        )

        const [snapshotAtivos, snapshotConcluidos] = await Promise.all([
          getDocs(qAtivos),
          getDocs(qConcluidos)
        ])

        const todos = [
          ...snapshotAtivos.docs.map(doc => doc.data()),
          ...snapshotConcluidos.docs.map(doc => doc.data())
        ]

        const agrupado = {}
        todos.forEach(ag => {
          const data = ag.data
          if (agrupado[data]) {
            agrupado[data]++
          } else {
            agrupado[data] = 1
          }
        })

        setHistorico(agrupado)
      } catch (error) {
        console.error("Erro ao carregar histórico:", error)
      }
    }

    fetchHistorico()
  }, [user])

  if (!user) {
    return <p className="text-center mt-10">Verificando autenticação...</p>
  }

  return (
    <section className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Painel de Agendamentos</h1>

      {loading ? (
        <p className="text-center">Carregando agendamentos...</p>
      ) : agendamentos.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="space-y-4">
          {agendamentos.map(agendamento => (
            <AgendamentoCard
              key={agendamento.id}
              agendamento={agendamento}
              onConcluir={concluirAgendamento}
            />
          ))}
        </div>
      )}

      <div className="mt-10">
        <Button onClick={() => {
          setShowConcluidos(!showConcluidos)
          if (!showConcluidos) fetchConcluidos()
        }}>
          {showConcluidos ? 'Esconder Concluídos' : 'Mostrar Concluídos'}
        </Button>

        {showConcluidos && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Agendamentos Concluídos</h2>
            {agendamentosConcluidos.length === 0 ? (
              <p>Nenhum agendamento concluído.</p>
            ) : (
              agendamentosConcluidos.map(a => (
                <ConcluidoCard key={a.id} agendamento={a} />
              ))
            )}
          </div>
        )}
      </div>

      <HistoricoResumo historico={historico} />
    </section>
  )
}
