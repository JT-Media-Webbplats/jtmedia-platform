'use client'

import { useState, useTransition, type ReactNode, type DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { KanbanColumnDef } from '@/lib/pipeline'

export interface KanbanItem<K extends string> {
  id: string
  column: K
  /** Sort key inside the column (newest first). */
  sortKey: string
  node: ReactNode
}

interface Props<K extends string> {
  columns: KanbanColumnDef<K>[]
  items: KanbanItem<K>[]
  /** Called after an optimistic move; return an error message to roll back. */
  onMove: (id: string, to: K) => Promise<{ error?: string } | void>
  /** Optional footer per column, e.g. a summed value. */
  footer?: (columnKey: K, items: KanbanItem<K>[]) => ReactNode
  emptyText?: string
}

/**
 * Generic kanban board with native HTML5 drag and drop. Moves are applied
 * optimistically and rolled back if the server action returns an error.
 */
export default function KanbanBoard<K extends string>({ columns, items, onMove, footer, emptyText = 'Tomt' }: Props<K>) {
  const router = useRouter()
  const [local, setLocal] = useState(items)
  const [dragging, setDragging] = useState<string | null>(null)
  const [over, setOver] = useState<K | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // Keep local state in sync when the server re-renders with fresh data.
  const [seen, setSeen] = useState(items)
  if (seen !== items) {
    setSeen(items)
    setLocal(items)
  }

  function move(id: string, to: K) {
    const current = local.find((i) => i.id === id)
    if (!current || current.column === to) return
    const from = current.column
    setError(null)
    setLocal((prev) => prev.map((i) => (i.id === id ? { ...i, column: to } : i)))
    setSavingId(id)
    startTransition(async () => {
      const result = await onMove(id, to)
      if (result && 'error' in result && result.error) {
        setError(result.error)
        setLocal((prev) => prev.map((i) => (i.id === id ? { ...i, column: from } : i)))
      } else {
        router.refresh()
      }
      setSavingId(null)
    })
  }

  function onDragStart(e: DragEvent, id: string) {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
    setDragging(id)
  }
  function onDrop(e: DragEvent, to: K) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || dragging
    setOver(null)
    setDragging(null)
    if (id) move(id, to)
  }

  return (
    <div>
      {error && (
        <p className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-8 px-8 items-start">
        {columns.map((col) => {
          const colItems = local
            .filter((i) => i.column === col.key)
            .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1))
          const isOver = over === col.key
          return (
            <section
              key={col.key}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (over !== col.key) setOver(col.key) }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(null) }}
              onDrop={(e) => onDrop(e, col.key)}
              className={`w-[290px] shrink-0 rounded-2xl border transition-colors ${
                isOver ? 'bg-brand-green/10 border-brand-green' : 'bg-gray-100/70 border-gray-200'
              }`}
            >
              <header className="px-4 pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700 truncate">{col.label}</h3>
                  <span className="ml-auto text-[11px] font-bold text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5">{colItems.length}</span>
                </div>
                {col.hint && <p className="text-[11px] text-gray-400 mt-1">{col.hint}</p>}
              </header>

              <div className="px-3 pb-3 space-y-2.5 min-h-[120px]">
                {colItems.length === 0 && (
                  <p className="text-[11px] text-gray-400 text-center py-8 border border-dashed border-gray-300 rounded-xl">{emptyText}</p>
                )}
                {colItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, item.id)}
                    onDragEnd={() => { setDragging(null); setOver(null) }}
                    className={`relative bg-white rounded-xl border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing transition-opacity ${
                      dragging === item.id ? 'opacity-40' : ''
                    }`}
                  >
                    {item.node}
                    {savingId === item.id && (
                      <span className="absolute top-2 right-2 text-gray-400"><Loader2 className="w-3.5 h-3.5 animate-spin" /></span>
                    )}
                    {/* Keyboard / touch fallback for moving */}
                    <select
                      aria-label="Flytta till"
                      value={item.column}
                      onChange={(e) => move(item.id, e.target.value as K)}
                      className="absolute bottom-2 right-2 text-[10px] text-gray-400 bg-transparent border-0 focus:outline-none cursor-pointer max-w-[110px]"
                    >
                      {columns.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {footer && colItems.length > 0 && (
                <footer className="px-4 py-3 border-t border-gray-200/80 text-[11px] text-gray-500">{footer(col.key, colItems)}</footer>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
