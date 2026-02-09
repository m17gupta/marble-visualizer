import { FaRegHeart } from "react-icons/fa";


type props={
      data: any;
  isActive: boolean;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  onFav: (e: React.MouseEvent) => void;
}

const GridViewMaterial: React.FC<props> = ({ data, isActive, activeId, setActiveId, onFav }) => {
  const isOpen = activeId === data.id;

  const handlePick = () => {
    setActiveId(isOpen ? null : data.id);
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Tile */}
      <button
        onClick={handlePick}
        className={[
          "group block w-full overflow-hidden rounded-xl border bg-white text-left shadow-sm transition p-0",
          isActive
            ? "border-emerald-500 ring-2 ring-emerald-300"
            : "border-zinc-200 hover:border-zinc-300 hover:shadow",
        ].join(" ")}
      >
        <div className="relative aspect-square w-full">
          <img
            src={data.media}
            alt={data.name}
            className="h-full w-full object-cover"
          />
          <button
            onClick={onFav}
            className="absolute right-1 top-1 inline-flex items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow hover:bg-white p-1"
            aria-label="favorite"
            type="button"
          >
            <FaRegHeart className="h-4 w-4" />
          </button>
        </div>
      </button>


    </div>
  );
};

export default GridViewMaterial