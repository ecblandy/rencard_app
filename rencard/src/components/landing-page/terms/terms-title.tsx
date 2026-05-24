interface Params {
  title: string;
  info: string;
  description: string;
}

export default function TermsTitle({ title, info, description }: Params) {
  return (
    <div className="text-center">
      <h1 className="font-urbanist font-bold text-[2rem] max-sm:text-[1.375rem] mb-[1.5625rem]">
        {title}
      </h1>

      <p className="font-urbanist font-semibold text-[1.5rem] max-sm:text-[1.125rem] text-neutral-strong">
        {description}
      </p>

      <p className="mt-[2rem] font-urbanist font-semibold text-[1.125rem]">
        {info}
      </p>
    </div>
  );
}
