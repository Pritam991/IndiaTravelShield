import { arrivalsMeta, DATASET_URL } from "@/lib/arrivals";
import { tourism } from "@/lib/tourism";

// Attribution required by the Government Open Data License - India (GODL):
// provider, source, licence and the dataset URL. It also states the
// non-endorsement and no-warranty terms in plain words.
export default function DataAttribution() {
  const sources = [
    { title: arrivalsMeta.title, url: DATASET_URL },
    ...Object.values(tourism.meta.sources).map((s) => ({ title: s.title, url: s.url })),
  ];
  return (
    <div className="attrib">
      <h3>Data attribution</h3>
      <ul>
        {sources.map((s) => (
          <li key={s.url}>
            Ministry of Tourism, Government of India, <em>{s.title}</em>, Open Government Data
            (OGD) Platform India,{" "}
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.url}
            </a>
            . Published under the{" "}
            <a
              href="https://data.gov.in/government-open-data-license-india"
              target="_blank"
              rel="noopener noreferrer"
            >
              Government Open Data License - India
            </a>
            .
          </li>
        ))}
      </ul>
      <p className="small">
        Fetched {tourism.meta.fetchedOn}. We reshaped the tables (removed subtotal rows, ranked and
        rounded the figures) and added our own comments. The data provider does not endorse
        IndiaTravelShield or this use of its data, and is not responsible for any errors in it or
        in our changes to it.
      </p>
    </div>
  );
}
