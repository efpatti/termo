import { TermProvider } from "@/TermContext";
import { Termo } from "./Termo";

export default function Home() {
  return (
    <TermProvider>
      <Termo />
    </TermProvider>
  );
}
