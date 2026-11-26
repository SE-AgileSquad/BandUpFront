import assert from "node:assert/strict";
import { test } from "node:test";
import { canAccessAdmin } from "../src/lib/admin-access.ts";

test("administration uses the three backend roles and fails closed for unknown roles", () => {
  for (const role of [undefined, null, "", "User", "student", "admin"]) {
    assert.equal(canAccessAdmin(role), false);
    assert.equal(canAccessAdmin(role, true), false);
  }
  assert.equal(canAccessAdmin("Admin"), true);
  assert.equal(canAccessAdmin("Admin", true), false);
  assert.equal(canAccessAdmin("SuperAdmin"), true);
  assert.equal(canAccessAdmin("SuperAdmin", true), true);
});
