import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  deliverables,
  groups,
  pipelineStages,
  sections,
} from "./content.js";

test("exercise site lists all four HIT-PYTHON-2026 capstone groups", () => {
  assert.equal(groups.length, 4);
  const names = groups.map((group) => group.name);
  assert.match(names.join(" "), /Phân loại cảm xúc/);
  assert.match(names.join(" "), /biển số xe/);
  assert.match(names.join(" "), /Hand Gesture/);
  assert.match(names.join(" "), /Fashion Visual Search/);
});

test("each group exposes exactly three new features with constraints", () => {
  for (const group of groups) {
    assert.equal(group.features.length, 3, `${group.name} should declare 3 features`);
    for (const feature of group.features) {
      assert.ok(feature.title.length > 5, `${group.name} feature needs a real title`);
      assert.ok(feature.description.length > 40, `${feature.title} needs a meaningful description`);
      assert.ok(feature.constraints.length >= 3, `${feature.title} needs design constraints`);
    }
  }
});

test("hand gesture group exists and exposes three features", () => {
  const handGesture = groups.find((group) => /Hand Gesture/i.test(group.name));
  assert.ok(handGesture, "Hand Gesture group must exist");
  assert.equal(handGesture.features.length, 3);
});

test("ci/cd pipeline covers the required core stages", () => {
  const labels = pipelineStages.map((stage) => stage.stage).join("|");
  assert.equal(pipelineStages.length, 9);
  assert.ok(!/notify/i.test(labels), "Notify stage should be removed for now");
  for (const expected of [
    "Lint",
    "Unit test",
    "Build image",
    "Security scan",
    "Push registry",
    "Integration test",
    "Deploy staging",
    "Manual gate",
    "Deploy prod",
  ]) {
    assert.match(labels, new RegExp(expected, "i"));
  }
});

test("deliverables metadata is populated", () => {
  assert.ok(deliverables.length >= 3);
});

test("sidebar sections include ci/cd and every group, without cloud or submission", () => {
  const kinds = sections.map((section) => section.kind);
  assert.ok(kinds.includes("cicd"));
  assert.ok(!kinds.includes("cloud"), "cloud section should be removed");
  assert.ok(!kinds.includes("submission"), "submission section should be removed");

  const groupSections = sections.filter((section) => section.kind === "group");
  assert.equal(groupSections.length, groups.length);
  for (const section of groupSections) {
    assert.ok(groups.some((group) => group.id === section.groupId));
  }
});

test("vite config uses the GitHub Pages base for /Capstone/", () => {
  const config = fs.readFileSync(path.resolve("vite.config.js"), "utf8");
  assert.match(config, /\/ml-data-engineering\/Capstone\//);
});
