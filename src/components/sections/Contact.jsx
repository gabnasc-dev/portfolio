import { RevealOnScroll } from "../RevealOnScroll";
import emailjs from '@emailjs/browser';
import { useState } from "react";

export const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [toast, setToast] = useState({ visible: false, message: "", success: true });

  const showToast = (message, success) => {
    setToast({ visible: true, message, success });
    setTimeout(() => setToast({ visible: false, message: "", success: true }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        e.target,
        import.meta.env.VITE_PUBLIC_KEY
      )
      .then(() => {
        setFormData({ name: "", email: "", message: "" });
        showToast("Mensagem enviada com sucesso!", true);
      })
      .catch(() => {
        showToast("Erro ao enviar. Tente novamente.", false);
      });
  };

  return (
    <section id="contact" className="flex items-center justify-center py-20 px-4 relative">

      {/* Toast */}
      {toast.visible && (
        <div
          className={`fixed top-5 right-5 z-50 max-w-xs w-auto py-2.5 px-4 rounded-lg shadow-lg text-white text-sm font-medium
            transition-all duration-300
            ${toast.success
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_16px_rgba(59,130,246,0.3)]"
              : "bg-red-500/90 shadow-[0_0_16px_rgba(239,68,68,0.3)]"
            }`}
          style={{ animation: "slideIn 0.3s ease-out forwards" }}
        >
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <RevealOnScroll>
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-400/70 mb-3 font-medium">Contato</p>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Entre em contato
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              placeholder="Nome"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 transition focus:outline-none focus:border-blue-500/60 focus:bg-blue-500/5"
            />
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              placeholder="exemplo@email.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 transition focus:outline-none focus:border-blue-500/60 focus:bg-blue-500/5"
            />
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              placeholder="Sua mensagem..."
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 transition focus:outline-none focus:border-blue-500/60 focus:bg-blue-500/5 resize-none"
            />
            <button
              type="submit"
              className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              Enviar mensagem
            </button>
          </form>
        </div>
      </RevealOnScroll>
    </section>
  );
};
