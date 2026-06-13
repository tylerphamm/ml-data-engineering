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
  GitBranch,
  HardDrive,
  Inbox,
  Layers,
  Lightbulb,
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
  Tag,
  Target,
  Terminal,
  TriangleAlert,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

import { getSlideIndexForKey, slides } from "./deck.js";
import "./styles.css";

const pad = (n) => String(n).padStart(2, "0");

const iconMap = {
  "Tạo pool": Layers,
  "Giao việc": Send,
  "Chia việc": Split,
  "Chờ I/O": Clock,
  "Chạy song song": Columns3,
  "Gom kết quả": CheckCircle2,
  "Event loop": RefreshCw,
  "async def": Terminal,
  await: Clock,
  gather: Layers,
  "Cú pháp": Terminal,
  Producer: Send,
  Broker: Server,
  Queue: ListOrdered,
  Consumer: Inbox,
  Process: Boxes,
  Thread: Activity,
  Concurrency: RefreshCw,
  Parallelism: Columns3,
  GIL: Lock,
  ThreadPoolExecutor: Layers,
  ProcessPoolExecutor: Cpu,
  "Khi nào dùng": CheckCircle2,
  "Race condition": TriangleAlert,
  "Giới hạn": Lock,
  "Chi phí": Gauge,
  "Lưu ý": TriangleAlert,
  "Cạm bẫy": TriangleAlert,
  "Hệ sinh thái": Network,
  "Exchange": ArrowLeftRight,
  Routing: Network,
  Ack: BadgeCheck,
  Topic: MessagesSquare,
  Partition: Columns3,
  Offset: Bookmark,
  Tách: Split,
  "Chịu tải": Gauge,
  "Chịu được": Gauge,
  "Tin cậy": ShieldCheck,
  "Không mất": ShieldCheck,
  "Mở rộng": Maximize2,
  "Định tuyến": Network,
  "Phản hồi": Zap,
  "Dòng sự kiện": Activity,
  "Nhiều nơi": Users,
  "Nhiều nhóm": Users,
  "Đọc lại": RefreshCw,
  Throughput: Gauge,
  "Mỗi việc": CheckCircle2,
  "Dùng khi": CheckCircle2,
  Scale: Maximize2,
  "I/O": HardDrive,
  CPU: Cpu,
  "Mục tiêu": CheckCircle2,
  "Cách học": FileText,
  "Nhận biết": Search,
  "Ví dụ": FileText,
  Chọn: Filter,
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

function Subtitle({ text }) {
  if (!text) return null;
  return <p className="subtitle">{text}</p>;
}

function BrandLogo({ logo }) {
  if (!logo) return null;
  return (
    <img className="titleLogo" src={`${import.meta.env.BASE_URL}logos/${logo}.svg`} alt="" aria-hidden="true" />
  );
}

function RichCards({ details }) {
  return (
    <div className="richCards" style={{ "--cols": details.length }}>
      {details.map((detail, index) => {
        const Icon = iconFor(detail.label);

        return (
          <article className="richCard" key={detail.label}>
            <span className="cardNum">{pad(index + 1)}</span>
            <Icon className="cardIcon" aria-hidden="true" />
            <strong>{detail.label}</strong>
            <p>{detail.text}</p>
            {detail.example ? (
              <div className="cardExample">
                <span>Ví dụ</span>
                <p>{detail.example}</p>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function CompactCards({ details }) {
  return (
    <div className="compactCards">
      {details.map((detail) => {
        const Icon = iconFor(detail.label);

        return (
          <article className="compactCard" key={detail.label}>
            <div className="compactHead">
              {detail.logo ? (
                <img className="detailLogo" src={`${import.meta.env.BASE_URL}logos/${detail.logo}.svg`} alt="" aria-hidden="true" />
              ) : (
                <Icon aria-hidden="true" />
              )}
              <span>{detail.label}</span>
            </div>
            <p>{detail.text}</p>
            {detail.example ? <em className="compactExample">{detail.example}</em> : null}
          </article>
        );
      })}
    </div>
  );
}

function StepsRow({ steps }) {
  return (
    <div className="stepsRow">
      {steps.map((step, index) => {
        const Icon = iconFor(step.title);

        return (
          <React.Fragment key={step.title}>
            <div className="stepCard">
              <span className="stepNum">{pad(index + 1)}</span>
              <Icon className="stepIcon" aria-hidden="true" />
              <strong>{step.title}</strong>
              <em>{step.sub}</em>
            </div>
            {index < steps.length - 1 ? <ArrowRight className="stepArrow" aria-hidden="true" /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ScenarioLine({ line }) {
  const marks = {
    bad: { Icon: XCircle, cls: "lineBad" },
    good: { Icon: CheckCircle2, cls: "lineGood" },
    plain: { Icon: ArrowRight, cls: "linePlain" },
  };
  const mark = marks[line.mark] ?? marks.plain;
  const Icon = mark.Icon;

  return (
    <div className={`scenarioLine ${mark.cls}`}>
      <Icon aria-hidden="true" />
      <span>{line.text}</span>
    </div>
  );
}

function ScenarioBox({ scenario }) {
  return (
    <div className="scenarioBox">
      <div className="scenarioTitle">
        <Target aria-hidden="true" />
        <span>{scenario.title}</span>
      </div>
      <div className="scenarioLines">
        {scenario.lines.map((line, index) => (
          <ScenarioLine key={index} line={line} />
        ))}
      </div>
      {scenario.code ? (
        <pre className="scenarioCode">
          <code>{scenario.code}</code>
        </pre>
      ) : null}
    </div>
  );
}

function Callout({ callout }) {
  const icons = { insight: Target, warning: TriangleAlert, tip: Lightbulb };
  const Icon = icons[callout.type] ?? Target;

  return (
    <div className={`callout callout-${callout.type}`}>
      <Icon aria-hidden="true" />
      <div>
        <strong>{callout.title}</strong>
        {callout.lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function DecisionTree({ decision }) {
  return (
    <div className="decisionTree">
      <div className="decisionHead">
        <GitBranch aria-hidden="true" />
        <span>Task của bạn làm gì?</span>
      </div>
      {decision.map((item) => (
        <div className="branchItem" key={item.cond}>
          <span className="branchCond">{item.cond}</span>
          <ArrowRight aria-hidden="true" />
          <strong className="branchPick">{item.pick}</strong>
        </div>
      ))}
    </div>
  );
}

function ExampleChips({ examples }) {
  return (
    <div className="exampleChips">
      <div className="chipsHead">
        <Filter aria-hidden="true" />
        <span>Ví dụ thực tế</span>
      </div>
      {examples.map((example) => (
        <div className="exampleChip" key={example}>
          {example}
        </div>
      ))}
    </div>
  );
}

function ChooseGrid({ choose }) {
  return (
    <div className="chooseGrid">
      {choose.map((column) => (
        <article className="chooseCard" key={column.title}>
          <div className="chooseHead">
            <CheckCircle2 aria-hidden="true" />
            <strong>{column.title}</strong>
          </div>
          <ul>
            {column.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function Tags({ tags }) {
  return (
    <div className="tagRow">
      {tags.map((tag) => (
        <span className="tagPill" key={tag}>
          <Tag aria-hidden="true" />
          {tag}
        </span>
      ))}
    </div>
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
            <strong>Sequential</strong>
          </div>
          <ArrowRight className="arrowIcon" />
          <div className="miniCard accent">
            <Layers />
            <strong>Concurrent</strong>
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

function CoverSlide({ slide }) {
  return (
    <section className="slide slideCover" data-tone={slide.tone}>
      <div className="coverContent">
        <h1>{slide.title}</h1>
        <p className="body">{slide.body}</p>
      </div>
      <CoverVisual />
    </section>
  );
}

function CardsSlide({ slide }) {
  return (
    <section className="slide slideCards" data-tone={slide.tone}>
      <div className="contentHead">
        <h1>{slide.title}</h1>
        <Subtitle text={slide.body} />
      </div>
      <RichCards details={slide.details} />
      {slide.callout ? <Callout callout={slide.callout} /> : null}
    </section>
  );
}

function ToolSlide({ slide }) {
  return (
    <section className="slide slideTool" data-tone={slide.tone}>
      <div className="contentHead">
        <h1>{slide.title}</h1>
        <Subtitle text={slide.body} />
      </div>
      {slide.steps ? <StepsRow steps={slide.steps} /> : null}
      <div className="toolMain">
        {slide.scenario ? <ScenarioBox scenario={slide.scenario} /> : null}
        <CompactCards details={slide.details} />
      </div>
      {slide.callout ? <Callout callout={slide.callout} /> : null}
    </section>
  );
}

function BrokerSlide({ slide }) {
  const logo = slide.details.find((detail) => detail.logo)?.logo;

  return (
    <section className="slide slideBroker" data-tone={slide.tone}>
      <div className="contentHead">
        <h1>
          {slide.title}
          <BrandLogo logo={logo} />
        </h1>
        <Subtitle text={slide.body} />
      </div>
      <div className="brokerMain">
        {slide.scenario ? <ScenarioBox scenario={slide.scenario} /> : null}
        <CompactCards details={slide.details} />
      </div>
      {slide.tags ? <Tags tags={slide.tags} /> : null}
    </section>
  );
}

function TableSlide({ slide }) {
  return (
    <section className="slide slideTable" data-tone={slide.tone}>
      <div className="tableIntro">
        <h1>{slide.title}</h1>
        <Subtitle text={slide.body} />
      </div>
      <CompareTable table={slide.table} />
      {slide.decision || slide.examples ? (
        <div className="tableExtras">
          {slide.decision ? <DecisionTree decision={slide.decision} /> : null}
          {slide.examples ? <ExampleChips examples={slide.examples} /> : null}
        </div>
      ) : null}
      {slide.callout ? <Callout callout={slide.callout} /> : null}
    </section>
  );
}

function VersusSlide({ slide }) {
  return (
    <section className="slide slideVersus" data-tone={slide.tone}>
      <div className="tableIntro">
        <h1>{slide.title}</h1>
        <Subtitle text={slide.body} />
      </div>
      <div className="versusMain">
        <CompareTable table={slide.table} />
        <ChooseGrid choose={slide.choose} />
      </div>
      {slide.callout ? <Callout callout={slide.callout} /> : null}
    </section>
  );
}

function MessageQueueDiagram() {
  return (
    <svg
      className="mqDiagram"
      viewBox="0 0 760 300"
      role="img"
      aria-label="Nhiều Producer gửi tin vào Message Queue, Consumer lấy ra xử lý"
    >
      <g stroke="#1e293b" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" fill="none" opacity="0.5">
        <path d="M168 104 H276" />
        <path d="M168 126 H276" />
        <path d="M138 214 H276" />
        <path d="M138 236 H276" />
      </g>
      <g fill="#312e81">
        <circle cx="208" cy="104" r="6" />
        <circle cx="196" cy="236" r="6" />
      </g>

      <g>
        <rect x="55" y="78" width="110" height="60" fill="#fb7185" />
        <ellipse cx="110" cy="138" rx="55" ry="14" fill="#f43f5e" />
        <ellipse cx="110" cy="78" rx="55" ry="14" fill="#fda4af" />
      </g>
      <g>
        <rect x="55" y="196" width="80" height="46" fill="#fb7185" />
        <ellipse cx="95" cy="242" rx="40" ry="11" fill="#f43f5e" />
        <ellipse cx="95" cy="196" rx="40" ry="11" fill="#fda4af" />
      </g>

      <g>
        <ellipse cx="298" cy="155" rx="20" ry="50" fill="#2dd4bf" />
        {[314, 332, 350, 368, 386, 404].map((x) => (
          <ellipse key={x} cx={x} cy="155" rx="20" ry="50" fill="#fb7185" stroke="#f43f5e" strokeWidth="1.5" />
        ))}
        <ellipse cx="424" cy="155" rx="20" ry="50" fill="#7c3aed" />
        <ellipse cx="442" cy="155" rx="20" ry="50" fill="#c4b5fd" />
        <g fill="#312e81">
          {[324, 344, 364, 384, 404].map((x) => (
            <circle key={x} cx={x} cy="120" r="6" />
          ))}
        </g>
      </g>

      <path d="M474 155 H604" stroke="#1e293b" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" fill="none" opacity="0.5" />
      <circle cx="539" cy="155" r="6" fill="#312e81" />

      <g>
        <rect x="615" y="122" width="100" height="60" fill="#a78bfa" />
        <ellipse cx="665" cy="182" rx="50" ry="13" fill="#7c3aed" />
        <ellipse cx="665" cy="122" rx="50" ry="13" fill="#c4b5fd" />
      </g>

      <g fill="#1e293b" fontWeight="700" textAnchor="middle" fontSize="18" fontFamily="Inter, sans-serif">
        <text x="105" y="290">Producers</text>
        <text x="372" y="290">Message queue</text>
        <text x="665" y="290">Consumer</text>
      </g>
    </svg>
  );
}

function ArrowDownGray({ x, y1, y2 }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2 - 8} stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
      <polygon points={`${x - 14},${y2 - 10} ${x + 14},${y2 - 10} ${x},${y2 + 4}`} fill="#cbd5e1" />
    </g>
  );
}

function RabbitMqDiagram() {
  const exchanges = [
    { cx: 320, label: "Direct", fill: "#6ee7b7", stroke: "#10b981", ink: "#065f46", mk: "rb-green" },
    { cx: 470, label: "Topic", fill: "#fda4af", stroke: "#f43f5e", ink: "#9f1239", mk: "rb-coral" },
    { cx: 615, label: "Fanout", fill: "#67e8f9", stroke: "#06b6d4", ink: "#155e75", mk: "rb-cyan" },
  ];
  const queues = [
    { cx: 320, w: 86, label: "Queue 1" },
    { cx: 430, w: 86, label: "Queue 2" },
    { cx: 505, w: 52, label: "Q3" },
    { cx: 560, w: 52, label: "Q4" },
    { cx: 618, w: 52, label: "Q5" },
    { cx: 678, w: 52, label: "Q6" },
  ];
  const routes = [
    { from: 320, to: 320, mk: "rb-green", c: "#10b981" },
    { from: 470, to: 430, mk: "rb-coral", c: "#f43f5e" },
    { from: 470, to: 505, mk: "rb-coral", c: "#f43f5e" },
    { from: 615, to: 560, mk: "rb-cyan", c: "#06b6d4" },
    { from: 615, to: 618, mk: "rb-cyan", c: "#06b6d4" },
    { from: 615, to: 678, mk: "rb-cyan", c: "#06b6d4" },
  ];
  const font = "Inter, sans-serif";

  return (
    <svg className="mqDiagram" viewBox="0 0 760 486" role="img" aria-label="RabbitMQ: Producer gửi qua Exchange (Direct, Topic, Fanout) định tuyến tới các Queue rồi tới Consumer">
      <defs>
        {["rb-green:#10b981", "rb-coral:#f43f5e", "rb-cyan:#06b6d4"].map((m) => {
          const [id, c] = m.split(":");
          return (
            <marker key={id} id={id} markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="13" refX="6" refY="6" orient="auto">
              <path d="M1 1 L12 6 L1 11 Z" fill={c} />
            </marker>
          );
        })}
      </defs>

      <text x="336" y="40" textAnchor="end" fontSize="19" fontWeight="800" fill="#334155" fontFamily={font}>PRODUCER</text>
      <rect x="352" y="16" width="60" height="40" rx="5" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
      <polyline points="354,21 382,42 410,21" fill="none" stroke="#f59e0b" strokeWidth="2" />
      <ArrowDownGray x={382} y1={58} y2={96} />

      <rect x="20" y="100" width="720" height="300" rx="18" fill="#e8eef4" stroke="#94a3b8" strokeWidth="2" />
      <text x="42" y="128" fontSize="16" fontWeight="800" fill="#475569" fontFamily={font}>BROKER</text>

      <rect x="38" y="144" width="684" height="60" rx="10" fill="#ffffff" />
      <text x="54" y="179" fontSize="12" fontWeight="800" fill="#334155" fontFamily={font}>EXCHANGE</text>
      {exchanges.map((e) => (
        <g key={e.label}>
          <rect x={e.cx - 55} y="156" width="110" height="36" rx="9" fill={e.fill} stroke={e.stroke} strokeWidth="2" />
          <text x={e.cx} y="179" textAnchor="middle" fontSize="15" fontWeight="800" fill={e.ink} fontFamily={font}>{e.label}</text>
        </g>
      ))}

      <text x="54" y="266" fontSize="12" fontWeight="800" fill="#334155" fontFamily={font}>BINDINGS</text>
      {routes.map((r, i) => (
        <line key={i} x1={r.from} y1="196" x2={r.to} y2="312" stroke={r.c} strokeWidth="5" markerEnd={`url(#${r.mk})`} />
      ))}

      <rect x="38" y="316" width="684" height="56" rx="10" fill="#ffffff" />
      <text x="54" y="350" fontSize="12" fontWeight="800" fill="#334155" fontFamily={font}>QUEUES</text>
      {queues.map((q) => (
        <g key={q.label}>
          <rect x={q.cx - q.w / 2} y="328" width={q.w} height="34" rx="8" fill="#cffafe" stroke="#0e7490" strokeWidth="2" />
          <text x={q.cx} y="350" textAnchor="middle" fontSize="13" fontWeight="800" fill="#155e75" fontFamily={font}>{q.label}</text>
        </g>
      ))}

      <text x="42" y="390" fontSize="16" fontWeight="800" fill="#ea580c" fontFamily={font}>RabbitMQ</text>
      <ArrowDownGray x={382} y1={400} y2={438} />

      <text x="336" y="464" textAnchor="end" fontSize="19" fontWeight="800" fill="#334155" fontFamily={font}>CONSUMER</text>
      <rect x="352" y="442" width="60" height="40" rx="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
      <polyline points="354,447 382,468 410,447" fill="none" stroke="#f59e0b" strokeWidth="2" />
    </svg>
  );
}

function KafkaPartition({ lx, bx, y, label, count, boxColor }) {
  const font = "Inter, sans-serif";
  return (
    <g>
      <text x={lx} y={y} fontSize="12" fontWeight="800" fill="#2c5282" fontFamily={font}>{label}</text>
      {Array.from({ length: count }, (_, i) => (
        <g key={i}>
          <rect x={bx + i * 30} y={y - 14} width="24" height="18" rx="3" fill="#ffffff" stroke={boxColor} strokeWidth="1.5" />
          <text x={bx + i * 30 + 12} y={y} textAnchor="middle" fontSize="12" fontWeight="800" fill="#2c5282" fontFamily={font}>{i}</text>
        </g>
      ))}
    </g>
  );
}

function KafkaSquares({ bx, y, fill, stroke }) {
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={bx + i * 18} y={y} width="14" height="12" rx="2" fill={fill} stroke={stroke} strokeWidth="1" />
      ))}
    </g>
  );
}

function KafkaDiagram() {
  const font = "Inter, sans-serif";
  return (
    <svg className="mqDiagram" viewBox="0 0 880 470" role="img" aria-label="Kafka: Producer ghi vào Cluster gồm các Broker với Topic chia thành Partition, Consumer đọc theo offset">
      <text x="440" y="28" textAnchor="middle" fontSize="22" fontWeight="800" fill="#2c5282" fontFamily={font}>APACHE KAFKA</text>

      <rect x="24" y="150" width="140" height="42" rx="21" fill="#ffffff" stroke="#2c5282" strokeWidth="2" />
      <text x="94" y="176" textAnchor="middle" fontSize="14" fontWeight="800" fill="#2c5282" fontFamily={font}>PRODUCER</text>
      <line x1="170" y1="171" x2="300" y2="171" stroke="#2c5282" strokeWidth="3" />
      <polygon points="300,164 314,171 300,178" fill="#2c5282" />

      <rect x="716" y="150" width="140" height="42" rx="21" fill="#ffffff" stroke="#2c5282" strokeWidth="2" />
      <text x="786" y="176" textAnchor="middle" fontSize="14" fontWeight="800" fill="#2c5282" fontFamily={font}>CONSUMER</text>
      <line x1="712" y1="171" x2="580" y2="171" stroke="#2c5282" strokeWidth="3" />
      <polygon points="580,164 566,171 580,178" fill="#2c5282" />

      <rect x="308" y="64" width="264" height="300" rx="10" fill="#eef2f7" stroke="#4a5568" strokeWidth="2" />
      <rect x="376" y="52" width="128" height="26" rx="4" fill="#ffffff" stroke="#4a5568" strokeWidth="1.5" />
      <text x="440" y="70" textAnchor="middle" fontSize="13" fontWeight="800" fill="#2c5282" fontFamily={font}>CLUSTER</text>

      <rect x="318" y="90" width="118" height="28" fill="#2d3e5f" />
      <text x="377" y="109" textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffffff" fontFamily={font}>BROKER 1</text>
      <rect x="320" y="126" width="112" height="24" rx="4" fill="#ffffff" stroke="#4a5568" strokeWidth="1.5" />
      <text x="376" y="142" textAnchor="middle" fontSize="10" fontWeight="800" fill="#2c5282" fontFamily={font}>TOPIC CLICK</text>
      <KafkaSquares bx={322} y={156} fill="#bee3f8" stroke="#4299e1" />
      <rect x="320" y="180" width="112" height="24" rx="4" fill="#ffffff" stroke="#4a5568" strokeWidth="1.5" />
      <text x="376" y="196" textAnchor="middle" fontSize="10" fontWeight="800" fill="#2c5282" fontFamily={font}>TOPIC UPLOAD</text>
      <KafkaSquares bx={322} y={210} fill="#bee3f8" stroke="#4299e1" />

      <rect x="444" y="90" width="118" height="28" fill="#fc8181" />
      <text x="503" y="109" textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffffff" fontFamily={font}>BROKER 2</text>
      <rect x="446" y="126" width="112" height="24" rx="4" fill="#ffffff" stroke="#4a5568" strokeWidth="1.5" />
      <text x="502" y="142" textAnchor="middle" fontSize="10" fontWeight="800" fill="#2c5282" fontFamily={font}>TOPIC CLICK</text>
      <KafkaSquares bx={448} y={156} fill="#fed7d7" stroke="#fc8181" />
      <rect x="446" y="180" width="112" height="24" rx="4" fill="#ffffff" stroke="#4a5568" strokeWidth="1.5" />
      <text x="502" y="196" textAnchor="middle" fontSize="10" fontWeight="800" fill="#2c5282" fontFamily={font}>TOPIC UPLOAD</text>
      <KafkaSquares bx={448} y={210} fill="#fed7d7" stroke="#fc8181" />

      <line x1="377" y1="364" x2="210" y2="384" stroke="#4299e1" strokeWidth="1.5" opacity="0.5" />
      <line x1="503" y1="364" x2="650" y2="384" stroke="#fc8181" strokeWidth="1.5" opacity="0.5" />

      <rect x="24" y="384" width="400" height="80" rx="6" fill="#bee3f8" />
      <KafkaPartition lx={38} bx={150} y={406} label="PARTITION 1" count={6} boxColor="#4299e1" />
      <KafkaPartition lx={38} bx={150} y={432} label="PARTITION 2" count={4} boxColor="#4299e1" />
      <KafkaPartition lx={38} bx={150} y={458} label="PARTITION 3" count={6} boxColor="#4299e1" />

      <rect x="456" y="384" width="400" height="80" rx="6" fill="#fed7d7" />
      <KafkaPartition lx={470} bx={582} y={406} label="PARTITION 1" count={6} boxColor="#fc8181" />
      <KafkaPartition lx={470} bx={582} y={432} label="PARTITION 2" count={4} boxColor="#fc8181" />
      <KafkaPartition lx={470} bx={582} y={458} label="PARTITION 3" count={6} boxColor="#fc8181" />
    </svg>
  );
}

function BenefitCards({ details }) {
  return (
    <div className="benefitCards" style={{ "--n": details.length }}>
      {details.map((detail) => {
        const Icon = iconFor(detail.label);

        return (
          <article className="benefitCard" key={detail.label}>
            <div className="benefitHead">
              <Icon aria-hidden="true" />
              <span>{detail.label}</span>
            </div>
            <p>{detail.text}</p>
          </article>
        );
      })}
    </div>
  );
}

function DiagramSlide({ slide }) {
  return (
    <section className="slide slideDiagram" data-tone={slide.tone}>
      <div className="contentHead">
        <h1>{slide.title}</h1>
        <Subtitle text={slide.body} />
      </div>
      <div className="diagramWrap">
        {slide.visual === "messagequeue" ? <MessageQueueDiagram /> : null}
        {slide.visual === "rabbitmq" ? <RabbitMqDiagram /> : null}
        {slide.visual === "kafka" ? <KafkaDiagram /> : null}
      </div>
      <BenefitCards details={slide.details} />
    </section>
  );
}

function ShowcaseSlide({ slide }) {
  return (
    <section className="slide slideShowcase" data-tone={slide.tone}>
      <div className="contentHead">
        <h1>{slide.title}</h1>
        <Subtitle text={slide.body} />
      </div>
      <div className="showcaseMain">
        <div className="showcaseImg">
          <img src={`${import.meta.env.BASE_URL}images/rabbitmq-vs-kafka.jpg`} alt="So sánh RabbitMQ và Kafka" />
        </div>
        <ChooseGrid choose={slide.choose} />
      </div>
    </section>
  );
}

function Slide({ slide }) {
  if (slide.layout === "cover") return <CoverSlide slide={slide} />;
  if (slide.layout === "cards") return <CardsSlide slide={slide} />;
  if (slide.layout === "tool") return <ToolSlide slide={slide} />;
  if (slide.layout === "broker") return <BrokerSlide slide={slide} />;
  if (slide.layout === "table") return <TableSlide slide={slide} />;
  if (slide.layout === "versus") return <VersusSlide slide={slide} />;
  if (slide.layout === "diagram") return <DiagramSlide slide={slide} />;
  if (slide.layout === "showcase") return <ShowcaseSlide slide={slide} />;
  return <CardsSlide slide={slide} />;
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
          <span>High-Performance Python &amp; Message Queue</span>
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
