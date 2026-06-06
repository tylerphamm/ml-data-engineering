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
    ...(slide.commands ?? []).flatMap((command) => [command.label, command.code, command.resultLabel, command.result]),
    ...(slide.checklist ?? []),
    ...(slide.roadmap ?? []),
  ].join(" ");

test("deck is a database beginner lesson in Vietnamese", () => {
  assert.ok(slides.length >= 14);
  assert.equal(slides[0].title, "Cơ sở dữ liệu cơ bản cho người mới");

  const combined = slides.map(textOf).join(" ");
  assert.match(combined, /Cơ sở dữ liệu/);
  assert.match(combined, /người mới|buổi học/i);
  assert.match(combined, /DBMS/);
  assert.match(combined, /SQL/);
  assert.match(combined, /NoSQL/);
  assert.match(combined, /ACID/);
});

test("deck explains core relational concepts", () => {
  const combined = slides.map(textOf).join(" ");

  assert.match(combined, /Bảng/);
  assert.match(combined, /Bản ghi/);
  assert.match(combined, /Trường/);
  assert.match(combined, /Khóa chính/);
  assert.match(combined, /Khóa ngoại/);
  assert.match(combined, /Index/);
  assert.match(combined, /Schema/);
});

test("deck distinguishes database from DBMS", () => {
  const dbmsSlide = slides.find((slide) => /Database và DBMS/.test(slide.title));

  assert.ok(dbmsSlide, "deck should include a database vs DBMS slide");
  assert.match(textOf(dbmsSlide), /Database là dữ liệu/);
  assert.match(textOf(dbmsSlide), /phần mềm quản lý/);
});

test("deck covers the four NoSQL families and specialized stores", () => {
  const combined = slides.map(textOf).join(" ");

  assert.match(combined, /Document/);
  assert.match(combined, /Key-Value/);
  assert.match(combined, /Column-family/);
  assert.match(combined, /Graph/);
  assert.match(combined, /Vector/);
  assert.match(combined, /Time-series/);
  assert.match(combined, /In-memory/);
  assert.match(combined, /Search/);
});

test("deck includes basic SQL CRUD commands", () => {
  const crudSlide = slides.find((slide) => /Câu lệnh SQL/.test(slide.title));
  const combined = crudSlide.commands.map((command) => command.code).join("\n");

  assert.equal(crudSlide.layout, "command");
  assert.match(combined, /SELECT \* FROM SinhVien/);
  assert.match(combined, /INSERT INTO SinhVien/);
  assert.match(combined, /UPDATE SinhVien SET/);
  assert.match(combined, /DELETE FROM SinhVien/);
});

test("deck includes a runnable SQLite practice slide", () => {
  const sqliteSlide = slides.find((slide) => /SQLite/.test(slide.title));
  const combined = sqliteSlide.commands.map((command) => command.code).join("\n");

  assert.equal(sqliteSlide.layout, "command");
  assert.match(combined, /sqlite3 truong\.db/);
  assert.match(combined, /CREATE TABLE SinhVien/);
});

test("deck compares SQL versus NoSQL and OLTP versus OLAP", () => {
  const comparisonSlides = slides.filter((slide) => slide.layout === "comparison");
  const titles = comparisonSlides.map((slide) => slide.title);

  assert.ok(comparisonSlides.length >= 2);
  assert.ok(titles.some((title) => /SQL và NoSQL/.test(title)));
  assert.ok(titles.some((title) => /OLTP và OLAP/.test(title)));

  for (const slide of comparisonSlides) {
    assert.ok(slide.details.length >= 4, `${slide.title} needs two columns and supporting cards`);
  }
});

test("deck includes a detailed OLTP versus OLAP comparison table", () => {
  const tableSlide = slides.find((slide) => slide.layout === "table");

  assert.ok(tableSlide, "deck should include a table layout slide");
  assert.match(tableSlide.title, /OLTP và OLAP/);
  assert.deepEqual(tableSlide.table.columns, ["Tiêu chí", "OLTP", "OLAP"]);
  assert.ok(tableSlide.table.rows.length >= 6, "table should compare many criteria");

  for (const row of tableSlide.table.rows) {
    assert.equal(row.length, 3, "each row needs a criterion plus OLTP and OLAP values");
    assert.ok(row.every((cell) => cell.length > 0));
  }

  const criteria = tableSlide.table.rows.map((row) => row[0]);
  assert.ok(criteria.includes("Cách lưu trữ"));
  assert.ok(criteria.includes("Người dùng"));
  assert.ok(criteria.includes("Ví dụ hệ"));
});

test("deck explains scaling, sharding and replication", () => {
  const scaleSlide = slides.find((slide) => /Scaling/.test(slide.title));

  assert.ok(scaleSlide);
  assert.deepEqual(scaleSlide.points, ["Vertical", "Horizontal", "Sharding", "Replication"]);
});

test("deck recommends PostgreSQL as the beginner default", () => {
  const chooseSlide = slides.find((slide) => /Chọn CSDL/.test(slide.title));

  assert.ok(chooseSlide);
  assert.match(textOf(chooseSlide), /PostgreSQL/);
});

test("deck ends with a wrap-up that has a checklist and roadmap", () => {
  const closing = slides.find((slide) => slide.layout === "closing");

  assert.ok(closing);
  assert.ok(closing.checklist.length >= 3);
  assert.ok(closing.roadmap.length >= 3);
});

test("deck uses the supported visual layouts", () => {
  const layouts = new Set(slides.map((slide) => slide.layout));

  assert.ok(layouts.has("cover"));
  assert.ok(layouts.has("concept"));
  assert.ok(layouts.has("flow"));
  assert.ok(layouts.has("comparison"));
  assert.ok(layouts.has("command"));
  assert.ok(layouts.has("closing"));
});

test("cover hides duplicate eyebrow", () => {
  const main = fs.readFileSync(path.resolve("src/main.jsx"), "utf8");

  assert.equal(slides[0].hideEyebrow, true);
  assert.match(main, /hideEyebrow/);
});

test("each slide carries metadata for the database theme", () => {
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
