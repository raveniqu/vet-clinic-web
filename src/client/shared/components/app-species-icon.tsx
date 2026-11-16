import { Bird, Cat, Dog, LineSquiggle, PawPrint, Rabbit, Rat, Turtle } from "lucide-react";

interface AppSpeciesIconProps {
  code?: string;
  className?: string;
}

export function AppSpeciesIcon({ code, className = "size-4" }: AppSpeciesIconProps) {
  switch (code) {
    case "CANINE":
      return <Dog className={className} />;
    case "FELINE":
      return <Cat className={className} />;
    case "RABBIT":
      return <Rabbit className={className} />;
    case "HAMSTER":
      return <Rat className={className} />;
    case "AVIAN":
      return <Bird className={className} />;
    case "SNAKE":
      return <LineSquiggle className={className} />;
    case "TURTLE":
      return <Turtle className={className} />;
    default:
      return <PawPrint className={className} />;
  }
}
