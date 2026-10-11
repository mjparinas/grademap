import { bankUnit, type Q } from "../own";

// Grade 2 social studies: people who shaped communities, smart shopping and sustainable communities in Nova
// Scotia. Indigenous, Acadian, African Nova Scotian and Gaelic content is light and factual, and needs community
// review.

const CONTRIB: Q[] = [
  ["Who are the First People of Mi’kma’ki, the land we call Nova Scotia?", "the Mi’kmaq", ["the Vikings", "the Romans"], "The Mi’kmaq have lived here for thousands of years and live here today."],
  ["The Mi’kmaw language is called…", "Mi’kmaw", ["Gaelic", "Latin"], "Mi’kmaw is spoken in Nova Scotia today."],
  ["Many place names in Nova Scotia come from the…", "Mi’kmaw language", ["Roman language", "Martian language"], "Words like Shubenacadie and Antigonish come from Mi’kmaw."],
  ["Rita Joe, a poet from Eskasoni, shared her…", "poems and stories", ["bridge designs", "cooking shows"], "Rita Joe wrote poems that taught people about Mi’kmaw life."],
  ["The Acadians built dykes along the Bay of Fundy to…", "turn salt marsh into farmland", ["catch lobster", "make snow"], "Dykes kept the tide out so crops could grow."],
  ["Acadians are people who speak…", "French", ["Gaelic", "Mi’kmaw"], "Acadian French is spoken in parts of Nova Scotia today."],
  ["What does the Acadian flag have on it?", "a gold star", ["a maple leaf", "a lobster"], "The star stands for Mary, the guide of Acadians at sea."],
  ["Gaelic is a language from…", "Scotland", ["Africa", "Mexico"], "Many Scots came to Nova Scotia and brought Gaelic."],
  ["Cape Breton is famous for…", "fiddle music", ["desert music only", "volcanoes"], "Gaelic settlers brought fiddle tunes that are still played."],
  ["The Gaelic College in St. Ann’s is on…", "Cape Breton Island", ["Prince Edward Island", "Sable Island"], "It teaches Gaelic songs, dance and language."],
  ["Viola Desmond stood up for fairness at a theatre in…", "New Glasgow", ["Halifax Harbour", "Yarmouth"], "In 1946 she refused to leave a seat she had paid for."],
  ["Viola Desmond helped people think about…", "treating everyone fairly", ["building boats", "baking pies"], "Her courage helped change unfair rules."],
  ["Black Loyalists settled in Nova Scotia after the…", "American Revolution", ["Halifax Explosion", "Second World War"], "Many came to Nova Scotia more than 200 years ago and built communities."],
  ["Africville was a community in…", "Halifax", ["Sydney", "Truro"], "People in Africville built homes, a church and a school."],
  ["A church or school can help a community by…", "bringing people together", ["keeping people apart", "making noise only"], "Places like these are important for sharing and learning.", true],
  ["Fishing communities along the coast show how people use…", "the sea for work and food", ["the moon for light", "deserts for food"], "Fishing is part of life in many Nova Scotia towns.", true],
  ["How can a new idea or invention help a community?", "it can make life easier", ["it always makes things harder", "it never changes anything"], "Good ideas can solve problems.", true],
  ["Why is it good for a community to have many cultures?", "we learn from each other", ["everyone must be the same", "nobody shares"], "Different foods, songs and ideas make a community rich.", true],
  ["Compared with long ago, schools today…", "have many tools and books", ["do not exist", "have no teachers"], "Schools have changed over time.", true],
  ["When something becomes different over time, it has…", "changed", ["stayed the same", "disappeared forever"], "Communities change as people bring new ideas.", true],
  ["What is a ceilidh?", "a lively party with music and dancing", ["a kind of boat", "a school test"], "Ceilidhs are a Gaelic tradition still enjoyed in Nova Scotia."],
  ["The Mi’kmaq have lived in Mi’kma’ki for…", "thousands of years", ["about ten years", "one week"], "Mi’kmaw people are the First People of this land."],
  ["The Tintamarre is an Acadian…", "noisy parade", ["quiet library visit", "swimming race"], "People bang pots and pans to celebrate Acadian pride."],
  ["Rita Joe was a Mi’kmaw…", "poet", ["lighthouse keeper", "hockey coach"], "She wrote poems about Mi’kmaw life and sharing understanding."],
  ["Viola Desmond is shown on which Canadian bill?", "the $10 bill", ["the $5 bill", "the $100 bill"], "Her picture was added to the $10 bill in 2018.", true],
  ["Birchtown, near Shelburne, was founded by…", "Black Loyalists", ["Roman soldiers", "Viking sailors"], "It became a large community of free Black settlers.", true],
  ["Who can make a community better?", "anyone who helps and shares ideas", ["only grown-ups", "only famous people"], "Kids and adults all help communities grow.", true],
];

export const contributions = bankUnit({
  id: "ns-contributions-2",
  title: "People Who Shaped Our Communities",
  emoji: "🤝",
  blurb: "Meet people and groups who helped Nova Scotia grow.",
  parentNote:
    "Practises how Mi’kmaw, Acadian, African Nova Scotian, Gaelic and other communities and individuals brought change to Nova Scotia communities. It follows the Grade 2 outcome on individuals and cultural groups who contributed to change.",
  standards: ["Investigate how individuals and diverse cultural groups have contributed to change", "Learn how people and groups changed Nova Scotia communities"],
  items: CONTRIB,
});

const SHOP: Q[] = [
  ["A consumer is someone who…", "buys or uses goods and services", ["only makes goods", "never shops"], "Consumers choose what to buy."],
  ["A toy costs $5. You have $10. How much money is left after you buy it?", "$5", ["$10", "$15"], "10 take away 5 is 5."],
  ["Which costs less?", "a $2 apple", ["a $5 apple", "a $10 apple"], "Cheaper means it costs less."],
  ["You have $20. A book costs $15. How much is left?", "$5", ["$35", "$15"], "20 take away 15 is 5."],
  ["Which is a local food from Nova Scotia?", "blueberries", ["bananas", "pineapples"], "Wild blueberries grow in Nova Scotia."],
  ["Where do many Nova Scotia apples grow?", "the Annapolis Valley", ["the Arctic", "a desert"], "Many orchards are in the Annapolis Valley."],
  ["Lobster is a food from the…", "ocean", ["desert", "sky"], "Lobster fishers work off Nova Scotia's coast."],
  ["Maple syrup comes from…", "sap of maple trees", ["milk", "fish"], "Maple trees are tapped for sap."],
  ["Buying local goods means buying things made…", "near where you live", ["on another planet", "long ago"], "Local goods travel less far."],
  ["An advertisement tries to…", "get you to buy something", ["teach you to swim", "keep you quiet"], "Ads are made to sell things."],
  ["Which is a need to buy?", "food", ["a fancy toy", "a game"], "Food is a need. Toys are wants."],
  ["Which is a want to buy?", "a new game", ["milk", "winter boots"], "A game is fun but not needed."],
  ["You save $5 each week. After 2 weeks you have…", "$10", ["$5", "$7"], "5 plus 5 is 10."],
  ["Two pencils cost the same. One is stronger. Which is a good choice?", "the stronger one", ["the weaker one", "neither"], "Better quality for the same price is a good choice."],
  ["Why do we compare prices?", "to find a good deal", ["to make shopping harder", "to spend more"], "Comparing helps us use money wisely.", true],
  ["A trade-off means choosing one thing and…", "giving up another", ["getting both for free", "having no choice"], "You often cannot have everything.", true],
  ["You have $10. A hat costs $5 and a scarf costs $10. You buy the hat. How much is left?", "$5", ["$10", "$0"], "10 take away 5 is 5.", true],
  ["You want a $20 toy and have saved $15. How much more do you need?", "$5", ["$35", "$15"], "20 take away 15 is 5.", true],
  ["Why can buying local fish be a good idea?", "it supports people in our community", ["it is always free", "it comes from space"], "Local buying keeps money in the community.", true],
  ["A snack costs 85 cents. You pay with a dollar. How much change do you get?", "15 cents", ["85 cents", "25 cents"], "100 cents take away 85 cents is 15 cents.", true],
  ["A book costs $8. You pay with $10. How much change do you get?", "$2", ["$8", "$18"], "10 take away 8 is 2."],
  ["Which costs more?", "a $9 toy", ["a $3 toy", "a $1 toy"], "More expensive means it costs more."],
  ["You save $2 each week. After 4 weeks you have…", "$8", ["$6", "$12"], "2 plus 2 plus 2 plus 2 is 8."],
  ["What does the price of something tell you?", "how much it costs", ["how heavy it is", "what colour it is"], "The price is the amount of money to pay."],
  ["Two shops sell the same bike. Shop A is $50 and Shop B is $45. Which is the better deal?", "Shop B", ["Shop A", "They cost the same"], "Shop B costs less for the same bike.", true],
  ["A sign says half price. A $10 toy would cost…", "$5", ["$20", "$10"], "Half of 10 is 5.", true],
  ["Why might you wait before buying something you want?", "to think if it is worth it", ["to make it cost more", "so it breaks"], "Waiting helps us make a wise choice.", true],
];

export const consumers = bankUnit({
  id: "ns-consumers-2",
  title: "Smart Shoppers",
  emoji: "🛒",
  blurb: "Choose wisely, save up and shop local.",
  parentNote:
    "Practises how consumers decide what to buy: comparing price and quality, needs and wants, saving up, advertising, and local goods like blueberries, apples and lobster. Prices are in whole dollars. It follows the Grade 2 outcome on consumer decisions.",
  standards: ["Investigate how decisions are made as consumers", "Learn how shoppers choose, compare prices and save"],
  items: SHOP,
});

const SUSTAIN: Q[] = [
  ["Sustainable means using what we need and leaving enough for…", "later", ["never", "nobody"], "Sustainable ways keep things going for the future."],
  ["What does reduce mean?", "use less", ["use more", "throw away"], "Reduce means making less waste."],
  ["What does reuse mean?", "use something again", ["throw it away", "break it"], "A jar can be reused for storing things."],
  ["What does recycle mean?", "make old things into new things", ["bury things", "burn things"], "Paper and cans can be made into new ones."],
  ["In Nova Scotia, food scraps go in the…", "green cart", ["blue sky", "toy box"], "Compost turns food scraps into soil."],
  ["Compost is made from…", "food and plant scraps", ["plastic toys", "metal pots"], "Compost helps plants grow."],
  ["Which saves water?", "turning off the tap while brushing teeth", ["leaving the tap on", "running a bath for fun"], "Turning off the tap saves clean water."],
  ["Which saves energy?", "turning off the light when you leave", ["leaving every light on", "running a heater with open windows"], "Less power means less waste."],
  ["Which is a good way to travel and be kind to the earth?", "walk or bike", ["drive alone to the corner", "fly everywhere"], "Walking and biking use no fuel."],
  ["A community garden helps because it…", "grows food near home", ["uses lots of plastic", "makes litter"], "People share the work and the food."],
  ["Why should we keep beaches clean?", "to protect animals and plants", ["to make more garbage", "to hide the sand"], "Litter can hurt sea life."],
  ["Shopping locally helps because the food…", "travels a short way", ["travels around the world", "is always bigger"], "Less travel uses less fuel."],
  ["Which bag can you use again and again?", "a cloth bag", ["a bag thrown out after one use", "a bag that tears at once"], "Using a bag many times makes less waste."],
  ["Forests help us because they give…", "clean air and homes for animals", ["more garbage", "less rain"], "Trees are important, so we protect them."],
  ["Which item can usually go in the recycling?", "a clean paper box", ["a banana peel", "a dirty tissue"], "Clean paper and cardboard can be recycled.", true],
  ["You outgrow a coat. A kind way to help the earth is to…", "pass it on to someone", ["throw it in the ocean", "burn it"], "Passing it on is reuse.", true],
  ["Why is it not sustainable to cut down every tree?", "there would be none left for later", ["trees grow forever", "trees are bad"], "We must plant new trees.", true],
  ["Which choice makes the least garbage?", "a reusable water bottle", ["a new plastic bottle each time", "a paper cup each time"], "Reusing creates less waste.", true],
  ["Fish need time to grow. Taking only what we need helps…", "fish stay for the future", ["fish disappear fast", "nothing at all"], "Fishers follow rules to keep fish plentiful.", true],
  ["If everyone walks to school, the air in town is…", "cleaner", ["dirtier", "pink"], "Fewer cars means cleaner air.", true],
  ["Which one can be reused?", "a glass jar", ["a banana peel", "a used tissue"], "A clean jar can hold things again and again."],
  ["A leaky tap wastes…", "water", ["sand", "music"], "A drip adds up, so we tell a grown-up to fix it."],
  ["Which way to pack lunch makes less waste?", "a reusable container", ["a new plastic bag each day", "extra wrapping on everything"], "Reusing a container means less garbage."],
  ["Planting a tree helps because trees give…", "shade, clean air and homes for animals", ["more garbage", "less rain"], "Trees are good for people and wildlife."],
  ["Why is it good to fix a broken toy instead of throwing it away?", "it makes less garbage", ["it makes more garbage", "toys never break"], "Fixing things helps them last longer.", true],
  ["Netukulimk is the Mi’kmaw way of taking only what is needed. It is a kind of…", "sustainable living", ["wasting things", "ignoring nature"], "It helps keep the land and sea healthy for the future.", true],
  ["Buying a used bike instead of a new one is a way to…", "reuse", ["litter", "waste"], "A used bike gets a second life.", true],
];

export const sustainableCommunities = bankUnit({
  id: "ns-sustainable-communities-2",
  title: "Caring for Our Community’s Future",
  emoji: "♻️",
  blurb: "Use what we need and leave enough for later.",
  parentNote:
    "Practises what sustainable means in child terms: reduce, reuse, recycle and compost (including Nova Scotia’s green cart), saving water and energy, and caring for beaches and forests. It follows the Grade 2 outcome on sustainable development in local communities.",
  standards: ["Analyse ways for supporting sustainable development in local communities", "Learn simple ways to care for our community's future"],
  items: SUSTAIN,
});
