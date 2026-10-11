import { bankUnit, type Q } from "../own";

// Kindergarten (Primary) social studies: how people in Nova Scotia celebrate. Indigenous, Acadian, African Nova
// Scotian and Gaelic content is light and factual, and needs community review.

const CELEBRATE: Q[] = [
  ["People in Nova Scotia celebrate in…", "many different ways", ["only one way", "no ways at all"], "Families and communities have their own traditions."],
  ["What do many people do on their birthday?", "share a cake with family and friends", ["go to sleep all day", "stay away from everyone"], "Birthdays are a time to be with people we love."],
  ["On a birthday, people often sing…", "Happy Birthday", ["a lullaby only", "nothing at all"], "Singing together is a happy tradition."],
  ["Many families share a special meal to…", "celebrate together", ["be alone", "do homework"], "Food and family go together at a celebration."],
  ["What is a parade?", "a line of people walking or riding together", ["a very quiet nap", "a kind of fruit"], "In a parade, people march by so others can watch."],
  ["At a parade, people often hear…", "music", ["only silence", "a loud fire alarm"], "Bands and drums play at many parades."],
  ["What is a tradition?", "something a group does again and again", ["something nobody does", "a kind of food"], "A tradition is passed down from year to year."],
  ["Canada Day is on July 1. What do many people do?", "watch fireworks and wave flags", ["build a snowman", "trick or treat"], "Canada Day is a summer party for our country."],
  ["Which colours are on the Canadian flag?", "red and white", ["blue and yellow", "green and pink"], "The Canadian flag has a red maple leaf on white."],
  ["Acadians have a noisy parade called the Tintamarre. What do they bang?", "pots and pans", ["pianos", "snowballs"], "The Tintamarre is a happy, noisy parade."],
  ["Acadian National Day is on…", "15 August", ["25 December", "1 January"], "Acadians celebrate in August with the Tintamarre."],
  ["The Acadian flag has a star. What colour is the star?", "yellow", ["purple", "black"], "The Acadian flag has blue, white and red stripes and a gold star."],
  ["At a ceilidh in Nova Scotia, people enjoy…", "Gaelic music and dancing", ["swimming lessons", "a snow day"], "A ceilidh is a lively party with fiddles and dancing."],
  ["Which instrument is often played at a ceilidh?", "a fiddle", ["a trumpet", "a garden hose"], "Cape Breton is famous for its fiddle music."],
  ["The Mi’kmaq live in Nova Scotia today. They gather to…", "share songs, food and stories", ["hide from others", "stop celebrating"], "Many Mi’kmaw communities hold gatherings, and everyone can enjoy learning about them."],
  ["The Mi’kmaw people have lived in Mi’kma’ki for a very…", "long time", ["short time", "single day"], "The Mi’kmaq are the First People of this land."],
  ["Treaty Day is on 1 October. It reminds us of…", "treaties between the Mi’kmaq and the Crown", ["a day at the beach", "the first snow"], "Treaty Day helps us remember promises made to share the land in peace.", true],
  ["African Heritage Month is in…", "February", ["July", "October"], "People in Nova Scotia learn about and celebrate African Nova Scotian history in February.", true],
  ["Emancipation Day is on…", "1 August", ["1 July", "31 October"], "Emancipation Day remembers the end of slavery in the British Empire.", true],
  ["What is good to do when a neighbour celebrates something different?", "be kind and curious", ["tease them", "tell them to stop"], "We can learn from each other.", true],
  ["Which one is a way to celebrate with a community?", "going to a gathering together", ["staying under the bed", "ignoring everyone"], "Celebrations are better shared.", true],
  ["Why do people make music at celebrations?", "it makes the party happy", ["to be sad", "to be bored"], "Music helps people feel joy and togetherness.", true],
  ["Why do people celebrate holidays?", "to share joy with others", ["to be grumpy", "to hide inside"], "Holidays bring people together.", true],
  ["What do we blow out on a birthday cake?", "candles", ["bubbles", "leaves"], "Many people make a wish and blow out the candles."],
  ["What do friends often bring to a birthday party?", "a gift", ["a test", "a bill"], "A gift is a kind way to say happy birthday."],
  ["On 31 October, many children dress up in…", "costumes", ["snowsuits only", "swimsuits only"], "Halloween is a time for costumes and treats."],
  ["How many stars are on the Acadian flag?", "one", ["five", "ten"], "The Acadian flag has one gold star."],
  ["Gaelic is a…", "language", ["fruit", "kind of boat"], "Some people in Nova Scotia still speak and sing in Gaelic.", true],
  ["African Heritage Month helps us learn about…", "African Nova Scotian history and culture", ["only the weather", "only sports"], "African Nova Scotian communities have a long history here.", true],
];

export const celebrations = bankUnit({
  id: "ns-celebrations-k",
  title: "Celebrations in Nova Scotia",
  emoji: "🎉",
  blurb: "Parades, music, dancing and cake: how we celebrate!",
  parentNote:
    "Practises noticing that people in Nova Scotia celebrate in different ways, from birthdays and Canada Day to the Acadian Tintamarre, Gaelic ceilidhs, Mi’kmaw gatherings, Treaty Day and African Heritage Month. It follows the Primary social studies outcome on traditions, rituals and celebrations.",
  standards: ["Investigate how local people have varied traditions, rituals, and celebrations", "Learn how people in Nova Scotia celebrate in different ways"],
  items: CELEBRATE,
});
