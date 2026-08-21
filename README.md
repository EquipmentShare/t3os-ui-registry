# T3OS UI Registry

Copy-owned UI modules for applications integrating with T3OS.

Registry items use the [shadcn GitHub registry format](https://ui.shadcn.com/docs/registry/github). Applications install source they can inspect, adapt, and own; this repository is not a runtime dependency.

## Install

Preview the item before installing it:

```bash
pnpm dlx shadcn@latest view EquipmentShare/t3os-ui-registry/account-workspace-menu
pnpm dlx shadcn@latest add EquipmentShare/t3os-ui-registry/account-workspace-menu
```

## Account workspace menu

The compact menu combines current workspace context, workspace search and switching, account identity, and local application sign-out. Workspace IDs appear beneath names so developers and support teams can identify the exact installation context. Its interface accepts display-safe data and ordinary URLs:

```tsx
<AccountWorkspaceMenu
  currentWorkspaceId={currentWorkspaceId}
  workspaces={workspaces.map((workspace) => ({
    id: workspace.id,
    name: workspace.name,
    description: workspace.description,
    logoUrl: workspace.logoUrl,
    href: `/sign-in?workspace=${encodeURIComponent(workspace.id)}`,
  }))}
  user={{ name: user.name, email: user.email, pictureUrl: user.pictureUrl }}
  connectWorkspaceHref="/sign-in?choose=1"
  signOutAction="/sign-out"
/>
```

The consumer adapter remains responsible for authentication, retrieving authorized workspace metadata, generating OAuth routes, and processing the POST sign-out action. The UI module performs no fetching or token handling.

Consumers can theme the module through its `--t3-menu-*` CSS custom properties.

## Security

Registry source must never contain credentials, tokens, tenant identifiers, customer data, or private application configuration. See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
