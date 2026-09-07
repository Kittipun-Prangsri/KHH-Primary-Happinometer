import { Clock, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function PendingApprovalScreen() {
  const { logout, user } = useAuth()

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="glass-card rounded-2xl border border-amber-100 shadow-md p-6 sm:p-8 text-center animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md mb-4">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800">รอการอนุมัติสิทธิ์</h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          บัญชีของคุณ{user?.displayName ? ` (${user.displayName})` : ''} เข้าสู่ระบบสำเร็จแล้ว
          แต่ยังไม่ได้รับสิทธิ์เข้าถึง Dashboard กรุณาติดต่อผู้ดูแลระบบเพื่อขออนุมัติ
        </p>

        <button
          type="button"
          onClick={logout}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  )
}
