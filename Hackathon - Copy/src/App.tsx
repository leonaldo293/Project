import React, { useState } from 'react'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Loader2, Plus, BookOpen } from 'lucide-react'
import { Flashcard } from './components/Flashcard'
import { supabase } from './lib/supabase'

function App() {
  const [studyNotes, setStudyNotes] = useState('')
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const generateFlashcards = async () => {
    if (!studyNotes.trim()) {
      showMessage('Por favor, insira suas anotações de estudo.', 'error')
      return
    }

    setIsLoading(true)
    try {
      // Simulação de geração de flashcards com IA
      // Em produção, isso seria uma chamada para sua API
      const generatedFlashcards = [
        {
          question: 'O que é fotossíntese?',
          answer: 'Processo pelo qual plantas convertem luz solar em energia.'
        },
        {
          question: 'Qual é a principal organela envolvida na fotossíntese?',
          answer: 'Cloroplasto.'
        },
        {
          question: 'Quais são os dois estágios principais da fotossíntese?',
          answer: 'Reações dependentes de luz e ciclo de Calvin.'
        },
        {
          question: 'Qual gás é absorvido durante a fotossíntese?',
          answer: 'Dióxido de carbono (CO2).'
        },
        {
          question: 'Qual gás é liberado durante a fotossíntese?',
          answer: 'Oxigênio (O2).'
        }
      ]

      // Salvar no Supabase
      const { data, error } = await supabase
        .from('flashcards')
        .insert(generatedFlashcards)
        .select()

      if (error) {
        throw error
      }

      setFlashcards(data || [])
      showMessage('Flashcards gerados com sucesso!', 'success')
    } catch (error) {
      console.error('Error:', error)
      showMessage('Ocorreu um erro ao gerar os flashcards.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const loadSavedFlashcards = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setFlashcards(data || [])
    } catch (error) {
      console.error('Error:', error)
      showMessage('Ocorreu um erro ao carregar os flashcards.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteFlashcard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setFlashcards(flashcards.filter(card => card.id !== id))
      showMessage('Flashcard excluído com sucesso!', 'success')
    } catch (error) {
      console.error('Error:', error)
      showMessage('Ocorreu um erro ao excluir o flashcard.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">AI Study Buddy</h1>
          <p className="text-lg text-indigo-600">Gere flashcards de estudo inteligentes com IA</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Insira suas anotações de estudo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={studyNotes}
                onChange={(e) => setStudyNotes(e.target.value)}
                placeholder="Cole aqui suas anotações..."
                className="min-h-[200px]"
              />
              <Button 
                onClick={generateFlashcards} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  'Gerar Flashcards'
                )}
              </Button>

              {message && (
                <div className={`p-3 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flashcards Section */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Seus Flashcards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={loadSavedFlashcards} 
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  'Carregar Flashcards Salvos'
                )}
              </Button>

              <div className="grid grid-cols-1 gap-4 mt-4">
                {flashcards.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Seus flashcards aparecerão aqui após a geração.
                  </p>
                ) : (
                  flashcards.map((card) => (
                    <Flashcard
                      key={card.id}
                      id={card.id}
                      question={card.question}
                      answer={card.answer}
                      onDelete={deleteFlashcard}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="text-center py-8 text-gray-600">
          <p>AI Study Buddy - Desenvolvido com Lovable.ai e Supabase</p>
        </footer>
      </div>
    </div>
  )
}

export default App