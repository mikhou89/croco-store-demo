"use client";
import { useRef, useState } from "react";
import { productImage } from "@/lib/format";

export function Gallery({ images, alt, badge }: { images: string[]; alt: string; badge?: React.ReactNode }) {
  const [i, setI] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const list = images.length ? images : [null as unknown as string];
  const goTo = (n: number) => {
    setI(n);
    const el = rail.current;
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };
  return (
    <div className="md:sticky md:top-[100px] grid gap-3 md:grid-cols-[76px_1fr] md:gap-4">
      {list.length > 1 && (
        <div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
          {list.map((id, n) => (
            <button key={n} onClick={() => goTo(n)} aria-label={`Image ${n + 1}`} aria-current={i === n} className={`size-[68px] md:size-[76px] shrink-0 rounded-xl bg-white p-1.5 ring-1 transition ${i === n ? "ring-ink" : "ring-line hover:ring-muted"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={productImage(id)} alt="" className="size-full object-contain" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      <div className={`relative order-1 md:order-2 overflow-hidden rounded-[1.75rem] bg-white ${list.length > 1 ? "" : "md:col-span-2"}`}>
        <div
          ref={rail}
          className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar"
          onScroll={(e) => { const el = e.currentTarget; setI(Math.round(el.scrollLeft / el.clientWidth)); }}
        >
          {list.map((id, n) => (
            <div key={n} className="aspect-square w-full shrink-0 snap-center grid place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={productImage(id, 800)}
                srcSet={`${productImage(id, 400)} 400w, ${productImage(id, 800)} 800w`}
                sizes="(min-width:768px) 50vw, 100vw"
                alt={n === 0 ? alt : `${alt}, vue ${n + 1}`}
                width={800}
                height={800}
                loading={n === 0 ? "eager" : "lazy"}
                fetchPriority={n === 0 ? "high" : undefined}
                className="size-full object-contain p-[7%]"
              />
            </div>
          ))}
        </div>
        {badge && <div className="absolute left-4 top-4 flex flex-col gap-1.5">{badge}</div>}
        {list.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 md:hidden">
            {list.map((_, n) => <span key={n} className={`h-1.5 rounded-full transition-all ${i === n ? "w-5 bg-ink" : "w-1.5 bg-ink/25"}`} />)}
          </div>
        )}
      </div>
    </div>
  );
}
