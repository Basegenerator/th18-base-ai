import { NextResponse } from "next/server";

type BasePlan = {
  baseType: string;
  style: string;
  placement: {
    core: string;
    innerRing: string;
    outerRing: string;
    traps: string;
    note: string;
  };
};

function normalizePrompt(prompt: string) {
  return prompt.toLowerCase().trim();
}

function detectIntent(prompt: string) {
  const p = normalizePrompt(prompt);

  if (p.includes("anti all")) return "anti_all";
  if (p.includes("cwl") || p.includes("esl")) return "cwl_esl";
  if (p.includes("anti 2")) return "anti_2";
  if (p.includes("anti 3")) return "anti_3";
  if (p.includes("anti duke charge") || p.includes("duke charge")) return "anti_duke_charge";
  if (p.includes("anti backpack") || p.includes("backpack")) return "anti_backpack";
  if (p.includes("anti throwers") || p.includes("throwers")) return "anti_throwers";

  return "default";
}

function buildPlan(intent: string): BasePlan {
  switch (intent) {
    case "anti_all":
      return {
        baseType: "ANTI ALL",
        style: "Balanced TH18 anti-meta base with strong anti-2 and anti-3 pressure.",
        placement: {
          core: "Town Hall, strongest splash value, and high-priority defense cluster in the center.",
          innerRing: "Defenses split into uneven compartments around the core to kill clean pathing.",
          outerRing: "Trash buildings and side defenses spread wide to destroy funnels.",
          traps: "Core traps on likely smash lanes, with spring and bomb value on outer entries.",
          note: "Best for a general defense base when you do not know the opponent's attack plan.",
        },
      };

    case "cwl_esl":
      return {
        baseType: "CWL / ESL BASE",
        style: "Competitive war base with stable core and trap-heavy pressure.",
        placement: {
          core: "Town Hall slightly protected, with core defenses packed but not too symmetrical.",
          innerRing: "Two strong compartments around the core to force bad spell and hero value.",
          outerRing: "Spread key defenses so one blimp or smash does not gain too much value.",
          traps: "Heavy anti-entry traps on the most natural approach lanes.",
          note: "Use this when you want consistency against skilled war attackers.",
        },
      };

    case "anti_2":
      return {
        baseType: "ANTI 2",
        style: "TH18 war base designed to stop safe two-stars.",
        placement: {
          core: "Town Hall offset from perfect center but still protected by layers.",
          innerRing: "Key defenses arranged so attackers must choose between bad pathing or bad spell value.",
          outerRing: "Outer compartments should be uneven to break funneling.",
          traps: "Place seeking and giant-bomb value near the likely final push route.",
          note: "Use this when your main goal is to prevent easy 2-stars.",
        },
      };

    case "anti_3":
      return {
        baseType: "ANTI 3",
        style: "Anti-3-star TH18 war base with protected core and awkward entry lanes.",
        placement: {
          core: "Town Hall, monolith-style value, and main DPS in a protected center.",
          innerRing: "Compartment walls should create multiple turns before the core is reached.",
          outerRing: "Do not allow a straight funnel into the main value.",
          traps: "Hide damage traps where hero pathing looks most obvious.",
          note: "Best when you want to punish overcommitted pushes and hero charges.",
        },
      };

    case "anti_duke_charge":
      return {
        baseType: "ANTI DUKE CHARGE",
        style: "Designed to punish hero-charge entries and slow progress.",
        placement: {
          core: "Core should be awkward to reach directly, with the Town Hall not exposed.",
          innerRing: "Put key defenses behind layers so a charge cannot pick them off efficiently.",
          outerRing: "Keep entry buildings spread so the charge cannot cleanly funnel.",
          traps: "Use trap stacks in the first and second likely entry lanes.",
          note: "Best if the attacker relies on one clean hero lane.",
        },
      };

    case "anti_backpack":
      return {
        baseType: "ANTI BACKPACK",
        style: "Anti-blimp / anti-backpack base with bait and value denial.",
        placement: {
          core: "Do not stack all important value on one obvious blimp target.",
          innerRing: "Split high-value defenses across separate compartments.",
          outerRing: "Use decoy structures to pull the attacker off the real value.",
          traps: "Place air traps and damage traps where the blimp is most likely to land.",
          note: "Good when the opponent likes airborne value delivery.",
        },
      };

    case "anti_throwers":
      return {
        baseType: "ANTI THROWERS",
        style: "Anti-thrower base with spread value and no easy long-range payoff.",
        placement: {
          core: "Core should be protected, but not in a simple square pattern.",
          innerRing: "Spread key buildings so one throw line does not reach everything.",
          outerRing: "Avoid lining up buildings in obvious straight value paths.",
          traps: "Use traps on likely long-range approach angles and landing spots.",
          note: "Strong against current meta armies that want easy target clusters.",
        },
      };

    default:
      return {
        baseType: "TH18 DEFAULT",
        style: "Balanced TH18 anti-meta layout for general defense.",
        placement: {
          core: "Town Hall and main DPS in a secure central zone.",
          innerRing: "Uneven inner compartments to prevent clean pathing.",
          outerRing: "Wide outer ring with spread buildings for anti-funnel.",
          traps: "Traps on the most likely first entry lane.",
          note: "Use this when the prompt is unclear.",
        },
      };
  }
}

function makeLayoutLink(intent: string) {
  const links: Record<string, string> = {
    anti_all: "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAAFQAAAAK-sfFeSce3dOoB-P-_72SJ",
    cwl_esl: "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAAFQAAAAK-sfe6i1GAg_KxHFJAVI-B",
    anti_2: "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAAFQAAAAK-sf0WCb1_6UiFzywJmW9F",
    anti_3: "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAAFQAAAAK-sgOM8hJA-lj4k7WoDFW6",
    anti_duke_charge: "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAAFQAAAAK-sgj4v6k_BvMnzY8mj6EU",
    anti_backpack: "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAAFQAAAAK-sg5pFueuw7FaX66fLjPb",
    anti_throwers: "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAAFQAAAAK-sizGUpdC2TZ_zuQpWBig",
    default: "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AHV%3AAAAABgAAAALwFcNcVPdKe2ufTAiwo-MD",
  };

  return links[intent] ?? links.default;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const prompt = String(body.prompt ?? "");
  const intent = detectIntent(prompt);
  const plan = buildPlan(intent);

  return NextResponse.json({
    th: "TH18",
    prompt,
    intent,
    baseType: plan.baseType,
    style: plan.style,
    placement: plan.placement,
    layoutLink: makeLayoutLink(intent),
  });
}
