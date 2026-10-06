import { useMemo, useState } from "react";
import { icons, Tag } from "lucide-react";

// Nomes PascalCase do lucide (a lista é filtrada em runtime: o que não
// existir na versão instalada é escondido, nunca parte o build).
const CURATED = [
  "Store", "ShoppingBag", "ShoppingCart", "Tag", "Tags", "Percent", "Gift",
  "Shirt", "Baby", "Footprints", "Gem", "Watch", "Glasses", "Handbag",
  "Briefcase", "Backpack", "Crown", "Diamond",
  "Car", "CarFront", "Truck", "Bike", "Bus", "Plane", "Ship", "Sailboat", "Anchor",
  "Home", "Sofa", "Armchair", "BedDouble", "Lamp", "Bath",
  "Utensils", "UtensilsCrossed", "Coffee", "Cake", "Wine", "Apple", "Beef",
  "Fish", "Pizza", "Croissant", "Milk", "Egg",
  "Pill", "HeartPulse", "Stethoscope", "Syringe", "Dumbbell", "Trophy", "Medal",
  "Sparkles", "Scissors", "Palette", "Brush", "Camera", "Music", "Mic", "Guitar",
  "Film", "Clapperboard", "Gamepad2",
  "Flower", "Flower2", "TreePine", "Leaf", "Sun", "Sprout", "Tractor",
  "Dog", "Cat", "Bird", "PawPrint",
  "ToyBrick", "Blocks", "Puzzle",
  "GraduationCap", "BookOpen", "Book", "Languages",
  "Laptop", "Smartphone", "Tv", "Headphones", "Printer", "Camera",
  "Wrench", "Hammer", "Drill", "PaintRoller", "Plug",
  "Building", "Building2", "Hotel", "Landmark", "MapPin", "Compass", "Tent", "Luggage",
  "Wallet", "CreditCard", "Banknote", "PiggyBank", "TrendingUp",
  "Phone", "Mail", "Clock", "Calendar",
  "Star", "Heart", "Award", "BadgeCheck",
  "Dress" // (se não existir nesta versão, é escondido)
];

export function iconKebab(pascal: string): string {
  return pascal.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function iconPascal(kebab: string): string {
  return String(kebab || "")
    .split("-")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

// Desenha o ícone guardado na BD (nome kebab, ex. "shopping-bag"). Cai no Tag.
export function CategoryIcon({ name, size = 18, className }: { name?: string | null; size?: number; className?: string }) {
  const Cmp = ((icons as Record<string, any>)[iconPascal(name || "")] || Tag) as any;
  return <Cmp size={size} className={className} />;
}

export default function CategoryIconPicker({
  value, onChange, accentColor = "#D4A843",
}: {
  value?: string | null;
  onChange: (kebab: string) => void;
  accentColor?: string;
}) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const all = (icons as Record<string, any>);
    return CURATED.filter((n) => all[n]).filter((n) =>
      (n + " " + iconKebab(n)).toLowerCase().includes(q.trim().toLowerCase())
    ).slice(0, 150);
  }, [q]);
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-9 h-9 rounded-xl border border-[#EDE8DE] grid place-items-center bg-[#FBF7F2] shrink-0">
          <CategoryIcon name={value} size={18} />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Procurar ícone… (ex: carro, bebé, bolo)"
          className="w-full border border-[#EDE8DE] bg-white py-2 px-3 text-xs text-[#2D2C2B] placeholder:text-[#87909a] outline-none focus:border-[#D4A843] rounded-xl"
        />
      </div>
      <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-44 overflow-y-auto border border-[#EDE8DE] rounded-xl p-2 bg-[#FBF7F2]">
        {list.map((n) => {
          const kebab = iconKebab(n);
          const active = (value || "") === kebab;
          const Cmp = (icons as Record<string, any>)[n] as any;
          return (
            <button
              key={n}
              type="button"
              title={kebab}
              onClick={() => onChange(kebab)}
              className="aspect-square rounded-lg grid place-items-center border transition-colors"
              style={active
                ? { backgroundColor: accentColor, borderColor: accentColor, color: "#fff" }
                : { backgroundColor: "#fff", borderColor: "#EDE8DE", color: "#5A3335" }}
            >
              <Cmp size={16} />
            </button>
          );
        })}
        {list.length === 0 && <p className="col-span-full text-center text-xs text-[#87909a] py-4">Sem ícones para “{q}”.</p>}
      </div>
      {!!value && <p className="text-[10px] text-[#87909a] mt-1">Escolhido: <strong>{value}</strong></p>}
    </div>
  );
}
