import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AccountWorkspaceMenu } from "../../registry/account-workspace-menu/account-workspace-menu";
import {
  SignOutPrototypeSwitcher,
  type SignOutVariant,
} from "./signout-prototype-switcher";
import "./styles.css";

const workspaces = [
  {
    id: "da3b0218-ddf1-4faf-ac0e-a93718de60aa",
    name: "Field Operations",
    href: "#field-ops",
  },
  {
    id: "62640fb8-1a72-4fb0-9a31-48bc5f427f21",
    name: "Demo Account",
    href: "#demo",
  },
  {
    id: "4ae55417-2be1-42e1-a320-60246136d40d",
    name: "Training Workspace",
    href: "#training",
  },
];

function Demo() {
  const readVariant = (): SignOutVariant => {
    const value = new URLSearchParams(window.location.search).get("variant");
    return value === "A" || value === "B" ? value : "C";
  };
  const [variant, setVariant] = useState<SignOutVariant>(readVariant);

  useEffect(() => {
    const update = () => setVariant(readVariant());
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.signoutVariant = variant;
    return () => {
      delete document.documentElement.dataset.signoutVariant;
    };
  }, [variant]);

  return (
    <div className="page">
      <header>
        <a className="brand" href="#home">
          <span>EX</span>
          <strong>
            Example Connector<small>RENTALS → T3OS</small>
          </strong>
        </a>
        <nav>
          <a className="active" href="#imports">
            Imports
          </a>
          <a href="#templates">Templates</a>
          <a href="#catalog">Cat/Class</a>
          <a href="#automation">Automation</a>
        </nav>
        <AccountWorkspaceMenu
          currentWorkspaceId="da3b0218-ddf1-4faf-ac0e-a93718de60aa"
          workspaces={workspaces}
          user={{ name: "Alex Morgan", email: "alex@example.com" }}
          connectWorkspaceHref="#connect"
          signOutAction="/sign-out"
          defaultOpen
        />
      </header>
      <main>
        <small>FIELD OPERATIONS</small>
        <h1>On-Rent imports</h1>
        <p>
          Upload rental reports and reconcile equipment identities with T3OS.
        </p>
        <section>
          <h2>Upload an On-Rent report</h2>
          <div>Drop a report here</div>
        </section>
      </main>
      <SignOutPrototypeSwitcher current={variant} />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
