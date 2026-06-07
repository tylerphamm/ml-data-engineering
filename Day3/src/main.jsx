import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Columns3,
  Copy,
  Database,
  FileText,
  KeyRound,
  Layers,
  Maximize2,
  Network,
  Rows3,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Table,
  Terminal,
  Zap,
} from "lucide-react";

import { getSlideIndexForKey, slides } from "./deck.js";
import "./styles.css";

const iconMap = {
  ACID: ShieldCheck,
  Atomicity: ShieldCheck,
  Bảng: Table,
  "Bản ghi": Rows3,
  Cache: Zap,
  Column: Columns3,
  Consistency: ShieldCheck,
  Cấu: Columns3,
  Database,
  DBMS: Server,
  DELETE: Terminal,
  Document: FileText,
  Durability: ShieldCheck,
  Graph: Network,
  Horizontal: Maximize2,
  Index: Search,
  "In-memory": Zap,
  INSERT: Terminal,
  Isolation: ShieldCheck,
  "Key-Value": KeyRound,
  Khóa: KeyRound,
  Mở: Maximize2,
  NoSQL: Boxes,
  "Quan hệ": Network,
  Query: Search,
  Replication: Copy,
  Schema: Columns3,
  Search,
  SELECT: Terminal,
  Sharding: Layers,
  SQL: Database,
  "Time-series": Activity,
  Trường: Columns3,
  Truy: Search,
  UPDATE: Terminal,
  Vector: Sparkles,
  Vertical: Server,
  Workload: Activity,
};

function iconFor(label, fallback = Database) {
  const key = Object.keys(iconMap).find((item) => label.toLowerCase().includes(item.toLowerCase()));
  return iconMap[key] ?? fallback;
}

function Eyebrow({ slide }) {
  if (slide.hideEyebrow) return null;

  return (
    <div className="eyebrow">
      <span>{slide.section}</span>
      <span>{slide.kicker}</span>
    </div>
  );
}

function Details({ details }) {
  if (!details?.length) return null;

  return (
    <div className={`details ${details.length === 1 ? "detailsSingle" : ""}`}>
      {details.map((detail, index) => {
        const Icon = iconFor(detail.label, index % 2 === 0 ? Database : Layers);

        return (
          <article key={`${detail.label}-${index}`}>
            {detail.logo ? (
              <img className="detailLogo" src={`${import.meta.env.BASE_URL}logos/${detail.logo}.svg`} alt={detail.label} />
            ) : (
              <Icon aria-hidden="true" />
            )}
            <div>
              <span>{detail.label}</span>
              <p>{detail.text}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function CoverVisual() {
  return (
    <div className="coverVisual" aria-hidden="true">
      <div className="dbWindow">
        <div className="dbHeader">
          <span />
          <span />
          <span />
        </div>
        <div className="dbGrid">
          <div className="miniCard">
            <Table />
            <strong>Bảng</strong>
          </div>
          <ArrowRight className="arrowIcon" />
          <div className="miniCard accent">
            <Search />
            <strong>Query</strong>
          </div>
          <ArrowRight className="arrowIcon" />
          <div className="miniCard">
            <Rows3 />
            <strong>Kết quả</strong>
          </div>
        </div>
      </div>
      <div className="terminalStrip">
        <Terminal />
        <code>SELECT * FROM SinhVien;</code>
      </div>
    </div>
  );
}

function AnalogyVisual({ type }) {
  const presets = {
    library: { host: "Cơ sở dữ liệu", labels: ["Sách", "Kệ", "Mã số"] },
    store: { host: "DBMS", labels: ["Tạo", "Đọc", "Bảo vệ"] },
    table: { host: "Bảng SinhVien", labels: ["MaSV", "Ten", "Tuoi"] },
  };
  const preset = presets[type] ?? { host: "Cơ sở dữ liệu", labels: ["Data", "Schema", "Query"] };

  return (
    <div className="analogyVisual" aria-hidden="true">
      <div className="visualHost">
        <Database />
        <span>{preset.host}</span>
      </div>
      <div className="containerBox">
        {preset.labels.map((label) => {
          const Icon = iconFor(label);
          return (
            <div className="visualChip" key={label}>
              <Icon />
              <strong>{label}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FlowDiagram({ points }) {
  return (
    <div className="flowDiagram" style={{ "--cols": points.length }}>
      {points.map((point, index) => {
        const Icon = iconFor(point);
        return (
          <React.Fragment key={point}>
            <div className="flowStep">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon aria-hidden="true" />
              <strong>{point}</strong>
            </div>
            {index < points.length - 1 ? <ArrowRight className="flowArrow" aria-hidden="true" /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function CommandBlocks({ commands }) {
  return (
    <div className="commandStack">
      {commands.map((command) => (
        <article className="commandBlock" key={`${command.label}-${command.code}`}>
          <div className="commandLabel">
            <Terminal aria-hidden="true" />
            <span>{command.label}</span>
          </div>
          <pre>
            <code>{command.code}</code>
          </pre>
          <div className="expected">
            <span>{command.resultLabel ?? "Kết quả"}</span>
            <strong>{command.result}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

function Checklist({ items }) {
  return (
    <div className="checklist">
      {items.map((item) => (
        <div className="checkItem" key={item}>
          <CheckCircle2 aria-hidden="true" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function Roadmap({ items }) {
  return (
    <div className="roadmap">
      {items.map((item, index) => (
        <div className="roadmapItem" key={item}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{item}</strong>
        </div>
      ))}
    </div>
  );
}

function CoverSlide({ slide }) {
  return (
    <section className="slide slideCover" data-tone={slide.tone}>
      <div className="coverContent">
        <Eyebrow slide={slide} />
        <h1>{slide.title}</h1>
        <p className="body">{slide.body}</p>
      </div>
      <CoverVisual />
    </section>
  );
}

function ConceptSlide({ slide }) {
  return (
    <section className="slide slideConcept" data-tone={slide.tone}>
      <div className="copy">
        <Eyebrow slide={slide} />
        <h1>{slide.title}</h1>
        <p className="body">{slide.body}</p>
      </div>
      <div className="support">
        {slide.visual ? <AnalogyVisual type={slide.visual} /> : null}
        <Details details={slide.details} />
      </div>
    </section>
  );
}

function FlowSlide({ slide }) {
  return (
    <section className="slide slideFlow" data-tone={slide.tone}>
      <div className="flowHeader">
        <Eyebrow slide={slide} />
        <h1>{slide.title}</h1>
        <p className="body">{slide.body}</p>
      </div>
      <FlowDiagram points={slide.points} />
      <div className="flowFooter flowFooterWide">
        <Details details={slide.details} />
      </div>
    </section>
  );
}

function ComparisonSlide({ slide }) {
  const columns = slide.details.slice(0, 2);
  const useCases = slide.details.slice(2);

  return (
    <section className="slide slideComparison" data-tone={slide.tone}>
      <div className="comparisonIntro">
        <Eyebrow slide={slide} />
        <h1>{slide.title}</h1>
        <p className="body">{slide.body}</p>
      </div>
      <div className="comparisonGrid">
        {columns.map((item) => {
          const Icon = iconFor(item.label, Database);
          return (
            <article key={item.label}>
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
      <div className="comparisonBottom">
        <Details details={useCases} />
      </div>
    </section>
  );
}

function CommandSlide({ slide }) {
  return (
    <section className="slide slideCommand" data-tone={slide.tone}>
      <div className="commandIntro">
        <Eyebrow slide={slide} />
        <h1>{slide.title}</h1>
        {slide.body ? <p className="body">{slide.body}</p> : null}
      </div>
      <CommandBlocks commands={slide.commands} />
      <Details details={slide.details} />
    </section>
  );
}

function CompareTable({ table }) {
  return (
    <div className="compareTable" style={{ "--rows": table.rows.length + 1 }}>
      <div className="compareRow compareHead">
        {table.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {table.rows.map((row) => (
        <div className="compareRow" key={row[0]}>
          {row.map((cell, index) => (
            <span key={index}>{cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function TableSlide({ slide }) {
  return (
    <section className="slide slideTable" data-tone={slide.tone}>
      <div className="tableIntro">
        <Eyebrow slide={slide} />
        <h1>{slide.title}</h1>
        {slide.body ? <p className="body">{slide.body}</p> : null}
      </div>
      <CompareTable table={slide.table} />
    </section>
  );
}

function ClosingSlide({ slide }) {
  return (
    <section className="slide slideClosing" data-tone={slide.tone}>
      <div className="closingIntro">
        <Eyebrow slide={slide} />
        <h1>{slide.title}</h1>
        <p className="body">{slide.body}</p>
      </div>
      <div className="closingPanels">
        <div className="labCard">
          <div className="labHeader">
            <CheckCircle2 aria-hidden="true" />
            <span>Sau buổi này bạn đã biết</span>
          </div>
          <Checklist items={slide.checklist} />
        </div>
        <div className="roadmapPanel">
          <span>Roadmap học tiếp</span>
          <Roadmap items={slide.roadmap} />
        </div>
      </div>
    </section>
  );
}

function Slide({ slide }) {
  if (slide.layout === "cover") return <CoverSlide slide={slide} />;
  if (slide.layout === "flow") return <FlowSlide slide={slide} />;
  if (slide.layout === "comparison") return <ComparisonSlide slide={slide} />;
  if (slide.layout === "command") return <CommandSlide slide={slide} />;
  if (slide.layout === "table") return <TableSlide slide={slide} />;
  if (slide.layout === "closing") return <ClosingSlide slide={slide} />;
  return <ConceptSlide slide={slide} />;
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = slides[activeIndex];
  const progress = useMemo(() => ((activeIndex + 1) / slides.length) * 100, [activeIndex]);
  const isPrintMode = useMemo(() => new URLSearchParams(window.location.search).has("print"), []);

  useEffect(() => {
    document.body.classList.toggle("printMode", isPrintMode);
    return () => document.body.classList.remove("printMode");
  }, [isPrintMode]);

  useEffect(() => {
    if (isPrintMode) return undefined;

    function handleKeyDown(event) {
      const nextIndex = getSlideIndexForKey(activeIndex, event);

      if (nextIndex !== activeIndex) {
        event.preventDefault();
        setActiveIndex(nextIndex);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, isPrintMode]);

  if (isPrintMode) {
    return (
      <main className="printDeck">
        {slides.map((printSlide, index) => (
          <div className="slideCanvas printCanvas" key={`${printSlide.title}-${index}`}>
            <Slide slide={printSlide} />
          </div>
        ))}
      </main>
    );
  }

  return (
    <main className="deckShell">
      <div className="slideCanvas" key={activeIndex}>
        <div className="topBar">
          <span>Database beginner course</span>
          <span>
            {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>
        <Slide slide={slide} />
        <div className="progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
