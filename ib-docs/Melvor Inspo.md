# Questions
## How are fractional resources handled?

## Render queues 

## how are resource nodes handled
# Rando

### Load Game State

```JavaScript
this.completion.onLoad();
this.bank.onLoad();
this.potions.onLoad();
this.petManager.onLoad();
this.shop.onLoad();
```

### Render Queues
```JavaScript
this.renderQueue.activeSkills = true;
this.renderQueue.sidebarSkillUnlock = true;
```

### Perplexity on Render Queues in Melvor

Render Queue Structure
The render queue is implemented as an object with boolean and set-based properties that track various UI rendering needs:
typescript
this.renderQueue = {
    title: false,
    combatMinibar: false,
    activeSkills: false,
    sidebarSkillUnlock: false,
    clueHuntStep6: false,
    birthdayEventProgress: false,
    realmVisibility: false,
    realmSidebarVisibility: new Set(),
    sidebarSkillOpacity: false,
    sidebarClass: false,
}

Key Characteristics
Purpose: The render queue serves as a flag-based tracking mechanism for UI update requirements.
Types of Flags:
Boolean Flags: Most properties are simple boolean flags indicating whether a specific UI element needs re-rendering
Set-based Flag: realmSidebarVisibility uses a Set for more complex tracking of realm sidebar visibility
Usage Pattern:
When a game state changes, relevant flags are set to true
During the rendering cycle, these flags are checked to determine which UI components need updating
After rendering, flags can be reset to false
Potential Rendering Optimization
This implementation allows for efficient, selective UI updates by:
Avoiding unnecessary full re-renders
Providing granular control over which UI elements need refreshing
Minimizing performance overhead by tracking specific rendering requirements
The design suggests a performance-conscious approach to managing complex game UI updates across multiple game systems.
# Time

## RE: Loop from Perplexity
Based on the code shown, this appears to be from Melvor Idle, an idle game. Let me break down the key game loop implementation components:

### Core Loop Properties
```typescript
this.loopInterval = -1;
this.loopStarted = false;
this.previousTickTime = performance.now();
this.MAX_PROCESS_TICKS = 20 * 60 * 60 * 24; // Max ticks per day
```

### Time Management Properties
```typescript
// Offline processing thresholds
this.MIN_OFFLINE_TIME = 60000; // 1 minute in ms
this.MAX_OFFLINE_TIME = 86400000; // 24 hours in ms 
this.OFFLINE_EXIT_TIME = 500; // Min remaining time before exiting offline mode
this.OFFLINE_GC_RATIO = 0.95; // Garbage collection tuning

// Loop state tracking
this._isInOnlineLoop = true;
this._previousLoopTime = Date.now();
this._offlineInfo = {
    startTime: 0,
    timeProcessed: 0,
    tickRate: 1000,
};
```

### Key Design Elements

1. **Dual Loop System**:
- Online loop for active gameplay
- Offline loop for processing idle time when game was closed

2. **Time Delta Processing**:
- Tracks time between ticks using `previousTickTime`
- Uses performance.now() for precise timing

3. **Offline Progress**:
- Triggers when time delta exceeds `MIN_OFFLINE_TIME` (1 minute)
- Caps at `MAX_OFFLINE_TIME` (24 hours)
- Uses `OFFLINE_GC_RATIO` to prevent memory issues during long offline calculations[1]

4. **State Management**:
- Tracks game state with properties like `isPaused`
- Maintains tick timestamps for saving and processing[1]

### Loop Implementation Details

1. **Online Loop**:
- Processes game ticks in real-time
- Updates active gameplay elements
- Handles immediate player interactions[1]

2. **Offline Loop**:
- Calculates accumulated offline time
- Processes multiple ticks at once to catch up
- Applies idle progress and rewards[1]

3. **Performance Optimization**:
- Uses throttling for frame rates
- Implements garbage collection ratio for memory management
- Has safeguards against excessive tick processing[1]

This implementation allows the game to:
- Run efficiently during active play
- Process idle progress when closed
- Handle both real-time and offline progression
- Manage system resources effectively[1]


## RE: Processing Offline Time > 24 hours
Let me explain the game loop implementation in this code, focusing on the idle/offline time handling:

### Core Time Management

The game implements a dual-loop system with the following key timing constants[1]:

```typescript
// Offline processing thresholds
this.MIN_OFFLINE_TIME = 60000; // 1 minute in ms
this.MAX_OFFLINE_TIME = 86400000; // 24 hours in ms
this.OFFLINE_EXIT_TIME = 500; // Min remaining time to exit offline
this.OFFLINE_GC_RATIO = 0.95; // Garbage collection tuning
```

### Loop State Tracking

The game maintains several state properties[1]:
```typescript
this._isInOnlineLoop = true;
this._previousLoopTime = Date.now();
this._offlineInfo = {
    startTime: 0,
    timeProcessed: 0,
    tickRate: 1000,
};
```

### Key Design Elements

1. **Time Delta Processing**:
- The game checks the time difference between sessions
- If delta > 1 minute, enters offline processing mode
- Caps offline progress at 24 hours maximum[1]

2. **Performance Optimization**:
- Uses `OFFLINE_GC_RATIO` (0.95) to prevent memory issues
- Implements frame rate throttling for resource management
- Has a minimum exit threshold of 500ms for offline processing[1]

3. **Idle Time Constraints**:
The 24-hour limit appears to be an industry standard practice for idle games because[3]:
- Helps maintain game balance
- Prevents excessive resource accumulation
- Encourages regular player engagement
- Provides reasonable catch-up mechanics

### Loop Implementation

The game uses a tick-based system where:
- Online ticks process in real-time
- Offline ticks are batched and processed when the player returns
- A garbage collection ratio prevents memory issues during long offline calculations[1]

The 24-hour limit could theoretically be extended, but it would require careful consideration of:
- Game balance
- Server resource management
- Memory usage during offline calculations
- Player engagement metrics

Citations:
[1] https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/31112838/58be0452-fce2-47bb-9bd4-8c561cb0b9b0/paste.txt
[2] https://www.warzone.com/Forum/459149-slow-pace-start-little-idle-time
[3] https://gameanalytics.com/blog/how-to-make-an-idle-game-adjust/
[4] https://blog.kongregate.com/the-math-of-idle-games-part-i/
[5] https://www.reddit.com/r/UlalaIdleAdventure/comments/detoce/maximum_idle_time/
## Loop

```JavaScript
loop() {
        const loopTime = Date.now();
        try {
            if (this._isInOnlineLoop) {
                const delta = Math.max(loopTime - this.tickTimestamp, 0);
                if ((delta >= this.MIN_OFFLINE_TIME || this._forceOfflineLoop) && !this.isGolbinRaid) {
                    this.enterOfflineLoop(loopTime);
                }
            }
            else {
                const timeOffset = loopTime - this._offlineInfo.startTime - this._offlineInfo.timeProcessed;
                if (timeOffset <= this.OFFLINE_EXIT_TIME || this._offlineInfo.timeProcessed >= this.MAX_OFFLINE_TIME) {
                    this.exitOfflineLoop(loopTime);
                }
            }
        }
        catch (e) {
            this.stopMainLoop();
            this.showBrokenGame(e, 'An error occured while changing loop states:');
            console.error(e);
            throw new Error(`An error occured while changing loop states: ${e}`);
        }
        if (this._isInOnlineLoop) {
            this.loopOnline(loopTime);
        }
        else {
            this.loopOffline(loopTime);
        }
        this._previousLoopTime = loopTime;
        if (this.interactionBlocked)
            this.unblockInteraction();
    }
```


## Online Loop Processing

```JavaScript
/** The main loop for when the game is processing online */
    loopOnline(loopTime) {
        if (!this.isGolbinRaid)
            this.tickTimestamp = loopTime;
        try {
            this.processTime();
        }
        catch (e) {
            this.stopMainLoop();
            this.showBrokenGame(e, 'An error occurred while processing ticks:');
            console.error(e);
            throw new Error(`An error occurred while processing ticks: ${e}.`);
        }
        if (this.enableRendering) {
            try {
                this.render();
            }
            catch (e) {
                this.stopMainLoop();
                this.showBrokenGame(e, 'An error occurred while rendering:');
                console.error(e);
                throw new Error(`An error occurred while rendering: ${e}.`);
            }
        }
        // Perform Long scheduled tasks
        this.autoSave(loopTime);
        this.cloudUpdate(loopTime);
        this.updateRichPresence(loopTime);
        this.gameInteractionUpdate(loopTime);
        processScheduledItemNotifications();
    }
```

## Offline Loop Processing
```JavaScript
/** The main loop for when the game is processing offline time */
    loopOffline(loopTime) {
        var _a;
        try {
            const totalTime = Math.min(loopTime - this._offlineInfo.startTime, this.MAX_OFFLINE_TIME);
            const ticksLeft = Math.floor((totalTime - this._offlineInfo.timeProcessed) / TICK_INTERVAL);
            const tStart = performance.now();
            const ticksToRun = Math.min(this._offlineInfo.tickRate, ticksLeft);
            this._offlineInfo.timeProcessed += ticksToRun * TICK_INTERVAL;
            this.runTicks(ticksToRun);
            const tEnd = performance.now();
            const tDiff = Math.max(tEnd - tStart, 1);
            const ticksPerMillisecond = ticksToRun / tDiff;
            let newTickRate = Math.floor(ticksPerMillisecond * TICK_INTERVAL * this.OFFLINE_GC_RATIO);
            newTickRate = Math.max(newTickRate, 1);
            this._offlineInfo.tickRate = newTickRate;
            offlineLoading.updateProgress(this._offlineInfo.timeProcessed, totalTime, ticksPerMillisecond * 1000);
        }
        catch (e) {
            const modError = mod.getModErrorFromError(e);
            const errorLog = this.getErrorLog(e, 'An error occured while processing ticks offline:', modError);
            offlineLoading.setError(e, modError, errorLog);
            // Attempt to stop the currently active skill
            (_a = this.activeAction) === null || _a === void 0 ? void 0 : _a.stop();
        }
    }
```
## Offline Loop
```JavaSCript
enterOfflineLoop(loopTime) {
        var _a, _b;
        this._isInOnlineLoop = false;
        loadingOfflineProgress = true;
        if (this.activeAction === this.combat &&
            (!this.settings.enableOfflineCombat ||
                (this.combat.selectedArea instanceof SlayerArea && !this.slayer.isUnlocked))) {
            this.combat.stop();
        }
        if (this.activeAction === this.thieving && !this.thieving.isUnlocked) {
            this.thieving.stop();
        }
        this.resetOfflineTracking();
        this._offlineInfo = {
            action: this.activeAction,
            snapshot: this.snapshotOffline(),
            startTime: this.tickTimestamp,
            timeProcessed: 0,
            tickRate: 1000,
        };
        (_b = (_a = this.activeAction) === null || _a === void 0 ? void 0 : _a.createOfflineSnapshot) === null || _b === void 0 ? void 0 : _b.call(_a);
        pauseModalQueue();
        if (this.activeAction !== undefined) {
            const offlineProgress = createElement('offline-progress');
            addModalToQueue({
                title: getLangString('MISC_STRING_3'),
                html: offlineProgress,
                imageUrl: this.activeAction.media,
                imageWidth: 64,
                imageHeight: 64,
                imageAlt: getLangString('CHARACTER_SELECT_88'),
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            this._offlineInfo.offlineProgress = offlineProgress;
        }
        $('#modal-offline-loading').modal('show');
        this._events.emit('offlineLoopEntered', new GameEvent());
    }
```


## Offline Loop Support

```JavaScript
/** Triggers the game to enter the offline loop on its next loop */
    triggerOfflineLoop() {
        if (!this._isInOnlineLoop || this.isGolbinRaid)
            return;
        this._forceOfflineLoop = true;
    }
```

```JavaScript
exitOfflineLoop(loopTime) {
        this._isInOnlineLoop = true;
        loadingOfflineProgress = false;
        const info = this._offlineInfo;
        if (info.action !== undefined && info.snapshot !== undefined && info.offlineProgress !== undefined) {
            const newSnapshot = this.snapshotOffline();
            info.offlineProgress.setMessages(this, info.snapshot, newSnapshot, info.timeProcessed, info.action);
            this.trackOfflineTelemetry(info.snapshot, newSnapshot, info.timeProcessed);
        }
        $('#modal-offline-loading').modal('hide');
        resumeModalQueue();
        this.tickTimestamp = Date.now();
        this.previousTickTime = performance.now() - (loopTime - this._previousLoopTime);
        this.combat.notifications.clear();
        this._offlineInfo = {
            startTime: 0,
            timeProcessed: 0,
            tickRate: 1000,
        };
        this._forceOfflineLoop = false;
        this._events.emit('offlineLoopExited', new GameEvent());
    }
```
## Process Time
```JavaScript
/** Processes time since the last setInterval */
    processTime() {
        const currentTickTime = performance.now();
        let ticksToRun = Math.floor((currentTickTime - this.previousTickTime) / TICK_INTERVAL);
        if (ticksToRun > this.MAX_PROCESS_TICKS) {
            ticksToRun = this.MAX_PROCESS_TICKS;
            this.previousTickTime = currentTickTime - ticksToRun * TICK_INTERVAL;
        }
        this.runTicks(ticksToRun);
        this.previousTickTime += ticksToRun * TICK_INTERVAL;
    }
    /** Runs the specified amount of game ticks */
    runTicks(ticksToRun) {
        for (let i = 0; i < ticksToRun; i++) {
            this.tick();
        }
    }
    tick() {
        var _a;
        if (this.isGolbinRaid) {
            this.golbinRaid.activeTick();
        }
        else {
            this._passiveTickers.forEach((action) => {
                action.passiveTick();
            });
            (_a = this.activeAction) === null || _a === void 0 ? void 0 : _a.activeTick();
            this.combat.checkDeath();
        }
    }
```
### Pause 
```JavaScript
// This should allow offline progress to go off if the game was in a paused state when it was last saved
if (this.pausedAction !== undefined && !this.isGolbinRaid) {
	this.activeAction = this.pausedAction;
	this.pausedAction = undefined;
	this._isPaused = false;
```

# Structure

## Enums

### Tiers

```JavaScript
var SlayerTierID;
(function(SlayerTierID) {
    SlayerTierID[SlayerTierID["Easy"] = 0] = "Easy";
    SlayerTierID[SlayerTierID["Normal"] = 1] = "Normal";
    SlayerTierID[SlayerTierID["Hard"] = 2] = "Hard";
    SlayerTierID[SlayerTierID["Elite"] = 3] = "Elite";
    SlayerTierID[SlayerTierID["Master"] = 4] = "Master";
    SlayerTierID[SlayerTierID["Legendary"] = 5] = "Legendary";
    SlayerTierID[SlayerTierID["Mythical"] = 6] = "Mythical";
}
```

### Rarity
```JavaScript
var CrateRarity;
(function(CrateRarity) {
    CrateRarity[CrateRarity["Common"] = 35] = "Common";
    CrateRarity[CrateRarity["Uncommon"] = 20] = "Uncommon";
    CrateRarity[CrateRarity["Rare"] = 10] = "Rare";
    CrateRarity[CrateRarity["UltraRare"] = 4] = "UltraRare";
    CrateRarity[CrateRarity["BuggedRare"] = 1] = "BuggedRare";
}
```

### Combat Modifiers
```JavaScript
var ModifierID;
(function(ModifierID) {
    ModifierID[ModifierID["increasedGlobalAccuracy"] = 0] = "increasedGlobalAccuracy";
    ModifierID[ModifierID["increasedMeleeAccuracyBonus"] = 1] = "increasedMeleeAccuracyBonus";
    ModifierID[ModifierID["increasedMeleeMaxHit"] = 2] = "increasedMeleeMaxHit";
    ModifierID[ModifierID["increasedMeleeEvasion"] = 3] = "increasedMeleeEvasion";
    ModifierID[ModifierID["increasedRangedAccuracyBonus"] = 4] = "increasedRangedAccuracyBonus";
    ModifierID[ModifierID["increasedRangedMaxHit"] = 5] = "increasedRangedMaxHit";
}
```

### Equipment Slots
```JavaScript
var OldEquipmentSlotIDs;
(function(OldEquipmentSlotIDs) {
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Helmet"] = 0] = "Helmet";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Platebody"] = 1] = "Platebody";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Platelegs"] = 2] = "Platelegs";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Boots"] = 3] = "Boots";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Weapon"] = 4] = "Weapon";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Shield"] = 5] = "Shield";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Amulet"] = 6] = "Amulet";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Ring"] = 7] = "Ring";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Gloves"] = 8] = "Gloves";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Quiver"] = 9] = "Quiver";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Cape"] = 10] = "Cape";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Passive"] = 11] = "Passive";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Summon1"] = 12] = "Summon1";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Summon2"] = 13] = "Summon2";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Consumable"] = 14] = "Consumable";
    OldEquipmentSlotIDs[OldEquipmentSlotIDs["Gem"] = 15] = "Gem";
}
```