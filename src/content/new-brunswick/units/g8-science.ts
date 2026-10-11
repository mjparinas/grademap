import { bankUnit, type Q } from "../own";

// Grade 8 science, New Brunswick: motion and stability, the Laws of Motion, and space exploration.

const MOTION: Q[] = [
  ["What is speed?", "how far something travels in a certain amount of time", ["how heavy something is", "what colour it is", "its temperature"], "Speed = distance ÷ time."],
  ["A cyclist travels 30 km in 2 hours. What is the average speed?", "15 km/h", ["30 km/h", "60 km/h", "2 km/h"], "30 ÷ 2 = 15."],
  ["A car goes at 80 km/h for 3 hours. How far does it travel?", "240 km", ["83 km", "27 km", "160 km"], "Distance = speed × time."],
  ["What is the difference between speed and velocity?", "velocity includes direction", ["velocity is slower", "speed includes direction", "they are the same"], "60 km/h north is a velocity."],
  ["What is acceleration?", "a change in speed or direction over time", ["steady speed", "being at rest", "gravity only"], "Speeding up, slowing down and turning are all acceleration."],
  ["What is a force?", "a push or a pull", ["a kind of energy", "a speed", "a mass"], "Forces are measured in newtons (N)."],
  ["What unit is used to measure force?", "newton", ["kilogram", "metre", "second"], "It is named for Sir Isaac Newton."],
  ["Newton’s first law says an object at rest stays at rest unless…", "an unbalanced force acts on it", ["it gets tired", "it gets warm", "it is looked at"], "This tendency is called inertia."],
  ["What is inertia?", "an object’s tendency to keep doing what it is doing", ["a kind of friction", "a force", "a speed"], "Heavier objects have more inertia."],
  ["Why do passengers lurch forward when a bus stops suddenly?", "their bodies keep moving because of inertia", ["gravity turns off", "the seat pushes them", "the road pulls them"], "The seat belt provides the force that stops you."],
  ["Newton’s second law says that force equals…", "mass × acceleration", ["mass + speed", "speed ÷ time", "distance × time"], "F = ma."],
  ["A 2 kg object accelerates at 3 m/s². What force acts on it?", "6 N", ["5 N", "1.5 N", "9 N"], "F = 2 × 3."],
  ["If the same force pushes a light cart and a heavy cart, which accelerates more?", "the light cart", ["the heavy cart", "both the same", "neither"], "Less mass means more acceleration."],
  ["Newton’s third law says that for every action there is…", "an equal and opposite reaction", ["a bigger reaction", "no reaction", "a smaller reaction"], "A rocket pushes gas down and the gas pushes the rocket up."],
  ["When you push on a wall, the wall…", "pushes back on you with the same force", ["pushes harder", "does not push", "moves away"], "Forces come in pairs."],
  ["What is friction?", "a force that opposes motion between touching surfaces", ["a force that speeds things up", "a kind of gravity", "a kind of magnetism"], "Rough surfaces have more friction."],
  ["Which surface has the least friction?", "ice", ["sandpaper", "carpet", "gravel"], "Ice is smooth and slippery."],
  ["What is gravity?", "a force that pulls objects toward each other", ["a force that pushes objects apart", "a type of speed", "a light"], "On Earth it pulls objects toward the centre."],
  ["What is the difference between mass and weight?", "mass is the amount of matter, and weight is the force of gravity on it", ["they are the same", "mass is a force", "weight is the amount of matter"], "Your mass is the same on the Moon, but your weight is less."],
  ["Balanced forces on an object cause…", "no change in its motion", ["acceleration", "a faster speed", "a turn"], "A book on a table has balanced forces."],
  ["Unbalanced forces on an object cause…", "a change in its motion", ["no change", "balance", "friction to vanish"], "The object speeds up, slows down or changes direction."],
  ["What makes an object more stable?", "a low centre of mass and a wide base", ["a high centre of mass", "a narrow base", "a tall shape"], "Race cars are low and wide.", true],
  ["Why do seat belts and airbags protect people?", "they spread out the force and slow the body gradually", ["they speed up the body", "they remove inertia", "they stop gravity"], "Slowing over a longer time reduces the force.", true],
  ["Which graph shows a steady speed?", "a straight sloped line on a distance-time graph", ["a flat line only", "a zigzag", "a circle"], "The slope shows the speed.", true],
  ["On a distance-time graph, what does a flat horizontal line mean?", "the object is not moving", ["the object is speeding up", "the object is slowing", "the object is moving fast"], "Distance does not change.", true],
];

const SPACE: Q[] = [
  ["Which satellite, launched in 1957, was the first in space?", "Sputnik 1", ["Apollo 11", "Hubble", "Canadarm"], "It was launched by the Soviet Union."],
  ["Who was the first human in space?", "Yuri Gagarin", ["Neil Armstrong", "Buzz Aldrin", "Alan Shepard"], "He orbited Earth in 1961."],
  ["In what year did humans first land on the Moon?", "1969", ["1959", "1979", "1989"], "Apollo 11 landed on July 20."],
  ["What is the International Space Station?", "a space laboratory that orbits Earth", ["a space telescope", "a planet", "a rocket"], "Astronauts from many countries work there."],
  ["Canada’s robotic arm that helped build the space station is…", "Canadarm2", ["Canadahand", "SpaceBot", "Roverarm"], "It moves large equipment in space."],
  ["Which Canadian was the first in space?", "Marc Garneau", ["Roberta Bondar", "Chris Hadfield", "Julie Payette"], "He flew in 1984."],
  ["Which Canadian astronaut was the first woman from Canada in space?", "Roberta Bondar", ["Julie Payette", "Marc Garneau", "Chris Hadfield"], "She flew in 1992."],
  ["What does a space telescope do?", "collects light from far away objects without the blur of Earth’s air", ["lands on planets", "carries people", "fuels rockets"], "The Hubble Space Telescope orbits Earth."],
  ["What is a satellite?", "an object that orbits a larger body", ["a planet", "a comet", "a star"], "The Moon is a natural satellite."],
  ["Satellites are used for…", "weather forecasting, GPS and communication", ["growing food", "making rain", "building houses"], "Many everyday services use satellites."],
  ["What does GPS stand for?", "Global Positioning System", ["General Planet System", "Great Pole Signal", "Ground Power Station"], "GPS helps find locations."],
  ["What is a rover?", "a vehicle that explores the surface of a planet or moon", ["a rocket", "a satellite", "a spacesuit"], "Rovers have explored Mars."],
  ["Which planet have rovers driven on?", "Mars", ["Jupiter", "Saturn", "the Sun"], "Mars has a rocky surface."],
  ["Why do astronauts wear spacesuits?", "to survive without air, heat control and pressure", ["to be easy to see", "to look like robots", "for fun"], "Space has no air."],
  ["What is microgravity?", "the feeling of weightlessness while orbiting", ["no gravity at all", "extra gravity", "a kind of wind"], "Astronauts and objects float because they are in free fall around Earth."],
  ["What provides the force to launch a rocket?", "burning fuel that pushes gas downward", ["wings", "wind", "a spring"], "Newton’s third law explains it."],
  ["Why do rockets have multiple stages?", "to drop empty parts and become lighter", ["to look taller", "to cool the engine", "to add colour"], "A lighter rocket accelerates more."],
  ["What is space debris?", "old satellites and pieces of rockets orbiting Earth", ["clouds in space", "asteroids only", "comets only"], "Debris can damage spacecraft."],
  ["Why is Earth’s atmosphere a problem for telescopes on the ground?", "it blurs and blocks some light", ["it is too clear", "it has no air", "it adds more stars"], "Space telescopes avoid this.", true],
  ["Which agency runs Canada’s space program?", "the Canadian Space Agency", ["NASA", "the European Space Agency", "the Coast Guard"], "It was created in 1989.", true],
  ["Why is exploring space important?", "it helps us learn about the universe and develop new technology", ["it is easy", "it is cheap", "it has no benefits"], "Space research led to many inventions."],
  ["What is the Moon’s gravity compared with Earth’s?", "about one sixth", ["the same", "double", "ten times"], "You would weigh less on the Moon.", true],
  ["Which robotic spacecraft has travelled farthest from Earth and now is in interstellar space?", "Voyager 1", ["Apollo 11", "the ISS", "Hubble"], "It was launched in 1977.", true],
  ["How do spacecraft talk to Earth?", "by radio waves", ["by phone cables", "by sound", "by mail"], "Signals take time to travel.", true],
  ["Why do we send robots instead of people to some places in space?", "they can go where it is too dangerous or far for people", ["robots are alive", "people are too small", "robots eat less food"], "Robotic missions can go to places humans cannot.", true],
];

export const motionForces = bankUnit({
  id: "nb-motion-forces-8",
  title: "Motion, Forces & Newton’s Laws",
  emoji: "🏎️",
  blurb: "Speed, velocity, acceleration, friction and the Laws of Motion.",
  parentNote:
    "Practises speed, velocity, acceleration, forces, friction, gravity and Newton's three Laws of Motion, with stability. It follows the Grade 8 science skill descriptors on motion and stability and the Laws of Motion in the New Brunswick curriculum.",
  standards: ["Scientific Literacy: Investigation, Scientific Literacy: Sensemaking", "relationships between variables in motion, stability and the Laws of Motion"],
  items: MOTION,
});

export const spaceExploration = bankUnit({
  id: "nb-space-exploration-8",
  title: "Space Exploration",
  emoji: "🚀",
  blurb: "Rockets, satellites, rovers and Canada’s part in space.",
  parentNote:
    "Practises the history and technology of space exploration, including satellites, rovers, rockets and Canada's contributions. It follows the Grade 8 science skill descriptors on space exploration in the New Brunswick curriculum.",
  standards: ["Scientific Literacy: Sensemaking, Learning and Living Sustainably: Responsible and Sustainable Application", "explanations about space exploration and its technology and benefits"],
  items: SPACE,
});
