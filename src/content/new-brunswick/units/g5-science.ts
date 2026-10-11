import { bankUnit, type Q } from "../own";

// Grade 5 science, New Brunswick: simple machines and human body systems. This unit covers the nervous system.

const NERVOUS: Q[] = [
  ["What is the main job of the nervous system?", "to send messages between the brain and the body", ["to digest food", "to pump blood", "to hold the body up"], "It controls how you think, move and sense."],
  ["Which organ is the control centre of the nervous system?", "the brain", ["the heart", "the lungs", "the stomach"], "The brain is protected by the skull."],
  ["What is the spinal cord?", "a bundle of nerves running down the back from the brain", ["a bone in the leg", "a muscle", "a blood vessel"], "The backbone protects it."],
  ["What protects the brain?", "the skull", ["the ribs", "the pelvis", "the spine only"], "The skull is a hard bony case."],
  ["What protects the spinal cord?", "the vertebrae", ["the skull", "the ribs", "the hip bones"], "Vertebrae form the backbone."],
  ["What are nerves?", "bundles of cells that carry messages", ["tubes that carry blood", "tiny bones", "muscles"], "Nerves reach every part of your body."],
  ["What is a neuron?", "a nerve cell", ["a blood cell", "a skin cell", "a bone cell"], "Neurons pass signals to each other."],
  ["Nerve signals travel as…", "tiny electrical and chemical messages", ["sound waves", "heat only", "water drops"], "They move very fast."],
  ["Together, the brain and spinal cord make up the…", "central nervous system", ["peripheral nervous system", "muscular system", "digestive system"], "The nerves that branch out make the peripheral system."],
  ["Which part of the brain helps with balance and coordination?", "the cerebellum", ["the cerebrum", "the spinal cord", "the skull"], "The cerebellum is at the back of the brain."],
  ["Which part of the brain is used for thinking, memory and deciding?", "the cerebrum", ["the cerebellum", "the brainstem", "the spinal cord"], "It is the largest part of the brain."],
  ["Which part of the brain controls automatic things like breathing and heartbeat?", "the brainstem", ["the cerebrum", "the skull", "the nose"], "You don’t have to think about breathing."],
  ["What is a reflex?", "a fast, automatic response that doesn't wait for the brain to decide", ["a slow decision", "a dream", "a kind of memory"], "Pulling your hand from a hot stove is a reflex."],
  ["Why are reflexes useful?", "they protect you quickly", ["they slow you down", "they help you sleep", "they cause pain"], "The spinal cord can react before the brain."],
  ["Which of these is a voluntary action (one you choose)?", "waving hello", ["blinking when dust comes", "your heartbeat", "sneezing"], "Voluntary actions are controlled by thinking."],
  ["Which of these is an involuntary action?", "your heartbeat", ["kicking a ball", "writing your name", "waving"], "Involuntary actions happen automatically."],
  ["Which sense organ detects light?", "the eye", ["the ear", "the nose", "the tongue"], "The eye sends signals to the brain by the optic nerve."],
  ["Which sense organ detects sound?", "the ear", ["the eye", "the skin", "the tongue"], "Nerves carry sound messages to the brain."],
  ["What helps protect your head during biking or skating?", "a helmet", ["a hat", "sunglasses", "gloves"], "Helmets protect the brain."],
  ["Why is sleep important for the brain?", "it helps the brain rest and store memories", ["the brain turns off forever", "the brain grows hair", "it makes you hungry"], "Children need plenty of sleep.", true],
  ["What can you do to keep your nervous system healthy?", "get sleep, eat well and wear a helmet", ["skip sleep", "avoid water", "hit your head"], "Healthy habits help.", true],
  ["When you touch something hot, which carries the message to your brain?", "nerves", ["bones", "muscles", "blood only"], "Your brain then sends a message to move away."],
  ["Which sense lets you feel hot and cold?", "touch", ["sight", "hearing", "smell"], "Nerve endings in the skin detect temperature."],
  ["Reaction time is…", "how fast you respond to something", ["how big your brain is", "how tall you are", "how old you are"], "You can test it with a dropped ruler.", true],
  ["Which of these tests reaction time?", "catching a dropped ruler", ["lifting a book", "counting to ten", "reading a map"], "Catch it sooner and the reaction time is shorter.", true],
  ["How does your brain learn new skills?", "nerve connections get stronger with practice", ["it grows a new brain", "the skull gets bigger", "nerves disappear"], "Practice helps your brain.", true],
];

export const nervousSystem = bankUnit({
  id: "nb-nervous-system-5",
  title: "The Nervous System",
  emoji: "🧠",
  blurb: "Brain, spinal cord, nerves and reflexes.",
  parentNote:
    "Practises the nervous system, one of the human systems in the Grade 5 science skill descriptors in the New Brunswick curriculum, with the brain, spinal cord, nerves, reflexes and ways to protect them.",
  standards: ["Scientific Literacy: Sensemaking", "explanations about the nervous system based on evidence from inquiry into the human systems"],
  items: NERVOUS,
});
