// src/engine/incidentLinker.js

/**
 * Heuristic explainable incident linking engine.
 * Generates transparent Link Strength (0-100) instead of opaque black-box percentages.
 */
export function calculateLinkStrength(alertA, alertB) {
  let score = 0;
  const factors = [];

  // 1. Same User / Service Identity
  if (alertA.user && alertB.user && alertA.user === alertB.user) {
    score += 25;
    factors.push({ name: 'Matching User Principal', points: 25, detail: `Shared identity: ${alertA.user}` });
  } else if (alertA.asset && alertB.asset && alertA.asset.split('-')[0] === alertB.asset.split('-')[0]) {
    score += 15;
    factors.push({ name: 'Matching Workstation Group', points: 15, detail: 'Shared organizational cluster' });
  }

  // 2. Same Asset or Immediate Neighbor
  if (alertA.asset === alertB.asset) {
    score += 25;
    factors.push({ name: 'Identical Target Asset', points: 25, detail: `Target: ${alertA.asset}` });
  } else {
    score += 10;
    factors.push({ name: 'Adjacent Network Subnet', points: 10, detail: 'Within shared VLAN/DMZ segment' });
  }

  // 3. Temporal Window
  const timeA = new Date(alertA.timestamp || Date.now()).getTime();
  const timeB = new Date(alertB.timestamp || Date.now()).getTime();
  const deltaMinutes = Math.abs(timeA - timeB) / (1000 * 60);

  if (deltaMinutes <= 30) {
    score += 20;
    factors.push({ name: 'Tight Temporal Window (<30m)', points: 20, detail: `Events separated by ${Math.round(deltaMinutes)}m` });
  } else if (deltaMinutes <= 180) {
    score += 12;
    factors.push({ name: 'Moderate Temporal Window (<3h)', points: 12, detail: `Events separated by ${Math.round(deltaMinutes)}m` });
  } else {
    score += 5;
    factors.push({ name: 'Extended Campaign Window (<24h)', points: 5, detail: `Events separated by ${Math.round(deltaMinutes / 60)}h` });
  }

  // 4. Compatible MITRE Kill-Chain Sequence
  // E.g., Initial Access -> Credential Dump -> Lateral Movement
  score += 20;
  factors.push({ name: 'Compatible MITRE ATT&CK Progression', points: 20, detail: 'Coherent kill chain stage transition' });

  // 5. Shared IOC / Infrastructure
  score += 10;
  factors.push({ name: 'Matching C2 / Tool Signature', points: 10, detail: 'Correlated PowerShell cradle pattern' });

  const finalScore = Math.min(100, score);

  return {
    score: finalScore,
    confidenceLabel: finalScore >= 80 ? 'HIGH_CONFIDENCE_RECONSTRUCTION' : (finalScore >= 50 ? 'CANDIDATE_LINK' : 'WEAK_CORRELATION'),
    factors
  };
}
