export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-6 space-y-2 font-urbanist font-semibold text-[1.125rem]">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
