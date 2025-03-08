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
		// attributes: [attributes.strength, attributes.presence],
		aspects: [aspects.fire],
		example: "dogs, foxes, wolves, cats, rabbits, mice, bears, raccoons",
	},
	{
		name: "Scalebearers",
		// attributes: [attributes.strength, attributes.dexterity],
		aspects: [aspects.fire],
		example: "snake, lizard, alligator, crocodile, dragons",
	},
	{
		name: "Aquatics",
		// attributes: [attributes.sense, attributes.dexterity],
		aspects: [aspects.water],
		example: "fish, dolphins, other water-bound creatures",
	},
	{
		name: "Avians",
		// attributes: [attributes.sense, attributes.presence],
		aspects: [aspects.wind],
		example: "eagles, ravens, penguins, flamingo, all other birds",
	},
	{
		name: "Arthropods",
		// attributes: [attributes.sense, attributes.dexterity],
		aspects: [aspects.light],
		example: "insects, arachnids, bugs, most creatures with exoskeletons",
	},
	{
		name: "Devils",
		// attributes: [attributes.strength, attributes.presence],
		aspects: [aspects.darkness],
		example: "demons, devils, succubus/incubus, vampires",
	},
]

export const drives = {
	dominance: {
		name: "Dominance",
		description:
			"you want to assert control through direct action and force of will",
	},
	empowerment: {
		name: "Empowerment",
		description:
			"you find purpose in enhancing the potential of yourself and others",
	},
	protection: {
		name: "Protection",
		description:
			"you find meaning in preserving the people and things you value",
	},
	adaptation: {
		name: "Adaptation",
		description:
			"you value versatility, responsiveness, and adjusting to changing circumstances",
	},
	manipulation: {
		name: "Manipulation",
		description:
			"you view the world as a complex system to influence as you see fit",
	},
}

export const roles = {
	metalworking: {
		name: "Metalworking",
		attribute: attributes.strength,
		examples: "create tools, utensils, weapons, armor, other hardware",
		drives: [drives.dominance, drives.adaptation],
	},
	farming: {
		name: "Farming",
		attribute: attributes.strength,
		examples: "field workers, ranchers",
		drives: [drives.empowerment, drives.protection],
	},
	lawEnforcement: {
		name: "Law Enforcement & Protection",
		attribute: attributes.strength,
		examples: "knight (police), protector",
		drives: [drives.dominance, drives.protection],
	},
	resources: {
		name: "Resources",
		attribute: attributes.strength,
		examples: "mining, material transport",
		drives: [drives.empowerment, drives.protection, drives.adaptation],
	},
	exploration: {
		name: "Exploration & Navigation",
		attribute: attributes.sense,
		examples: "explorer, navigator, cartographer",
		drives: [drives.adaptation, drives.manipulation],
	},
	investigation: {
		name: "Investigation",
		attribute: attributes.sense,
		examples: "detective",
		drives: [drives.dominance, drives.protection, drives.manipulation],
	},
	science: {
		name: "Science",
		attribute: attributes.sense,
		examples:
			"chemistry, astronomy, archaeology, biology, social science, herbalist, meteorologist",
		drives: [drives.empowerment, drives.adaptation],
	},
	medicine: {
		name: "Medicine",
		attribute: attributes.sense,
		examples: "doctor, nurse, surgeon, field medic",
		drives: [drives.empowerment, drives.protection, drives.adaptation],
	},
	transportation: {
		name: "Transportation",
		attribute: attributes.dexterity,
		examples: "wind ferry pilot, horse rider",
		drives: [drives.empowerment, drives.adaptation],
	},
	crafting: {
		name: "Crafting",
		attribute: attributes.dexterity,
		examples: "woodwork, toys, locksmithing, jewelry",
		drives: [drives.dominance, drives.adaptation, drives.manipulation],
	},
	art: {
		name: "Art",
		attribute: attributes.dexterity,
		examples: "painter, musician",
		drives: [drives.dominance, drives.adaptation, drives.manipulation],
	},
	underworld: {
		name: "Underworld",
		attribute: attributes.dexterity,
		examples: "burglars, smugglers, forgers, saboteurs, assassins, spies",
		drives: [drives.dominance, drives.adaptation, drives.manipulation],
	},
	entertainment: {
		name: "Entertainment",
		attribute: attributes.presence,
		examples: "actors, magicians, model, other performers",
		drives: [drives.dominance, drives.adaptation, drives.manipulation],
	},
	socialWork: {
		name: "Social Work",
		attribute: attributes.presence,
		examples: "receptionist, store clerk, surveyor",
		drives: [drives.protection, drives.empowerment],
	},
	education: {
		name: "Education",
		attribute: attributes.presence,
		examples: "academy professor, principals, instructors",
		drives: [drives.protection, drives.empowerment, drives.manipulation],
	},
	law: {
		name: "Law",
		attribute: attributes.presence,
		examples: "legislator, judge, lawyer",
		drives: [drives.protection, drives.empowerment, drives.manipulation],
	},
}

export const experiences = {
	stoppedBreakIn: {
		description: "stopped a break-in",
		attributes: [attributes.strength],
		aspects: [aspects.fire],
	},
	rebelliousUpbringing: {
		description: "rebellious upbringing",
		attributes: [attributes.strength],
		aspects: [aspects.fire, aspects.darkness],
	},
	gotLostInWilderness: {
		description: "got lost in the wilderness",
		attributes: [attributes.sense],
		aspects: [aspects.darkness, aspects.wind],
	},
	foragedForSurvival: {
		description: "foraged for survival",
		attributes: [attributes.sense],
		aspects: [aspects.wind, aspects.light],
	},
	readLotsOfBooks: {
		description: "read a lot of books",
		attributes: [attributes.sense],
		aspects: [aspects.light, aspects.water],
	},
	studiedTopicOfInterest: {
		description: "intensely studied a topic of interest",
		attributes: [attributes.sense],
		aspects: [aspects.light, aspects.water],
	},
	trainedInMarksmanship: {
		description: "trained in archery/marksmanship",
		attributes: [attributes.dexterity],
		aspects: [aspects.fire, aspects.wind],
	},
	tookGymnastics: {
		description: "took gymnastics",
		attributes: [attributes.dexterity],
		aspects: [aspects.wind, aspects.water],
	},
	martialArtsExperience: {
		description: "martial arts experience",
		attributes: [attributes.dexterity],
		aspects: [aspects.water, aspects.fire],
	},
	acquaintanceWithCrafter: {
		description: "close acquaintance with a crafter",
		attributes: [attributes.dexterity],
		aspects: [aspects.light, aspects.water],
	},
	providedForFamily: {
		description: "worked to provide for your family",
		attributes: [attributes.presence],
		aspects: [aspects.light],
	},
	classClown: {
		description: "class clown",
		attributes: [attributes.presence],
		aspects: [aspects.wind],
	},
	metFriendlyOutlander: {
		description: "met a friendly outlander",
		attributes: [attributes.presence],
		aspects: [aspects.water, aspects.wind],
	},
	livedInStrictHousehold: {
		description: "lived in a strict household",
		attributes: [attributes.presence],
		aspects: [aspects.light, aspects.darkness],
	},
	experiencedHomelessness: {
		description: "experienced homelessness",
		attributes: [attributes.presence],
		aspects: [aspects.darkness],
	},
	hadSeveralPartners: {
		description: "had several partners",
		attributes: [attributes.presence],
		aspects: [aspects.wind, aspects.darkness],
	},
}

export const actions = {
	strike: {
		name: "Strike",
		attribute: attributes.strength,
		description: "punch someone, damage equals number of successes",
	},
	block: {
		name: "Block",
		attribute: attributes.strength,
		description: "reduce damage by number of successes",
	},
	dodge: {
		name: "Dodge",
		attribute: attributes.dexterity,
		description: "roll more successes than damage to avoid it",
	},
	jump: {
		name: "Jump",
		attribute: attributes.dexterity,
		description: "gaps are a suggestion :)",
	},
	dash: {
		name: "Dash",
		attribute: attributes.dexterity,
		description: "s p e e d",
	},
	sneak: {
		name: "Sneak",
		attribute: attributes.dexterity,
		description: "sshhhh",
	},
	shoot: {
		name: "Shoot",
		attribute: attributes.dexterity,
		description: "eat my crossbow bitch",
	},
	locate: {
		name: "Locate",
		attribute: attributes.sense,
		description: "proactively find a thing",
	},
	notice: {
		name: "Notice",
		attribute: attributes.sense,
		description: "reactively see/hear/feel a thing",
	},
	rest: {
		name: "Rest",
		attribute: attributes.sense,
		description: "recover fatigue",
	},
	charm: {
		name: "Charm",
		attribute: attributes.presence,
		description: "bribery",
	},
	intimidate: {
		name: "Intimidate",
		attribute: attributes.presence,
		description: "blackmail",
	},
	deceive: {
		name: "Deceive",
		attribute: attributes.presence,
		description: "try to lie convincingly",
	},
	read: {
		name: "Read",
		attribute: attributes.presence,
		description: "try to see through lies, glean intent, or resist influence",
	},
}

export const aspectSkills = [
	{
		name: "Accelerate",
		aspect: aspects.wind,
		drives: [drives.adaptation],
		effect:
			"Until your next action, give your allies # additional combat movements on their turn",
	},
	{
		name: "Arc of Flame",
		aspect: aspects.fire,
		drives: [drives.dominance],
		effect: "Deal 1 hit to # characters at short range (not immediate range)",
	},
	{
		name: "Burning Aura",
		aspect: aspects.fire,
		drives: [drives.empowerment],
		effect:
			"# allies have +1 die on all of their strike, shoot, or aspect action rolls until your next action",
	},
	{
		name: "Call of the Night",
		aspect: aspects.darkness,
		drives: [drives.empowerment, drives.manipulation],
		effect: "All characters have +# dice on their rolls until your next action",
	},
	{
		name: "Castle",
		aspect: aspects.water,
		drives: [drives.protection],
		effect:
			"Prevent up to # hits to all allies at immediate range until your next action",
	},
	{
		name: "Cinder Storm",
		aspect: aspects.fire,
		drives: [drives.dominance],
		effect:
			"Deal 1 hit to every ally and yourself, then deal (success: 2 hits) (failure: 1 hit) to all enemies",
	},
	{
		name: "Discriminate",
		aspect: aspects.darkness,
		drives: [drives.manipulation],
		effect:
			"Every aspect check for a chosen aspect has -# dice until your next action",
	},
	{
		name: "Drain",
		aspect: aspects.darkness,
		drives: [drives.dominance, drives.protection],
		effect: "Deal 1 hit (success: then heal the amount of hits dealt)",
	},
	{
		name: "Energize",
		aspect: aspects.light,
		drives: [drives.protection],
		effect:
			"Prevent a character from taking up to # fatigue until your next action",
	},
	{
		name: "Expel",
		aspect: aspects.wind,
		drives: [drives.dominance],
		effect: "Move # enemies at immediate range to any zone within medium range",
	},
	{
		name: "Fair Play",
		aspect: aspects.wind,
		drives: [drives.empowerment, drives.manipulation],
		effect: "Deal # fatigue to all enemies with 0 hits",
	},
	{
		name: "Flame Strike",
		aspect: aspects.fire,
		drives: [drives.dominance],
		effect: "Deal # of hits to a character at immediate range",
	},
	{
		name: "Flamewall",
		aspect: aspects.fire,
		drives: [drives.adaptation, drives.protection],
		effect:
			"Choose a zone at short or immediate range. Until your next action, when any character enters or exits the chosen zone, they take # * 2 hits",
	},
	{
		name: "Fluidity",
		aspect: aspects.water,
		drives: [drives.adaptation, drives.empowerment],
		effect:
			"Reaction: after an ally makes a roll, allow them to reroll # of their dice and take the higher results",
	},
	{
		name: "Focused Healing",
		aspect: aspects.light,
		drives: [drives.empowerment, drives.protection],
		effect:
			"Choose a character. The next time a chosen character makes an action which heals hits from one or more characters, heal # additional hits from the healed characters",
	},
	{
		name: "Freeze",
		aspect: aspects.water,
		drives: [drives.adaptation],
		effect:
			"Choose a zone no further than medium range. Prevent # chosen characters in that zone from moving until your next action",
	},
	{
		name: "Frostbite",
		aspect: aspects.water,
		drives: [drives.manipulation],
		effect: "Deal # fatigue to a character at immediate range",
	},
	{
		name: "Healing",
		aspect: aspects.light,
		drives: [drives.adaptation, drives.protection],
		effect: "Heal # hits from a character within long range",
	},
	{
		name: "Imperil",
		aspect: aspects.darkness,
		drives: [drives.manipulation],
		effect: "A character has -# dice on their rolls until your next action",
	},
	{
		name: "Inferno",
		aspect: aspects.fire,
		drives: [drives.dominance, drives.empowerment],
		effect:
			"A character's next strike, shoot, or aspect action deals (success: triple the hits) (failure: double the hits)",
	},
	{
		name: "Inner Flame",
		aspect: aspects.fire,
		drives: [drives.adaptation, drives.dominance],
		effect:
			"After taking fatigue for this art, deal (success: your fatigue amount in hits) (failure: 1 hit) to a character in immediate range",
	},
	{
		name: "Inspire",
		aspect: aspects.light,
		drives: [drives.empowerment],
		effect:
			"A character has +# dice on their rolls until the next time you use this art",
	},
	{
		name: "Multicast",
		aspect: aspects.wind,
		drives: [drives.empowerment],
		effect:
			"Add # additional targets to a target character's next action. The target character chooses the targets",
	},
	{
		name: "Overflow",
		aspect: aspects.darkness,
		drives: [drives.empowerment],
		effect:
			"Your allies have +# dice on all of their rolls until your next action. Take # fatigue",
	},
	{
		name: "Pacify",
		aspect: aspects.light,
		drives: [drives.manipulation],
		effect:
			"Prevent a character from dealing up to # hits until your next action",
	},
	{
		name: "Quick Swap",
		aspect: aspects.wind,
		drives: [drives.adaptation],
		effect:
			"Swap zones with another character (success: you choose the character) (failure: the character is random)",
	},
	{
		name: "Ray of Equality",
		aspect: aspects.light,
		drives: [drives.dominance, drives.manipulation],
		effect: "Deal # * 2 hits to the enemy with the highest toughness",
	},
	{
		name: "Regret",
		aspect: aspects.darkness,
		drives: [drives.manipulation],
		effect:
			"Deal 1 fatigue to # enemies who've dealt hits since your last action",
	},
	{
		name: "Restore",
		aspect: aspects.light,
		drives: [drives.protection],
		effect: "Heal # hits from all allies in immediate range",
	},
	{
		name: "Riftwalk",
		aspect: aspects.darkness,
		drives: [drives.adaptation],
		effect:
			"Mark your current zone and a chosen zone no further than a range of #. Until your next action, the marked zones are considered adjacent",
	},
	{
		name: "Sear",
		aspect: aspects.fire,
		drives: [drives.manipulation],
		effect:
			"Deal # hits to all characters who used fire aspect art since your last action, including yourself.",
	},
	{
		name: "Shield",
		aspect: aspects.water,
		drives: [drives.protection],
		effect:
			"Prevent up to # hits on a character within long range until your next action",
	},
	{
		name: "Slide",
		aspect: aspects.water,
		drives: [drives.adaptation],
		effect:
			"Choose a zone no further than a range of #. Until your next turn, moving into that zone does not consume combat movement. All other combat movement restrictions still apply",
	},
	{
		name: "Surge",
		aspect: aspects.wind,
		drives: [drives.empowerment],
		effect: "Repeat the effect of a character's next action # times",
	},
	{
		name: "Survival Instinct",
		aspect: aspects.wind,
		drives: [drives.adaptation, drives.protection],
		effect:
			"Give an ally +1 die (success: for each hit that ally has taken) on their next roll",
	},
	{
		name: "Tsunami",
		aspect: aspects.water,
		drives: [drives.adaptation, drives.dominance],
		effect:
			"Choose a zone at a range of #. Deal # * 2 hits (on failure: 1 hit) to every character in that zone",
	},
]

export const characterLevels = [
	{ level: 1, attributePoints: 0, aspectPoints: 0 },
	{ level: 2, attributePoints: 0, aspectPoints: 1 },
	{ level: 3, attributePoints: 1, aspectPoints: 1 },
	{ level: 4, attributePoints: 1, aspectPoints: 2 },
	{ level: 5, attributePoints: 2, aspectPoints: 2 },
	{ level: 6, attributePoints: 2, aspectPoints: 3 },
	{ level: 7, attributePoints: 3, aspectPoints: 3 },
	{ level: 8, attributePoints: 3, aspectPoints: 4 },
	{ level: 9, attributePoints: 4, aspectPoints: 4 },
	{ level: 10, attributePoints: 4, aspectPoints: 5 },
	{ level: 11, attributePoints: 5, aspectPoints: 5 },
	{ level: 12, attributePoints: 5, aspectPoints: 6 },
	{ level: 13, attributePoints: 6, aspectPoints: 6 },
]
