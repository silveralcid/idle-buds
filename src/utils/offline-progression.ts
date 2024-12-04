// offline-progression.ts
export function calculateTimeAway(lastSaveTime: number, currentTime: number = Date.now()) {
    const timeAwayMilliseconds = currentTime - lastSaveTime;
    const timeAwaySeconds = Math.floor(timeAwayMilliseconds / 1000);
    const hours = Math.floor(timeAwaySeconds / 3600);
    const minutes = Math.floor((timeAwaySeconds % 3600) / 60);
    const seconds = timeAwaySeconds % 60;
  
    return {
      timeAwayMilliseconds,
      timeAwayMessage:
        timeAwayMilliseconds > 0
          ? `${hours} hours, ${minutes} minutes, and ${seconds} seconds ago`
          : "No pause recorded",
    };
  }
  