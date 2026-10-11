import { bankUnit, type Q } from "../own";

// Grade 8 science, Climate Change: evidence, then causes and action. Includes the Mi’kmaw view that long-term
// observation of land and sea is evidence. Indigenous content is light, in the present tense, and needs partner review.

const EVIDENCE: Q[] = [
  ["Which describes climate rather than weather?", "The average temperature in Halifax over 30 years", ["Today's fog in Halifax", "Tomorrow's forecast of rain"], "Weather is what happens on a given day. Climate is the pattern over many years."],
  ["Rain on Monday and sunshine on Tuesday are examples of…", "weather", ["climate", "a greenhouse gas"], "Weather changes from day to day. Climate is the long-term pattern."],
  ["What does the greenhouse effect do?", "Gases in the air trap some of Earth's heat", ["Plants make the air hotter by growing", "Clouds stop all sunlight from reaching Earth"], "Greenhouse gases act like a blanket around the planet, keeping some heat in."],
  ["Which of these is a greenhouse gas?", "carbon dioxide", ["nitrogen", "argon"], "Carbon dioxide traps heat. Nitrogen and argon do not."],
  ["Thermometer records over more than a century show Earth's average surface temperature has…", "risen", ["stayed exactly the same", "fallen steadily"], "Records from around the world show a warming trend over time."],
  ["Many mountain glaciers around the world are…", "shrinking", ["growing quickly everywhere", "staying the same size"], "Satellite photos and measurements show that most glaciers have lost ice."],
  ["Summer sea ice in the Arctic Ocean has been…", "getting smaller over recent decades", ["getting thicker every year", "unchanged since records began"], "Satellites have tracked sea ice for decades, and the summer ice covers less area."],
  ["Two main reasons global sea level is rising are melting land ice and…", "seawater expanding as it warms", ["rain filling the oceans faster", "tides getting stronger"], "Warm water takes up more space than cold water, which is called thermal expansion."],
  ["Kinetic molecular theory says that when water is heated, its particles…", "move faster and spread slightly farther apart", ["move more slowly and pack closer", "stop moving until it cools"], "Heat gives particles more energy, so they move faster and need more room."],
  ["Why is the ocean such an important store of heat?", "Water can take in a lot of heat energy", ["Water reflects all heat back into space", "Oceans make their own heat from salt"], "Oceans have soaked up most of the extra heat in the climate system."],
  ["Ocean acidification happens when the ocean takes in extra…", "carbon dioxide", ["oxygen", "nitrogen"], "Carbon dioxide dissolves in seawater and makes it slightly more acidic."],
  ["Scientists drill ice cores to study…", "bubbles of ancient air trapped in the ice", ["the ages of nearby fish", "how thick the clouds are today"], "Each layer of ice holds air from the year it formed, so it is a record of the past."],
  ["A tree's rings can give clues about past…", "growing conditions, such as warm or dry years", ["ocean tides", "traffic patterns"], "Trees grow differently in different conditions, and each ring is one year."],
  ["Which change has been observed in the Gulf of Maine, the waters near Nova Scotia?", "Warmer ocean water", ["Colder ocean water each year", "Fresh water instead of salt water"], "Gulf of Maine waters have warmed faster than most of the world's oceans."],
  ["What can higher seas and stronger storm surges do to exposed shorelines?", "Speed up erosion", ["Stop waves from reaching land", "Make the land rise"], "More water and stronger waves wear away soil and rock faster."],
  ["Warming seawater raises sea level even without melting ice because…", "warmer water takes up more space", ["heat adds salt to the water", "warm water weighs more"], "Particles move faster when heated and spread out, so the same water needs more room.", true],
  ["Without any natural greenhouse effect, Earth would be…", "much colder than it is now", ["much hotter than it is now", "about the same as now"], "A natural greenhouse effect keeps Earth warm enough for life. The problem is extra greenhouse gases.", true],
  ["Fish species once found farther south are now found in cooler northern waters. This is evidence of…", "species ranges shifting as waters warm", ["tides getting weaker", "a lower sea level"], "Animals move to stay in water that suits them, and scientists track where they are found.", true],
  ["Why can Mi’kmaw Elders' and fishers' observations of the sea count as evidence?", "Careful watching over many generations shows how things change", ["They only count if no instruments exist", "They only describe weather on a single day"], "The Mi’kmaq have observed Mi’kma’ki for a very long time, and that knowledge shows long-term patterns.", true],
  ["One very cold week in Nova Scotia is used to say climate change is not happening. What is wrong with this?", "A week is weather, but climate is the long-term pattern", ["Cold weeks never happen", "Climate is measured in hours"], "Climate is judged over decades, so a single cold week does not change the long-term trend.", true],
  ["Why do scientists use many kinds of evidence, like ice cores, thermometers and satellites?", "Separate sources that agree make a conclusion stronger", ["Only one source is ever needed", "Different sources should never be compared"], "When independent methods point to the same answer, scientists can trust it more.", true],
  ["Which instrument measures air temperature?", "thermometer", ["barometer", "anemometer"], "A barometer measures air pressure and an anemometer measures wind speed."],
  ["Carbon dioxide is released when we burn…", "fossil fuels like coal and oil", ["pure water", "sand"], "Burning fossil fuels adds carbon dioxide to the air."],
  ["Satellites help scientists by…", "measuring sea ice and temperatures from space", ["planting trees", "making rain"], "Satellites give a view of the whole planet over many years."],
  ["Plants take in carbon dioxide when they make food. This process is…", "photosynthesis", ["erosion", "evaporation"], "Plants use sunlight, water and carbon dioxide to make sugar."],
  ["Which is a trend, not a single data point?", "Average yearly temperatures rising over 50 years", ["Yesterday's high of 22 °C", "A snowfall on Tuesday"], "A trend is a pattern over a long time."],
  ["A scientist says evidence supports warming rather than proves it forever. Why this careful wording?", "Science states conclusions from the evidence available and can update them", ["Scientists are unsure about everything", "No evidence has been collected"], "Careful wording shows how science works.", true],
  ["Why do scientists compare current data to a baseline period?", "To see how much conditions have changed from an earlier normal", ["To make the data shorter", "To hide recent changes"], "A baseline gives a starting point to measure against.", true],
];

const ACTION: Q[] = [
  ["Burning fossil fuels such as coal, oil and natural gas releases…", "carbon dioxide", ["extra oxygen", "pure nitrogen"], "The carbon stored in fossil fuels goes into the air as carbon dioxide when it burns."],
  ["Which of these is a fossil fuel?", "natural gas", ["wind", "tidal power"], "Natural gas, coal and oil formed from ancient living things."],
  ["Which of these is a renewable energy source?", "wind", ["coal", "oil"], "Wind keeps blowing, so it will not run out."],
  ["Cutting down large areas of forest adds to climate change because…", "fewer trees are left to take in carbon dioxide", ["forests reflect all sunlight into space", "trees produce only fossil fuels"], "Growing trees store carbon, so losing forests leaves more carbon dioxide in the air."],
  ["Methane, released by landfills and farm animals, is…", "a greenhouse gas", ["a gas that cools Earth", "a kind of rock"], "Methane traps heat, even though there is much less of it than carbon dioxide."],
  ["In the carbon cycle, plants take in carbon dioxide through…", "photosynthesis", ["evaporation", "erosion"], "Plants use carbon dioxide, water and sunlight to make food."],
  ["Reducing greenhouse gas emissions to slow climate change is called…", "mitigation", ["adaptation", "evaporation"], "To mitigate means to make something less severe."],
  ["Changing how we live to cope with the effects of climate change is called…", "adaptation", ["mitigation", "combustion"], "To adapt means to adjust to new conditions."],
  ["Which is an example of mitigation?", "Building a wind farm to make electricity", ["Building a seawall", "Moving a house away from the shore"], "A wind farm replaces fossil fuel power, so fewer greenhouse gases are released."],
  ["Which is an example of adaptation?", "Building a seawall to protect a road", ["Installing solar panels", "Switching a bus fleet to electric power"], "A seawall helps people cope with higher water. It does not cut emissions."],
  ["Living shorelines use plants such as salt marsh grasses to…", "slow waves and reduce erosion", ["make seawater fresh", "stop the tides"], "Plant roots hold soil in place and the plants soak up the force of waves."],
  ["Protecting wetlands and salt marshes helps because they…", "store carbon and soak up floodwater", ["create fossil fuels", "stop storms from forming"], "Wetlands act like sponges and keep carbon out of the air."],
  ["Which choice reduces emissions from travel?", "Taking public transit instead of driving alone", ["Letting a car idle for a long time", "Driving alone on a short trip"], "A bus or train carries many people with less fuel per person."],
  ["Tidal power, such as at the Bay of Fundy, makes electricity from…", "the movement of tides", ["burning coal", "burning natural gas"], "Moving water turns a turbine, and the tides come twice a day."],
  ["Which action can a student take to help?", "Walk or bike to school when it is safe", ["Leave lights on in empty rooms", "Drive to school even when it is a short walk"], "Using less fuel and electricity lowers emissions."],
  ["Which is an action a government can take on climate change?", "Pass laws that limit emissions", ["Turn off a light at home", "Recycle a can at school"], "Governments can make rules and spend money in ways individuals cannot."],
  ["What can higher seas and bigger storms cause for coastal communities?", "Flooding and erosion", ["Lower tides everywhere", "Fewer waves"], "Higher water and stronger waves reach farther inland and wear away shores."],
  ["Warming waters can hurt fishing communities because…", "some fish and shellfish move or decline when temperatures change", ["fish need warmer water to be caught", "warm water makes every fish grow bigger"], "Species live where conditions suit them, and fishers must follow the changes.", true],
  ["A town can build a seawall or help a salt marsh grow in front of its shore. What is a fair way to choose?", "Compare cost, how long each lasts, nature and who is protected", ["Pick whichever costs least today and stop thinking", "Pick the one most people have heard of"], "Good decisions weigh trade-offs, including long-term costs and effects on others.", true],
  ["Why is planting trees alone not enough to stop climate change?", "Burning fossil fuels adds more carbon dioxide than trees can absorb", ["Trees add carbon dioxide to the air", "Trees only grow in warm places"], "Trees help, but emissions need to be cut as well.", true],
  ["Switching a power plant from coal to wind is mitigation because it…", "lowers greenhouse gas emissions", ["protects a shoreline from waves", "helps people move inland"], "Mitigation is about the cause: releasing fewer greenhouse gases.", true],
  ["Which action is mitigation and also helps a community?", "Building safe bike lanes so more people can cycle", ["Raising a road above flood level", "Paying to rebuild a flooded home"], "Cycling replaces car trips, which lowers emissions and keeps people active.", true],
  ["Which question best helps judge a climate claim in a news story?", "Where did the evidence come from and who collected it?", ["How many people shared it?", "How exciting is the headline?"], "Reliable claims rest on evidence from trustworthy sources.", true],
  ["When fossil fuels are burned, carbon that was stored underground for millions of years…", "moves into the air as carbon dioxide", ["is stored deeper in the soil", "turns into oxygen"], "Burning moves carbon from long-term storage to the atmosphere faster than natural processes can remove it.", true],
];

export const climateEvidence = bankUnit({
  id: "ns-climate-evidence-8",
  title: "Evidence of Climate Change",
  emoji: "🌡️",
  blurb: "Spot the clues that show Earth is warming.",
  parentNote:
    "Practises telling weather from climate, the greenhouse effect, kinetic molecular theory and thermal expansion, and the evidence for climate change, including the Mi’kmaw view that long-term observation counts. Ties to the Nova Scotia Grade 8 science outcomes on Climate Change.",
  standards: ["Climate Change", "Explain evidence for climate change, using records, particles and ocean observations"],
  items: EVIDENCE,
});

export const climateAction = bankUnit({
  id: "ns-climate-action-8",
  title: "Climate Change: Causes & Action",
  emoji: "🌍",
  blurb: "Find out what causes climate change and what we can do.",
  parentNote:
    "Practises human causes of climate change, the carbon cycle, effects on coasts and communities, and the difference between mitigation and adaptation. Ties to the Nova Scotia Grade 8 science outcomes on Climate Change.",
  standards: ["Climate Change", "Explain causes and effects of climate change and compare ways to respond"],
  items: ACTION,
});
