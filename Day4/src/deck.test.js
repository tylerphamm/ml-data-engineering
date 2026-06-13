import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  clampSlideIndex,
  getNextSlideIndex,
  getPreviousSlideIndex,
  getSlideIndexForKey,
  slides,
} from "./deck.js";

const textOf = (slide) =>
  [
    slide.section,
    slide.kicker,
    slide.title,
    slide.body,
    slide.keyMessage,
    ...(slide.points ?? []),
    ...(slide.details ?? []).flatMap((detail) => [detail.label, detail.text]),
    ...(slide.table?.columns ?? []),
    ...(slide.table?.rows ?? []).flat(),
    ...(slide.commands ?? []).flatMap((command) => [command.label, command.code, command.resultLabel, command.result]),
    ...(slide.checklist ?? []),
    ...(slide.roadmap ?? []),
  ].join(" ");

test("deck is a high performance Python lesson in Vietnamese", () => {
  assert.ok(slides.length >= 10);
  assert.equal(slides[0].title, "High-Performance Python");

  const combined = slides.map(textOf).join(" ");
  assert.match(combined, /Python/);
  assert.match(combined, /GIL/);
  assert.match(combined, /[Pp]rocess/);
  assert.match(combined, /[Tt]hread/);
  assert.match(combined, /Message [Qq]ueue/);
});

test("deck explains the GIL and the wait-versus-compute distinction in plain words", () => {
  const combined = slides.map(textOf).join(" ");

  assert.match(combined, /GIL/);
  assert.match(combined, /[Tt]hread/);
  assert.match(combined, /phải chờ/i);
  assert.match(combined, /tính toán nặng/i);
});

test("deck covers the three concurrency tools in plain language", () => {
  const combined = slides.map(textOf).join(" ");

  assert.match(combined, /Multithreading/i);
  assert.match(combined, /Multiprocessing/i);
  assert.match(combined, /Asyncio/i);
  assert.match(combined, /[Tt]hread/);
  assert.match(combined, /[Pp]rocess/);
  assert.match(combined, /điều phối/i);
});

test("deck teaches message queues with RabbitMQ and Kafka in plain language", () => {
  const combined = slides.map(textOf).join(" ");

  assert.match(combined, /Message [Qq]ueue/);
  assert.match(combined, /[Hh]àng đợi/);
  assert.match(combined, /Producer/);
  assert.match(combined, /Consumer/);
  assert.match(combined, /RabbitMQ/);
  assert.match(combined, /Exchange/i);
  assert.match(combined, /Kafka/);
  assert.match(combined, /[Tt]opic/);
  assert.match(combined, /[Pp]artition/);
  assert.match(combined, /[Oo]ffset/);
});

test("deck compares RabbitMQ versus Kafka", () => {
  const tableSlide = slides.find((slide) => /^RabbitMQ vs Kafka$/.test(slide.title));

  assert.ok(tableSlide, "deck should include a RabbitMQ vs Kafka table slide");
  assert.ok(tableSlide.table.columns.some((c) => c.includes("RabbitMQ")));
  assert.ok(tableSlide.table.columns.some((c) => c.includes("Kafka")));
  assert.ok(tableSlide.table.rows.length >= 6);
});

test("deck uses the supported visual layouts", () => {
  const layouts = new Set(slides.map((slide) => slide.layout));

  assert.ok(layouts.has("cover"));
  assert.ok(layouts.has("cards"));
  assert.ok(layouts.has("table"));
  assert.ok(layouts.has("diagram"));
});

test("cover hides duplicate eyebrow", () => {
  const main = fs.readFileSync(path.resolve("src/main.jsx"), "utf8");

  assert.equal(slides[0].hideEyebrow, true);
  assert.match(main, /hideEyebrow/);
});

test("each slide carries metadata for the performance theme", () => {
  for (const slide of slides) {
    assert.ok(slide.section.length > 2, `${slide.title} should define a section`);
    assert.ok(slide.kicker.length > 2, `${slide.title} should define a kicker`);
    assert.ok(slide.layout.length > 2, `${slide.title} should define a layout`);
    assert.ok(slide.tone.length > 1, `${slide.title} should define a tone`);
    assert.ok(slide.keyMessage.length > 20, `${slide.title} should define a key message`);
    assert.ok(slide.points.length >= 3 && slide.points.length <= 5, `${slide.title} should define concise points`);
  }
});

test("navigation helpers keep the slide index inside deck bounds", () => {
  assert.equal(clampSlideIndex(-10), 0);
  assert.equal(clampSlideIndex(2), 2);
  assert.equal(clampSlideIndex(999), slides.length - 1);

  assert.equal(getPreviousSlideIndex(0), 0);
  assert.equal(getPreviousSlideIndex(3), 2);
  assert.equal(getNextSlideIndex(slides.length - 1), slides.length - 1);
  assert.equal(getNextSlideIndex(3), 4);
});

test("keyboard navigation advances with Space and common presentation keys", () => {
  assert.equal(getSlideIndexForKey(2, { key: " ", code: "Space" }), 3);
  assert.equal(getSlideIndexForKey(2, { key: "Spacebar", code: "Space" }), 3);
  assert.equal(getSlideIndexForKey(2, { key: "ArrowRight", code: "ArrowRight" }), 3);
  assert.equal(getSlideIndexForKey(2, { key: "PageDown", code: "PageDown" }), 3);
  assert.equal(getSlideIndexForKey(2, { key: "ArrowLeft", code: "ArrowLeft" }), 1);
  assert.equal(getSlideIndexForKey(2, { key: "Home", code: "Home" }), 0);
  assert.equal(getSlideIndexForKey(2, { key: "End", code: "End" }), slides.length - 1);
  assert.equal(getSlideIndexForKey(2, { key: "a", code: "KeyA" }), 2);
});
