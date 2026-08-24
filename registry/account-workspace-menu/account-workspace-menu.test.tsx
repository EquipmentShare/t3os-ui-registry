import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  AccountWorkspaceMenu,
  type AccountWorkspaceMenuProps,
} from "./account-workspace-menu";
import {
  filterAccountWorkspaces,
  initials,
} from "./account-workspace-menu-model";

const props: AccountWorkspaceMenuProps = {
  currentWorkspaceId: "ws-field-ops",
  workspaces: [
    {
      id: "ws-field-ops",
      name: "Field Operations",
      description: "Primary workspace",
      href: "/sign-in?workspace=ws-field-ops",
    },
    {
      id: "ws-demo",
      name: "Training Workspace",
      href: "/sign-in?workspace=ws-demo",
    },
  ],
  user: {
    name: "Alex Morgan",
    email: "alex@example.com",
    pictureUrl: "https://example.com/profile.png",
  },
  connectWorkspaceHref: "/sign-in?choose=1",
  signOutAction: "/sign-out",
};

describe("AccountWorkspaceMenu", () => {
  it("opens a combined workspace and account menu", async () => {
    const user = userEvent.setup();
    render(<AccountWorkspaceMenu {...props} />);

    await user.click(
      screen.getByRole("button", {
        name: "Account and workspace: Field Operations",
      }),
    );

    const menu = screen.getByRole("menu", { name: "Account and workspaces" });
    expect(within(menu).getByText("Alex Morgan")).toBeVisible();
    expect(
      within(menu).queryByText("alex@example.com"),
    ).not.toBeInTheDocument();
    expect(within(menu).getByText("ws-field-ops")).toBeVisible();
    expect(within(menu).getByText("ws-demo")).toBeVisible();
    expect(
      within(menu).getByRole("menuitem", { name: /Training Workspace/ }),
    ).toHaveAttribute("href", "/sign-in?workspace=ws-demo");
    expect(
      within(menu).getByRole("menuitem", { name: /Connect workspace/ }),
    ).toHaveAttribute("href", "/sign-in?choose=1");
    const signOut = within(menu).getByRole("menuitem", { name: "Sign out" });
    expect(signOut.closest("form")).toHaveAttribute("action", "/sign-out");
    expect(signOut.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("clears a search before Escape closes the menu", async () => {
    const user = userEvent.setup();
    render(<AccountWorkspaceMenu {...props} defaultOpen />);

    await user.type(
      screen.getByRole("searchbox", { name: "Search workspaces" }),
      "primary",
    );
    expect(
      screen.getByRole("menuitem", { name: /Field Operations/ }),
    ).toBeVisible();
    expect(
      screen.queryByRole("menuitem", { name: /Training Workspace/ }),
    ).not.toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(
      screen.getByRole("searchbox", { name: "Search workspaces" }),
    ).toHaveValue("");
    expect(screen.getByRole("menu")).toBeVisible();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Account and workspace: Field Operations",
      }),
    ).toHaveFocus();
  });

  it("keeps search-field navigation keys in the search field", async () => {
    const user = userEvent.setup();
    render(<AccountWorkspaceMenu {...props} defaultOpen />);

    const search = screen.getByRole("searchbox", {
      name: "Search workspaces",
    });
    await user.type(search, "field");
    await user.keyboard("{Home}");

    expect(search).toHaveFocus();
    expect(search).toHaveValue("field");
    expect(search).toHaveProperty("selectionStart", 0);
  });

  it("does not steal focus on Escape after the menu loses focus", async () => {
    const user = userEvent.setup();
    render(
      <>
        <AccountWorkspaceMenu {...props} defaultOpen />
        <input type="search" aria-label="Page search" />
      </>,
    );

    const menuSearch = screen.getByRole("searchbox", {
      name: "Search workspaces",
    });
    await user.type(menuSearch, "primary");
    const pageSearch = screen.getByRole("searchbox", { name: "Page search" });
    await user.click(pageSearch);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await user.keyboard("{Escape}");

    expect(pageSearch).toHaveFocus();
  });

  it("closes when keyboard focus leaves the menu", async () => {
    const user = userEvent.setup();
    render(
      <>
        <AccountWorkspaceMenu {...props} defaultOpen />
        <button type="button">Page action</button>
      </>,
    );

    screen.getByRole("menuitem", { name: "Sign out" }).focus();
    await user.tab();

    expect(screen.getByRole("button", { name: "Page action" })).toHaveFocus();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("clears a stale search after an outside click", async () => {
    const user = userEvent.setup();
    render(<AccountWorkspaceMenu {...props} defaultOpen />);

    await user.type(
      screen.getByRole("searchbox", { name: "Search workspaces" }),
      "missing",
    );
    expect(screen.getByText("No matching workspaces")).toBeVisible();

    await user.click(document.body);
    await user.click(
      screen.getByRole("button", {
        name: "Account and workspace: Field Operations",
      }),
    );

    expect(
      screen.getByRole("searchbox", { name: "Search workspaces" }),
    ).toHaveValue("");
    expect(
      screen.getByRole("menuitem", { name: /Training Workspace/ }),
    ).toBeVisible();
  });

  it("renders nothing when current workspace data is absent", () => {
    const { container } = render(
      <AccountWorkspaceMenu {...props} currentWorkspaceId="unknown" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("account workspace helpers", () => {
  it("filters by name, description, and id", () => {
    expect(filterAccountWorkspaces(props.workspaces, "primary")).toEqual([
      props.workspaces[0],
    ]);
    expect(filterAccountWorkspaces(props.workspaces, "ws-demo")).toEqual([
      props.workspaces[1],
    ]);
  });

  it("creates stable initials", () => {
    expect(initials(" Alex Morgan ")).toBe("AM");
    expect(initials("Operations")).toBe("O");
    expect(initials(" ")).toBe("?");
  });
});
