import { useEffect } from "react";

// PROTOTYPE — three sign-out treatments on the existing demo route.
export type SignOutVariant = "A" | "B" | "C";

const variants: readonly SignOutVariant[] = ["A", "B", "C"];
const names: Record<SignOutVariant, string> = {
  A: "Outlined",
  B: "Icon only",
  C: "Ghost + icon",
};

export function SignOutPrototypeSwitcher({
  current,
}: {
  current: SignOutVariant;
}) {
  const select = (offset: number) => {
    const next =
      variants[
        (variants.indexOf(current) + offset + variants.length) % variants.length
      ]!;
    const url = new URL(window.location.href);
    url.searchParams.set("variant", next);
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches("input, textarea, [contenteditable='true']")) return;
      if (event.key === "ArrowLeft") select(-1);
      if (event.key === "ArrowRight") select(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <aside
      className="signout-prototype-switcher"
      aria-label="Prototype variant"
    >
      <button
        type="button"
        aria-label="Previous variant"
        onClick={() => select(-1)}
      >
        ←
      </button>
      <strong>
        {current} — {names[current]}
      </strong>
      <button type="button" aria-label="Next variant" onClick={() => select(1)}>
        →
      </button>
    </aside>
  );
}
