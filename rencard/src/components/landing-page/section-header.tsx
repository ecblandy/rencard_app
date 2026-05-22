interface SectionHeaderProps {
  title: string;
  description: string;
  texStyle?: "white" | "black";
}

export default function SectionHeader({
  title,
  description,
  texStyle = "black",
}: SectionHeaderProps) {
  const textStyle = {
    white: "text-white",
    black: "text-black",
  };

  return (
    <div
      className={`font-urbanist space-y-[.6875rem] text-center ${textStyle[texStyle]}`}
    >
      <h2 className="font-bold text-[2.5rem] leading-[100%]">{title}</h2>
      <p className="font-semibold text-[1.5rem] text-[#7A7A7A] leading-[100%]">
        {description}
      </p>
    </div>
  );
}
