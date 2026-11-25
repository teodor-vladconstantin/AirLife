// E-E-A-T: who signs the articles. Leave `name` empty to publish as the organisation;
// set it (and jobTitle) to publish as a named Person in the byline and in Article schema.
export const AUTHOR = {
  name: "", // e.g. "Ion Popescu"
  jobTitle: "", // e.g. "Tehnician instalator climatizare"
  url: "", // optional profile / about URL
};

export const SITE = "https://airlife.ro";
export const bylineName = () => AUTHOR.name || "Echipa AirLife";
