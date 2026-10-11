import { bankUnit, type Q } from "../own";

// Grade 7 science, New Brunswick: matter and Earth surface processes. This unit covers Earth surface processes.

const SURFACE: Q[] = [
  ["What are the main layers of the Earth, from the outside in?", "crust, mantle, outer core, inner core", ["core, mantle, crust, air", "mantle, crust, core, ocean", "crust, ocean, mantle, air"], "The crust is the thin outer layer."],
  ["What is a tectonic plate?", "a huge slab of the Earth’s crust and upper mantle", ["a kind of rock", "a map", "a kind of ocean"], "Plates move a few centimetres a year."],
  ["What happens at a convergent boundary?", "two plates push toward each other", ["two plates move apart", "two plates slide past", "plates stop moving"], "Mountains can form when plates collide."],
  ["What happens at a divergent boundary?", "two plates move apart", ["two plates push together", "two plates melt", "two plates freeze"], "New crust forms in the gap."],
  ["What happens at a transform boundary?", "plates slide past each other", ["plates move apart", "plates push into each other", "plates grow"], "The San Andreas Fault is an example."],
  ["Most earthquakes happen…", "along plate boundaries", ["in the middle of oceans only", "only in deserts", "only in mountains"], "Energy is released when rock suddenly slips."],
  ["Which instrument records earthquake waves?", "a seismograph", ["a barometer", "an anemometer", "a thermometer"], "A seismograph draws a trace of ground motion."],
  ["Where do volcanoes often form?", "near plate boundaries", ["in the middle of a desert", "only near lakes", "near every city"], "Magma rises through the crust."],
  ["What is lava?", "melted rock that has reached the surface", ["melted ice", "a kind of ash", "a gas"], "Underground it is called magma."],
  ["The Appalachian Mountains in New Brunswick are…", "very old and worn down", ["very young and tall", "volcanoes", "made of ice"], "They formed hundreds of millions of years ago and have eroded since."],
  ["Compared with the Appalachians, the Rocky Mountains are…", "younger and more jagged", ["older and more rounded", "made of sand", "under water"], "Younger mountains have had less time to erode."],
  ["What is physical weathering?", "breaking rock into smaller pieces without changing its minerals", ["changing rock into new minerals", "making new rock", "melting rock"], "Frost wedging is an example."],
  ["What is chemical weathering?", "changing the minerals in rock by chemical reactions", ["breaking rock with a hammer", "freezing rock", "making rock bigger"], "Acid rain can chemically weather limestone."],
  ["Which agent of erosion shaped the Bay of Fundy coastline?", "waves and tides", ["volcanoes", "earthquakes only", "moss"], "The tide range is up to 16 metres."],
  ["Which is the strongest agent of erosion in a river valley?", "flowing water", ["standing water", "a still pond", "ice cubes"], "Flowing water carries soil and rock."],
  ["What is a delta?", "land built from sediment dropped where a river meets a larger body of water", ["a kind of mountain", "a kind of cliff", "a type of cave"], "The river slows and drops sediment."],
  ["Glaciers carve U-shaped valleys. Rivers carve…", "V-shaped valleys", ["U-shaped valleys", "round valleys", "flat valleys"], "Glaciers are wider and more rounded."],
  ["How did glaciers change New Brunswick long ago?", "they scraped the land and left behind soil and boulders", ["they made volcanoes", "they dried up the rivers", "they planted forests"], "Ice covered the area about 20 000 years ago."],
  ["What is the rock cycle?", "the way rocks change from one type to another over time", ["a bicycle trail", "a weather pattern", "a tide chart"], "Igneous, sedimentary and metamorphic rocks change into each other."],
  ["Which process turns sediments into sedimentary rock?", "compaction and cementation", ["melting and cooling", "heating and squeezing only", "evaporating only"], "Layers press together and are glued by minerals."],
  ["Which kind of rock can form when magma cools slowly underground?", "granite", ["sandstone", "limestone", "slate"], "Slow cooling makes large crystals."],
  ["How can we learn about Earth’s past from rock layers?", "older layers are usually deeper, and fossils tell what lived then", ["younger layers are deeper", "there are no clues", "fossils appear only at the top"], "This idea is the law of superposition.", true],
  ["How can people reduce the damage from earthquakes?", "build strong buildings and have a plan", ["ignore warnings", "build on loose sand", "avoid drills"], "Preparation saves lives.", true],
  ["Why do the Bay of Fundy tides erode cliffs more than a calm lake does?", "the tides are very large and strong", ["lakes are salty", "lakes have bigger waves always", "the tide cools the rock"], "Large daily tides move a huge amount of water.", true],
  ["Why does soil form slowly?", "weathering and decay work over hundreds of years", ["it is made in factories", "wind makes it in one day", "it falls from the sky"], "Soil is a slow, precious resource."],
  ["Which model best shows how plates move?", "slowly pushing layers of clay", ["a spinning top", "a soap bubble", "a paper plane"], "Models help us picture slow processes.", true],
];

export const earthSurface = bankUnit({
  id: "nb-earth-surface-7",
  title: "Earth’s Surface Processes",
  emoji: "🌍",
  blurb: "Plates, mountains, weathering, erosion and the rock cycle.",
  parentNote:
    "Practises Earth surface processes: plate tectonics, earthquakes and volcanoes, weathering, erosion and deposition, and the rock cycle, with local examples from the Appalachians and the Bay of Fundy. It follows the Grade 7 science skill descriptors on matter and Earth surface processes in the New Brunswick curriculum.",
  standards: ["Scientific Literacy: Sensemaking", "explanations about Earth surface processes based on evidence from inquiry"],
  items: SURFACE,
});
