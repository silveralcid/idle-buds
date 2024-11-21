export const calculateResourceGain = (gatherRate: number, deltaTime: number, currentFraction: number) => {
    const gatherAmount = gatherRate * deltaTime;
    const totalAmount = currentFraction + gatherAmount;
    const wholeAmount = Math.floor(totalAmount);
    const newFraction = totalAmount - wholeAmount;
    return { wholeAmount, newFraction };
  };
  
  export const calculateExperienceGain = (xpGainRate: number, deltaTime: number, currentXPFraction: number) => {
    const xpGain = xpGainRate * deltaTime;
    const totalXP = currentXPFraction + xpGain;
    const wholeXP = Math.floor(totalXP);
    const newXPFraction = totalXP - wholeXP;
    return { wholeXP, newXPFraction };
  };