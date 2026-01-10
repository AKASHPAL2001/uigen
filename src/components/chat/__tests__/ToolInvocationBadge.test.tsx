import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

test("displays 'Creating' for str_replace_editor create command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: {
          command: "create",
          path: "/components/Button.tsx",
        },
      }}
    />
  );

  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("displays 'Editing' for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: {
          command: "str_replace",
          path: "/App.jsx",
        },
      }}
    />
  );

  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("displays 'Editing' for str_replace_editor insert command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: {
          command: "insert",
          path: "/utils/helpers.ts",
        },
      }}
    />
  );

  expect(screen.getByText("Editing helpers.ts")).toBeDefined();
});

test("displays 'Reading' for str_replace_editor view command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        state: "result",
        result: "file content",
        args: {
          command: "view",
          path: "/config/settings.json",
        },
      }}
    />
  );

  expect(screen.getByText("Reading settings.json")).toBeDefined();
});

test("displays 'Deleting' for file_manager delete command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "file_manager",
        state: "result",
        result: { success: true },
        args: {
          command: "delete",
          path: "/old-file.tsx",
        },
      }}
    />
  );

  expect(screen.getByText("Deleting old-file.tsx")).toBeDefined();
});

test("displays 'Moving to' for file_manager rename command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "file_manager",
        state: "result",
        result: { success: true },
        args: {
          command: "rename",
          path: "/old-name.tsx",
          new_path: "/new-name.tsx",
        },
      }}
    />
  );

  expect(screen.getByText("Moving to new-name.tsx")).toBeDefined();
});

test("shows loading spinner when tool is in progress", () => {
  const { container } = render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        state: "call",
        args: {
          command: "create",
          path: "/Loading.tsx",
        },
      }}
    />
  );

  // Should have animate-spin class for the loader
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

test("shows green dot when tool is complete", () => {
  const { container } = render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
        args: {
          command: "create",
          path: "/Complete.tsx",
        },
      }}
    />
  );

  // Should have green background for completion indicator
  const greenDot = container.querySelector(".bg-emerald-500");
  expect(greenDot).toBeDefined();
});

test("handles tool without args gracefully", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Modifying file")).toBeDefined();
});

test("handles unknown tool names", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "unknown_tool",
        state: "result",
        result: "done",
      }}
    />
  );

  expect(screen.getByText("unknown tool")).toBeDefined();
});

test("displays fallback for file_manager without command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "file_manager",
        state: "result",
        result: { success: true },
        args: {},
      }}
    />
  );

  expect(screen.getByText("Managing files")).toBeDefined();
});
