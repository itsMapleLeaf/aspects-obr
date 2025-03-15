export const attributes = {
	strength: {
		name: "Strength",
		description: "applying force and heavy hits",
	},
	sense: {
		name: "Sense",
		description: "finding and picking up on things",
	},
	dexterity: {
		name: "Dexterity",
		description: "precision and acrobatics",
	},
	intellect: {
		name: "Intellect",
		description: "reasoning, knowledge, and problem-solving",
	},
	presence: {
		name: "Presence",
		description: "people smarts, influence, manipulation",
	},
}

export const aspects = {
	fire: {
		name: "Fire",
		aura: "rage, violence, destruction",
		material: "flame, heat, tectonics",
	},
	water: {
		name: "Water",
		aura: "tranquility, comfort, quiet",
		material: "liquids, vapor, ice",
	},
	wind: {
		name: "Wind",
		aura: "adaptability, turbulence, freedom",
		material: "air, sound, weather",
	},
	light: {
		name: "Light",
		aura: "justice, order, stability",
		material: "physical light, healing, enhancements",
	},
	darkness: {
		name: "Darkness",
		aura: "manipulation, tension, abandon",
		material: "illusions, reality bending, psychology",
	},
}

export const lineages = [
	{
		name: "Furbearers",
		aspects: [aspects.fire],
		example: "dogs, foxes, wolves, cats, rabbits, mice, bears, raccoons",
		ability: "Party Tactics - Your rolls have +1 die per ally in medium range.",
	},
	{
		name: "Scalebearers",
		aspects: [aspects.fire],
		example: "snake, lizard, alligator, crocodile, dragons",
		ability: "Hardened Scales - Increase your max hits by 5.",
	},
	{
		name: "Aquatics",
		aspects: [aspects.water],
		example: "fish, dolphins, other water-bound creatures",
		ability:
			"Oceanic Instinct - Water does not count as rough terrain. You can move two zones through water for 1 movement.",
	},
	{
		name: "Avians",
		aspects: [aspects.wind],
		example: "eagles, ravens, penguins, flamingo, all other birds",
		ability:
			"Flight - You may remain in a floorless zone where you would otherwise fall.",
	},
	{
		name: "Arthropods",
		aspects: [aspects.light],
		example: "insects, arachnids, bugs, most creatures with exoskeletons",
		ability:
			"Trillion Senses - You may reroll any failed Sense roll once per roll.",
	},
	{
		name: "Devils",
		aspects: [aspects.darkness],
		example: "demons, devils, succubus/incubus, vampires",
		ability:
			"Innate Charm - After applying modifiers, your Presence rolls always have no less than 3 dice.",
	},
]

export const actions = {
	strike: {
		name: "Strike",
		attribute: attributes.strength,
		description: "Attack a character with your fist or a weapon",
	},
	block: {
		name: "Block",
		attribute: attributes.strength,
		description: "Guard against an incoming attack",
	},
	exert: {
		name: "Exert",
		attribute: attributes.strength,
		description:
			"Any general application of force: lifting things, pushing things, holding another character still, etc.",
	},
	endure: {
		name: "Endure",
		attribute: attributes.strength,
		description: "Resist external physical forces",
	},
	locate: {
		name: "Locate",
		attribute: attributes.sense,
		description: "Proactively find something with your senses",
	},
	notice: {
		name: "Notice",
		attribute: attributes.sense,
		description: "Reactively see, hear, or feel something",
	},
	focus: {
		name: "Focus",
		attribute: attributes.sense,
		description:
			"Resist external emotional or any other form of mental influence",
	},
	rest: {
		name: "Rest",
		attribute: attributes.sense,
		description: "Take a quick break, a comfy nap, or a good night's rest",
	},
	shoot: {
		name: "Shoot",
		attribute: attributes.dexterity,
		description: "Fire a weapon to strike at a range",
	},
	dodge: {
		name: "Dodge",
		attribute: attributes.dexterity,
		description: "Evade an incoming attack",
	},
	maneuver: {
		name: "Maneuver",
		attribute: attributes.dexterity,
		description:
			"Jumping, climbing, swimming, and other movements requiring precision and/or balance",
	},
	dash: {
		name: "Dash",
		attribute: attributes.dexterity,
		description: "Move swiftly to get to your destination quicker",
	},
	sneak: {
		name: "Sneak",
		attribute: attributes.dexterity,
		description: "Stay hidden and/or quiet",
	},
	aid: {
		name: "Aid",
		attribute: attributes.intellect,
		description: "Offer first aid to someone else",
	},
	persuade: {
		name: "Persuade",
		attribute: attributes.intellect,
		description: "Influence another character through reasoning",
	},
	intuit: {
		name: "Intuit",
		attribute: attributes.intellect,
		description: "Apply understanding to solve a logical problem",
	},
	charm: {
		name: "Charm",
		attribute: attributes.presence,
		description:
			"Influence another character with bribery, flattery, or amusement",
	},
	intimidate: {
		name: "Intimidate",
		attribute: attributes.presence,
		description: "Influence another character with threats or blackmail",
	},
	read: {
		name: "Read",
		attribute: attributes.presence,
		description: "Try to see through lies or glean someone's intent",
	},
	deceive: {
		name: "Deceive",
		attribute: attributes.presence,
		description: "Try to lie convincingly",
	},
}

export const aspectSkills = [
	// Water aspect skills
	{
		name: "Ice Bridge",
		aspect: aspects.water,
		description: "Shape ice into walkable platforms",
		effect:
			"Starting from an adjacent zone, draw a path of adjacent zones, 1 zone per success. All zones in this path gain solid floors that negate rough terrain and hazards.",
	},
	{
		name: "Crystal Cage",
		aspect: aspects.water,
		description: "Entrap a character in crystalline walls of ice",
		effect:
			"Choose 1 zone per success within long range (5), then create a solid wall surrounding each zone. Characters cannot pass through this wall. Characters must deal at least 1 hit to a wall to destroy it.",
	},
	{
		name: "Shield",
		aspect: aspects.water,
		description: "Protect a character from harm with an icy shield",
		effect:
			"If a chosen character within long range (5) would take hits from an action, prevent 1 hit per success",
	},
	{
		name: "Hailstorm",
		aspect: aspects.water,
		description: "Summon an indiscriminate storm of piercing hailstones",
		effect:
			"All enemies within medium range (2) take 1 hit per success. On success, all allies within medium range take 1 hit per success.",
	},
	{
		name: "Geyser",
		aspect: aspects.water,
		description: "Elevate character with a burst of water",
		effect:
			"Choose up to 1 character per success. Those characters cannot take hits for 1 turn.",
	},

	// Wind aspect skills
	{
		name: "Dampen",
		aspect: aspects.wind,
		description: "Create a zone of absolute silence",
		effect:
			"For 1 round per success, characters in medium range (2) from your current location have -3 dice on hearing-based Sense rolls",
	},
	{
		name: "Accelerate",
		aspect: aspects.wind,
		description: "Propel targets forward with gusts of wind",
		effect:
			"All characters in a chosen zone within long range (5) gain 1 movement per success for 1 round",
	},
	{
		name: "Decelerate",
		aspect: aspects.wind,
		description: "Create headwinds to slow targets",
		effect:
			"All characters in a chosen zone within long range (5) lose 1 movement per success for 1 round",
	},
	{
		name: "Amplify",
		aspect: aspects.wind,
		description: "Enhance acoustic vibrations",
		effect:
			"For 1 round per success, characters in short range from your current location have +3 dice on hearing-based Sense rolls",
	},
	{
		name: "Gust",
		aspect: aspects.wind,
		description: "Shift a character's position with a strong gust of wind",
		effect:
			"Choose a zone within medium range (2). Move all characters in that zone by 1 zone per success.",
	},

	// Light aspect skills
	{
		name: "Hand of Brilliance",
		aspect: aspects.light,
		description: "Grant an inspiring glow to allies",
		effect:
			"Choose up to 1 character per success. Grant those characters an extra action on their turn",
	},
	{
		name: "Heal",
		aspect: aspects.light,
		description: "Channel restorative light energy",
		effect: "A chosen character within long range (5) heals 1 hit per success",
	},
	{
		name: "Healing Aura",
		aspect: aspects.light,
		description: "Conjure a warm aura of illuminating wellness",
		effect:
			"All allies within short range (1) heal 2 hits on success, 1 hit on failure",
	},
	{
		name: "Enhance",
		aspect: aspects.light,
		description: "Empower allies with radiant energy",
		effect:
			"For 1 round, a chosen character within medium range (2) gains +1 die per success (on this roll) on their rolls",
	},
	{
		name: "Redemption",
		aspect: aspects.light,
		description: "Allow a character to reroll a failed roll",
		effect: "Allow a character to reroll a failed roll",
	},
	{
		name: "Purify",
		aspect: aspects.light,
		description: "Quickly conjure a purifying shield of light",
		effect: "When you take hits, heal that many hits on another character",
	},
	{
		name: "Illuminate",
		aspect: aspects.light,
		description: "Create revealing spheres of light",
		effect: "Create revealing spheres of light",
	},

	// Darkness aspect skills
	{
		name: "Shade",
		aspect: aspects.darkness,
		description:
			"Create a sphere of darkness so imposing, not even light can escape",
		effect:
			"For 1 round per success, characters within short range (1) have -3 dice on actions requiring targets and sight-based Sense actions",
	},
	{
		name: "Confusion",
		aspect: aspects.darkness,
		description: "Create mental fog that clouds thinking",
		effect:
			"For 1 round per success, characters within short range (1) have -3 dice on Intellect actions",
	},
	{
		name: "Riftwalk",
		aspect: aspects.darkness,
		description:
			"Shift your surrounding reality, translating yourself through the fourth dimension",
		effect: "Move to any zone within a range equal to the success count",
	},
	{
		name: "Imperil",
		aspect: aspects.darkness,
		description: "Curse targets with a sudden, sharp pang of exhaustion",
		effect:
			"Choose 1 character per success within medium range (2). Chosen characters take 1 fatigue.",
	},
	{
		name: "Weaken",
		aspect: aspects.darkness,
		description: "Drain a target's life force",
		effect:
			"A chosen character within long range (5) has -1 die per success for 1 round",
	},

	// Fire aspect skills
	{
		name: "Flame Wall",
		aspect: aspects.fire,
		description: "Create barriers of roaring flames",
		effect:
			"Choose 1 zone within long range (5) per success. Chosen zones deal 1 hit when entered or exited for one round",
	},
	{
		name: "Burning",
		aspect: aspects.fire,
		description: "Wreath your attacks in searing flames",
		effect:
			"When making an action that deals hits, add 2 hits per success (on this roll)",
	},
	{
		name: "Arc of Flame",
		aspect: aspects.fire,
		description: "Fling a circle of flame around yourself",
		effect:
			"Choose 1 target per success within short range (1). Deal 2 hits to each one.",
	},
	{
		name: "Heating",
		aspect: aspects.fire,
		description: "Fill an area with oppressive heat",
		effect:
			"Choose 1 zone within medium range (2) per success. For 1 round, characters take 1 fatigue when entering or starting their turn in those zones.",
	},
	{
		name: "Bolt",
		aspect: aspects.fire,
		description: "Deploy an indiscriminate bolt of lightning",
		effect: "Deal 1 hit per success to a random enemy",
	},
]

export const personas = [
	{
		name: "Commander",
		description: "Empowers and strengthens allies",
		ability:
			"Battle Cry - Your allies within short range have +1 die on their rolls.",
	},
	{
		name: "Fighter",
		description: "Solves problems with physical force and prowess",
		ability: "Unwavering - Your actions deal 1 extra hit.",
	},
	{
		name: "Manipulator",
		description: "Indirectly tips the scales of conflict in their favor",
		ability: "Trickery - Adrenaline in combat costs 1 less fatigue.",
	},
	{
		name: "Protector",
		description: "Protects others from threats",
		ability:
			"Empowered Defender - In combat, your rolls have +1 die for each hit prevented since your last action.",
	},
	{
		name: "Strategist",
		description: "Excels in agility, adaptability, and field tactics",
		ability: "Nimble - You have +1 movement.",
	},
	{
		name: "Vitalist",
		description: "Focuses on the well-being and recovery of others",
		ability:
			"Blessed Healer - When you heal 1 hit on another character, also heal 1 hit on yourself.",
	},
]

export const characterLevels = [
	{ level: 1, attributePoints: 0 },
	{ level: 2, attributePoints: 0 },
	{ level: 3, attributePoints: 1 },
	{ level: 4, attributePoints: 1 },
	{ level: 5, attributePoints: 2 },
	{ level: 6, attributePoints: 2 },
	{ level: 7, attributePoints: 3 },
	{ level: 8, attributePoints: 3 },
	{ level: 9, attributePoints: 4 },
	{ level: 10, attributePoints: 4 },
	{ level: 11, attributePoints: 5 },
	{ level: 12, attributePoints: 5 },
	{ level: 13, attributePoints: 6 },
]
