import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'

interface FlashcardProps {
  id?: string
  question: string
  answer: string
  onDelete?: (id: string) => void
}

export function Flashcard({ id, question, answer, onDelete }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (id && onDelete) {
      onDelete(id)
    }
  }

  return (
    <div className="relative">
      <Card 
        className="w-80 h-60 cursor-pointer transition-all duration-300 transform-gpu"
        onClick={handleFlip}
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'none',
          transformStyle: 'preserve-3d',
        }}
      >
        <CardContent className="flex items-center justify-center h-full p-6">
          <div className="text-center" style={{ backfaceVisibility: 'hidden' }}>
            <CardTitle className="mb-4">{isFlipped ? 'Resposta' : 'Pergunta'}</CardTitle>
            <p>{isFlipped ? answer : question}</p>
          </div>
        </CardContent>
      </Card>
      
      {id && onDelete && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}