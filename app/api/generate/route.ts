import { NextResponse } from "next/server";

function parsePrompt(prompt: string) {
  const p = prompt.toLowerCase();

  if (p.includes("anti all")) {
    return {
      baseType: "ANTI ALL",
      style: "max defense coverage, balanced compartments, safe core, anti-2 and anti-3 pressure",
    };
  }

  if (p.includes("cwl") || p.includes("esl")) {
    return {
      baseType: "CWL / ESL BASE",
      style: "tight core, trap-heavy core, anti-funnel layout, strong protection for key defenses",
    };
  }

  if (p.includes("anti 2")) {
    return {
      baseType: "ANTI 2",
      style: "anti-2 star war base, protected town hall, compartment pressure, awkward pathing",
    };
  }

  if (p.includes("anti 3")) {
    return {
      baseType: "ANTI 3",
      style: "anti-3 star war base, split compartments, protected core, anti-queen charge structure",
    };
  }

  if (p.includes("anti duke charge")) {
    return {
      baseType: "ANTI DUKE CHARGE",
      style: "anti hero-charge layout, trap-stacked approach lanes, offset core, awkward entry angles",
    };
  }

  if (p.includes("anti backpack")) {
    return {
      baseType: "ANTI BACKPACK",
      style: "anti-blimp style layout, core baiting, spread key defenses, protected inner ring",
    };
  }

  if (p.includes("anti throwers")) {
    return {
      baseType: "ANTI THROWERS",
      style: "anti ranged-splash style layout, layered defenses, spread value, defensive pockets",
    };
  }

  return {
    baseType: "TH18 DEFAULT",
    style: "balanced TH18 war base, stable compartments, protected core, anti-3 pressure",
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const prompt = String(body.prompt ?? "");

  const base = parsePrompt(prompt);

  return NextResponse.json({
    prompt,
    th: "TH18",
    baseType: base.baseType,
    style: base.style,
    layoutLink: "https://link.clashofclans.com/en?action=OpenLayout&id=TH18%3AWB%3AAAAAFQAAAAK-sfFeSce3dOoB-P-_72SJ",
  });
}
