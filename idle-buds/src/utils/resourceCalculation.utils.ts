export const calculateResourceGain = (gatherRate: number, ticks: number, currentFraction: number) => {
    const gatherAmount = gatherRate * ticks * 20;
    const totalAmount = currentFraction + gatherAmount;
    const wholeAmount = Math.floor(totalAmount);
    const newFraction = totalAmount - wholeAmount;
    return { wholeAmount, newFraction };
  };
  
  export const calculateExperienceGain = (xpGainRate: number, ticks: number, currentXPFraction: number) => {
    const xpGain = xpGainRate * ticks * 20;
    const totalXP = currentXPFraction + xpGain;
    const wholeXP = Math.floor(totalXP);
    const newXPFraction = totalXP - wholeXP;
    return { wholeXP, newXPFraction };
  };