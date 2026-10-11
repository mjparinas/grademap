import { bankUnit, type Q } from "../own";

// Grade 1 science: scientific skills and technology (SCI.1.B.1, C.1, C.2, C.4, C.5, D.2) and life long ago (SCI.1.E.12).

const SKILLS: Q[] = [
  ["Which tool helps you see tiny things up close?", "magnifying glass", ["spoon", "mitten"], "A magnifying glass makes small things look bigger."],
  ["Which tool helps you measure how long a pencil is?", "ruler", ["cup", "clock"], "A ruler measures length."],
  ["Which tool can you use to measure how long something is, using blocks?", "linking cubes", ["a sponge", "a flashlight"], "You can line up cubes and count them."],
  ["Which tool tells you how warm or cold the air is?", "thermometer", ["ruler", "scale"], "A thermometer measures temperature."],
  ["Which tool shows how heavy something is?", "scale", ["ruler", "magnifying glass"], "A scale tells us about mass."],
  ["Which senses do scientists use to observe?", "sight, touch, hearing, smell", ["only sleep", "only taste"], "We observe with our senses, safely."],
  ["Which sense do you use to see colour and shape?", "sight", ["hearing", "smell"], "Your eyes help you see."],
  ["What do you do before touching or tasting something new?", "Ask a grown-up", ["Taste it quickly", "Hide it"], "Safety first: never taste unknown things."],
  ["Which is a safe way to use scissors?", "Walk with the points down", ["Run with them", "Throw them"], "Handle tools carefully."],
  ["After an experiment, what should you do with the materials?", "Clean up and put them away", ["Leave them on the floor", "Hide them"], "Looking after materials is part of being a scientist."],
  ["A scientist who studies plants and animals is called a…", "biologist", ["chef", "pilot"], "Many scientists study living things."],
  ["Who grows food on the prairies?", "a farmer", ["a firefighter", "a bus driver"], "Farmers use science about soil, plants and weather."],
  ["Who helps people choose healthy foods?", "a nutritionist", ["a plumber", "a painter"], "A nutritionist knows about food."],
  ["Who studies rocks and soil?", "a geoscientist", ["a baker", "a dancer"], "Geoscientists learn about the Earth."],
  ["Who designs things like bridges and machines?", "an engineer", ["a librarian", "a teacher"], "Engineers use science to design and build."],
  ["A technology is something people made to…", "help with a need", ["hide from others", "make a mess"], "People create technologies to be useful."],
  ["Which is a technology people made to keep us dry in the rain?", "an umbrella", ["a cloud", "a puddle"], "An umbrella was made by people to solve a problem."],
  ["Which is a technology to help us see in the dark?", "a flashlight", ["a pillow", "a crayon"], "A flashlight makes light."],
  ["Which is made by people?", "a bicycle", ["a pine tree", "a rock"], "A bicycle is a technology."],
  ["Which was NOT made by people?", "a lake", ["a bridge", "a toy car"], "A lake is natural."],
  ["Which tool helps us cut paper?", "scissors", ["a ruler", "a pencil"], "Scissors were made for cutting."],
  ["When scientists wonder about something, they ask…", "questions", ["nothing", "for a nap"], "Curiosity starts with a question.", true],
  ["Which is a good way to take care of the environment at school?", "Put recycling in the right bin", ["Drop litter outside", "Leave lights on all day"], "We can take action to help the planet.", true],
  ["A class action that helps nature is to…", "plant a garden", ["pick all the flowers", "leave garbage on the ground"], "Planting helps living things.", true],
  ["Why do we compare two objects to measure them?", "to see which is longer or heavier", ["to make them dirty", "to hide them"], "Comparing helps us measure.", true],
  ["Which is the best tool to find out which of two rocks is heavier?", "a balance or scale", ["a spoon", "a crayon"], "A scale or balance compares mass.", true],
  ["It is good to be a scientist when you are…", "curious and careful", ["bored and careless", "angry and rushing"], "Scientists wonder and are careful.", true],
];

const LONG_AGO: Q[] = [
  ["An animal that has died out forever is…", "extinct", ["asleep", "hungry"], "Extinct means no more of that kind are alive."],
  ["Dinosaurs are…", "extinct", ["still alive in Manitoba", "only toys"], "Dinosaurs lived long ago and are extinct."],
  ["Did people ever live at the same time as dinosaurs?", "No", ["Yes, every day", "Yes, in Winnipeg"], "Dinosaurs lived millions of years before people."],
  ["What do we call the traces of living things found in rock?", "fossils", ["cookies", "crystals"], "Fossils show us living things from long ago."],
  ["Fossils are found in…", "rocks", ["air", "water bottles"], "Fossils can be found in rock."],
  ["Who studies fossils?", "a palaeontologist", ["a chef", "a mail carrier"], "Palaeontologists study ancient life."],
  ["A fossil is a sign of something that lived…", "long ago", ["yesterday", "today"], "Fossils are very old."],
  ["Which animal is extinct?", "mammoth", ["moose", "beaver"], "Mammoths lived long ago."],
  ["Which animal is extinct?", "passenger pigeon", ["robin", "sparrow"], "Passenger pigeons once flew in huge flocks and are gone."],
  ["Which of these is alive today?", "bison", ["mammoth", "T. rex"], "Bison still live on the prairies."],
  ["Which of these lived long ago and does not live now?", "dinosaur", ["owl", "fox"], "Dinosaurs are extinct."],
  ["Do we learn about dinosaurs from fossils?", "Yes", ["No, from toys only", "No, from clouds"], "Bones and tracks in rock are clues."],
  ["A dinosaur bone found in rock is a…", "fossil", ["seed", "shell game"], "It is an example of a fossil."],
  ["Which place can you visit to see fossils?", "a museum", ["a swimming pool", "a bus"], "Museums show fossils to visitors."],
  ["Some dinosaurs ate plants. They are called…", "plant eaters", ["rock eaters", "ice cream eaters"], "Some ate only plants.", true],
  ["How do we know animals were alive long ago?", "We find their fossils", ["They told us", "Because of the moon"], "Fossils are clues.", true],
  ["The mammoth looked like a hairy…", "elephant", ["frog", "bird"], "Mammoths were big and had long tusks.", true],
  ["Extinct means no living ones are left. Which is extinct?", "a dodo", ["a cow", "a duck"], "The dodo bird is gone.", true],
  ["Is a living kind of animal that is now rare extinct?", "No, it is still alive", ["Yes, always", "Yes, if small"], "Rare is not the same as extinct.", true],
  ["Living things that are gone forever teach us to…", "take care of living things now", ["forget them", "make them angry"], "We can protect animals and plants.", true],
  ["Which is a footprint trace from long ago?", "a fossil footprint", ["a fresh print in snow", "a drawing"], "Some tracks turned to rock.", true],
  ["Long ago, many dinosaurs…", "died out", ["lived in houses", "used phones"], "They became extinct.", true],
  ["Which statement is true?", "Fossils are very old.", ["Fossils are new toys.", "Fossils are alive."], "Fossils formed long ago.", true],
  ["Scientists compare a fossil bone to a living animal's bone to…", "learn how it looked", ["make soup", "play music"], "Comparing gives clues.", true],
  ["What is a skeleton?", "bones of an animal", ["a kind of fruit", "a soft pillow"], "Fossil skeletons show size and shape.", true],
  ["If all of one kind of animal is gone, we say it is…", "extinct", ["growing", "baby"], "Extinct is gone forever.", true],
];

export const scienceSkills = bankUnit({
  id: "mb-g1-science-skills",
  title: "Tools & Technology",
  emoji: "🔍",
  blurb: "Tools scientists use, things people make, and jobs that use science.",
  parentNote:
    "Practises choosing tools to observe and measure, working safely and with curiosity, noticing that people make technologies to meet needs, and connecting science to jobs and taking care of our environment.",
  standards: [
    "SCI.1.B.1, SCI.1.C.1, SCI.1.C.2, SCI.1.C.4, SCI.1.C.5, SCI.1.D.2",
    "scientific attitudes, taking action, measuring, using tools safely, careers and technologies people create",
  ],
  items: SKILLS,
});

export const longAgo = bankUnit({
  id: "mb-g1-life-long-ago",
  title: "Life Long Ago",
  emoji: "🦕",
  blurb: "Fossils, dinosaurs and animals that are gone.",
  parentNote: "Practises the idea that many kinds of living things that once lived are now extinct, and that fossils give us clues about them.",
  standards: ["SCI.1.E.12", "many kinds of organisms that once lived are now extinct"],
  items: LONG_AGO,
});
