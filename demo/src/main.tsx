import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AccountWorkspaceMenu } from "../../registry/account-workspace-menu/account-workspace-menu";
import "./styles.css";

const workspaces = [
  {
    id: "field-ops",
    name: "Field Operations",
    description: "Primary workspace",
    href: "#field-ops",
  },
  {
    id: "demo",
    name: "Demo — Account",
    description: "Training and demonstration",
    href: "#demo",
  },
  {
    id: "training",
    name: "Training Workspace",
    description: "Demonstration workspace",
    href: "#training",
  },
];

function Demo() {
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
          currentWorkspaceId="field-ops"
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
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
