export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="my-[2rem]">
      <h2 className="font-bold font-urbanist text-[1.25rem] mb-[1.5rem]">
        {title}
      </h2>
      {children}
    </section>
  );
}
