// Semantic <table> (BTU by room volume): easy for search engines and AI answers to quote. Same figures as the BTU calculator.
export const BTU_ROWS = [
  ["până la 65 mc (≈ 26 mp la 2,5 m)", "9.000 BTU", "dormitor, birou mic"],
  ["65 – 85 mc (≈ 26 – 34 mp)", "12.000 BTU", "living mediu, dormitor mare"],
  ["85 – 130 mc (≈ 34 – 52 mp)", "18.000 BTU", "living open-space, cameră mansardată"],
  ["130 – 170 mc (≈ 52 – 68 mp)", "24.000 BTU", "spațiu comercial mic, living mare"],
  ["peste 170 mc", "36.000 BTU sau mai multe unități", "recomandăm o ofertă personalizată"],
];

export const BtuTable = ({ caption = "Putere recomandată (BTU) în funcție de volumul camerei" }: { caption?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-border">
    <table className="w-full text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead className="bg-secondary/50 text-left">
        <tr><th scope="col" className="p-3">Volum cameră</th><th scope="col" className="p-3">Putere recomandată</th><th scope="col" className="p-3">Exemple</th></tr>
      </thead>
      <tbody>
        {BTU_ROWS.map((row) => (
          <tr key={row[0]} className="border-t border-border">
            <th scope="row" className="p-3 text-left font-normal">{row[0]}</th><td className="p-3">{row[1]}</td><td className="p-3">{row[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default BtuTable;
