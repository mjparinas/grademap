import { bankUnit, type Q } from "../own";

// Grade 6 science, New Brunswick: natural and technical sensory systems.

const SENSES: Q[] = [
  ["How many senses do people usually talk about?", "five", ["two", "three", "ten"], "They are sight, hearing, smell, taste and touch."],
  ["Which part of the eye lets in light?", "the pupil", ["the iris", "the retina", "the eyelid"], "The pupil is the dark opening in the middle."],
  ["Which part of the eye is coloured?", "the iris", ["the pupil", "the lens", "the retina"], "The iris controls how much light gets in."],
  ["Which part of the eye focuses light?", "the lens", ["the pupil", "the cornea only", "the eyelid"], "The lens bends light onto the retina."],
  ["Which part of the eye has cells that detect light?", "the retina", ["the iris", "the pupil", "the lens"], "The retina sends signals to the brain."],
  ["Which nerve carries messages from the eye to the brain?", "the optic nerve", ["the auditory nerve", "the spinal nerve", "the olfactory nerve"], "The brain makes the image."],
  ["What happens to your pupil in bright light?", "it gets smaller", ["it gets bigger", "it disappears", "it turns blue"], "This protects the retina."],
  ["What happens to your pupil in dim light?", "it gets bigger", ["it gets smaller", "it closes", "it stays the same"], "More light gets in."],
  ["What does a person with nearsightedness find hard?", "seeing things far away clearly", ["seeing things up close", "hearing sounds", "tasting salt"], "Glasses can correct it."],
  ["Which part of the ear collects sound?", "the outer ear", ["the cochlea", "the eardrum", "the auditory nerve"], "The ear flap funnels sound."],
  ["What vibrates when sound hits it in the ear?", "the eardrum", ["the lens", "the nostril", "the tongue"], "The eardrum passes vibrations along."],
  ["Which part of the inner ear changes vibrations into nerve signals?", "the cochlea", ["the eardrum", "the lens", "the cornea"], "The cochlea is shaped like a snail shell."],
  ["Which sound level can damage hearing over time?", "loud noise for a long time", ["quiet music", "whispering", "birds singing quietly"], "Ear protection helps."],
  ["Which tool protects hearing around loud machines?", "ear protection", ["sunglasses", "gloves", "a hat"], "Always wear protection around loud noise."],
  ["Where are the cells that detect smell found?", "high inside the nose", ["on the tongue", "in the ears", "on the skin"], "They send messages to the brain."],
  ["What are taste buds?", "sensors on the tongue that detect tastes", ["tiny seeds", "parts of the ear", "cells in the eye"], "Taste buds detect sweet, sour, salty, bitter and umami."],
  ["Which of these is one of the basic tastes?", "bitter", ["spicy", "crunchy", "cold"], "Spicy and crunchy are felt, not tasted."],
  ["Why does food taste bland when you have a stuffy nose?", "smell helps us taste", ["your tongue falls asleep", "your eyes close", "your ears block"], "Smell and taste work together."],
  ["Which organ is the largest sense organ?", "the skin", ["the eye", "the nose", "the ear"], "The skin has nerves that feel touch, heat, cold and pain."],
  ["Which sense helps you know a stove is hot?", "touch", ["sight", "taste", "hearing"], "Skin sensors detect temperature."],
  ["Why is pain helpful?", "it warns you about danger", ["it makes you hungry", "it slows you down for fun", "it helps you hear"], "Pain tells you to protect your body."],
  ["Which two senses work together when you catch a ball?", "sight and touch", ["taste and smell", "hearing and taste", "smell and hearing"], "Many senses work as a team."],
  ["Where are the messages from the senses made sense of?", "in the brain", ["the skin", "the lens", "the tongue"], "Sense organs only gather the information.", true],
  ["An optical illusion shows that…", "your brain can be fooled when it interprets what you see", ["your eyes are broken", "light doesn’t exist", "colours are not real"], "The brain makes sense of signals using past experience.", true],
  ["Why do some animals see better in the dark than people?", "their eyes have adaptations for dim light", ["they have bigger ears", "they have no eyes", "they have a second nose"], "Owls and cats have such adaptations.", true],
  ["Which animal has a sense of hearing that uses echoes to find food?", "a bat", ["a robin", "a snail", "a trout"], "Bats use echolocation.", true],
];

const TECH: Q[] = [
  ["What does a sensor do?", "detects something in the environment, such as light or heat", ["cooks food", "builds walls", "paints rooms"], "Sensors turn what they detect into signals."],
  ["Which device uses a sensor to keep a room at a set temperature?", "a thermostat", ["a clock", "a mirror", "a ruler"], "The thermostat turns heating on and off."],
  ["Which device detects smoke and sounds an alarm?", "a smoke detector", ["a thermometer", "a camera", "a speaker"], "Test the batteries often."],
  ["Which device uses a sensor to turn on a light when someone walks by?", "a motion sensor", ["a clock", "a pencil", "a straw"], "It detects movement."],
  ["A camera is like an eye because it…", "has a lens that focuses light", ["has a nose", "has a heart", "has a spine"], "Both capture an image."],
  ["A microphone is like which body part?", "the ear", ["the eye", "the tongue", "the skin"], "It changes sound into signals."],
  ["Which technology helps people who cannot hear well?", "a hearing aid", ["a magnifying glass", "a thermometer", "a flashlight"], "Hearing aids make sounds louder."],
  ["Which technology helps people see small print?", "a magnifying glass", ["a hearing aid", "a stethoscope", "a speaker"], "Magnifiers make objects look larger."],
  ["What is a stethoscope used for?", "listening to sounds inside the body", ["measuring temperature", "seeing tiny things", "weighing objects"], "Doctors listen to hearts and lungs."],
  ["What does an X-ray machine let doctors see?", "bones inside the body", ["what you had for lunch", "your dreams", "your thoughts"], "X-rays pass through soft tissue but not bone."],
  ["A thermometer is a tool that…", "measures temperature", ["measures sound", "measures mass", "measures time"], "It could be digital or liquid-filled."],
  ["Which technology uses sound waves to “see” underwater?", "sonar", ["a flashlight", "a magnet", "a mirror"], "Boats use sonar to find the sea floor."],
  ["Which sensor in a phone detects how you are holding it?", "an accelerometer", ["a thermometer", "a ruler", "a compass only"], "The screen turns when you rotate the phone."],
  ["Why are sensors used in cars?", "to help drivers stay safe", ["to make them louder", "to make them slower", "to hold the doors shut"], "Sensors detect objects behind the car."],
  ["A weather station uses sensors to measure…", "temperature, wind and rain", ["distance to the Moon", "the colour of rocks", "the age of trees"], "Weather data are used for forecasts."],
  ["What is a variable in an experiment?", "something that can change", ["a kind of tool", "a type of animal", "a word"], "In a fair test, you change only one variable."],
  ["In a fair test, the variable you change is the…", "independent variable", ["dependent variable", "constant", "control"], "You change it to see what happens."],
  ["In a fair test, the variable you measure is the…", "dependent variable", ["independent variable", "constant", "tool"], "It depends on what you changed."],
  ["Why do scientists repeat their tests?", "to make sure the results are reliable", ["to make them longer", "to avoid mistakes in drawing", "to get a different answer"], "Repeating tests builds confidence."],
  ["What can you do to make a graph of results easy to read?", "label the axes and give a title", ["leave out numbers", "use no scale", "draw random lines"], "Clear graphs help others understand."],
  ["How do hearing protection, glasses and helmets show technology helping people?", "they protect or improve how we sense and stay safe", ["they make senses worse", "they stop senses", "they are only for decoration"], "Technology can protect our senses.", true],
  ["Why do engineers design technology to match how senses work?", "so people can use it easily and safely", ["so it looks old", "so it breaks", "so it is hidden"], "Alarms use loud sounds and bright lights.", true],
  ["A Braille display helps someone who is blind to…", "read by touch", ["see colours", "hear sounds", "taste food"], "Braille uses raised dots.", true],
  ["What should you do before trusting a sensor reading?", "check that the sensor is working and calibrated", ["ignore the numbers", "assume it is never wrong", "shake it"], "Sensors can make mistakes.", true],
  ["A smoke alarm uses a loud sound because…", "it needs to wake people up", ["it plays music", "it is cheap", "it saves power"], "The alarm is designed to be noticed quickly."],
];

export const senses = bankUnit({
  id: "nb-senses-6",
  title: "Our Senses",
  emoji: "👁️",
  blurb: "Eyes, ears, nose, tongue and skin.",
  parentNote:
    "Practises natural sensory systems: sight, hearing, smell, taste and touch. It follows the Grade 6 science skill descriptors on natural and technical sensory systems in the New Brunswick curriculum.",
  standards: ["Scientific Literacy: Sensemaking", "explanations about natural sensory systems based on evidence from inquiry"],
  items: SENSES,
});

export const technicalSensors = bankUnit({
  id: "nb-technical-sensors-6",
  title: "Sensors & Helpful Technology",
  emoji: "📡",
  blurb: "Thermostats, cameras, hearing aids and fair tests.",
  parentNote:
    "Practises technical sensory systems and technology that extends human senses, and how variables are handled in an investigation. It follows the Grade 6 science skill descriptors on technical sensory systems in the New Brunswick curriculum.",
  standards: ["Scientific Literacy: Investigation", "planning investigations about relationships between variables in natural and technical sensory systems"],
  items: TECH,
});
