'use client'

const WHATSAPP_NUMBER = '5511983943905'
const WHATSAPP_MESSAGE = 'Olá, Alexander! Vi seu portfólio e gostaria de conversar sobre um projeto.'

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
    >
      {/* Tooltip */}
      <span className="
        hidden sm:flex items-center
        bg-[#111827] text-white text-xs font-medium
        px-3 py-1.5 rounded-lg border border-green-500/20
        opacity-0 group-hover:opacity-100
        translate-x-2 group-hover:translate-x-0
        transition-all duration-300 pointer-events-none
        whitespace-nowrap shadow-lg
      ">
        Fale comigo agora
      </span>

      {/* Button */}
      <div className="
        relative w-14 h-14 rounded-full
        bg-[#25D366] hover:bg-[#20c05e]
        flex items-center justify-center
        shadow-[0_4px_20px_rgba(37,211,102,0.45)]
        hover:shadow-[0_6px_28px_rgba(37,211,102,0.65)]
        hover:scale-110
        transition-all duration-300
      ">
        {/* Ping ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />

        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="white"
          className="w-7 h-7 relative z-10"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.44.638 4.73 1.752 6.715L2 30l7.522-1.715A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 01-5.852-1.607l-.42-.25-4.462 1.017 1.052-4.35-.273-.445A11.46 11.46 0 014.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zM22.4 19.1c-.33-.165-1.953-.963-2.256-1.073-.303-.11-.523-.165-.743.165-.22.33-.852 1.073-1.045 1.293-.193.22-.385.248-.715.083-.33-.165-1.393-.514-2.654-1.638-.98-.875-1.64-1.955-1.833-2.285-.193-.33-.02-.508.145-.672.149-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.018-2.45-.268-.643-.54-.555-.743-.566-.193-.01-.413-.012-.633-.012s-.578.083-.88.413c-.303.33-1.155 1.128-1.155 2.75s1.183 3.19 1.348 3.41c.165.22 2.328 3.556 5.643 4.987.79.34 1.406.543 1.886.695.793.252 1.515.216 2.085.131.636-.095 1.953-.798 2.228-1.568.275-.77.275-1.43.193-1.568-.083-.137-.303-.22-.633-.385z" />
        </svg>
      </div>
    </a>
  )
}