import { NextResponse } from "next/server";

type Intent = "anti_2" | "anti_3" | "cwl_esl" | "anti_all" | "custom";

type BuildingPack = {
  core: string[];
  innerRing: string[];
  outerRing: string[];
  traps: string[];
  notes: string[];
};

function detectIntent(prompt: string): Intent {
  const p = prompt.toLowerCase();

  if (p.includes("anti all")) return "anti_all";
  if (p.includes("cwl") || p.includes("esl")) return "cwl_esl";
  if (p.includes("anti 2")) return "anti_2";
  if (p.includes("anti 3")) return "anti_3";

  return "custom";
}

function parseExtras(prompt: string) {
  const p = prompt.toLowerCase();
  const extras = {
    antiBackpack: p.includes("backpack"),
    antiThrowers: p.includes("throwers"),
    antiDukeCharge: p.includes("duke charge"),
  };
  return extras;
}

function buildPack(intent: Intent, extras: ReturnType<typeof parseExtras>): BuildingPack {
  const base: BuildingPack = {
    core: [
      "Town Hall",
      "main high-value defense cluster",
      "central compartment pressure",
      "protected core anchor",
    ],
    innerRing: [
      "split compartments",
      "offset value zones",
      "anti-funnel walls",
      "secondary DPS pockets",
    ],
    outerRing: [
      "wide trash spread",
      "broken funnel edges",
      "decoy compartments",
      "side pressure buildings",
    ],
    traps: [
      "entry lane traps",
      "core spring/bomb zones",
      "anti-charge punish traps",
      "air denial points",
    ],
    notes: [
      "TH18 only",
      "single-link output",
      "dark style layout logic",
    ],
  };

  if (intent === "anti_2") {
    base.notes.push("anti 2 star priority");
    base.innerRing.unshift("awkward pathing ring");
    base.traps.unshift("likely 2-star push lane trap");
  }

  if (intent === "anti_3") {
    base.notes.push("anti 3 star priority");
    base.core.unshift("dense core compartment");
    base.traps.unshift("hero value denial traps");
  }

  if (intent === "cwl_esl") {
    base.notes.push("CWL/ESL war-safe structure");
    base.innerRing.unshift("controlled war core");
    base.outerRing.unshift("clean anti-blimp spacing");
  }

  if (intent === "anti_all") {
    base.notes.push("general anti-meta");
    base.core.unshift("most protected value zone");
    base.outerRing.unshift("maximum funnel disruption");
  }

  if (extras.antiBackpack) {
    base.notes.push("anti backpack");
    base.outerRing.unshift("anti-blimp bait spacing");
  }

  if (extras.antiThrowers) {
    base.notes.push("anti throwers");
    base.innerRing.unshift("no straight-line value path");
  }

  if (extras.antiDukeCharge) {
    base.notes.push("anti duke charge");
    base.traps.unshift("charge-entry punish traps");
  }

  return base;
}

function buildLink(intent: Intent) {
  const links: Record<Intent, string> = {
    anti_2:
      "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAANAAAAAJmaO8s3DepTWOdFkFzWEIm",
    anti_3:
      "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAANAAAAAJmaO4sX-yrO4Ir92-fsXww",
    cwl_esl:
      "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAANAAAAAJmaPCcYccMVlu1YEiubTcj",
    anti_all:
      "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAANAAAAAJmaOvU89ydZ5C__B-ZkB-j",
    custom:
      "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AHV%3AAAAABgAAAALwFcNcVPdKe2ufTAiwo-MD",
  };

  return links[intent];
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const prompt = String(body.prompt ?? "");
  const intent = detectIntent(prompt);
  const extras = parseExtras(prompt);
  const pack = buildPack(intent, extras);

  return NextResponse.json({
    th: "TH18",
    intent,
    prompt,
    layoutMode: "generated",
    placement: pack,
    layoutLink: buildLink(intent),
  });
}
