import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Boxes,
  CheckCircle2,
  Clock,
  Columns3,
  Cpu,
  FileText,
  Filter,
  Gauge,
  HardDrive,
  Inbox,
  Layers,
  ListOrdered,
  Lock,
  Maximize2,
  MessagesSquare,
  Network,
  RefreshCw,
  Search,
  Send,
  Server,
  ShieldCheck,
  Snail,
  Split,
  Terminal,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";

import { getSlideIndexForKey, slides } from "./deck.js";
import "./styles.css";

const iconMap = {
  "Song song": Maximize2,
  "Tạo pool": Layers,
  "Consumer group": Users,
  Chạy: Zap,
  Chờ: Clock,
  Chia: Split,
  Gom: CheckCircle2,
  Nộp: Send,
  "Tiến trình": Boxes,
  Luồng: Activity,
  Thread: Activity,
  Process: Cpu,
  Concurrency: RefreshCw,
  Parallelism: Columns3,
  GIL: Lock,
  "I/O": HardDrive,
  CPU: Cpu,
  Event: RefreshCw,
  await: Clock,
  async: Terminal,
  gather: Layers,
  "Cú pháp": Terminal,
  "Khi nào": CheckCircle2,
  "Dùng khi": CheckCircle2,
  "Cái bẫy": TriangleAlert,
  "Lưu ý": TriangleAlert,
  Race: TriangleAlert,
  "Giới hạn": Lock,
  "Chi phí": Gauge,
  "Hệ quả": Gauge,
  "Hệ sinh thái": Network,
  Producer: Send,
  Broker: Server,
  Queue: ListOrdered,
  Consumer: Inbox,
  Exchange: ArrowLeftRight,
  Routing: Network,
  Ack: BadgeCheck,
  Topic: MessagesSquare,
  Partition: Columns3,
  Offset: Bookmark,
  "Tách": Split,
  "Chịu tải": Gauge,
  "Tin cậy": ShieldCheck,
  Scale: Maximize2,
  "Nhận biết": Search,
  "Ví dụ": FileText,
  "Chọn": Filter,
  "Mục tiêu": CheckCircle2,
  "Cách học": FileText,
};

function iconFor(label, fallback = Cpu) {
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
        const Icon = iconFor(detail.label, index % 2 === 0 ? Cpu : Layers);

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
            <Snail />
            <strong>Tuần tự</strong>
          </div>
          <ArrowRight className="arrowIcon" />
          <div className="miniCard accent">
            <Layers />
            <strong>Đồng thời</strong>
          </div>
          <ArrowRight className="arrowIcon" />
          <div className="miniCard">
            <Gauge />
            <strong>Throughput</strong>
          </div>
        </div>
      </div>
      <div className="terminalStrip">
        <Terminal />
        <code>asyncio.run(main())</code>
      </div>
    </div>
  );
}

function AnalogyVisual({ type }) {
  const presets = {
    gil: { icon: Lock, host: "GIL — một micro duy nhất", labels: ["Luồng A chạy", "Luồng B chờ", "Luồng C chờ"] },
    queue: { icon: Server, host: "Message Broker", labels: ["Producer", "Queue", "Consumer"] },
  };
  const preset = presets[type] ?? { icon: Cpu, host: "CPython", labels: ["Tiến trình", "Luồng", "CPU"] };
  const HostIcon = preset.icon;

  return (
    <div className="analogyVisual" aria-hidden="true">
      <div className="visualHost">
        <HostIcon />
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
          const Icon = iconFor(item.label, Cpu);
          return (
            <article key={item.label}>
              {item.logo ? (
                <img className="detailLogo" src={`${import.meta.env.BASE_URL}logos/${item.logo}.svg`} alt={item.label} />
              ) : (
                <Icon aria-hidden="true" />
              )}
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
    <div className="compareTable" style={{ "--rows": table.rows.length + 1, "--dataCols": table.columns.length - 1 }}>
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
          <span>Python hiệu năng cao &amp; Message Queue</span>
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
