export function PageHeader({ title, eyebrow, description, actions }) {
  return (
    <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="text-sm font-semibold uppercase text-emerald-800">{eyebrow}</p> : null}
        <h2 className="mt-1 text-2xl font-semibold tracking-normal text-stone-950 sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

