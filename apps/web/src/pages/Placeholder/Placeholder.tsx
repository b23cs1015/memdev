type PlaceholderProps = {
  title: string;
  description: string;
};

function Placeholder({
  title,
  description,
}: PlaceholderProps) {
  return (
    <div>
      <p className="text-sm font-medium text-blue-600">Workspace</p>

      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        {title}
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-8 rounded-xl border border-[#E7E7E2] bg-white px-5 py-14 text-center">
        <p className="text-sm font-medium">
          This section is coming next.
        </p>

        <p className="mt-1 text-sm text-slate-500">
          The underlying backend API is already available.
        </p>
      </div>
    </div>
  );
}

export default Placeholder;