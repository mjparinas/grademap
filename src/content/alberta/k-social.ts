import type { Unit } from "../types";
import { e, order, q, sorter, unitOf, type Item } from "../ontario/k-g2-kit";
import { ab } from "./kit";

// Alberta Kindergarten social studies, whose focus is culture, tradition and community. Families, needs and
// wants, places, helpers and working together are shared with BC and Ontario (see k.ts). These units cover
// traditions and celebrations, and leaders in communities. Indigenous content is kept light and general; deeper
// content should be developed with First Nations, Métis and Inuit partners.

// ---------- Traditions and Celebrations ----------

const TRADITIONS: Item[] = [
  q("What is a tradition?", "something a family or group does again and again", ["a thing you buy at a store", "a kind of weather"], "Traditions are special things people do the same way, year after year.", { emoji: "🎉" }),
  q("Families celebrate in different ways. Is that okay?", "Yes, every family is special", ["No, all must be the same", "Only one way is right"], "Families and communities have their own traditions."),
  q("Kenji's family makes dumplings together on special days. That is a…", "family tradition", ["traffic rule", "storm"], "Cooking a special food together can be a tradition.", { emoji: "🥟" }),
  q("Amira's family lights candles at a festival. What is she doing?", "sharing a tradition", ["fixing a car", "doing homework"], "Festivals often have special customs, like lighting candles.", { emoji: "🕯️" }),
  q("Which one is a way people share their culture?", "music, food and stories", ["math facts only", "weather reports"], "Culture includes the music, food, clothing and stories people share.", { emoji: "🎶" }),
  q("Grandma tells a story her grandma told her. This is a…", "story from the past", ["new invention", "shopping list"], "Many families pass stories down. These help us learn about history.", { emoji: "📖" }),
  q("Which one is a birthday tradition?", e("singing and a cake", "🎂"), [e("raking leaves", "🍂"), e("a fire drill", "🚒")], "Many families have a special way to celebrate birthdays.", { d: 2 }),
  q("A friend wears special clothes from her culture. What do you do?", "be kind and curious", ["laugh at it", "say it is silly"], "We can ask kind questions and learn about each other.", { emoji: "👘", d: 2 }),
  q("Which question is kind to ask a friend about their tradition?", "Can you tell me about it?", ["Why is yours weird?", "That is not real."], "Respectful questions help us learn.", { d: 2 }),
  q("People in Alberta come from many cultures. What does this mean?", "we have many traditions", ["everyone is the same", "nobody has stories"], "Our communities are made up of people with many cultures and histories.", { emoji: "🌎", d: 2 }),
  q("You look at a photo of your family long ago. What can you learn?", "how people lived in the past", ["what is for lunch", "the weather tomorrow"], "Old photos and things show history.", { emoji: "📷", d: 2 }),
  q("Which is a way to remember a family's past?", "photos and stories", ["a traffic light", "a bus pass"], "Families remember with photos, stories, songs and special things.", { d: 3 }),
  q("Elders share stories with your class. What can you do?", "listen with respect", ["interrupt", "walk away"], "Listening carefully shows respect for people who share what they know.", { emoji: "👂", d: 3 }),
  q("Two families celebrate differently. What do they have in common?", "they both celebrate something special", ["they are exactly the same", "they do not celebrate"], "Traditions can look different and still show what matters to people.", { d: 3 }),
];

const CELEBRATE_SORT = sorter({
  prompt: "Past or today? Tap a picture, then its basket.",
  hint: "Things from the past are old. Things today are new.",
  bins: [
    { id: "past", label: "Long ago", emoji: "🕰️" },
    { id: "now", label: "Today", emoji: "📱" },
  ],
  items: [
    { label: "horse and wagon", emoji: "🐎", bin: "past" },
    { label: "old photo", emoji: "📷", bin: "past" },
    { label: "oil lamp", emoji: "🪔", bin: "past" },
    { label: "washboard", emoji: "🧺", bin: "past" },
    { label: "tablet", emoji: "📱", bin: "now" },
    { label: "school bus", emoji: "🚌", bin: "now" },
    { label: "light bulb", emoji: "💡", bin: "now" },
    { label: "washing machine", emoji: "🫧", bin: "now" },
  ],
});

const FAMILY_ORDER = order("Order the family from youngest to oldest.", "A baby is the youngest, then a child, then a parent, then a grandparent.", [
  ["baby", "👶"],
  ["child", "🧒"],
  ["parent", "🧑"],
  ["grandparent", "👵"],
]);

// ---------- Leaders in Our Community ----------

const LEADERS: Item[] = [
  q("What does a leader do?", "helps a group make good choices", ["takes all the toys", "stays away"], "Leaders guide and help others.", { emoji: "🌟" }),
  q("Who is the leader of a school?", "the principal", ["a baker", "a pilot"], "The principal helps lead the whole school.", { emoji: "🏫" }),
  q("Who leads a class?", "the teacher", ["the postal carrier", "the bus"], "A teacher guides the class each day."),
  q("A mayor leads a…", "town or city", ["class lunch", "bake sale"], "A mayor is chosen to lead a town or city, like Edmonton or Calgary.", { emoji: "🏙️" }),
  q("Who leads a First Nation community?", "a Chief and council", ["a principal", "a lunch helper"], "Many First Nations have a Chief and council chosen by the community.", { d: 2 }),
  q("Which is a good leader?", "listens and is fair", ["is bossy", "ignores others"], "Good leaders listen, are fair and help everyone.", { emoji: "🤝" }),
  q("Your class needs a helper to lead the line. Who should it be?", "someone who is kind and safe", ["someone who runs away", "someone who pushes"], "Leaders set an example for others."),
  q("Who keeps people safe in a community?", "a firefighter or police officer", ["a clown only", "a bakery"], "Community helpers keep us safe.", { emoji: "🧑‍🚒" }),
  q("Who helps children cross the street?", "a crossing guard", ["a mail carrier", "a baker"], "Crossing guards lead children across streets safely.", { emoji: "🚸" }),
  q("Many communities have Elders. Why do people respect them?", "they share what they have learned", ["they play tag all day", "they never talk"], "Elders are people who guide others with their knowledge and care.", { d: 2 }),
  q("A team picks a captain. Why?", "to help the team work together", ["to boss everyone", "to take the ball"], "A captain leads and helps the team cooperate.", { emoji: "🏒", d: 2 }),
  q("Which person is a leader in your community?", "someone who helps the group", ["someone who only takes", "someone who is unkind"], "Leaders in communities help the group.", { d: 3 }),
  q("You can be a leader too. How?", "help a friend and be kind", ["break the rules", "hide from others"], "Even kids lead when they are kind and fair.", { emoji: "🧒", d: 3 }),
  q("Who makes sure a town has clean roads and parks?", "town workers", ["only kids", "only pets"], "Many people in a municipality work to care for the community.", { d: 3 }),
];

const LEADER_SORT = sorter({
  prompt: "Good leader or not? Tap a picture, then its basket.",
  hint: "Good leaders listen, share and are fair. They do not boss or push.",
  bins: [
    { id: "good", label: "Good leader", emoji: "🌟" },
    { id: "notgood", label: "Not helpful", emoji: "🚫" },
  ],
  items: [
    { label: "listens", emoji: "👂", bin: "good" },
    { label: "shares", emoji: "🤝", bin: "good" },
    { label: "is fair", emoji: "⚖️", bin: "good" },
    { label: "helps others", emoji: "🤲", bin: "good" },
    { label: "bosses", emoji: "😠", bin: "notgood" },
    { label: "pushes", emoji: "🚫", bin: "notgood" },
    { label: "ignores", emoji: "🙉", bin: "notgood" },
    { label: "takes it all", emoji: "🧺", bin: "notgood" },
  ],
});

export const units: Unit[] = [
  {
    id: "traditions-and-celebrations-ab",
    title: "Traditions & Celebrations",
    emoji: "🎉",
    blurb: "How families and communities celebrate",
    standards: ab("cultures, traditions, and histories", "family and community traditions, sharing stories from the past, and respecting different ways of celebrating"),
    parentNote: "Talk about your family's traditions and stories, and be curious about those of friends. Respect and kindness are the aims, not memorizing facts about any one culture.",
    generate: unitOf(TRADITIONS, [CELEBRATE_SORT, FAMILY_ORDER]),
  },
  {
    id: "leaders-in-community-ab",
    title: "Leaders in Our Community",
    emoji: "🌟",
    blurb: "Who leads and helps in a community",
    standards: ab("leaders in communities", "who leads and helps groups in a community, and what makes a good leader"),
    parentNote: "Talk about the people who lead and help in your school and neighbourhood, and how children can lead by being kind and fair.",
    generate: unitOf(LEADERS, [LEADER_SORT]),
  },
];
