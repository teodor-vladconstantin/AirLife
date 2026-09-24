import { Leaf, Mail } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const ComingSoon = () => (
  <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black/65" />

    <div className="relative z-10 px-4 text-center max-w-2xl">
      <div className="inline-flex items-center gap-2 mb-10">
        <Leaf className="w-7 h-7 text-primary" />
        <span className="text-3xl font-bold text-white">AirLife</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
        În curând<span className="text-primary">.</span>
      </h1>

      <p className="text-lg md:text-xl text-white/85 mb-12">
        Pregătim soluții HVAC sustenabile pentru o casă mai sănătoasă.
        Site-ul nostru va fi disponibil foarte curând.
      </p>

      <a
        href="mailto:contact@airlife.ro"
        className="inline-flex items-center gap-2 text-white/90 hover:text-primary transition-colors"
      >
        <Mail className="w-4 h-4" />
        contact@airlife.ro
      </a>
    </div>
  </main>
);

export default ComingSoon;
