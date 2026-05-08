import { bgColorSets, gradients } from "../util.js/colors";

export default function CardGrid() {
  const items = Array.from({ length: gradients.length }, (_, i) => i + 1);

  const randomSet = () => gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <div className="p-6">
      <div
        className="grid gap-6 justify-center"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
        }}
      >
        {items.map((item) => (
          <div
            key={item}
            className={`w-80 h-56 cursor-pointer select-none bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg font-semibold ${randomSet()}`}
          >
            Card {item}
          </div>
        ))}
      </div>
    </div>
  );
}