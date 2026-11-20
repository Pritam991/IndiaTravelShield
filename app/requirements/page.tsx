import type { Metadata } from "next";
import Link from "next/link";
import { req } from "@/lib/requirements";
import { national } from "@/lib/data";
import { SourceLink, SourceList } from "@/components/Ui";
import PageHeader from "@/components/PageHeader";
import Band from "@/components/Band";
import Reveal from "@/components/Reveal";
import ReqChecklist from "@/components/ReqChecklist";
import SpecialCases from "@/components/SpecialCases";

export const metadata: Metadata = {
  title: "What you need to visit India: documents, permits and registrations",
  description:
    "A checklist of the documents foreign visitors need for India, plus the special permits and registrations for places like Arunachal Pradesh, Sikkim, Ladakh and Kedarnath.",
  alternates: { canonical: "/requirements" },
};

export default function RequirementsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Requirements"
        title="What you need to visit India"
        crumbs={
          <>
            <Link href="/">Home</Link> / Requirements
          </>
        }
        lead="A checklist of the documents to carry, how the e-Visa works, and the extra permits and registrations that apply to some places, such as Arunachal Pradesh and Kedarnath."
      />

      <section className="reqnote">
        <p>
          <strong>Read this first.</strong> Rules change and depend on your
          nationality. Everything here was read on {req.readOn}. Each special
          case is labelled with how well we could check it, and none replaces
          the official source. We do not process visas or permits.
        </p>
      </section>

      <ul className="qk">
        {req.quick.map((q, i) => (
          <li key={q.id}>
            <Reveal delay={i * 70}>
              <a href={q.href} className="qk-card">
                <strong>{q.title}</strong>
                <span>{q.body}</span>
                <i>{q.cta} &rarr;</i>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>

      <Band tone="soft" id="checklist" label="Your checklist">
        <Reveal>
          <p className="eyebrow dk">Checklist</p>
          <h2>Everything to prepare, in order</h2>
          <p className="lead">
            Tick items as you go. Your ticks stay in this browser only, and you
            can print the list.
          </p>
        </Reveal>
        <ReqChecklist groups={req.checklist} />
      </Band>

      <section id="evisa" className="layer">
        <Reveal>
          <p className="eyebrow dk">Visa</p>
          <h2>The e-Visa, step by step</h2>
          <p>{req.evisa.intro}</p>
          <ol className="steps2">
            {req.evisa.steps.map((s, i) => (
              <li key={s}>
                <span>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <dl className="facts-list">
            {req.evisa.facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
          <p className="warn">{req.evisa.warning}</p>
          <p>
            <a
              className="btn"
              href={req.sources.evisa.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the official e-Visa page
            </a>{" "}
            <span className="small">
              Also see <SourceLink id="visa" /> and <SourceLink id="boi" />.
            </span>
          </p>
        </Reveal>
      </section>

      <Band tone="dark" id="special" label="Special permits and registrations">
        <Reveal>
          <p className="eyebrow">Special cases</p>
          <h2>Places that need more than a visa</h2>
          <p className="lead on-dark-text">
            Some areas need a permit for foreign nationals, and some pilgrimages
            need you to register before you travel. Each card says how well we
            could check it.
          </p>
        </Reveal>
        <div className="sc-wrap">
          <SpecialCases cases={req.special} />
        </div>
      </Band>

      <section className="layer">
        <Reveal>
          <h2>After you arrive</h2>
          <ul className="after">
            {req.after.map((a) => (
              <li key={a.title}>
                <strong>{a.title}</strong>
                <p>{a.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="layer">
        <Reveal>
          <h2>Read your own government&apos;s advice</h2>
          <SourceList ids={national.advisorySources} />
          <p className="small">
            Immigration: <SourceLink id="boi" />. Restricted areas:{" "}
            <SourceLink id="mha" />.
          </p>
        </Reveal>
      </section>
    </>
  );
}
