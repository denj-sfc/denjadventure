//work on eat()

// declare variables
let tasks = 0 // completed tasks
let asks = 0 // help requests
let rooms = [], roomsNum // room array and current room number
let items = [], itemsNum // item array and current item number
let discoveredrooms = [] // array of rooms player has visited
let inventory = -1 // location for items in inventory
let gone = -2 // location for removed items
let box = -3 // location for items in box
let boxOpen = false
let santaChained = false
const MAPWIDTH = 3 // width of map (3x3 grid)

// =======================
// INPUT CHECK
// =======================
// listen for enter key and process command
function checkInput(e) {
    if (e.key == "Enter") {
        e.preventDefault();
        command = cli.textContent.trim();
        cli.innerHTML = "";
        parser(command); // send command to parser
    }
}

// =======================
// PARSER
// =======================
// break down command call appropriate function
function parser(cmd) {
    let cmdWords = cmd.trim().toUpperCase().split(" ");
    let verb = cmdWords[0]; // action
    var noun = cmdWords.slice(1).join(" "); // target
    switch (verb) {
        case "NORTH": case "N":
            moveNorth();
            break;
        case "SOUTH": case "S":
            moveSouth();
            break;
        case "EAST": case "E":
            moveEast();
            break;
        case "WEST": case "W":
            moveWest();
            break;
        // item interactions
        case "GET": case "PICKUP": case "TAKE": case "GRAB": case "GTE":
            get(noun);
            break;
        case "DROP": case "REMOVE":
            drop(noun);
            break;
        case "EXAMINE": case "EX": case "X":
            examine(noun);
            break;
        case "SLEEP":
            john();
            break;
        case "FEED":
            feedReindeer(noun);
            break;
        case "RING":
            ringBell(noun);
            break;
        case "WRAP":
            wrapPresents(noun);
            break;
        case "HARNESS": case "HITCH": case "HITCHUP":
            harness(noun);
            break;
        case "THROW": case "CHUCK":
            chuck(noun);
            break;
        case "HIT": case "ATTACK": case "KILL": case "SLAY": case "STAB":
            kill(noun);
            break;
        case "CHAIN": case "TIE": case "RESTRAIN": case "SHACKLE":
            chain(noun);
            break;
        case "KISS": case "MISTLETOE":
            kiss(noun);
            break;
        case "SHOUT":
            shout();
            break;
        case "OPEN": case "LOOK":
            openBox(noun);
            break;
        case "EAT": case "DEVOUR": case "INGEST":
            eat(noun);
            break;
        case "HELP":
            help(noun);
            break;
        case "BACK": case "LEAVE":
            back();
            break;
        default: // default
            intFailSound();
            outputText("Hmmm...");
    }
}

// =======================
// MOVEMENT
// =======================

function moveNorth() {
    if (rooms[roomsNum].exits.includes("north") || rooms[roomsNum].hiddenExits.includes("north")) {
        roomsNum -= MAPWIDTH
        discoveredrooms.push(roomsNum);
        showrooms();
        updateMinimap();
        walkSound();
    } else {
        intFailSound();
        outputText("You can't go that way");
    }
}

function moveEast() {
    if (rooms[roomsNum].exits.includes("east")) {
        roomsNum++;
        discoveredrooms.push(roomsNum);
        showrooms();
        updateMinimap();
        walkSound();
    } else {
        intFailSound();
        outputText("You can't go that way");
    }
}

function moveSouth() {
    if (rooms[roomsNum].exits.includes("south")) {
        roomsNum += MAPWIDTH;
        discoveredrooms.push(roomsNum);
        showrooms();
        updateMinimap();
        walkSound();
    } else {
        intFailSound();
        outputText("You can't go that way");
    }
}

function moveWest() {
    if (rooms[roomsNum].exits.includes("west") || rooms[roomsNum].hiddenExits.includes("west")) {
        roomsNum--;
        discoveredrooms.push(roomsNum);
        showrooms();
        updateMinimap();
        walkSound();
    } else {
        intFailSound();
        outputText("You can't go that way");
    }
}

// =======================
// PLAYER ACTIONS
// =======================

// chain up santa (MAKE KILL FUNC REACT TO THIS)
function chain(noun) {
    output.appendChild(document.createElement("br"));
    if (items[16].location == inventory) {
        if (noun == "SANTA") {
            if (roomsNum == 3) {
                var audio = new Audio("/audio/chain.mp3");
                audio.play();
                santaChained = true;
                outputText("You approach Santa silently, the cold metal chains heavy in your hands. With a swift motion, you loop them around his wrists and ankles, securing him tightly to the chair. His eyes flutter open briefly, a flicker of recognition passing through them before they close again. The room feels charged, as if the very air is holding its breath.");
            } else {
                outputText("You can't see santa")
            }
        } else {
            outputText("You can't chain up " + noun.toLowerCase())
        }
    } else {
        outputText("You don't have a chain... go find one")
    }
}

// shout (for fun)
function shout() {
    output.appendChild(document.createElement("br"));
    outputText("You shout jumbled nonsense - I don't know if you expected a reply, but I appreciate your commitment...")
}

// kiss santa under mistletoe
function kiss(noun) {
    output.appendChild(document.createElement("br"));
    if (noun.toUpperCase() === "SANTA" && roomsNum === 3) {
        if (items[13].location === inventory) {
            var audio = new Audio("/audio/kiss.mp3");
            audio.play();
            outputText("Holding the mistletoe above your head, you approach Santas cold body. His chilling breath caresses your face...");
            setTimeout(function () {
                outputText("His eyes shoot open as you make contact with his icy blue lips...");
            }, 2000)
            setTimeout(function () {
                outputText("Come on... this isn't the game for that");
            }, 4000)
        } else {
            outputText("Wheres the mistletoe?")
        }
    } else {
        outputText("You can't kiss " + noun.toLowerCase() + " why would you want to...");
    }
}

// kill santa easter egg
function kill(noun) {
    output.appendChild(document.createElement("br"));
    if (noun.toUpperCase() === "SANTA" && roomsNum === 3) {
        if (items[11].location === inventory) {
            if (santaChained == true) {
                var audio = new Audio("/audio/unsheath.mp3");
                audio.play();
                setTimeout(function () {
                    var audio = new Audio("/audio/stab.mp3");
                    audio.play();
                }, 2000);
                outputText("The chains rattle as Santa's laughter grows louder, echoing through the void you've entered. It seems binding him was a mistake...");
                setTimeout(function () {
                    outputText("The knife slices throught the cold air, plunging into its eternal home - your own heart...");
                }, 3000);
                setTimeout(function () {
                    outputText("Darkness envelops you, and you feel your life slipping away. Blood seeps from your wound, pooling around you as the laughter fades into a haunting silence.");
                }, 6000);
                setTimeout(function () {
                    outputText("You have met a grim fate, all in the name of curiosity...");
                }, 9000);
                setTimeout(function () {
                    window.location.href = "gameEnd.html";
                }, 12000);
            } else{
                var audio = new Audio("/audio/unsheath.mp3");
                audio.play();
                setTimeout(function () {
                    var audio = new Audio("/audio/stab.mp3");
                    audio.play();
                }, 2000);
                outputText("You lunge at Santa with the knife, but as you strike, he vanishes into a swirl of shadows and cold air. A chilling laughter echoes around you, and you feel an icy grip on your soul. The room fades to black, and you realize some forces are beyond your control.");
                setTimeout(function () {
                    window.location.href = "gameEnd.html";
                }, 7000);
            }           
        } else {
            intFailSound();
            outputText("You don't have the facilities for that... maybe you need a *knife*")
        }
    } else {
        intFailSound();
        outputText("You cant kill " + noun.toLowerCase());
    }
}

// trigger ending when santa is awakened
function santa() {
    output.appendChild(document.createElement("br"));

    // does player have papers
    if (items[7].location === inventory) {
        var done = x;
        x = false;
        if (done == false) {
            tasks++;
        }
    }

    // if enough tasks done, end game
    if (tasks >= 4) {
        outputText("Santa rises slowly from the command chair, his glossy eyes locking onto yours. The air thickens around you, charged with a strange, expectant energy.");

        setTimeout(function () {
            outputText("His voice, low and otherworldly, whispers: 'Thank you...'");
            var audio = new Audio("/audio/bellSound.mp3");
            audio.play();
        }, 2000);

        setTimeout(function () {
            outputText("The room trembles violently, walls cracking and dust falling like fine snow. Cracks of brilliant light splinter across reality.");
        }, 4000);

        setTimeout(function () {
            outputText("The sleigh materializes before you, its runners glowing with ancient power. The reindeer's eyes burn with ethereal light, alive and aware.");
        }, 6000);

        setTimeout(function () {
            outputText("You feel yourself lifted, gravity releasing its grip. The ground falls away beneath your feet as the North Pole dissolves into starlight and shadow.");
        }, 8000);

        setTimeout(function () {
            outputText("Time fractures. In a single eternal moment, you witness everything—endless deliveries across countless worlds, children's wonder made manifest, centuries of magic and purpose intertwined.");
        }, 10000);

        setTimeout(function () {
            outputText("The visions fade. A white void stretches endlessly in all directions, infinite and serene. You have awakened something ancient, and it has acknowledged you.");
        }, 12000);

        setTimeout(function () {
            outputText("Your task is complete. The North Pole fades into memory and dream...");
        }, 14000);

        setTimeout(function () {
            window.location.href = "gameEnd.html";
        }, 20000);
    } else {
        outputText("Santa stirs slightly, his eyes flickering open, but he remains seated, motionless, as if waiting for something more.");
        outputText("A soft rumble passes through the room, the air heavy with anticipation. Perhaps you still have more to do before he truly awakens.");
        john();
        setInterval(function () {
            output.appendChild(document.createElement("br"));
            outputText("help");
        }, 10000)
    }
}

// wrap presents to complete a task
function wrapPresents(noun) {
    output.appendChild(document.createElement("br"));
    if (noun.toUpperCase() === "TOYS" || noun.toUpperCase() === "PRESENTS") {
        // check if player has materials
        if (roomsNum === 5 || items[6].location === inventory) {
            var audio = new Audio("/audio/wrapping.mp3");
            audio.play();
            outputText("You set to work, fingers flying over the shifting wrapping paper. The patterns twist and coil, almost playful, as presents come together. One launches from your hands, thudding against a door in the connector.");
            rooms[4].exits = "north, east, south or west"; // unlock new exit
            invAdd(items[10]);
            tasks++;
            // remove used items
            for (let item of items) {
                if ((item.name.toUpperCase() === "TOYS" && item.location === inventory) || (item.name.toUpperCase() === "WRAPPING PAPER" && (item.location === inventory || item.location === 5))) {
                    item.location = gone;
                    invDrop(item);
                }
            }
        } else {
            intFailSound();
            outputText("You lack the materials to wrap anything. The paper and toys remain stubbornly out of reach.");
        }
    } else {
        intFailSound();
        outputText("You attempt to wrap " + noun.toLowerCase() + ", but it resists your efforts. Perhaps stick to toys and presents.");
    }
}

// =======================
// GAME INITIALISATION
// =======================

// set up all rooms and items at start
function initGame() {
    // initialize rooms
    rooms[0] = {
        name: "Basement",
        exits: "east or south",
        desc: "The air is thick and metallic, heavy with the stench of old blood that never fully dried. Rusted chains hang from the rafters like frozen icicles, each one ending in a hook sharpened far beyond necessity. Splintered wooden toys—tiny trains, dolls with missing eyes, stuffed animals torn open—lie scattered across the floor, all soaked in the same dark stains. On the far wall, a massive workbench is lit by a single flickering bulb, illuminating blades arranged with obsessive care, each tagged with a child's name in trembling red ink. Deep gouges in the stone floor show where something… or someone… tried to crawl away. A Santa hat lies in the corner, its fluffy trim matted and brown. You can still hear it—faint, muffled—like someone choking on a carol they never wanted to sing.",
    };
    rooms[1] = {
        name: "Garage",
        exits: "east or south",
        hiddenExits: "west",
        desc: "The garage stretches beyond reason, its ceiling vanishing into shadow. Cold drafts curl along the walls like ghostly fingers, brushing against your skin. The sleigh dominates the center, its metal runners humming softly, as if recalling journeys it should never have taken. In the stalls, the reindeer stand statuesque—their glassy eyes flicker whenever you look away, hinting at a quiet awareness. There's a strange sound emanating from the west."
    };
    rooms[2] = {
        name: "Workshop",
        exits: "south",
        desc: "The workshop smells of old varnish and cold metal. Long wooden tables stretch into dimness, cluttered with tools that glint strangely. A fine dust floats lazily, drifting against the air currents instead of with them. Half-finished toys sit unnaturally still, their painted eyes catching light that seems not to exist. A conveyor belt moves sporadically, as though following its own secret rhythm."
    };
    rooms[3] = {
        name: "Santa's HQ",
        exits: "east",
        hiddenExits: "north",
        desc: "The command room hums with low electrical static that pricks along your arms. Walls are lined with flickering screens showing distorted maps and unreadable codes. A red carpet feels plush yet unnervingly cold. In the massive chair sits a figure motionless, but faint rustles hint at imperceptible movement. Occasionally, the screens flash bright red—a silent warning you can't quite decipher. There's a strange sound emanating from the north."
    };
    rooms[4] = {
        name: "Connector",
        exits: "east, south or west",
        desc: "A narrow corridor stretches like a spine, its walls too close and lighting unreliable. Each flickering bulb creates illusions of movement ahead or behind you. The floorboards creak underfoot in hollow, uneven tones. Scattered oats lie in precise patterns, some shifting slightly as if nudged by unseen fingers."
    };
    rooms[5] = {
        name: "Wrapping Station",
        exits: "north or west",
        desc: "The wrapping station is a maze of paper rolls and half-finished packages. Fluorescent lights cast a sickly glow, highlighting shifting wrapping patterns. Paper draped over chairs moves slightly, as if breathing. A roll on the floor rustles toward a table leg like a patient serpent. A distant tapping echoes through the room, rhythmic but inexplicable."
    };
    rooms[6] = null;
    rooms[7] = {
        name: "Front Desk",
        exits: "north",
        desc: "The front desk area feels frozen in time. Overhead lanterns cast amber light, the air dry and dusty. Papers shuffle subtly on the desk, separating names into neat columns of naughty and nice. A bell rests untouched, yet you could swear it rings under its own volition. The office chair slowly shifts, as if observing you."
    }

    // initialize items
    items[0] = {
        name: "Sleigh",
        desc: "The sleigh's runners hum with a faint, otherworldly resonance. Frost clings unnaturally to the metal, and shadows seem to linger beneath it, shifting just beyond your sight.",
        location: 1,
        gettable: false,
        visible: true
    };

    items[1] = {
        name: "Harness",
        desc: "The leather straps twitch almost imperceptibly when unobserved, as if eager to be worn. The buckles feel unnervingly cold, sending a shiver down your spine when touched.",
        location: 1,
        gettable: true,
        visible: true
    };

    items[2] = {
        name: "Reindeer",
        desc: "Their glassy eyes never blink, yet seem to follow every subtle movement you make. Their breathing is shallow, almost ghostly, and each soft exhale smells faintly of pine and cold metal.",
        location: 1,
        gettable: false,
        visible: true
    };

    items[3] = {
        name: "Toys",
        desc: "Each toy smiles differently, none in a way that feels natural. Some eyes glint too sharply, others tilt their heads unnaturally. A faint mechanical whir suggests they are aware of your presence.",
        location: 2,
        gettable: true,
        visible: true
    };

    items[4] = {
        name: "Santa",
        desc: "The suit appears full and lifelike, yet no rise or fall of breath breaks the eerie stillness. His eyes, when caught in the corner of your vision, seem to glimmer faintly with consciousness.",
        location: 3,
        gettable: false,
        visible: true
    };

    items[5] = {
        name: "Oats",
        desc: "The oats are scattered in patterns too precise to be accidental, almost like an arcane message. A faint warmth radiates from them, as if aware of hands that reach for them.",
        location: 4,
        gettable: true,
        visible: true,
        used: false
    };

    items[6] = {
        name: "Wrapping Paper",
        desc: "The paper's surface seems to ripple subtly when you blink. Snowflakes twist and coil into unfamiliar shapes, giving the sense that the sheets themselves are alive and observing you.",
        location: 5,
        gettable: true,
        visible: true
    };

    items[7] = {
        name: "Papers",
        desc: "The pages shuffle on their own, names smudging and shifting as if reconsidering their judgements. Some columns appear to whisper faintly when looked at too closely.",
        location: 7,
        gettable: true,
        visible: true
    };

    items[8] = {
        name: "Bell",
        desc: "A tiny silver bell that rings without being touched. The tone reverberates farther than it should, and the faintest shadow seems to move in response.",
        location: 7,
        gettable: true,
        visible: true
    };

    items[9] = {
        name: "Candy Cane",
        desc: "A striped cane that's unusually light. A soft tapping seems to echo from within, as though something inside is waiting for you to pay attention.",
        location: 5,
        gettable: true,
        visible: true
    };

    items[10] = {
        name: "Wrapped Presents",
        desc: "Toys wrapped in animated paper that hums softly from the inside. The paper seems to pulse lightly, almost breathing, suggesting the contents are more than ordinary gifts.",
        location: gone,
        gettable: true
    };

    items[11] = {
        name: "Knife",
        desc: "A sharp blade with a handle worn smooth by use. The edge glints unnaturally, reflecting light in a way that suggests it has seen far more than simple cutting tasks.",
        location: 0,
        gettable: true,
        visible: true
    };

    items[12] = {
        name: "Box",
        desc: "A cardboard box, wrinkled and stained with blood from years of use - the sides are close the bursting.",
        location: 5,
        gettable: false,
        visible: true,
    };

    items[13] = {
        name: "Mistletoe",
        desc: "Don't do what I think you're going to do...",
        location: box,
        gettable: true,
        visible: true,
    };

    items[14] = {
        name: "Dead rat",
        desc: "A dead rat, it looks like the box has already nibbled on it - I wouldn't eat that if I were you",
        location: box,
        gettable: true,
        visible: true,
        eatable: true,
    };

    items[15] = {
        name: "Clipboard",
        desc: "A clipboard, pages slightly stained by blood spatter - 'THINGS TO DO: Give Santa documents, Wrap toys, Feed reindeer, Harness reindeer, Wake up the man himself",
        location: 7,
        visible: true,
        gettable: true,
    };

    items[16] = {
        name: "Chains",
        desc: "Large, solid loops of metal connected to eachother - rusted from time, leaving brown residue on anything that touches them - could definitely hold someone down...",
        location: 0,
        visible: true,
        gettable: true,
    }

    outputText("Another day at work, today's the big day, the day that relies on masterful precision and hard work throughout the year. Your briefing yesterday stated 'Come in tomorrow, ask no questions - get your job done and leave', you know santa gets cranky during Christamas time, but this seems suspicios - as if something is really off...")
    outputText("You arrive at the North Pole facility, the air biting and cold. The building looms ahead, its windows dark and unwelcoming. You step inside, the door creaking ominously behind you as you enter the dimly lit front desk area.");
    outputText("Let's see what you have to do today on your clipboard...");
    output.appendChild(document.createElement("br"));
    // start player in front desk room
    roomsNum = 7;
    // track first room as discovered
    discoveredrooms.push(7);
    // focus on input field
    cli.focus();
    // display starting room
    showrooms();
    updateMinimap();
}

// =======================
// CREATE GAME ENVIRONMENT
// =======================

// add text to output display
function outputText(txt) {
    let newPara = document.createElement("p");
    newPara.innerHTML = txt;
    output.appendChild(newPara);
    newPara.scrollIntoView();
}

// update minimap display based on discovered rooms
function updateMinimap() {
    let minimapGrid = document.getElementById("minimap-grid");
    minimapGrid.innerHTML = "";

    for (let i = 0; i <= 8; i++) {
        let roomsBox = document.createElement("div");
        roomsBox.className = "minimap-rooms";
        // hide inaccessible rooms
        if (i === 0 || i === 6 || i === 8) {
            roomsBox.style.visibility = "hidden";
            minimapGrid.appendChild(roomsBox);
            continue;
        }
        // show discovered rooms
        if (discoveredrooms.includes(i)) {
            roomsBox.innerHTML = rooms[i] ? rooms[i].name : "?";
            roomsBox.style.backgroundColor = "#1a1a1a";
            roomsBox.style.color = "#b0b0b0";
        } else {
            // show undiscovered rooms as question marks
            roomsBox.innerHTML = "?";
            roomsBox.style.backgroundColor = "#0a0a0a";
            roomsBox.style.color = "#404040";
        }
        // highlight current room
        if (i === roomsNum) {
            roomsBox.classList.add("current");
        }
        minimapGrid.appendChild(roomsBox);
    }
}

// display current room info
function showrooms() {
    outputText("══════════════════");
    outputText("--- " + rooms[roomsNum].name + " ---");
    outputText("══════════════════");
    output.appendChild(document.createElement("br"));
    // show room description
    outputText(rooms[roomsNum].desc);
    output.appendChild(document.createElement("br"));
    outputText("You can see:");
    // list items in room
    for (itemsNum in items) {
        if (items[itemsNum].location == roomsNum && items[itemsNum].visible == true) {
            outputText(items[itemsNum].name);
        }
    }
    output.appendChild(document.createElement("br"));
    // show available exits
    outputText("You can go " + rooms[roomsNum].exits);
}

// =======================
// ITEM INTERACTIONS
// =======================

function eat(noun) {
    output.appendChild(document.createElement("br"));
    if (noun.toUpperCase() == "DEAD RAT" || noun.toUpperCase() == "RAT") {
        if (boxOpen == true || items[14].location == inventory) {
            damagePlayer();
            outputText("You take a bite of the rat. The taste is foul, a mix of decay and something metallic. Almost immediately, a wave of nausea hits you, your vision blurring as the room spins uncontrollably. Some things are better left uneaten...");
        } else
            outputText("You don't have a rat to eat");
    } else {
        outputText("You cant eat " + noun.toLowerCase());
    }
}

// throw item to random room
function chuck(noun) {
    output.appendChild(document.createElement("br"));
    let room = Math.floor(Math.random(8));
    let found = false;
    for (let item of items) {
        if (item.name.toUpperCase() === noun && item.location === inventory) {
            var audio = new Audio("/audio/pop.mp3");
            audio.play();
            item.location = room;
            invDrop(item);
            outputText("Why would you do that...");
            found = true;
            // keep item in valid room
            if (item.location == 0 || item.location == 6) {
                item.location++;
            }
        }
    }
    if (!found) {
        intFailSound();
        outputText("You don't have " + noun.toLowerCase());
    }
}

// look at item description
function examine(noun) {
    output.appendChild(document.createElement("br"));
    let found = false;
    for (let item of items) {
        if (item.name.toUpperCase() === noun.toUpperCase() && (item.location === roomsNum || item.location === inventory)) {
            outputText(item.desc);
            found = true;
        }
    }
    if (!found) {
        intFailSound();
        outputText("You peer around, but " + noun.toLowerCase() + " refuses to reveal itself");
    }
}

// drop item to current room
function drop(noun) {
    output.appendChild(document.createElement("br"));
    let found = false;
    for (let item of items) {
        if (item.name.toUpperCase() === noun && item.location === inventory) {
            var audio = new Audio("/audio/pop.mp3");
            audio.play();
            item.location = roomsNum;
            invDrop(item);
            outputText("You place " + item.name.toLowerCase() + " on the ground.");
            found = true;
        }
    }
    if (!found) {
        intFailSound();
        outputText("You don't have " + noun.toLowerCase());
    }
}

// pick up item from current room
function get(noun) {
    output.appendChild(document.createElement("br"));
    let found = false;
    for (let item of items) {
        if (item.name.toUpperCase() === noun && item.location === roomsNum && item.gettable === true) {
            var audio = new Audio("/audio/pop.mp3");
            audio.play();
            item.location = inventory;
            invAdd(item);
            outputText("You pick up " + item.name.toLowerCase());
            found = true;
            break;
        }
        if (item.name.toUpperCase() === noun && item.location === box && item.gettable === true) {
            var audio = new Audio("/audio/pop.mp3");
            audio.play();
            item.location = inventory;
            invAdd(item);
            outputText("You pick up " + item.name.toLowerCase());
            found = true;
            break;
        }
    }
    if (!found) {
        intFailSound();
        outputText("You can't see " + noun.toLowerCase() + ". Perhaps it hides from you.");
    }
}

// ring the bell to wake santa
function ringBell(noun) {
    output.appendChild(document.createElement("br"));
    if (noun.toUpperCase() === "BELL" && items[8].location === inventory) {
        outputText("You lift the bell and give it a gentle ring. The sound shimmers through the halls, faint yet commanding. Somewhere in the distance, something stirs, acknowledging your call.");
        var audio = new Audio("/audio/bellSound.mp3");
        audio.play();
        // if in santa's room, trigger ending
        if (roomsNum === 3) {
            outputText("A figure shifts in the shadows, eyes opening—he wakes up...");
            santa();
        }
    } else {
        intFailSound();
        outputText("You fumble with an invisible bell. The air remains unbroken, silent, and disapproving.");
    }
}

// feed oats to reindeer
function feedReindeer(noun) {
    output.appendChild(document.createElement("br"));
    if (noun.toUpperCase() === "REINDEER") {
        // only works in garage
        if (roomsNum === 1) {
            if (items[5].location === inventory) {
                var audio = new Audio("/audio/eating.mp3");
                audio.play();
                outputText("The reindeer sniff the oats, their breath visible in the cold air. Slowly, they snatch them from your hands, their glassy eyes glimmering with a strange satisfaction. A soft, low rumble echoes from the connector, as if the building itself is acknowledging your offering.");
                items[5].used = true;
                // remove oats from inventory
                for (let item of items) {
                    if (item.name.toUpperCase() === "OATS" && item.location === inventory) {
                        item.location = gone;
                        invDrop(item);
                        tasks++;
                    }
                }
            } else {
                intFailSound();
                outputText("You fumble around, but you have no oats to offer. The reindeer stare, unimpressed.");
            }
        } else {
            intFailSound();
            outputText("There aren't any reindeer here, only shadows that seem to shift when you blink.");
        }
    } else {
        intFailSound();
        outputText("You can't feed " + noun.toLowerCase());
    }
}

// put harness on reindeer
function harness(noun) {
    output.appendChild(document.createElement("br"));
    if (noun.toUpperCase() === "REINDEER") {
        // only works in garage
        if (roomsNum === 1) {
            if (items[1].location === inventory) {
                // reindeer must be fed first
                if (items[5].used === true) {
                    var audio = new Audio("/audio/harness.mp3");
                    audio.play();
                    outputText("Cold to the touch, the reindeer's skeletal form slides into the harness, surprisingly compliant. A deep rumble rises from their chest as if approving your efforts. The room feels alive with a tension you can almost hear.");
                    // remove harness from inventory
                    for (let item of items) {
                        if (item.name.toUpperCase() === "HARNESS" && item.location === inventory) {
                            item.location = gone;
                            invDrop(item);
                            tasks++;
                        }
                    }
                } else {
                    intFailSound();
                    outputText("The reindeer snap and gnash, revealing rows of sharp teeth. Perhaps they need to be fed first.");
                }
            } else {
                intFailSound();
                outputText("You reach for a harness that isn't here. The cold leather is missing from your grasp.");
            }
        } else {
            intFailSound();
            outputText("There aren't any reindeer here, only empty stalls and faint echoes.");
        }
    } else {
        intFailSound();
        outputText("You can't harness " + noun.toLowerCase());
    }
}

// open box, view items inside
function openBox(noun) {
    output.appendChild(document.createElement("br"));
    if (noun.toUpperCase() === "BOX" || noun.toUpperCase() === "IN BOX") {
        // only works in wrapping station
        if (roomsNum == 5) {
            var audio = new Audio("/audio/openChest.mp3");
            audio.play();
            boxOpen = true;
            outputText("You can see:");
            for (itemsNum in items) {
                if (items[itemsNum].location == box && items[itemsNum].visible == true) {
                    outputText(items[itemsNum].name);
                }
            }
        } else {
            outputText("There is no box here");
        }
    } else {
        outputText("You cant open " + noun);
    }
}

// =======================
// INVENTORY
// =======================

// add item to inventory display
function invAdd(item) {
    let itemsContainer = document.getElementById("items-container");
    let para = document.createElement("p");
    para.classList.add("item");
    para.textContent = item.name;
    itemsContainer.appendChild(para);
    // click item to examine it
    para.onclick = function () {
        examine(item.name);
    };
}

// remove item from inventory display
function invDrop(item) {
    let itemsContainer = document.getElementById("items-container");
    let itemElements = itemsContainer.getElementsByClassName("item");
    for (let element of itemElements) {
        if (element.textContent == item.name) {
            element.remove();
            break;
        }
    }
}

// =======================
// MISC
// =======================

// player damage UI
function damagePlayer() {
    x = document.getElementById("output");
    setInterval(function () {
        x.setAttribute("class", "damage");
    }, 2000);
    setInterval(function () {
        x.removeAttribute("class", "damage");
    }, 4000);
}

// show help menu
function help(noun) {
    output.appendChild(document.createElement("br"));
    asks++;
    if (noun.toUpperCase() === "PLEASE") {
        // show full help menu
        outputText("The world seems to lean in, listening carefully. Here is what you can do:");
        outputText("Movement:");
        outputText("North (n), South (s), East (e), West (w)");
        outputText("===");
        outputText("Pick up items:");
        outputText("Pickup, get, grab, take");
        outputText("===");
        outputText("Drop items:");
        outputText("Drop, remove, chuck");
        outputText("===");
        outputText("Examine items:");
        outputText("Examine, inspect, x");
        outputText("===");
        outputText("Open containers:")
        outputText("Open, look in")
        outputText("===");
        outputText("Other (item-specific / unique actions):");
        outputText("Feed, ring, wrap, hitch, harness");
        outputText("===");
        outputText("There are more to be discovered as you play");
        outputText("===");
        outputText("Exit:")
        outputText("Back or leave")
    } else if (asks >= 3 && noun.toUpperCase() !== "PLEASE") {
        // complain if asked too many times
        outputText("A faint whisper echoes in the room: 'Are you seriously going to keep asking that?'");
    } else {
        // ask nicely
        outputText("The room waits patiently. Perhaps ask nicely.");
    }
}

// exit game
function back() {
    if (confirm("Are you sure you want to leave... he won't be happy.")) {
        window.location.href = "index.html";
    } else {
        output.appendChild(document.createElement("br"));
        outputText("Good choice...");
    }
}

// =======================
// SOUNDS
// =======================

// enable music when user interacts with page
function enableMenuMusic() {
    let music = document.getElementById("menuMusic");
    function unlockAudio() {
        music.muted = false;
        music.volume = 0.3;
        music.play();
        // remove event listeners
        document.removeEventListener("keydown", unlockAudio);
        document.removeEventListener("click", unlockAudio);
    }
    // wait for user interaction to play music
    document.addEventListener("keydown", unlockAudio, { once: true });
    document.addEventListener("click", unlockAudio, { once: true });
}

// play failure sound
function intFailSound() {
    var audio = new Audio("/audio/failInt.mp3");
    audio.play();
}

// play walking sound
function walkSound() {
    var audio = new Audio("/audio/walk.mp3");
    audio.play();
}

// play pop sound
function pop() {
    var audio = new Audio("/audio/pop.mp3");
    audio.play;
}

// =======================
// VIDEOS
// =======================

let johnInterval = null;

// play john every 10 seconds
function john() {
    if (johnInterval) return; // only start once

    johnInterval = setInterval(function () {

        // create video element
        let vid = document.createElement("video");
        vid.id = "johnVideo";
        vid.autoplay = true;
        vid.muted = false;
        vid.playsInline = true;

        // set video source
        let src = document.createElement("source");
        src.src = "/video/johnvid.mp4";
        src.type = "video/mp4";

        vid.appendChild(src);
        document.body.appendChild(vid);

        // remove video after 1 second
        setTimeout(function () {
            vid.remove();
        }, 1000);

    }, 10000);
}