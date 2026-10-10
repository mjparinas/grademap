import { bankUnit, type Q } from "../own";

// Grade 1 social studies, Connecting and Belonging: Manitoba and Canada (1-KC-001 to 1-KC-004).

const ITEMS: Q[] = [
  ["Which province do we live in?", "Manitoba", ["Alberta", "Ontario"], "We live in Manitoba. A province is a part of our country."],
  ["Which country do we live in?", "Canada", ["Mexico", "Australia"], "Manitoba is a province in the country of Canada."],
  ["Manitoba is a…", "province", ["country", "city"], "A province is a big part of a country. Canada has ten provinces."],
  ["Canada is a…", "country", ["province", "town"], "A country has many provinces and territories inside it."],
  ["What is the capital city of Manitoba?", "Winnipeg", ["Ottawa", "Regina"], "Winnipeg is where Manitoba's government meets."],
  ["What is the capital city of Canada?", "Ottawa", ["Winnipeg", "Toronto"], "Ottawa is where Canada's government meets."],
  ["How many official languages does Canada have?", "two", ["one", "five"], "English and French are Canada's two official languages."],
  ["Which two languages are official in Canada?", "English and French", ["English and Spanish", "French and German"], "Canada's two official languages are English and French."],
  ["Canada's national anthem is called…", "O Canada", ["Happy Birthday", "Twinkle, Twinkle"], "We sing “O Canada” at school and at special events."],
  ["When do we sing “O Canada”?", "At school and at special events", ["Only at bedtime", "Only on a bus"], "We stand and show respect when we sing the anthem."],
  ["Which colours are on the Canadian flag?", "red and white", ["blue and yellow", "green and orange"], "The Canadian flag is red and white with a maple leaf."],
  ["What is on the middle of the Canadian flag?", "a maple leaf", ["a bison", "a star"], "The red maple leaf is in the middle of the white square."],
  ["Which flower is the flower of Manitoba?", "prairie crocus", ["rose", "sunflower"], "The prairie crocus blooms on the prairie in early spring."],
  ["Which bird is a symbol of Manitoba?", "great grey owl", ["bald eagle", "robin"], "The great grey owl is Manitoba's provincial bird."],
  ["Which tree is a symbol of Manitoba?", "white spruce", ["palm tree", "cherry tree"], "The white spruce is Manitoba's provincial tree."],
  ["What day do we remember people who served in wars?", "Remembrance Day", ["Canada Day", "Earth Day"], "On Remembrance Day we think about peace and war."],
  ["When is Remembrance Day?", "November 11", ["July 1", "December 25"], "We remember on the 11th day of November."],
  ["What flower do many people wear on Remembrance Day?", "a red poppy", ["a yellow daisy", "a pink rose"], "A red poppy shows that we remember."],
  ["On Remembrance Day we think about…", "peace and war", ["birthdays", "winter sports"], "It is a day to think about peace and to remember those who served."],
  ["What does a poppy help us do?", "Remember", ["Celebrate a birthday", "Plant a garden"], "A poppy is a sign that we remember."],
  ["What is a good way to show respect on Remembrance Day?", "Be quiet and still", ["Run and shout", "Play a loud game"], "Silence and stillness show that we care."],
  ["When do many Canadians celebrate Canada's birthday?", "July 1", ["November 11", "October 31"], "Canada Day is on July 1."],
  ["What do we call the day we celebrate our country's birthday?", "Canada Day", ["Remembrance Day", "Groundhog Day"], "Canada Day is Canada's birthday."],
  ["Which of these is in Manitoba?", "Winnipeg", ["Vancouver", "Halifax"], "Winnipeg is a city in Manitoba."],
  ["Which sentence is true?", "Manitoba is in Canada.", ["Canada is in Manitoba.", "Manitoba is a country."], "A province is inside a country."],
  ["Which one is a province in Canada?", "Manitoba", ["Winnipeg", "Canada Day"], "Manitoba is a province. Winnipeg is a city inside it."],
  ["Many signs and food packages in Canada are written in…", "English and French", ["only French", "only numbers"], "Many signs and packages use both official languages.", true],
  ["Canada has ten provinces and three…", "territories", ["oceans", "islands"], "The three territories are in the north.", true],
  ["Which one is a Manitoba symbol?", "prairie crocus", ["maple syrup", "cherry blossom"], "The prairie crocus is Manitoba's flower.", true],
  ["What does “bonjour” mean?", "hello", ["goodbye", "thank you"], "Bonjour means hello in French, one of Canada's official languages.", true],
  ["Why do we have two official languages?", "People in Canada speak English and French", ["Nobody speaks French", "Only kids speak English"], "Both languages are part of Canada's story.", true],
];

export const unit = bankUnit({
  id: "mb-manitoba-and-canada",
  title: "Manitoba & Canada",
  emoji: "🍁",
  blurb: "Our province, our country, and the days we remember.",
  parentNote:
    "Practises the first ideas of belonging to a province and a country: that Manitoba is a province in Canada, that English and French are the two official languages, the national anthem, a few Manitoba symbols, and Remembrance Day as a time to think about peace and war.",
  standards: ["1-KC-001, 1-KC-002, 1-KC-003, 1-KC-004", "Manitoba and Canada, the official languages, the national anthem and Remembrance Day"],
  items: ITEMS,
});
