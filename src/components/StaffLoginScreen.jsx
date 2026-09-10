import { AlertCircle, KeyRound, Loader2, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import providerIdLogo from '../assets/provider-id-logo.png'
import logo from '../assets/logo.png'

export default function StaffLoginScreen() {
  const { redirectToProviderLogin, loggingIn, loginError } = useAuth()

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-4 px-3 sm:px-6 flex items-center justify-center overflow-x-hidden">
      {/* Outer Rounded Container with Green Border (matching reference image) */}
      <div className="w-full max-w-[440px] rounded-[32px] sm:rounded-[36px] p-2 bg-[#009B4E] shadow-2xl transition-all animate-fade-in-up my-auto">
        {/* White Inner Card */}
        <div className="bg-white rounded-[24px] sm:rounded-[28px] px-5 py-6 sm:px-8 sm:py-8 text-center flex flex-col items-center relative shadow-inner">
          
          {/* Top Hospital Identity Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] sm:text-xs font-medium mb-4 sm:mb-5">
            <img src={logo} alt="โลโก้ รพ.คลองหาด" className="w-4 h-4 rounded-full object-contain" />
            <span>โรงพยาบาลคลองหาด • ระบบเจ้าหน้าที่</span>
          </div>

          {/* Exact Provider ID Logo Image */}
          <div className="w-full max-w-[260px] sm:max-w-[300px] mb-5 sm:mb-6 flex justify-center transform hover:scale-[1.02] transition-transform duration-300">
            <img 
              src={providerIdLogo} 
              alt="MOPH Provider ID Logo" 
              className="w-full h-auto object-contain max-h-24 sm:max-h-28 drop-shadow-sm"
            />
          </div>

          {/* Error Alert Display */}
          {loginError && (
            <div className="w-full mb-4 flex items-start gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-left text-xs text-rose-700 shadow-sm animate-pop-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Action Buttons Group */}
          <div className="w-full max-w-[270px] sm:max-w-[300px] flex flex-col gap-2.5 sm:gap-3 items-center">
            {/* Primary "เข้าสู่ระบบด้วย Provider ID" Button */}
            <button
              type="button"
              onClick={redirectToProviderLogin}
              disabled={loggingIn}
              className="w-full py-2.5 sm:py-3 px-6 rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-600/30 font-bold text-base sm:text-lg transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-pink-600/20"
            >
              {loggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>กำลังเชื่อมต่อ...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>เข้าสู่ระบบด้วย Provider ID</span>
                </>
              )}
            </button>

            {/* Secondary "ลงชื่อเข้าใช้ด้วย THAID" Button */}
            <button
              type="button"
              onClick={redirectToProviderLogin}
              disabled={loggingIn}
              className="w-full py-2 sm:py-2.5 px-4 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm shadow-sm hover:shadow transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2.5"
            >
              {loggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#101b46]" />
                  <span>กำลังเชื่อมต่อ...</span>
                </>
              ) : (
                <>
                  {/* ThaID Badge Icon */}
                  <div className="w-6 h-5 rounded-md bg-[#101b46] flex items-center justify-center p-0.5 shadow-sm shrink-0">
                    <span className="text-[9px] font-black tracking-tight text-amber-400">Tha<span className="text-sky-300">ID</span></span>
                  </div>
                  <span>ลงชื่อเข้าใช้ด้วย THAID</span>
                </>
              )}
            </button>
          </div>

          {/* Divider Line */}
          <div className="w-full max-w-[270px] sm:max-w-[300px] flex items-center justify-center gap-3 my-4 sm:my-5 text-slate-400">
            <div className="h-[1px] flex-1 bg-slate-200"></div>
            <span className="text-xs sm:text-sm font-medium text-slate-600">หรือ</span>
            <div className="h-[1px] flex-1 bg-slate-200"></div>
          </div>

          {/* Registration Section */}
          <div className="w-full max-w-[270px] sm:max-w-[300px] flex flex-col items-center">
            <p className="text-[#005E38] font-bold text-xs sm:text-sm mb-2 sm:mb-2.5">
              หากคุณยังไม่มี Provider ID
            </p>
            <a
              href="https://provider.moph.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 sm:py-3 px-6 rounded-full bg-[#009B4E] hover:bg-[#008342] text-white font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>ลงทะเบียน</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-100" />
            </a>
          </div>

          {/* Footer Terms & Privacy Policy Links */}
          <div className="mt-5 sm:mt-6 text-center text-[11px] sm:text-xs text-slate-500">
            <a 
              href="https://provider.moph.go.th" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#009B4E] transition-colors underline decoration-slate-300 hover:decoration-[#009B4E]"
            >
              นโยบายความเป็นส่วนตัว และ ข้อกำหนดเงื่อนไขการบริการ
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
