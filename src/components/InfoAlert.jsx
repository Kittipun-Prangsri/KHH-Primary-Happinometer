import { Info } from 'lucide-react'

export default function InfoAlert({ children }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-pink-50 border border-pink-200 p-3.5 text-xs sm:text-sm text-pink-700">
      <Info className="w-4 h-4 shrink-0 text-pink-500 mt-0.5" />
      <p>{children}</p>
    </div>
  )
}
