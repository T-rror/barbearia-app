'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { db, auth } from '../../lib/firebase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, senha)
      router.push('/admin')
    } catch (err) {
      alert('Login falhou. Verifique email e senha.')
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto mt-10 space-y-4 border rounded">
      <h1 className="text-xl font-bold">Login</h1>
      <input
        className="w-full p-2 border"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="w-full p-2 border"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
      />
      <button className="bg-black text-white px-4 py-2 rounded" type="submit">Entrar</button>
    </form>
  )
}
