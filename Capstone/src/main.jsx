import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CheckCircle2,
  Compass,
  Lock,
  PackageOpen,
  Sparkles,
  UserCircle2,
  Users,
  Workflow,
} from "lucide-react";

import {
  deliverables,
  groups,
  pipelineStages,
  sections,
} from "./content.js";
import "./styles.css";

const sectionIcons = {
  cicd: Workflow,
  group: Users,
};

function Eyebrow({ kicker, title }) {
  const [primary, secondary] = String(kicker).split(/\s+·\s+/, 2);

  return (
    <header>
      <div className="eyebrow">
        <span className="eyebrowSection">{primary}</span>
        {secondary ? (
          <>
            <span className="eyebrowDivider" aria-hidden="true" />
            <span className="eyebrowKicker">{secondary}</span>
          </>
        ) : null}
      </div>
      <h2>{title}</h2>
    </header>
  );
}

function CiCd() {
  return (
    <section className="block" id="ci-cd">
      <Eyebrow kicker="CI/CD · Pipeline" title="CI/CD pipeline" />
      <p className="lead">
        Pipeline được trigger trên mỗi <code>push</code> vào branch <code>main</code> của repo nhóm. Chọn GitHub Actions hoặc Jenkins
        — chọn 1 và bảo vệ được lựa chọn.
      </p>
      <div className="tableWrap">
        <table className="pipelineTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Stage</th>
              <th>Yêu cầu</th>
              <th>CI/CD failed khi</th>
            </tr>
          </thead>
          <tbody>
            {pipelineStages.map((row, index) => {
              const previousPhase = index > 0 ? pipelineStages[index - 1].phase : null;
              const isPhaseStart = row.phase !== previousPhase;
              const lines = Array.isArray(row.requirement) ? row.requirement : [row.requirement];
              return (
                <tr key={row.stage} className={isPhaseStart ? "phaseStart" : undefined}>
                  <td className="stepCell">{String(index + 1).padStart(2, "0")}</td>
                  <td>
                    <div className="stageCell">
                      <span className="stageName">{row.stage}</span>
                      {isPhaseStart ? <span className="phaseTag">{row.phase}</span> : null}
                    </div>
                  </td>
                  <td>
                    {lines.length === 1 ? (
                      lines[0]
                    ) : (
                      <ul className="requirementList">
                        {lines.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>{row.failFast}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h3 className="subHeading">
        <PackageOpen aria-hidden="true" />
        Yêu cầu đầu ra
      </h3>
      <ul className="checkList">
        {deliverables.map((item) => (
          <li key={item}>
            <CheckCircle2 aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function GroupBlock({ group }) {
  const assignees = group.assignees ?? [];
  return (
    <section className="block groupBlock" id={group.id} data-tone={group.tone}>
      <Eyebrow kicker={`Đề tài · Nhóm ${group.number}`} title={group.name} />
      <p className="lead">
        <strong>Bối cảnh:</strong> {group.summary}
      </p>
      <div className="assigneeRow">
        <span className="assigneeLabel">
          <UserCircle2 aria-hidden="true" />
          Người được phân công
        </span>
        {assignees.length > 0 ? (
          <ul className="assigneeList">
            {assignees.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        ) : (
          <span className="assigneePlaceholder">— chưa phân công</span>
        )}
      </div>
      <nav className="featureNav" aria-label={`3 tính năng của ${group.name}`}>
        {group.features.map((feature, index) => (
          <a key={feature.title} href={`#${group.id}-f${index + 1}`}>
            <span className="featureNavIndex">{index + 1}</span>
            <span className="featureNavTitle">{feature.title}</span>
          </a>
        ))}
      </nav>
      <div className="featureStack">
        {group.features.map((feature, index) => (
          <article className="featureCard" id={`${group.id}-f${index + 1}`} key={feature.title}>
            <div className="featureHeader">
              <span className="featureIndex">Tính năng {index + 1}</span>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <div className="constraintHeading">
              <Lock aria-hidden="true" />
              <span>Ràng buộc bắt buộc thiết kế</span>
            </div>
            <ul className="constraintList">
              {feature.constraints.map((constraint) => (
                <li key={constraint}>{constraint}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderSection(section) {
  if (section.kind === "cicd") return <CiCd key={section.id} />;
  if (section.kind === "group") {
    const group = groups.find((item) => item.id === section.groupId);
    return group ? <GroupBlock key={group.id} group={group} /> : null;
  }
  return null;
}

function Sidebar({ activeId, onSelect }) {
  return (
    <nav className="sidebar" aria-label="Mục lục bài tập">
      <div className="brand">
        <Sparkles aria-hidden="true" />
        <div>
          <strong>CI/CD &amp; Docker</strong>
          <span>Assignment</span>
        </div>
      </div>
      <ul>
        {sections.map((section) => {
          const Icon = sectionIcons[section.kind] ?? Compass;
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={isActive ? "active" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  onSelect(section.id);
                }}
              >
                <Icon aria-hidden="true" />
                <span>{section.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function App() {
  const initial = useMemo(() => {
    if (typeof window === "undefined") return sections[0].id;
    const hash = window.location.hash.replace("#", "");
    return sections.some((section) => section.id === hash) ? hash : sections[0].id;
  }, []);
  const [activeId, setActiveId] = useState(initial);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.25, 0.5, 0.75] },
    );

    sections.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const handleSelect = (id) => {
    setActiveId(id);
    if (typeof window === "undefined") return;
    const node = document.getElementById(id);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <div className="appShell">
      <Sidebar activeId={activeId} onSelect={handleSelect} />
      <main className="content">
        <header className="pageHeader">
          <h1>CI/CD and Docker Assignment</h1>
        </header>
        {sections.map((section) => renderSection(section))}
        <footer className="pageFooter">
          <span>CI/CD and Docker Assignment</span>
        </footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
