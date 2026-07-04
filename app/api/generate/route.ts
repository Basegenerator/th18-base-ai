import { NextResponse } from "next/server";

type Intent = "anti_2" | "anti_3" | "cwl_esl" | "anti_all" | "custom";

type PlacementPlan = {
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
  return {
    antiBackpack: p.includes("backpack"),
    antiThrowers: p.includes("throwers"),
    antiDukeCharge: p.includes("duke charge"),
  };
}

function makePlan(intent: Intent, extras: ReturnType<typeof parseExtras>): PlacementPlan {
  const plan: PlacementPlan = {
    core: [
      "Town Hall in a protected central area",
      "main heavy DPS around the core",
      "one offset compartment to break symmetry",
    ],
    innerRing: [
      "multiple compartments around the core",
      "no straight line into the middle",
      "split support defenses",
    ],
    outerRing: [
      "wide funnel breakers",
      "trash buildings spread out",
      "bait structures on the flanks",
    ],
    traps: [
      "first entry lane traps",
      "core punisher traps",
      "hidden pressure near obvious approach paths",
    ],
    notes: [
      "TH18 only",
      "black minimal layout logic",
      "single output link",
    ],
  };

  if (intent === "anti_2") {
    plan.notes.push("anti 2 star focus");
    plan.core.unshift("slightly offset Town Hall");
    plan.traps.unshift("2-star lane denial");
  }

  if (intent === "anti_3") {
    plan.notes.push("anti 3 star focus");
    plan.core.unshift("dense core with layered protection");
    plan.innerRing.unshift("extra compartment before core");
  }

  if (intent === "cwl_esl") {
    plan.notes.push("CWL / ESL war mode");
    plan.innerRing.unshift("war-safe compartments");
    plan.outerRing.unshift("anti-funnel spacing");
  }

  if (intent === "anti_all") {
    plan.notes.push("anti-meta general defense");
    plan.outerRing.unshift("maximum side pressure");
    plan.traps.unshift("balanced trap spread");
  }

  if (extras.antiBackpack) {
    plan.notes.push("anti backpack");
    plan.outerRing.unshift("anti-blimp bait ring");
  }

  if (extras.antiThrowers) {
    plan.notes.push("anti throwers");
    plan.innerRing.unshift("no clean throw line");
  }

  if (extras.antiDukeCharge) {
    plan.notes.push("anti duke charge");
    plan.traps.unshift("charge punish traps");
  }

  return plan;
}

function buildPromptLabel(intent: Intent, extras: ReturnType<typeof parseExtras>) {
  const labels = [intent.replace("_", " ")];
  if (extras.antiBackpack) labels.push("anti backpack");
  if (extras.antiThrowers) labels.push("anti throwers");
  if (extras.antiDukeCharge) labels.push("anti duke charge");
  return labels.join(" | ");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const prompt = String(body.prompt ?? "");
  const intent = detectIntent(prompt);
  const extras = parseExtras(prompt);
  const placement = makePlan(intent, extras);

  return NextResponse.json({
    th: "TH18",
    intent,
    label: buildPromptLabel(intent, extras),
    layoutMode: "generated",
    placement,
    layoutLink: "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAANAAAAAJmaPCcYccMVlu1YEiubTcj",
  });
}
