import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.BANDUP_TEST_PLAYWRIGHT || "playwright");
const origin = "http://127.0.0.1:3409";
const apiOrigin = "http://127.0.0.1:3410";
const timeout = { timeout: 6_000 };
const currentId = "019aef00-0000-7000-8000-000000000001";
const id = "019aef00-0000-7000-8000-000000000002";
const date = "2026-11-22T12:00:00Z";
let server;
let browser;

before(async () => {
  server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "-H", "127.0.0.1", "-p", "3409"], { stdio: "ignore" });
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${origin}/admin/`)).ok) break;
    } catch (error) {
      if (attempt === 39) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  browser = await chromium.launch({ executablePath: process.env.BANDUP_TEST_CHROME || undefined });
});

after(async () => {
  await browser?.close();
  server?.kill();
});

function fixtureSession(role) {
  return { id: currentId, role, displayName: "Test operator", email: "operator@example.test", creditBalance: 3 };
}

async function withPage(role, handler, run, options) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  page.setDefaultTimeout(timeout.timeout);
  const issues = [];
  page.on("pageerror", (error) => issues.push(error.message));
  const writes = [];
  const reads = [];
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === origin) return route.continue();
    if (url.origin !== apiOrigin) return route.abort();
    const headers = {
      "access-control-allow-origin": origin,
      "access-control-allow-credentials": "true",
      "access-control-allow-methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "access-control-allow-headers": "content-type, x-requested-with",
    };
    const method = request.method();
    async function reply(status, data) {
      if (data === undefined) return route.fulfill({ status, headers });
      return route.fulfill({ status, headers, json: data });
    }
    if (method === "OPTIONS") return reply(204);
    if (url.pathname === "/api/auth/me") return role ? reply(200, fixtureSession(role)) : reply(401);
    if (url.pathname === "/api/auth/refresh") return reply(401);
    if (!url.pathname.startsWith("/api/admin/")) return reply(404);
    const path = url.pathname.slice("/api/admin/".length);
    const call = { path, method, params: url.searchParams };
    if (method === "GET") reads.push(call);
    else writes.push({ path, method, data: request.postDataJSON(), csrf: await request.headerValue("x-requested-with") });
    const result = await handler?.(call, writes);
    return result ? reply(...result) : reply(404, { title: "Fixture not found" });
  });
  try {
    await run(page, writes, reads);
    assert.deepEqual(issues, []);
  } finally {
    await context.close();
  }
}

function heading(page, name) {
  return page.getByRole("heading", { name, exact: true }).waitFor({ state: "visible" });
}

function pageResult(items = [], page = 1) {
  return [200, { page, pageSize: 4, totalCount: items.length, items }];
}

test("rejects direct URL access for a learner and hides the navbar link", async () => {
  await withPage("User", undefined, async (page, _writes, reads) => {
    await page.goto(`${origin}/dashboard/`);
    await page.getByRole("link", { name: "Admin Panel" }).waitFor({ state: "hidden" });
    await page.goto(`${origin}/admin/passages/`);
    await heading(page, "403 · Access denied");
    assert.equal(reads.length, 0);
  });
});

test("returns an anonymous visitor to the existing login flow", async () => {
  await withPage(null, undefined, async (page) => {
    await page.goto(`${origin}/admin/users/`);
    await page.waitForURL((url) => url.pathname === "/login/" && url.searchParams.get("next") === "/admin/users/");
  });
});

test("shows dashboard counts and content navigation, and protects Users from Admin", async () => {
  await withPage("Admin", ({ path }) => {
    if (path === "dashboard") return [200, { publishedPassages: 23, draftPassages: 7, totalLessons: 18, totalUsers: 128 }];
    if (path === "passages") return pageResult();
  }, async (page, _writes, reads) => {
    await page.goto(`${origin}/dashboard/`);
    await page.getByRole("link", { name: "Admin Panel" }).click();
    await heading(page, "Admin home");
    await page.getByText("23", { exact: true }).waitFor();
    if (process.env.BANDUP_TEST_SCREENSHOTS) await page.screenshot({ path: `${process.env.BANDUP_TEST_SCREENSHOTS}/admin-home.png` });
    assert.equal(await page.getByRole("link", { name: "Manage users" }).count(), 0);
    await page.getByRole("link", { name: "Review draft passages" }).click();
    await heading(page, "No passages found");
    assert.equal(reads.find((call) => call.path === "passages")?.params.get("status"), "Draft");
    await page.goto(`${origin}/admin/users/`);
    await heading(page, "403 · Access denied");
    assert.equal(reads.some((call) => call.path === "users"), false);
  });
});

test("requires an account role, creates it, changes its role, and deactivates it", async () => {
  const account = { id, displayName: "Teacher", email: "teacher@example.test", role: "User", isActive: true, createdAt: date, creditBalance: 3 };
  await withPage("SuperAdmin", ({ path, method }, writes) => {
    if (path === "users" && method === "GET") {
      const roleWrite = writes.findLast((call) => call.method === "PATCH");
      return pageResult(writes.some((call) => call.method === "DELETE") ? [] : [{ ...account, role: roleWrite?.data.role ?? account.role }]);
    }
    if (path === "users" && method === "POST") return [201, { id }];
    if (path.startsWith(`users/${id}`)) return [204];
  }, async (page, writes) => {
    await page.goto(`${origin}/admin/users/`);
    await heading(page, "Users");
    await page.getByRole("button", { name: "New user" }).click();
    await page.getByLabel("Display name").fill("Teacher");
    await page.getByLabel("Email address").fill("teacher@example.test");
    await page.getByLabel("Password", { exact: true }).fill("OnlyLetters");
    await page.getByLabel("Role", { exact: true }).selectOption("Admin");
    await page.getByRole("button", { name: "Create account" }).click();
    assert.equal(await page.getByLabel("Password", { exact: true }).evaluate((node) => node.validity.patternMismatch), true);
    assert.equal(writes.length, 0);
    await page.getByLabel("Password", { exact: true }).fill("TeacherPassword123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.deepEqual(writes[0], { path: "users", method: "POST", data: { role: "Admin", displayName: "Teacher", email: "teacher@example.test", password: "TeacherPassword123" }, csrf: "bandup" });
    await page.getByRole("button", { name: "Change role" }).click();
    await page.getByLabel("Role", { exact: true }).selectOption("SuperAdmin");
    await page.getByRole("button", { name: "Confirm role change" }).click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.deepEqual(writes[1].data, { role: "SuperAdmin" });
    await page.getByRole("button", { name: "Deactivate", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Deactivate" }).click();
    await heading(page, "No active accounts found");
    assert.deepEqual(writes[2], { path: `users/${id}`, method: "DELETE", data: {}, csrf: "bandup" });
  });
});

test("shows loading, an API error and a successful retry", async () => {
  let load = 0;
  await withPage("Admin", async ({ path }) => {
    if (path === "lessons") {
      load += 1;
      if (load > 1) return pageResult();
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [500, { title: "Test failure" }];
    }
  }, async (page) => {
    await page.goto(`${origin}/admin/lessons/`);
    await page.getByRole("status").getByText("Loading lessons…").waitFor();
    await page.getByRole("alert").getByText("The server could not complete the request. Try again.").waitFor();
    await page.getByRole("button", { name: "Try again" }).click();
    await heading(page, "No lessons found");
  });
});

test("saves both lesson mappings and keeps the mobile navigation usable", async () => {
  const rows = [
    { questionType: "TrueFalseNotGiven", selectedLesson: null, options: [{ id, title: "Evidence basics" }], isEnabled: false },
    { questionType: "SentenceCompletion", selectedLesson: null, options: [], isEnabled: false },
  ];
  await withPage("SuperAdmin", ({ path, method }, writes) => {
    if (path !== "lesson-mappings") return;
    if (method === "PUT") return [204];
    return [200, rows.map((row) => writes.length && row.options.length ?
      { ...row, selectedLesson: { ...row.options[0], status: "Published" }, isEnabled: true } : row)];
  }, async (page, writes) => {
    await page.goto(`${origin}/admin/mapping/`);
    await heading(page, "Lesson mapping");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.getByRole("button", { name: "Open admin navigation" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Users" }).waitFor();
    await page.keyboard.press("Escape");
    await page.getByLabel("Default suggested lesson").first().selectOption(id);
    await page.getByRole("button", { name: "Save lesson mappings" }).click();
    await page.getByText("Mapping enabled", { exact: true }).waitFor();
    if (process.env.BANDUP_TEST_SCREENSHOTS) await page.screenshot({ path: `${process.env.BANDUP_TEST_SCREENSHOTS}/admin-mapping-mobile.png`, fullPage: true });
    assert.deepEqual(writes[0].data, { mappings: [
      { questionType: "TrueFalseNotGiven", lessonId: id }, { questionType: "SentenceCompletion", lessonId: null },
    ] });
  }, { viewport: { width: 390, height: 844 }, colorScheme: "dark", isMobile: true, hasTouch: true });
});

test("blocks passage publishing until review, then sends the confirmation", async () => {
  const questionId = "019aef00-0000-7000-8000-000000000003";
  const passage = {
    id, title: "Original passage", body: "A passage with evidence.", sourceNote: "BandUp", usageBasis: "Original content",
    status: "Draft", version: 1, updatedAt: date, wordCount: 4, isReadOnly: false, canCreateRevision: false,
    questions: [{ id: questionId, type: "TrueFalseNotGiven", prompt: "A saved claim", sortOrder: 1, explanation: "It is in the text.",
      evidenceSentence: "A passage with evidence.", unspecifiedPart: null, misleadingSentence: null,
      answerKey: { correctAnswer: "True", acceptedVariants: [], verifiedAt: null, isVerified: false } }],
    publishReadiness: { isReady: false, errors: { [`questions.${questionId}.answerKey.isVerified`]: ["Check the saved answer before publication."] } },
  };
  await withPage("Admin", ({ path, method }, writes) => {
    if (method === "POST") return [204];
    if (path !== `passages/${id}`) return;
    const verified = writes.some((call) => call.path.endsWith("/verify"));
    const published = writes.some((call) => call.path.endsWith("/publish"));
    return [200, { ...passage, status: published ? "Published" : "Draft", isReadOnly: published, canCreateRevision: published,
      questions: passage.questions.map((question) => ({ ...question, answerKey: { ...question.answerKey, isVerified: verified, verifiedAt: verified ? date : null } })),
      publishReadiness: verified ? { isReady: true, errors: {} } : passage.publishReadiness }];
  }, async (page, writes) => {
    await page.goto(`${origin}/admin/passages/${id}/`);
    await heading(page, "Original passage");
    const publish = page.getByRole("button", { name: "Publish passage", exact: true });
    assert.equal(await publish.isDisabled(), true);
    await page.getByText("Check the saved answer before publication.").waitFor();
    await page.getByLabel("I checked the saved answer and explanation.").click();
    await page.getByText("Ready to publish.", { exact: true }).waitFor();
    assert.equal(await publish.isDisabled(), true);
    await page.getByLabel("I have reviewed the original text and every answer.").check();
    await publish.click();
    await page.getByRole("dialog").getByRole("button", { name: "Publish passage" }).click();
    await page.getByRole("button", { name: "Duplicate as draft" }).waitFor();
    assert.deepEqual(writes[1], { path: `passages/${id}/publish`, method: "POST", data: { reviewConfirmed: true }, csrf: "bandup" });
  });
});

test("uses the writing prompt fields and opens a new draft after create", async () => {
  const details = { id, taskNumber: 2, status: "Draft", isReadOnly: false, updatedAt: date, publishedAt: null };
  await withPage("Admin", ({ path, method }, writes) => {
    if (path === "writing-prompts" && method === "POST") return [201, { id }];
    if (path === `writing-prompts/${id}`) return [200, { ...writes[0].data, ...details }];
  }, async (page, writes) => {
    await page.goto(`${origin}/admin/prompts/new/`);
    await heading(page, "New writing prompt");
    await page.getByLabel("Title", { exact: true }).fill("Remote work");
    await page.getByLabel("Task text", { exact: true }).fill("Discuss whether remote work improves productivity.");
    await page.getByLabel("Minimum words").fill("400");
    await page.getByRole("button", { name: "Create draft" }).click();
    assert.equal(writes.length, 0);
    await page.getByLabel("Maximum words").fill("450");
    await page.getByRole("button", { name: "Create draft" }).click();
    await heading(page, "Remote work");
    assert.deepEqual(writes[0].data, {
      title: "Remote work", taskText: "Discuss whether remote work improves productivity.", essayType: "Opinion essay", minWords: 400, maxWords: 450,
    });
  });
});

test("adds a lesson example and enables publishing using server readiness", async () => {
  const exampleId = "019aef00-0000-7000-8000-000000000003";
  await withPage("Admin", ({ path, method }, writes) => {
    if (path === `lessons/${id}/examples` && method === "POST") return [201, { id: exampleId }];
    if (path !== `lessons/${id}`) return;
    const examples = writes.length ? [{ ...writes[0].data, id: exampleId }] : [];
    return [200, {
      id, title: "Evidence basics", body: "Compare claims with the passage.", status: "Draft", questionType: "SentenceCompletion",
      sortOrder: 1, isReadOnly: false, canChangeQuestionType: true, hasPractice: !!examples.length, exampleCount: examples.length, examples,
      publishReadiness: { isReady: !!examples.length, errors: examples.length ? {} : { examples: ["Add an example before publishing."] } },
    }];
  }, async (page, writes) => {
    await page.goto(`${origin}/admin/lessons/${id}/`);
    await heading(page, "Evidence basics");
    const publish = page.getByRole("button", { name: "Publish lesson" });
    assert.equal(await publish.isDisabled(), true);
    await page.getByRole("button", { name: "Add example" }).click();
    await page.getByLabel("Evidence sentence", { exact: true }).fill("Birds nest on tall buildings.");
    await page.getByLabel("Paraphrase", { exact: true }).fill("Some birds nest high above street level.");
    await page.getByRole("button", { name: "Save example" }).click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(await publish.isEnabled(), true);
    assert.deepEqual(writes[0].data, { evidenceSentence: "Birds nest on tall buildings.", paraphrase: "Some birds nest high above street level.", sortOrder: 1 });
  });
});
