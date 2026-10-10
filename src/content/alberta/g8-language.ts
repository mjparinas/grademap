import type { Unit } from "../types";
import { ab } from "./kit";
import { fromItems, q } from "./g8-bank";

// Alberta Grade 8 language arts: the English Language Arts (2000) general outcomes 1 and 5.
// The reading, writing, vocabulary and media units are shared from BC and Ontario (see g8.ts).
// All items are original.

const TALK = [
  q(1, "A classmate is sharing an idea in a group. What is the best way to show respect?", "Listen without interrupting, then respond to what they said.", ["Look at your phone until it is your turn.", "Finish their sentences for them.", "Start your own story right away."], "Good listeners give their full attention and build on what others say."),
  q(1, "Which sentence is a respectful way to disagree?", "I see it differently. Here is why I think so.", ["That idea is silly.", "You always get things wrong.", "Nobody agrees with you."], "You can disagree with an idea without putting the person down."),
  q(1, "Your group has finished a project. What kind of feedback is most helpful?", "Specific and kind, with one thing that worked and one idea to try next", ["Only 'good job'", "Only a list of mistakes", "No feedback at all"], "Helpful feedback names what is working and suggests a next step."),
  q(1, "Why is it useful to write about your own experiences before a discussion?", "It helps you gather your thoughts and ideas.", ["It makes the discussion shorter.", "It means you do not have to listen.", "It proves you are right."], "Writing or sketching first helps ideas take shape before you share them."),
  q(2, "In a group task, one person always does the talking. What could the group do?", "Give everyone a turn and a role.", ["Let that person do all the work.", "Stop the task.", "Vote the quiet people out."], "A fair group makes sure every voice is heard."),
  q(2, "A speaker says, 'Those people are all the same.' What is the problem with this statement?", "It is a stereotype that treats a whole group as one.", ["It is too short.", "It uses too many adjectives.", "It is a question."], "Statements about 'all' people in a group ignore the differences among individuals."),
  q(2, "Which is an example of inclusive language?", "Everyone is welcome to share.", ["Only the best readers should talk.", "Boys do this and girls do that.", "Anyone who is new should stay quiet."], "Inclusive language makes every person feel welcome."),
  q(2, "A friend's story is very different from yours because they come from another culture. What is a good response?", "Ask questions to understand their point of view.", ["Tell them their story is wrong.", "Change the subject.", "Say that your culture is better."], "Curiosity and respect help us learn from different perspectives."),
  q(2, "During a presentation, you want to stay on topic. Which tool helps most?", "A short outline with your main points", ["A longer story about something else", "Reading every word without looking up", "Speaking as quietly as possible"], "An outline helps you keep your ideas organized."),
  q(3, "In a class debate, you hear a good argument from the other side. What is the most mature response?", "Say what is strong in it, then explain where you see it differently.", ["Pretend you did not hear it.", "Repeat your own point louder.", "Argue about the speaker's appearance."], "Weighing evidence and acknowledging good ideas shows careful thinking."),
  q(3, "Why might two people read the same poem and take away different meanings?", "Their experiences and perspectives shape how they understand it.", ["One of them must have read it wrongly.", "Poems have no meaning.", "They used different pens."], "Readers bring their own experiences, so meanings can differ while still being supported by the text."),
  q(3, "A group member makes a suggestion you do not like. What should you do before you reject it?", "Ask a question to understand it and then consider its strengths.", ["Reject it at once.", "Ignore the person.", "Laugh about it."], "Understanding an idea first leads to better decisions."),
  q(3, "When a group's work is done, which reflection is most useful?", "What did we do well together, and what will we change next time?", ["Who was the worst teammate?", "Who talked the most?", "How soon can we stop?"], "Reflecting on how the group worked helps everyone improve."),
  q(3, "A story shares the experience of a person who is very different from you. What can reading it help you do?", "Understand and respect another point of view.", ["Decide that you already know everything.", "Skip the story.", "Argue with the author."], "Stories help us see the world through other people's eyes."),
];

export const units: Unit[] = [
  {
    id: "respectful-talk-ab",
    title: "Talking & Working Together",
    emoji: "🤝",
    blurb: "Listening, sharing ideas and giving kind feedback",
    standards: ab("General Outcomes 1, 5", "sharing ideas and experiences, listening with respect, working in groups and giving helpful feedback"),
    parentNote: "Exploring and sharing thoughts and experiences, listening to other points of view, using inclusive language, working fairly in a group and giving feedback that is specific and kind.",
    generate: fromItems(TALK),
  },
];
