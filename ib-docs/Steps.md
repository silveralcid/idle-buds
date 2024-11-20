### Primary Focus:

1. **Player (Hunter) Progression and Skills System**
2. **Buds System** (creature management system)
3. **Combat (including Bosses and Level Progression)**
4. **Resource Management** (resource gathering, refinement, and crafting)
5. **Equipment System**
6. **Affinity System** (Bud type advantage/disadvantage)
7. **Offline Progression**
8. **Economy Systems** (Bank and Shop)
9. **AWS Deployment and Scaling**

---

## 1. **Core Player (Hunter) Progression and Skills System**

### Objective:

Players (referred to as **hunters**) will level up over time, unlocking **skills** (such as **lumbering**, **mining**, etc.) which will determine how efficient they are at resource gathering and combat abilities, reflected by increasing skill levels and rewards.

### Steps:

- **Epic: Create Hunter Level/Progression System**
    
    - **Task 1.1**: **Design the Level System**
        
        - Define experience mechanics: how **XP is gained** (from gathering resources like wood, mining, combat).
        - Implement a **progression curve** for leveling. Early levels are easier, later levels require more XP.
        - Show XP in a progress bar and update dynamically on the UI.
        
        **Example:**
        
        ```
        const useHunterStore = create((set) => ({
          level: 1,
          experience: 0,
          xpToNextLevel: 100,  // Example for level 1.
          
          addXP: (xp: number) => set((state) => {
            const newXp = state.experience + xp;
            const newLevel = state.level + Math.floor(newXp / state.xpToNextLevel);
            return {
              experience: newXp % state.xpToNextLevel,
              level: newLevel,
              xpToNextLevel: state.xpToNextLevel * 1.5, // Progressive increment
            };
          }),
        }));
        ```
        
- **Task 1.2**: **Implement the Skills System (Mining, Lumbering, etc.)**
    
    - Add **Zustand stores** or skill-specific states (e.g., `lumberingXP`, `miningXP`), which mirror the hunter's general XP system but track skill progression separately.
    - **UI** should have **skill progress bars** for each skill (such as mining or fishing) that update based on skill usage.
    
    **Example:**
    
    ```
    const useSkillStore = create((set) => ({
      lumberingLevel: 1,
      miningLevel: 1,
      lumberingXP: 0,
      miningXP: 0,
    
      gainSkillXP: (skill: 'mining' | 'lumbering', xp: number) => set((state) => {
        const skillXPMap = {
          mining: 'miningXP',
          lumbering: 'lumberingXP'
        };
        return {
          [skillXPMap[skill]]: state[skillXPMap[skill]] + xp
        };
      }),
    }));
    ```
    

### Deliverables:

- Core **player leveling** and **skill progression** system live.
- Skill logic tied to **target activities** (e.g., **chopping trees increases lumbering**).
- **Progress bars**, level-up animations, and feedback for progression on all activities.

---

## 2. **Buds System (Palworld “Creature” Mechanics)**

### Objective:

This system defines player-owned creatures or "Buds" that:

1. Gather resources.
2. Participate in **combat**.
3. Evolve according to the game’s **Affinity system** (similar to Pokémon types).
4. Manage **special stats** such as health, attack, and defense.

### Steps:

- **Epic: Develop the Bud System** (general creature management)
    
    - **Task 2.1**: **Define Bud Data Models (Data-Driven Approach)**
        - Create **config files** that hold Bud **base stat information**, **affinities**, and **growth modifiers**. Include the list of abilities each Bud has.
    
    **Example:**
    
    ```
    export const Buds = [
      {
        id: 'fire_dragon',
        name: 'Fire Dragon',
        class: 'fire',  // Affinity
        baseStats: {
          health: 300,
          attack: 50,
          defense: 20,
        },
        growthRates: {  // For leveling.
          health: 15,
          attack: 5,
          defense: 3,
        },
        abilities: ['fire_breath', 'tail_whip'],
      }
    ];
    ```
    
    - **Task 2.2**: **Active/Inactive Bud System**
        
        - Build a **Bud Box** to store player’s inactive Buds (similar to Pokémon PC system), and an **active Bud party** system where players choose which Buds are active for gathering or fighting.
        
        **Subtasks**:
        - Build a UI for players to move Buds between the **Bud Box** (unused Buds) and **Active Bud Party**.
        - Tie stats in **Zustand** stores when Buds are active.
    
    **Example (Bud Store)**:
    
    ```
    const useBudStore = create((set) => ({
      activeBuds: [],
      budBox: [],
    
      addBudToBox: (budId: string) => set((state) => {
        const newBud = Buds.find(b => b.id === budId);
        return { budBox: [...state.budBox, newBud] };
      }),
      
      setActiveBud: (budId: string) => set((state) => {
        const activeBud = state.budBox.find(b => b.id === budId);
        return { activeBuds: [...state.activeBuds, activeBud] };
      }),
    }));
    ```
    
    - **Task 2.3**: **Buds’ Action System**
        
        - Define **bud interactions** where Buds can **gather resources**, **fight in combat**, or **sit idle**. Each Bud will have abilities affected by their **class/affinity**.
        
        **Subtasks**:
        
        - Implement logic to **assign tasks to Buds** (gathering, fighting).
        - Update UI to **reflect their current action** and **real-time stat changes**.

### Deliverables:

- A working **Bud Box** with **active/inactive Bud** management.
- Buds integrated into the **activity system** (gathering, fighting).
- **Bud progression**, stats, and abilities leveled/tied to combat or gathering activities.

---

## 3. **Combat System (with Bosses and Progression)**

### Objective:

Implement both **basic combat mechanics** and **boss fights** with **progression through levels** that unlock new challenges as the player levels up.

### Steps:

- **Epic: Build Combat System**
    
    - **Task 3.1**: **Turn-based Combat System**
        
        - Set up a **turn-based combat** system where Buds use defined **abilities**, and enemies counterattack. Functions to handle **damage calculation**, **status effects**, and **ability casting**.
        
        **Subtasks**:
        
        - Use your **Buds' stats** (attack, health, defense).
        - Implement simple **damage formulas** based on Bud stats and abilities.
    
    **Example:**
    
    ```
    const attackWithAbility = (attacker: Bud, target: Enemy, ability: Ability) => {
      const baseDamage = ability.basePower * (attacker.attack / target.defense);
      target.health -= baseDamage;
      
      if (target.health <= 0) {
        // Trigger an enemy-death event or move to next phase.
      }
    };
    ```
    
    - **Task 3.2**: **Boss Fights**
        
        - Design **boss encounters** with enhanced abilities, multi-phase boss battles, and special status effects (like stuns, burns).
        
        **Subtasks**:
        - Use **event-driven mechanics** for multi-phase fights (trigger next form or change of abilities when boss HP reaches certain thresholds).
    
    **Example (Event-driven combat phase)**:
    
    ```
    class BossFightSystem {
      currentPhase: number = 1;
    
      updateBossPhase(boss: Boss) {
        if (boss.health <= boss.maxHealth / 2 && this.currentPhase === 1) {
          EventEmitter.emit('bossSecondPhase', { bossId: boss.id });
          this.currentPhase = 2;
          console.log('Boss second phase activated!');
        }
      }
    }
    ```
    
    - **Task 3.3**: **Dynamic Combat UI**
        - Build a UI that displays **combat stats** (HP bars, abilities, etc.) and updates dynamically during battle.

### Deliverables:

- A functional **turn-based combat system** with battle mechanics.
- **Dynamic boss battles** with multi-phase mechanics.
- **Combat UI** that links player stats, battle abilities, and boss progression.

---

## 4. **Resource Refinement and Crafting System**

### Objective:

Allow players to gather **raw resources** (wood, ore, etc.), refine them, and craft items such as **tools**, **weapons**, or **equipment** used in combat or resource gathering.

### Steps:

- **Epic: Resource Refinement System**
    
    - **Task 4.1**: **Setup Raw Resources and Processed Resources**
        - Players should be able to **mine raw ore** or **chop wood** and then **refine** these resources into usable materials (smelting ores into ingots, cutting logs into planks).
    
    **Subtasks**:
    
    - Build out data that links **raw resources** to their **refined counterparts**.
    
    **Example:**
    
    ```
    const resourceRefinementMap = {
      oak_wood: 'plank',
      iron_ore: 'iron_ingot',
    };
    ```
    
    - **Task 4.2**: **Idle Crafting Queue System**
        - Implement a **crafting process** where items are queued for crafting/refinement and **completed over time**.
    
    **Subtasks**:
    
    - Set up a **progress bar** or **timer** for showing crafting progression.
    - Add logic that tracks **task completion** for crafting.
    
    **Example (Crafting Queue Store)**:
    
    ```
    const useCraftingStore = create(set => ({
      currentQueue: [],
      
      enqueueCrafting: (item) => set(state => ({
        currentQueue: [...state.currentQueue, item]
      })),
    
      // Process crafting at given intervals.
      processCraftingQueue: () => {
        set(state => {
          const [current, ...rest] = state.currentQueue;
          return { currentQueue: rest };  // Pop the queue.
        });
      }
    }));
    ```
    
    - **Task 4.3**: **Crafted Equipment with Quality Stats**
        
        - Introducing **affinity-based crafting** (certain Buds are better at producing higher-quality equipment), equipment will have **tiered qualities** that impact the player's effectiveness in combat or gathering.
        
        **Subtasks**:
        - Define **tiers** of crafted equipment (Common, Rare, Epic).
        - Equip equipment **crafting stations** or **Buds** to increase quality chances (e.g., **Fire Bud with high tier crafting ability** increases chance of **Epic-level fire weapons**).

### Deliverables:

- A core **resource refinement system** that takes raw materials and processes them into **higher-value items** over time.
- A **time-based crafting queue** that allows multi-stage recipes.
- Tiered **equipment quality** output depending on player/Bud affinities.

---

## 5. **Offline Progression**

### Objective:

Idle games thrive on **offline progression**. The game should track how much time has passed while the player is away and apply appropriate bonuses/resources upon login.

### Steps:

- **Epic: Implement Offline Progression System**
    
    - **Task 5.1**: **Track Offline Playtime**
        
        - Store the player's **last logout timestamp**, and the next time the player logs in, calculate how long they’ve been away.
        
        **Subtasks**:
        
        - Use **localStorage** to store and retrieve **lastTimestamp**.
        - Calculate resources depending on offline time span.
    
    **Example (Time Tracking)**:
    
    ```
    const handleLogout = () => {
      localStorage.setItem('lastLogout', JSON.stringify(Date.now()));
    }
    
    const handleLogin = () => {
      const lastLogout = parseInt(localStorage.getItem('lastLogout') || '0');
      const offlineTime = Date.now() - lastLogout;
    
      // Add offline rewards based on time away.
      const gatheredResources = offlineTime / 1000 * resourcesPerSecond;
      console.log(`You were away for ${offlineTime / 1000} seconds. Resources gathered: ${gatheredResources}`);
    };
    ```
    
    - **Task 5.2**: **Apply Idle Rewards for Time Away**
        - Apply **experience**, **resources**, or **Buds stats** as if the game was running continuously while the player was offline.

### Deliverables:

- **Offline playtime** tracking using local storage (basic implementation).
- Reward system calculates and applies **catch-up mechanics** based on actual time elapsed.

---

## 6. **Economy Systems (Bank and Shop)**

### Objective:

Players should be able to store or **exchange resources/items** using a Bank and **purchase/sell items** in Shops or Markets.

### Steps:

- **Epic: Create Bank System**
    
    - **Task 6.1**: **Build Personal Bank System**
        
        - Implement **bank storage** that acts as a vault for large amounts of items the player isn’t currently using.
        
        **Subtasks**:
        
        - Tie to player's inventory and allow **transferring to/from the bank**.
        - Add a **maximum capacity** that’s upgraded as the player progresses.
    - **Task 6.2**: **Bank UI and Interaction**
        
        - Design a seamless **Drag & Drop-like interface** where items can be moved between the inventory and bank.
- **Epic: Build a Shop System**
    
    - **Task 6.3**: **Basic Shop Functionality**
        
        - Add **buying and selling logic** where items (resources, gear, and consumables) are bought or sold for in-game currency.
        
        **Subtasks**:
        - Build a basic UI with item listings.
        - Track the player's **in-game currency** and update **on purchase/sell**.

### Deliverables:

- A **personal bank system** with item management and maximum capacity.
- A **shop system** where players can buy/sell items for currency, expanding as the game world grows.

---

## 7. **AWS Deployment and Infrastructure**

### Objective:

Deploy the game to AWS to track high player activity and support cloud-based game saves.

### Steps:

- **Epic: AWS Deployment Workflow**
    
    - **Task 7.1**: **Set Up AWS S3 for Static Site Hosting**
        - Create an S3 bucket for hosting your React/Vite static site.
        - Modify your Vite config to deploy static assets to S3.
    
    **Subtasks**:
    
    - Install AWS CLI to automate the process of pushing **build files** from your local environment directly to **S3**.
        
    - Enable CDNs using **CloudFront** to reduce latency.
        
    - **Task 7.2**: **DynamoDB for Player Save Data**
        
        - For **persistent player data** (like Bud stats, resources, etc.), you will need a back-end API to store data.
        
        **Subtasks**:
        
        - Set up a **DynamoDB table** for player profiles, tracking data such as **Buds, resources, combat history**.
        - Use **AWS Lambda** to build serverless functions that save and retrieve player data.

### Deliverables:

- **Full AWS deployment** pipeline (static site on S3, player data on DynamoDB).
- **Lambda functions** securely handle saves and updates for game progression.

---

## Final Breakdown

### Primary Systems for Your Prototype:

1. **Hunter progress and skills**.
2. **Buds system**: Ownership, evolution, combat, and hatching.
3. **Combat and boss battles** with level progression.
4. **Resource refinement** and **equipment crafting**.
5. **Offline progression**.
6. **Affinity system and Bud evolution**.
7. **Bank, shop, and economy systems**.

Everything can culminate into a **fleshed-out idle prototype**, fully deployable on **AWS**, and easily extendable to accommodate increasing game depth and new features. This gives you a full and modular implementation roadmap, starting from initial **systems setup** down to **combat, resource flow, and progression logic**. With this, you'll have a strong MVP to iterate on and prepare for **beta releases** later on.