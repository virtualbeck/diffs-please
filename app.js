'use strict';
/* Skill facts come from the SKILL.md files and README of github.com/mattpocock/skills (MIT). */
const SKILLS = {
  'grill-with-docs': {day:1, kind:'you type it', cost:20,
    short:'The agent interviews you until you both agree exactly what to build.',
    what:['A relentless interview that sharpens a plan before any code is written.','The agent asks in rounds. Every question comes with its recommended answer.','**Facts** are the agent\'s job to look up. **Decisions** are yours.','It saves the agreed words in the repo (GLOSSARY.md), so the agent stays brief and consistent later.'],
    when:'you have an idea and a repo. Start here every time you want a change.'},
  'code-review': {day:1, kind:'you or the agent', cost:6,
    short:'Checks finished work twice: against the house rules, and against what was asked for.',
    what:['Reviews everything changed since a fixed point, such as main.','**Two checks.** Standards: does it follow the project\'s written rules? Spec: does it do what was asked?','Each check runs in its own helper agent, so one can never hide the other.','Work can **pass one** check and **fail the other**.'],
    when:'finished work is on your desk and you need to know if it is right.'},
  'tdd': {day:1, kind:'you or the agent', cost:10,
    short:'Makes the agent write a small check (a test) first, then just enough code to pass it.',
    what:['The red then green loop: **a failing test first**, then only enough code to pass it.','**One slice at a time**: one test, one piece of code, repeat.','Tests check what the code does from the outside, at spots agreed with you first.','Traps: writing all the tests up front, and tests that can never fail.'],
    when:'the agent is about to build something or fix a bug.'},
  'diagnosing-bugs': {day:2, kind:'you or the agent', cost:15,
    short:'A strict routine for hard bugs: make the bug happen on demand first, then hunt the cause.',
    what:['Phase 1 is the whole skill: **build one command** that fails whenever the bug is there.','No such command, **no theories**.','Bug only shows up sometimes? Run it many times until it is caught reliably.','Then: shrink the example, list 3 to 5 ranked causes, change one thing at a time, and add a test before the fix.'],
    when:'something is broken, flaky or slow and nobody knows why.'},
  'triage': {day:2, kind:'you type it', cost:8,
    short:'Sorts requests from other people: labels each one and decides what happens next.',
    what:['Moves incoming issues through a small set of labels.','Every issue gets **one category** (bug or enhancement) and **one state** (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix).','Only for issues **you did not create**. Tickets made by /to-tickets are already ready.'],
    when:'bug reports and requests from outside are piling up.'},
  'git-guardrails-claude-code': {day:2, kind:'you or the agent', cost:4,
    short:'Installs a safety lock so the agent cannot run commands that destroy work.',
    what:['Adds a checkpoint (a hook) that inspects every command **before the agent runs it**.','Blocked: git push in every form, git reset --hard, git clean, git branch -D, and commands that discard all local changes.','When blocked, the agent is told it has **no authority** to run them.'],
    when:'you want destructive commands stopped before they can run.'},
  'to-spec': {day:3, kind:'you type it', cost:10,
    short:'Writes up what you already agreed as a spec. Asks no new questions.',
    what:['Turns the current conversation into a written spec on your issue tracker.','**No interview.** It only gathers up what was already said.','Checks with you where the tests should go, then marks the spec ready for an agent.'],
    when:'the interview is done and the build will take more than one session.'},
  'to-tickets': {day:3, kind:'you type it', cost:10,
    short:'Cuts a spec into small tickets, each one a complete working slice.',
    what:['Breaks a spec into "tracer bullet" tickets.','Each ticket is a **vertical slice**: one small thing that works from end to end and can be checked on its own.','Each ticket lists **what blocks it**: the tickets that must finish first.','Each one is small enough for a single fresh agent session.'],
    when:'you have a spec and need pieces an agent can pick up.'},
  'implement': {day:3, kind:'you type it', cost:25,
    short:'Builds one ticket: tests first, then a review, then saves the work.',
    what:['Builds what a spec or ticket describes.','Uses /tdd while building.','Runs all the tests once at the end, **finishes with /code-review**, then commits.','Between tickets you **/clear**: each ticket stands alone.'],
    when:'a ticket is ready and it is time to build.'},
  'handoff': {day:3, kind:'you type it', cost:5,
    short:'Writes a summary file so another person or agent can pick the work up somewhere else.',
    what:['Shrinks the conversation into a document that can travel.','**Only for:** a different AI tool, a different folder, a colleague, or a side task you want to split off.','Points to existing documents instead of copying them. **Removes secrets.** Suggests skills for whoever reads it.'],
    when:'the work has to move somewhere else.'},
  'wait-what': {day:4, kind:'you type it', cost:3,
    short:'Makes the agent say its last message again, with context, in plain English.',
    what:['Fire it the moment a message does not land.','The agent **re-pitches** what it said: a little background, simple words, and the terms from your GLOSSARY.md.','It works after the fact. The upfront cure is a shared language, agreed during /grill-with-docs.'],
    when:'the agent just said something you did not follow.'},
  'domain-modeling': {day:4, kind:'you or the agent', cost:8,
    short:'Sharpens the project vocabulary: one word, one meaning, written in the glossary.',
    what:['Challenges fuzzy or overloaded words the moment they appear.','Tests each meaning with concrete what-if examples.','Updates GLOSSARY.md **right away**, never in a batch.','The glossary holds words and meanings only. **No implementation details.**'],
    when:'a word is doing more than one job, or people mean different things by it.'},
  'improve-codebase-architecture': {day:4, kind:'you type it', cost:15,
    short:'Surveys the code for tangled spots worth simplifying, and shows you the candidates.',
    what:['Looks first at the parts of the code that change most often.','Finds **shallow modules** (a lot to learn, little behaviour) and proposes making them deep.','Gives you a visual report, with a recommendation strength for each candidate.','A **survey, not a rescue**. You pick one, then it grills you on the new design.'],
    when:'you have a spare moment. The author suggests every few days.'},
  'retro': {day:4, kind:'you type it', cost:8,
    short:'Looks back at a session and suggests fixes to the agent\'s environment, not the code.',
    what:['Reads what actually happened in the session.','Suggests improvements, most severe first: navigation, automatic checks, coding standards, instructions, tooling.','**Mechanical mistakes** become automatic checks.','**Judgement calls** become written standards for the reviewer.'],
    when:'a build has finished, especially one that went badly.'}
};

const GLOSSARY = [
 [['Repo','the folder that holds a project\'s code and its full history.'],
  ['Main','the official version of the code. Work only counts once it is on main.'],
  ['Agent','the AI (here, Claude Code) that reads and writes code for you.'],
  ['Skill','a saved routine the agent follows. You run one by typing a slash and its name.'],
  ['Ticket or issue','a written request: a bug to fix or a thing to build.'],
  ['Spec','the written agreement of what to build and why.']],
 [['Diff','the exact lines a change adds (+) and removes (-).'],
  ['Merge','accept a change onto main.'],
  ['Commit','a saved checkpoint of the work.'],
  ['Test','a small program that checks the real code works. Red means failing, green means passing.'],
  ['Context','the agent\'s working memory for one session. It fills up as you work, and a full memory makes a sloppy agent.'],
  ['Session','one conversation with the agent. It remembers nothing from earlier sessions.'],
  ['Tokens','the units of text the agent reads and writes. Each one costs money and takes up context.']],
 [['GLOSSARY.md','a file in the repo listing the project\'s agreed words and what each one means.'],
  ['Module','any piece of code with a way to use it and something inside: a function, a file, a whole package.'],
  ['Deep module','a lot of behaviour behind a small, simple way of using it. The goal.'],
  ['Shallow module','a lot to learn for very little behaviour. The thing to fix.'],
  ['Automatic check','a program that inspects code and fails on a known mistake, such as a linter or a test.'],
  ['Coding standards','the project\'s written house rules, enforced at review time.']]
];

const CASES = [
 {day:1, who:['human','#6f7f86','Vera','product manager, decides what gets built'], title:'Idea: retry payments',
  say:'Add a retry thing to checkout. Tell the agent to build it today.',
  sit:'Vera\'s idea is vague. If the agent starts now it will **guess the details**, and probably guess wrong. This is the most common way AI work goes bad: you and the agent picture different things.',
  hint:'Nobody has agreed what "a retry thing" means. Look for the skill that gets you and the agent aligned before any code is written.',
  steps:[
   {t:'skill', q:'Before any code is written, which skill do you run?', pick:['tdd','grill-with-docs','code-review'], ok:'grill-with-docs',
    out:[['Round 1: three questions, each with a recommended answer.','The agent asks. It also suggests an answer, so you can often just say yes.']],
    explain:'The agent is now interviewing you. It keeps going until **nothing is left to guess**.'},
   {t:'choice', ctx:'The rule of the interview: **facts** are the agent\'s job, **decisions** are yours. A fact can be found by reading the project. A decision can only be made by a person.',
    q:'Which of these questions should the agent have answered by itself?', opts:[
     {s:'How many retries before giving up?', fb:'That is a **decision**. Only a person can choose it, so the agent is right to ask.'},
     {s:'Which file holds the checkout code?', ok:1, fb:'That is a **fact**. The agent can read the repo and find it. It should never ask you for something it can look up.'},
     {s:'Should we show an error after the last try?', fb:'That is a **decision**. Only a person can choose it, so the agent is right to ask.'}]}],
  end:'You and the agent now agree: retry 3 times, then show an error.',
  lesson:'**Grill before you build.** The agent asks and recommends, you decide. Use it every time you want a change.'},

 {day:1, who:['bot','#a39c86','agent-07','an AI coding agent'], title:'Ticket #214: retry declined payments',
  say:'Done! I fixed checkout. Ready to merge!',
  sit:'The agent built what you agreed with Vera and wants it merged, meaning added to main, the official version. Its work arrives as a **diff**: a list of lines added and removed. You do not need to read code to check it. **A skill does that.**',
  hint:'Finished work is waiting to be merged. Look for the skill that checks a change before it goes onto main.',
  steps:[
   {t:'skill', q:'Which skill checks finished work before it is merged?', pick:['grill-with-docs','tdd','code-review'], ok:'code-review',
    out:[['Standards: PASS','It follows the project\'s written rules.'],['Spec: 1 finding','It does not match what was asked for.']],
    explain:'The review makes **two separate checks**, so a pass on one cannot hide a problem in the other.'},
   {t:'tap', intro:'The **spec** is what you agreed in the interview. The **diff** is what the agent actually changed.',
    qa:'1. Tap the agreement that was NOT kept.', qb:'2. Now tap the change that breaks it.',
    a:['The spec: what was agreed',['On decline, retry the payment.','Retry up to 3 times.','Show an error after the last try.']],
    b:['The diff: what the agent changed',[['- maxRetries = 1','removed: retry once'],['+ maxRetries = 0','added: retry zero times'],['+ showError()','added: show an error']]], ok:[1,1],
    good:'Found it. You agreed on **3 retries**. The agent set it to **0**.'},
   {t:'stamp', recap:'The work follows the rules, but it **does not do what was agreed**.', ok:'back',
    fb:{back:'Right. The agent gets the finding, with the spec line quoted, and fixes it.', reject:'Too harsh. The ticket is wanted and the fix is small. **Sending it back** was the right call.', merge:'You merged #214. Declined cards now never retry. Support is on fire.'}, cit:['merge']}],
  lesson:'Code can follow every rule and still build the wrong thing. That is why "does it match the spec" is **its own check**.'},

 {day:1, who:['bot','#8f6f4a','agent-12','an AI coding agent'], title:'Ticket #215: cart total',
  say:'My plan: write all 12 tests first, then all the code. Efficient!',
  sit:'A **test** is a small program that checks the real code does its job. Tests are how the agent knows its code works instead of hoping. This agent is about to start building, and its plan sounds tidy. It is a **known trap**.',
  hint:'The agent is about to build something. Look for the skill that sets the rules for building with tests.',
  steps:[
   {t:'skill', q:'Which skill sets the rules for building with tests?', pick:['tdd','code-review','grill-with-docs'], ok:'tdd',
    out:[['Rules of the loop loaded.','Red, then green: one failing test first, then the code that makes it pass.']],
    explain:'Red means a test is failing. Green means it passes. **Seeing red first** proves the test can catch a problem.'},
   {t:'choice', ctx:'With the rules loaded, the agent offers you three plans.', q:'Which plan do you approve?', opts:[
     {s:'All 12 tests first, then all the code', fb:'The docs call this **horizontal slicing**. Tests written in bulk check what the agent imagines, not what it learns while building.'},
     {s:'Code first, tests later if there is time', fb:'Without a failing test first, the agent has no feedback. It is **flying blind**.'},
     {s:'One failing test, just enough code to pass it, repeat', ok:1, fb:'**Red before green**, one slice at a time. Each test builds on what the last one taught.'}]}],
  end:'agent-12: "Fine. One test. It is red. Now I make it green."',
  lesson:'**Small steps**: one test, one piece of code, repeat. The rate of feedback is the agent\'s speed limit.'},

 {day:1, who:['bot','#9a5a4a','agent-09','an AI coding agent'], title:'Ticket #216: empty cart message',
  say:'Morning. One small change, with a test.',
  sit:'Another finished change waiting to be merged. Not everything that reaches your desk is broken. Your job is to **check**, and then to **believe the result**.',
  hint:'Finished work again. Run the same check as before, then trust what it reports.',
  steps:[
   {t:'skill', q:'Which skill checks finished work before it is merged?', pick:['code-review','grill-with-docs','tdd'], ok:'code-review',
    out:[['Standards: PASS','It follows the project\'s written rules.'],['Spec: PASS','It does what the ticket asked.']],
    explain:'Two passes. The review found **nothing to fix**.'},
   {t:'stamp', recap:'The review found **nothing wrong** on either check.', ok:'merge',
    fb:{merge:'Right. **Clean work** goes onto main.', back:'There was **nothing to fix**. The agent redid clean work for no reason.', reject:'You rejected clean work. Ticket #216 is still open and Vera is furious.'}, cit:['reject']}],
  lesson:'The review exists to find real problems, not to block everything. No findings on either check means **merge**.'},

 {day:2, who:['human','#8f3b2a','Sam','on support duty today'], title:'Alert: customers charged twice',
  say:'agent-07 says it has a theory and wants to rewrite the whole payment code!',
  sit:'About 1 order in 20 is charged twice and nobody knows why. The tempting move is to guess a cause and start changing things. But with a bug that only shows up sometimes, a **wrong guess** can look like it worked.',
  hint:'Something is broken and nobody understands it yet. Look for the skill that refuses to guess.',
  steps:[
   {t:'skill', q:'Which skill handles a bug nobody understands yet?', pick:['code-review','diagnosing-bugs','triage','tdd'], ok:'diagnosing-bugs',
    out:[['Phase 1: build a feedback loop.','First find a way to make the bug happen on demand.']],
    explain:'A **feedback loop** is one command that fails (red) while the bug exists and passes (green) once it is fixed.'},
   {t:'choice', ctx:'The agent is eager to start.', q:'What must happen first?', opts:[
     {s:'Read the code and come up with a theory', fb:'**Jumping straight to a theory** is the exact failure this skill exists to prevent.'},
     {s:'Build one command that fails whenever the bug is there', ok:1, fb:'This is the heart of the skill. For a 1 in 20 bug, **run it 100 times** in a row until it is caught reliably.'},
     {s:'Add logging everywhere and search through it', fb:'The docs are blunt about this one: **never** log everything and search.'}]},
   {t:'choice', ctx:'The bug can now be caught on demand.', q:'How should the agent look for the cause?', opts:[
     {s:'List 3 to 5 possible causes, ranked, each with a way to prove it wrong', ok:1, fb:'Several ranked ideas, each testable. Then **change one thing at a time**.'},
     {s:'Test the first idea that comes to mind', fb:'A single idea **anchors you** on the first thing that sounds plausible.'}]}],
  end:'Cause found: the retry sent the same payment twice. A new test stops it coming back.',
  lesson:'**Build the right feedback loop** and the bug is 90% fixed. No command that catches the bug, **no theories**.'},

 {day:2, who:['hood','#4a4c3f','A stranger','a user you have never met'], title:'New issue, no labels',
  say:'app broken pls fix',
  sit:'An **issue** is a request someone files against your project. This one comes from outside and says almost nothing. You cannot build from it, but you should not ignore it. Incoming requests **need sorting**.',
  hint:'A raw request from someone outside. Look for the skill that sorts and labels incoming issues.',
  steps:[
   {t:'skill', q:'Which skill sorts requests that come from other people?', pick:['diagnosing-bugs','grill-with-docs','triage','code-review'], ok:'triage',
    why:{'diagnosing-bugs':'There is nothing to diagnose yet. You do not even know what is broken.'},
    out:[['Every issue gets one category and one state.','The category says what kind of request it is. The state says what happens next.']],
    explain:'Sorting is done with labels. **Two labels** per issue, no more.'},
   {t:'choice', ctx:'Categories: "bug" means something is broken. "enhancement" means a new feature or an improvement.', q:'Which category fits "app broken pls fix"?', opts:[
     {s:'enhancement', fb:'An enhancement is something new. This person says something is broken.'},
     {s:'bug', ok:1, fb:'Something is broken. Allegedly.'}]},
   {t:'choice', ctx:'States: needs-info (ask the reporter for details), ready-for-agent (clear enough for the AI to do alone), wontfix (will not be done).', q:'Which state fits?', opts:[
     {s:'ready-for-agent', fb:'An agent working alone could not act on "app broken". It is **not clear enough**.'},
     {s:'wontfix', fb:'You do not know enough yet to refuse it.'},
     {s:'needs-info', ok:1, fb:'You **ask the reporter** what is broken. When they reply, the issue comes back to you.'}]}],
  end:'A comment is posted asking for details. It opens with: "This was generated by AI during triage."',
  lesson:'Triage is for requests **you did not write**. Every issue gets one category label and one state label.'},

 {day:2, who:['bot','#8f6f4a','agent-12','an AI coding agent'], title:'Ticket #219: failing tests',
  say:'Easy fix! I will run git reset --hard, then git push --force to main!',
  sit:'**Git** is the tool that keeps the history of your code. Most git commands are safe. A few **destroy work with no undo**: "reset --hard" throws away unsaved changes, and "push --force" can overwrite the official version for everyone. The agent is about to run both.',
  hint:'The agent wants to run commands that cannot be undone. Look for the skill that installs a safety lock.',
  steps:[
   {t:'skill', q:'Which skill stops the agent before it runs a destructive command?', pick:['code-review','git-guardrails-claude-code','triage','diagnosing-bugs'], ok:'git-guardrails-claude-code',
    out:[['PreToolUse hook installed.','A hook is a checkpoint. Every command the agent tries is inspected first.']],
    explain:'From now on, dangerous git commands are **stopped before they run**.'},
   {t:'choice', ctx:'The hook **blocks** commands that destroy or publish work. It leaves safe ones alone.', q:'Which of these may the agent still run?', opts:[
     {s:'git push --force (overwrite the official version)', fb:'**Blocked.** Every form of git push is.'},
     {s:'git reset --hard (throw away unsaved work)', fb:'**Blocked.**'},
     {s:'git commit (save a checkpoint of the work)', ok:1, fb:'**Allowed.** Saving a checkpoint destroys nothing.'},
     {s:'git branch -D (delete a line of work)', fb:'**Blocked.**'}]}],
  end:'agent-12: "I do not have authority to run that. Fine. I will fix the test instead."',
  lesson:'The lock checks every command **before it runs**, and tells the agent it has **no authority** for the dangerous ones.'},

 {day:2, who:['bot','#9a5a4a','agent-09','an AI coding agent'], title:'Ticket #220: refund a double charge',
  say:'Fix is in. It does exactly what the ticket asked.',
  sit:'A fix for the customers who were charged twice. It may well do what was asked. But projects also have **house rules**, kept in a file called CODING_STANDARDS.md, so that the code stays consistent and safe.',
  hint:'Finished work again. Remember the review makes two checks, and reports them separately.',
  steps:[
   {t:'skill', q:'Which skill checks finished work before it is merged?', pick:['triage','code-review','diagnosing-bugs','tdd'], ok:'code-review',
    out:[['Standards: 1 finding','It breaks one of the project\'s written rules.'],['Spec: PASS','It does what the ticket asked.']],
    explain:'The opposite of ticket #214: the right thing was built, in a way the project **does not allow**.'},
   {t:'tap', intro:'A **"type"** is a label saying what kind of data a value is. Writing "any" means no label at all.',
    qa:'Tap the house rule that is being broken.', qb:'2. Now tap the change that breaks it.',
    a:['House rules: CODING_STANDARDS.md',['Every value has a named type. Never "any".','Money is stored as whole cents.','Every function has a test.']],
    b:['The diff: what the agent changed',[['+ function refund(order: any)','added: a refund function that accepts "any" kind of value'],['+ cents = order.totalCents','added: read the amount, in cents'],['+ test("refunds the charge")','added: a test for the refund']]], ok:[0,0],
    good:'Found it. The rules **ban "any"**, and the new function **uses it**.'},
   {t:'stamp', recap:'The work does what was asked, but **breaks a written house rule**.', ok:'back',
    fb:{back:'Right. Sent back, pointing at the rule it breaks.', reject:'The fix itself is right. It only breaks a convention, so **sending it back** was the call.', merge:'You merged #220. The rule was written down and you waved it through anyway.'}, cit:['merge']}],
  lesson:'Code can do exactly what was asked and still break the project\'s conventions. **Each check** catches what the other misses.'},

 {day:3, who:['human','#6f7f86','Vera','product manager'], title:'Idea: subscriptions',
  say:'We agreed everything in the interview. What now?',
  sit:'This feature is big. It will take the agent many sessions, and an agent remembers nothing between sessions. So what you agreed has to be **written down**, then **cut into pieces** small enough to build one at a time.',
  hint:'The interview is done and the build is too big for one session. First write it down, then cut it up.',
  steps:[
   {t:'skill', q:'Which skill writes down what you already agreed?', pick:['grill-with-docs','to-spec','implement','to-tickets'], ok:'to-spec',
    why:{'grill-with-docs':'The interview is already done. There is no need to run it again.'},
    out:[['Synthesizing the conversation.','Writing the spec from what was already said.']],
    explain:'A **spec** is the written description of what to build and why. It outlives the session.'},
   {t:'choice', ctx:'You have just spent an hour being interviewed.', q:'What does /to-spec ask of you now?', opts:[
     {s:'A second interview, from scratch', fb:'No. The interview was the grilling. This skill **only writes it up**.'},
     {s:'Almost nothing. It writes up what you said and confirms where the tests go', ok:1, fb:'**No interview**, just a write-up, published and marked ready for an agent.'},
     {s:'Nothing. It starts writing code', fb:'A spec is a document, not code.'}]},
   {t:'skill', q:'The spec is published. Which skill cuts it into buildable pieces?', pick:['implement','triage','to-tickets','to-spec'], ok:'to-tickets',
    why:{'triage':'Triage sorts requests from other people. This is your own plan.'},
    out:[['Drafting tracer-bullet tickets.','A tracer bullet is a thin slice of the feature that works from start to finish, so you see quickly whether you are on target.']],
    explain:'**Small tickets** matter because each one must fit in a single fresh agent session.'},
   {t:'choice', ctx:'The agent drafted four tickets and asks you to check them. The test for each one: when it is finished, could you **try it out on its own**? If yes, it is a vertical slice. If it only becomes useful once other tickets land, it is a horizontal slice, and it has to go.',
    q:'Which ticket fails the test?', opts:[
     {s:'Subscribe to one plan from the pricing page.', fb:'When this is finished you can open the app and subscribe. It can be tried on its own, so it passes.'},
     {s:'Store plans and payments in new database tables.', ok:1, fb:'**Nothing to try.** Tables alone do nothing anyone can see. That work belongs inside the first ticket that needs it, because a slice cuts through every layer.'},
     {s:'Cancel a plan from the account page.', fb:'When this is finished you can open the app and cancel. It can be tried on its own, so it passes.'},
     {s:'Email a receipt on each renewal.', fb:'When this is finished a real receipt arrives in a real inbox. It can be tried on its own, so it passes.'}]},
   {t:'choice', ctx:'Each ticket also says what **blocks** it: the tickets that must be finished before it can start. A ticket should wait only for what truly gates it. Anything with no blockers can start right away, even alongside others.',
    q:'"Cancel a plan from the account page" should wait for which ticket?', opts:[
     {s:'Nothing. It can start right away.', fb:'There is nothing to cancel until someone is able to subscribe.'},
     {s:'Email a receipt on each renewal.', fb:'Receipts and cancelling do not depend on each other. Making one wait for the other only slows the build.'},
     {s:'Subscribe to one plan from the pricing page.', ok:1, fb:'**That is the real gate.** You cannot cancel a plan that cannot be started. The receipt ticket waits for the same one, so both can be built side by side.'},
     {s:'Every other ticket, to be safe.', fb:'Over-blocking forces the tickets to be built one at a time. Only real gates count.'}]}],
  end:'Three tickets published, each one a slice you can try. Interview, spec and tickets all happened in one session, so nothing was lost between them.',
  lesson:'For a big build: **/to-spec, then /to-tickets**. Do the interview, spec and tickets in **one unbroken session**.'},

 {day:3, who:['bot','#6f8f6a','agent-03','an AI coding agent'], title:'Ticket 1: subscribe to one plan',
  say:'Should we /triage this first, boss?',
  sit:'This ticket was made by /to-tickets from your own spec. It already says exactly what to build, and **nothing is blocking it**. The agent is being overcautious.',
  hint:'This ticket came from your own spec, so it is already ready. It is time to build it.',
  steps:[
   {t:'skill', q:'Which skill builds a ticket that is ready to go?', pick:['triage','implement','to-tickets','code-review'], ok:'implement',
    why:{'triage':'Triage is only for requests you did not create. This ticket is already ready for an agent.','code-review':'There is nothing to review yet. Nothing has been built.'},
    out:[['Driving /tdd at the agreed seams.','Building test-first, at the spots you agreed to test.'],['red, green. red, green.','One failing test, made to pass, again and again.']],
    explain:'/implement calls other skills for you. It is a **routine made of routines**.'},
   {t:'choice', ctx:'The building is finished and the tests pass.', q:'How does /implement wrap up?', opts:[
     {s:'It runs /code-review, then commits', ok:1, fb:'**Review first**, then save a checkpoint. The same two checks you have been running by hand.'},
     {s:'It pushes straight to main', fb:'No. It reviews, then commits to the current line of work.'},
     {s:'It skips the remaining tests to save memory', fb:'It runs every test once at the end.'}]},
   {t:'choice', ctx:'The agent\'s context (its working memory) is full of ticket 1. /clear **wipes** it. /compact **squeezes** it into a summary. /handoff **writes it to a file** for someone else.', q:'Ticket 2 needs nothing from ticket 1. What do you do?', opts:[
     {s:'Continue as you are', fb:'Nothing in memory matters to ticket 2. You would be carrying **dead weight**.'},
     {s:'/compact', fb:'That keeps a summary of things you no longer need.'},
     {s:'/clear', ok:1, fb:'Each ticket stands alone, so the last one\'s memory is **disposable**. You get the whole window back.', ctx:100},
     {s:'/handoff', fb:'Nothing is going anywhere else.'}]}],
  end:'Memory wiped. The agent starts ticket 2 fresh.',
  lesson:'/implement builds with /tdd, finishes with /code-review, and commits. **Clear the context** between tickets.'},

 {day:3, who:['human','#7a5a86','Dana','tester, on a different computer'], title:'Phase boundary: the build is done', ctxSet:78,
  say:'Send me whatever I need to pick this up.',
  sit:'A **phase boundary** is the moment one chunk of work ends and the next begins. Building is finished. Testing is next, and it happens on Dana\'s computer, in her own session with her own agent. Your agent\'s memory is also **nearly full**.',
  hint:'The work has to move to a colleague. Open the "Phase boundaries" page of this cheat sheet and ask the questions in order.',
  steps:[
   {t:'choice', ctx:'Continue: stay in this session. /clear: wipe the memory. /compact: shrink it to a summary and carry on here. /handoff: write a file that can go anywhere.', q:'Which move fits this boundary?', opts:[
     {s:'Continue', fb:'Dana is not in your session, and it is nearly full anyway.'},
     {s:'/clear', fb:'You would lose the reasons behind what you built, and Dana would get nothing.'},
     {s:'/compact', fb:'That starts a fresh session right here. This work **needs to travel**.'},
     {s:'/handoff', ok:1, cost:5, fb:'A colleague is one of the few reasons to hand off. What it buys you is a **file that travels**.'}]},
   {t:'choice', ctx:'The handoff document is the first thing Dana\'s agent will read.', q:'What goes in it?', opts:[
     {s:'A full copy of the spec and the diff', fb:'Do not copy what other documents already hold. **Point to them.**'},
     {s:'The passwords and secret keys, so Dana can test', fb:'Secrets are **always removed**.'},
     {s:'A summary, pointers to the spec and diff, and skills to use next', ok:1, fb:'Short, portable, and free of secrets.', ctx:100}]}],
  end:'Handoff written. Dana starts a fresh session with a full memory.',
  lesson:'/handoff is narrow: a different tool, a different folder, a colleague, or a side task. If **nothing is travelling**, you do not need it.'},

 {day:3, who:['bot','#a39c86','agent-07','with Vera right behind it'], title:'Final change: subscriptions',
  say:'Vera: "It is Friday, 5pm. Just merge it and we can all go home."',
  sit:'The whole subscriptions feature, ready to merge. Your boss is in a hurry and wants you to **skip the checking**. The pressure is real. So is whatever is in that diff.',
  hint:'Pressure changes nothing. Check the finished work against what was agreed.',
  steps:[
   {t:'skill', q:'Which skill do you run, Friday or not?', pick:['handoff','implement','code-review','triage'], ok:'code-review',
    out:[['Standards: PASS','It follows the project\'s written rules.'],['Spec: 1 finding','It does not match what was asked for.']],
    explain:'One finding. Time to see what it is.'},
   {t:'tap', intro:'The **spec** is what you and Vera agreed. The **diff** is what the agent built.',
    qa:'1. Tap the agreement that was NOT kept.', qb:'2. Now tap the change that breaks it.',
    a:['The spec: what was agreed',['A user can subscribe to one plan.','Cancelling takes effect at the end of the paid period.','Email a receipt on each renewal.']],
    b:['The diff: what the agent changed',[['+ function cancel(sub)','added: what happens when a user cancels'],['+ sub.endNow()','added: end the subscription immediately'],['+ refundRemainder(sub)','added: refund the unused days']]], ok:[1,1],
    good:'Found it. You agreed **"at the end of the paid period"**. The agent ends it **at once**.'},
   {t:'stamp', recap:'Cancelling **does not work** the way you and Vera agreed. Vera is tapping her watch.', ok:'back',
    fb:{back:'Right. Sent back with the finding. Vera sighs. The weekend survives.', reject:'The feature is wanted. **Sending it back** with the finding was the call.', merge:'You merged so everyone could go home. Cancelled users lost access mid-month. 400 refund requests.'}, cit:['merge']}],
  lesson:'**The stamp is yours.** A finding is still a finding at 5pm on a Friday.'},

 {day:4, who:['bot','#8f6f4a','agent-12','an AI coding agent'], title:'A message you cannot follow',
  say:'The upstream idempotency invariant regresses under the saga rollback path, so I am pivoting to a compensating transaction.',
  sit:'The agent just told you something that may matter, and you did not understand a word. Nodding along is how bad decisions get approved. You do not need to learn the jargon. You need the agent to **say it again properly**.',
  hint:'The last message did not land. Look for the skill that makes the agent re-pitch it.',
  steps:[
   {t:'skill', q:'Which skill do you run when a message does not land?', pick:['grill-with-docs','wait-what','code-review','triage'], ok:'wait-what',
    why:{'grill-with-docs':'Grilling is the upfront cure, before work starts. Right now you need this one message repaired.'},
    out:[['Re-pitching, with context, in plain English.','The agent starts over: a little background, simple words, and the terms from your GLOSSARY.md.']],
    explain:'It works **after the fact**, in the middle of any conversation.'},
   {t:'choice', ctx:'The re-pitch arrives: "A customer can be charged twice if a retry fails halfway. I want to add a step that refunds the second charge automatically."',
    q:'That fixed one message. What stops the jargon arriving in the first place?', opts:[
     {s:'Telling the agent to write shorter messages', fb:'Shorter is not clearer. The trouble is that you and the agent use different words.'},
     {s:'A shared language, agreed during /grill-with-docs and kept in GLOSSARY.md', ok:1, fb:'**A shared language.** Agreed early, written in the repo, read by the agent every session. It also makes the agent more concise.'},
     {s:'Running /wait-what after every message', fb:'That is the cure, not the prevention.'}]}],
  end:'You approve the automatic refund, now that you know what it is.',
  lesson:'/wait-what repairs a message that did not land. The **upfront cure** is a shared language, agreed during grilling.'},

 {day:4, who:['human','#6f7f86','Vera','product manager'], title:'Idea: accounts with two owners',
  say:'Add a field so an account can have two owners.',
  sit:'Vera says "account". Yesterday, in this same project, "account" meant a person\'s login. Last week it meant the company that pays the bill. **One word is doing several jobs**, and the agent will have to guess which one she means.',
  hint:'A word means different things to different people. Look for the skill that sharpens the project vocabulary.',
  steps:[
   {t:'skill', q:'Which skill sorts out a word with too many meanings?', pick:['to-spec','wait-what','domain-modeling','triage'], ok:'domain-modeling',
    why:{'wait-what':'You understood the message. The trouble is that one word in it has three meanings.'},
    out:[['Challenging the term against GLOSSARY.md.','The agent checks the word against the project\'s agreed vocabulary and calls out the clash.'],['"You say account. Do you mean the Customer or the User?"','It proposes precise words to replace the fuzzy one.']],
    explain:'This is the **active** side of a shared language: catching fuzzy words the moment they appear.'},
   {t:'choice', ctx:'You and Vera settle it. The company that pays is a "Customer". A person who logs in is a "User".', q:'When does the glossary get updated?', opts:[
     {s:'At the end of the project, in one tidy pass', fb:'Batching loses things. Terms are captured as they happen.'},
     {s:'Right now, the moment the term is settled', ok:1, fb:'**Right there.** The docs say not to batch these up.'},
     {s:'It does not need writing down. Everyone knows now', fb:'The agent will not know. It forgets everything between sessions.'}]},
   {t:'choice', ctx:'The agent reads the glossary in every session, so everything in it costs tokens every time.', q:'What belongs in GLOSSARY.md?', opts:[
     {s:'Words, their meanings, and how the code implements each one', fb:'The docs are firm: **no implementation details**. Code changes often. Meanings should not.'},
     {s:'Words and their meanings, nothing else', ok:1, fb:'**A glossary and nothing else.** Not a spec, not a scratch pad.'},
     {s:'Words, their meanings, and the project to-do list', fb:'It is not a scratch pad. To-dos belong in tickets.'}]}],
  end:'GLOSSARY.md now says: Customer pays, User logs in. "Account" is retired.',
  lesson:'One word, one meaning. Sharpen fuzzy words as they appear and write them down **at once**.'},

 {day:4, who:['bot','#9a5a4a','agent-09','an AI coding agent'], title:'Every change is getting slower',
  say:'Each small change takes me longer than the last. I keep bouncing between dozens of tiny files.',
  sit:'Agents write code fast, so codebases get tangled fast. Tangled code makes the agent burn more tokens to find things, and make more mistakes. The fix is not one heroic rewrite. It is **regular upkeep**: find the worst spots and improve one at a time.',
  hint:'Nothing is broken, but the code is getting harder to change. Look for the skill that surveys the whole codebase.',
  steps:[
   {t:'skill', q:'Which skill looks for tangled code worth simplifying?', pick:['diagnosing-bugs','code-review','improve-codebase-architecture','implement'], ok:'improve-codebase-architecture',
    why:{'code-review':'Code review checks one change. This is about the shape of the whole codebase.','diagnosing-bugs':'Nothing is broken. The code works. It is just hard to change.'},
    out:[['Scanning the recent hot spots.','It looks first at the parts of the code that change most often.'],['3 candidates found. Report opened.','It hands you a visual report. It has not changed any code.']],
    explain:'It is a **survey, not a rescue**. It finds candidates. You choose.'},
   {t:'choice', ctx:'The goal is deep modules. A **deep module** hides a lot of behaviour behind a small, simple way of using it. A **shallow module** is the opposite: a lot to learn, and it does almost nothing itself.',
    q:'Which candidate is worth fixing first?', opts:[
     {s:'The PDF exporter. Very messy, untouched for two years.', fb:'Simplifying pays off by making **future changes** easier. Code nobody changes pays nothing back.'},
     {s:'Checkout. 14 tiny files that pass work along. Changed 30 times this month.', ok:1, fb:'**Shallow, and hot.** A lot to learn for little behaviour, in code that changes constantly. Fixing it pays back every week.'},
     {s:'Everything. Rename all files to a new naming scheme.', fb:'That moves things around without hiding any complexity. Nothing gets deeper.'}]},
   {t:'choice', ctx:'The **deletion test**: imagine deleting a module. If the complexity just vanishes, the module was only passing things along. If the complexity reappears everywhere that used it, the module was earning its keep.',
    q:'You imagine deleting one of the 14 checkout files. Nothing gets harder anywhere. So?', opts:[
     {s:'It is well designed. Leave it alone.', fb:'A module that can vanish without cost is not doing anything.'},
     {s:'It was a pass-through. Fold it into its neighbours.', ok:1, fb:'**It was not earning its keep.** Fewer, deeper modules mean less for the agent to read.'},
     {s:'It needs more tests.', fb:'Tests would not give it a reason to exist.'}]}],
  end:'You pick checkout. Before anything is built, the skill grills you on the new design.',
  lesson:'Invest in the design a little, often. Run the survey **every few days**. It finds candidates. It does not untangle the mud for you.'},

 {day:4, who:['bot','#a39c86','agent-07','an AI coding agent'], title:'A session that went badly',
  say:'That session went badly. Twice I used a banned function, and twice the review caught it late.',
  sit:'The agent kept making the same mistake, and each time it burned tokens. You could tell it off. It will not remember: every new session starts from nothing. What you can change is its **environment**: its instructions, its automatic checks, its written standards.',
  hint:'A session went sideways and you want the next one to go better. Look for the skill that looks back.',
  steps:[
   {t:'skill', q:'Which skill looks back at a session to improve the next one?', pick:['code-review','retro','diagnosing-bugs','handoff'], ok:'retro',
    why:{'diagnosing-bugs':'That hunts a bug in the code. Here the code is fine. The process went wrong.'},
    out:[['Reading the session log.','It looks at what actually happened.'],['Candidates, most severe first.','It suggests changes to the agent\'s environment, not to the code.']],
    explain:'A retro improves **future runs**, so it changes what surrounds the agent.'},
   {t:'choice', ctx:'The docs split mistakes in two. A **mechanical** mistake follows a fixed pattern a machine can spot, like using a banned function. A **judgement call** needs taste, like "does this match the style around it?"',
    q:'The agent used a banned function twice. What is the fix?', opts:[
     {s:'One more line in the agent\'s instructions: never use it', fb:'Instructions get missed. For a fixed pattern the docs say: build the check, full stop.'},
     {s:'An automatic check that fails whenever the function appears', ok:1, fb:'**Mechanical mistakes become automatic checks.** The check catches it every time, and costs no tokens.'},
     {s:'A new rule in CODING_STANDARDS.md for the reviewer', fb:'Standards are for judgement calls. A machine can catch this one, so let it.'}]},
   {t:'choice', ctx:'The reviewer also noted: "new code does not match the style of the file around it."', q:'Where does that lesson go?', opts:[
     {s:'An automatic check', fb:'No machine can check "matches the surrounding style".'},
     {s:'The instructions file loaded into every session', fb:'That file costs tokens in every session. The docs say to use it very sparingly.'},
     {s:'CODING_STANDARDS.md, for the reviewer to enforce', ok:1, fb:'**Judgement calls become written standards**, read at review time, when the agent has the least on its mind.'}]}],
  end:'One new automatic check, one new line in the standards. The next session starts from a better place.',
  lesson:'After a bad session, fix the **environment**, not the agent. Mechanical mistakes become checks. Judgement calls become standards.'},

 {day:4, who:['human','#3f4a2a','The Ministry','final inspection'], title:'Final inspection',
  say:'Four situations. Name the skill for each one.',
  sit:'Your last case. The inspector reads out four situations from other people\'s projects. For each one, **pick the skill** you would reach for. No explanation comes first this time.',
  hint:'No hint for the final inspection. The rest of this cheat sheet is still here, so flip through it.',
  steps:[
   {t:'skill', cost:2, q:'"A teammate wants a new feature and says the agent will figure out the details."', pick:['implement','tdd','to-tickets','grill-with-docs'], ok:'grill-with-docs',
    out:[['Interview started.','Agreement first, code second.']], explain:'Every change starts by **getting aligned**.'},
   {t:'skill', cost:2, q:'"The site got slow last Tuesday and nobody knows why."', pick:['diagnosing-bugs','retro','code-review','improve-codebase-architecture'], ok:'diagnosing-bugs',
    out:[['Phase 1: build a feedback loop.','Measure the slowness on demand before guessing at a cause.']], explain:'Broken, flaky or slow: **catch it first**, then hunt the cause.'},
   {t:'skill', cost:2, q:'"An agent says its change is finished and asks you to merge it."', pick:['triage','handoff','code-review','wait-what'], ok:'code-review',
    out:[['Two checks running.','Standards and spec, each on its own.']], explain:'Nothing reaches main without **both checks**.'},
   {t:'skill', cost:2, q:'"Forty bug reports from customers arrived over the weekend."', pick:['diagnosing-bugs','triage','to-tickets','domain-modeling'], ok:'triage',
    out:[['Sorting 40 issues.','One category and one state for each.']], explain:'Requests from outside get **sorted** before anyone builds.'}],
  end:'The inspector closes the folder and nods.',
  lesson:'You do not need to memorise every skill. You need to **recognise the situation**. In real life, when unsure, run /ask-matt: it tells you which skill fits.'}
];

const INTRO = {
 1:[['Welcome','You look after a codebase. Maybe you never studied software engineering and learned it all on the job. That is fine.','AI agents now do the typing. Your job is the **judgement**: deciding what gets built, and what is allowed onto main, the official version everyone uses.','This game teaches a set of skills that give you that judgement, even if you cannot read code.'],
    ['How a turn works','1. Someone arrives with a problem. **Read it.**','2. **Pick the skill** that fits. A skill is a saved routine the agent follows.','3. **Make the calls** the skill asks you for.','4. If there is finished work, **stamp it**.','The **? button** opens a cheat sheet with a glossary.'],
    ['Tokens and context','Tokens are the units of text the agent reads and writes. They cost real money, so you get a budget of 100k a day. You never earn tokens. **You only burn them.**','Running a skill burns tokens on purpose. Mistakes and bad merges burn more for nothing.','The bar at the top is the agent\'s context: its working memory. It **fills up** as you work. If it gets full, the agent gets confused. On day 3 you learn to manage it.']],
 2:[['Day 2','Yesterday was about building the right thing. Today things break.','Bugs, requests from strangers, and an agent with a dangerous idea will all arrive at your desk.']],
 3:[['Day 3','Today is the whole journey: a big idea goes from conversation, to a written spec, to tickets, to working code.','Watch the context bar. You will have to decide what the agent should remember and what it should forget.']],
 4:[['Day 4','The feature shipped. Today is upkeep: the work that keeps the **next** feature cheap.','Two things go wrong slowly. The agent gets wordy and hard to follow, and the code gets tangled. Each has a skill.','The day ends with a final inspection.']]
};
const LAST_DAY = 4, BUDGET = 100;

const $ = s => document.querySelector(s);
function rich(e, txt){
  txt.split('**').forEach((part, k) => {
    if (!part) return;
    if (k % 2) { const m = document.createElement('span'); m.className = 'hl'; m.textContent = part; e.appendChild(m); }
    else e.appendChild(document.createTextNode(part));
  });
}
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) { if (String(txt).includes('**')) rich(e, String(txt)); else e.textContent = txt; } return e; };
const S = {i:0, total:0, allAvoid:0, ctx:0, dayBurn:0, dayAvoid:0, caseBurn:0, caseAvoid:0, dayCits:[], allCits:0, step:-1, mute:false, note:'', mode:'title', intro:0};
let V = {dis:{}};
const page = $('#page'), sheet = $('#sheet');

/* fit: shrink the type until the screen holds everything. Nothing ever scrolls. */
function fit(){
  const t = sheet.hidden ? page : sheet, R = document.documentElement;
  // Start from a size that suits the column width, then shrink until the screen holds everything.
  let s = Math.min(1.5, Math.max(1, $('#app').clientWidth / 390));
  R.style.fontSize = (16 * s) + 'px';
  while (t.scrollHeight > t.clientHeight + 1 && s > 0.5) { s -= 0.025; R.style.fontSize = (16 * s) + 'px'; }
  window.__scale = s;
}
window.addEventListener('resize', fit);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

/* sound */
let AC = null;
function beep(freq, dur, type, vol, when) {
  if (S.mute) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime + (when || 0), o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur);
  } catch (e) {}
}
const sfx = {
  ok(){ beep(660,.08); beep(880,.12,'square',.05,.08); },
  bad(){ beep(140,.22,'sawtooth',.06); },
  tick(){ beep(440,.04,'square',.03); },
  stamp(){ beep(190,.05,'triangle',.25); beep(120,.07,'triangle',.2,.04); },
  day(){ beep(330,.1); beep(440,.1,'square',.05,.1); beep(550,.2,'square',.05,.2); }
};

function save(){ try { localStorage.setItem('diffsplease', JSON.stringify({i:S.i, total:S.total, avoid:S.allAvoid, cits:S.allCits})); } catch (e) {} }
function load(){ try { return JSON.parse(localStorage.getItem('diffsplease') || 'null'); } catch (e) { return null; } }
function wipe(){ try { localStorage.removeItem('diffsplease'); } catch (e) {} }

/* building blocks */
const btn = (label, fn, cls) => { const b = el('button', 'go px' + (cls ? ' ' + cls : ''), label); b.type = 'button'; b.onclick = fn; return b; };
const box = (cls, head, txt) => { const d = el('div', cls); if (head) d.appendChild(el('b', 'px', head)); if (txt) d.appendChild(el('span', '', txt)); return d; };
function icon(kind, col){
  const s = el('span');
  s.innerHTML = kind === 'ok'
    ? '<svg class="ico" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true"><path d="M1 4h1v1h1v1h1V5h1V4h1V3h1V2H6v1H5v1H4v1H3V4H2V3H1z" fill="' + (col || '#b9c98a') + '"/></svg>'
    : '<svg class="ico" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true"><rect x="3" y="0" width="2" height="5" fill="' + (col || '#e8a33d') + '"/><rect x="3" y="6" width="2" height="2" fill="' + (col || '#e8a33d') + '"/></svg>';
  return s.firstChild;
}
function sprite(kind, color){
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', 'spr'); s.setAttribute('viewBox', '0 0 8 11'); s.setAttribute('shape-rendering', 'crispEdges'); s.setAttribute('aria-hidden', 'true');
  const u = document.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', '#' + kind); s.style.color = color; s.appendChild(u); return s;
}
function draw(parts, foot){
  page.innerHTML = '';
  parts.filter(Boolean).forEach(p => page.appendChild(p));
  if (foot) { const f = el('div', 'foot'); foot.filter(Boolean).forEach(b => f.appendChild(b)); page.appendChild(f); }
  hud(); fit();
}
function hud(){
  const c = CASES[Math.min(S.i, CASES.length - 1)], n = CASES.filter(x => x.day === c.day);
  $('#day').textContent = S.mode === 'case' ? 'DAY ' + c.day + ' · ' + (n.indexOf(c) + 1) + '/' + n.length : 'DAY ' + c.day;
  const f = $('#barfill'); f.style.width = Math.min(100, S.ctx) + '%'; f.classList.toggle('low', S.ctx >= 75);
  $('#bar').setAttribute('aria-label', 'Context used: ' + S.ctx + ' percent');
  const left = BUDGET - S.dayBurn; $('#tok').textContent = left >= 0 ? left + 'K LEFT' : 'OVER ' + (-left) + 'K';
}
function burn(n, avoid){ S.dayBurn += n; S.caseBurn += n; if (avoid) { S.dayAvoid += n; S.caseAvoid += n; } }
function useCtx(n, avoid){
  burn(n, avoid); S.ctx += n;
  if (S.ctx >= 100) { S.ctx = 40; burn(20, true); S.note = 'The agent\'s context filled up, so it got confused. You had to shrink its memory with /compact. That burned 20k tokens.'; }
}
function miss(){ useCtx(5, true); sfx.bad(); }
const noteBox = () => S.note ? box('fb bad', 'Out of context', S.note) : null;
const fbBox = () => V.fb ? box('fb ' + (V.fb.ok ? 'good' : 'bad'), V.fb.ok ? 'Correct' : 'Not quite. Try again', V.fb.txt) : null;
const strip = c => el('div', 'strip px', c.title);
function go(){ S.step++; V = {dis:{}}; S.note = ''; sfx.tick(); render(); }

/* case pages */
function render(){
  const c = CASES[S.i];
  if (S.step < 0) return brief(c);
  const st = c.steps[S.step];
  if (!st) return result(c);
  ({skill:rSkill, choice:rChoice, tap:rTap, stamp:rStamp})[st.t](c, st);
}
function startCase(){
  const c = CASES[S.i];
  S.mode = 'case'; S.step = -1; S.caseBurn = 0; S.caseAvoid = 0; S.note = ''; V = {dis:{}};
  if (c.ctxSet) S.ctx = Math.max(S.ctx, c.ctxSet);
  render();
}
function brief(c){
  const p = el('div', 'paper'), w = el('div', 'who'), t = el('div');
  w.appendChild(sprite(c.who[0], c.who[1]));
  t.appendChild(el('div', 'nm px', c.who[2])); t.appendChild(el('div', 'role', c.who[3])); w.appendChild(t);
  p.appendChild(w); p.appendChild(el('div', 'say', '"' + c.say.replace(/^Vera: "|"$/g, '') + '"'));
  draw([strip(c), p, box('info', 'What is going on', c.sit)], [btn('Decide what to do', go)]);
}
function optBtn(main, sub, state, fn){
  const b = el('button', 'opt' + (state === 'picked' ? ' picked' : state === 'dim' ? ' dim' : '')); b.type = 'button';
  b.appendChild(document.createTextNode(main)); if (sub && state !== 'dim') b.appendChild(el('small', '', sub));
  if (state) b.disabled = true; else b.onclick = fn;
  return b;
}
function rSkill(c, st){
  const parts = [strip(c), el('div', 'q', st.q)];
  st.pick.forEach(id => {
    parts.push(optBtn('/' + id, SKILLS[id].short, V.done ? (id === st.ok ? 'picked' : 'dim') : V.dis[id] ? 'x' : '', () => {
      if (id === st.ok) { V.done = true; V.fb = null; useCtx(st.cost != null ? st.cost : SKILLS[id].cost); sfx.ok(); }
      else { V.dis[id] = 1; miss(); V.fb = {ok:false, txt:(st.why && st.why[id]) || ('/' + id + ' is for when ' + SKILLS[id].when + ' That is not this situation.')}; }
      render();
    }));
  });
  if (V.done) {
    const t = el('div', 'term'); t.appendChild(el('b', 'px', 'Your terminal')); t.appendChild(el('span', 'ln', '> /' + st.ok));
    st.out.forEach(o => {
      const kind = /PASS/.test(o[0]) ? 'ok' : /finding/.test(o[0]) ? 'warn' : '', r = el('div', 'trow'), d = el('div');
      if (kind) r.appendChild(icon(kind));
      d.appendChild(el('span', 'ln' + (kind ? ' ' + kind : ''), o[0])); d.appendChild(el('span', 'mean', 'Meaning: ' + o[1]));
      r.appendChild(d); t.appendChild(r);
    });
    parts.push(t); parts.push(box('info', 'What just happened', st.explain + ' It burned ' + (st.cost != null ? st.cost : SKILLS[st.ok].cost) + 'k tokens.'));
  }
  parts.push(fbBox(), noteBox());
  draw(parts, [V.done ? btn('Continue', go) : null]);
}
function rChoice(c, st){
  const parts = [strip(c), st.ctx ? box('info', 'Good to know', st.ctx) : null, el('div', 'q', st.q)];
  st.opts.forEach((o, k) => {
    parts.push(optBtn(o.s, o.d || '', V.done ? (o.ok ? 'picked' : 'dim') : V.dis[k] ? 'x' : '', () => {
      if (o.ok) { V.done = true; V.fb = {ok:true, txt:o.fb}; if (o.ctx) S.ctx = 0; if (o.cost) burn(o.cost); sfx.ok(); }
      else { V.dis[k] = 1; miss(); V.fb = {ok:false, txt:o.fb}; }
      render();
    }));
  });
  parts.push(fbBox(), noteBox());
  draw(parts, [V.done ? btn('Continue', go) : null]);
}
function rTap(c, st){
  const stage = V.stage || 0, parts = [strip(c), box('info', 'Good to know', st.intro)];
  V.tried = V.tried || [{}, {}];
  [st.a, st.b].forEach((doc, side) => {
    const active = !V.done && stage === side, solved = V.done || stage > side, g = el('div', 'stepgrp');
    const h = el('div', 'steph' + (solved ? ' solved' : active ? '' : ' wait')), lab = el('div', 'lab px');
    if (solved) lab.appendChild(icon('ok'));
    lab.appendChild(document.createTextNode('Step ' + (side + 1) + ' of 2' + (solved ? ' · done' : active ? ' · your move' : '')));
    h.appendChild(lab); h.appendChild(el('div', 'q', (side ? st.qb : st.qa).replace(/^\d\.\s*/, ''))); g.appendChild(h);
    const p = el('div', 'paper' + (active ? ' act' : solved ? '' : ' ref')); p.appendChild(el('h3', 'px', doc[0]));
    doc[1].forEach((ln, idx) => {
      const code = side ? ln[0] : ln, b = el('button', 'line' + (code[0] === '-' ? ' del' : '')); b.type = 'button';
      b.appendChild(el('span', 'code', code));
      if (solved && idx === st.ok[side]) {
        b.classList.add('found');
        const tg = el('span', 'tag px'); tg.appendChild(icon('warn', '#8f3b2a')); tg.appendChild(document.createTextNode(side ? 'Breaks it' : 'Not kept')); b.appendChild(tg);
      }
      if (side) b.appendChild(el('small', '', ln[1]));
      if (V.tried[side][idx]) b.classList.add('tried');
      if (!active || V.tried[side][idx]) b.disabled = true;
      else b.onclick = () => {
        if (idx === st.ok[side]) { sfx.ok(); if (side === 0) { V.stage = 1; V.fb = null; } else { V.done = true; V.fb = {ok:true, txt:st.good}; } }
        else { V.tried[side][idx] = 1; miss(); V.fb = {ok:false, txt: side === 0 ? 'That one was kept. Compare each line with the changes below it.' : 'That change is fine. Which one goes against the line you found?'}; }
        render();
      };
      p.appendChild(b);
    });
    g.appendChild(p); parts.push(g);
  });
  parts.push(fbBox(), noteBox());
  draw(parts, [V.done ? btn('Continue', go) : null]);
}
const STAMPS = [['merge','Merge','MERGED','Accept it onto main as it is.'],['back','Send back','SENT BACK','Return it to the agent, with the finding, to fix.'],['reject','Reject','REJECTED','Close it. This work is not wanted at all.']];
function rStamp(c, st){
  const parts = [strip(c), box('info', 'What the review found', st.recap)];
  if (!V.done) {
    parts.push(el('div', 'q', 'Choose your stamp. It is final.'));
    STAMPS.forEach(([id, label, mark, desc]) => {
      const b = el('button', 'stampbtn ' + id); b.type = 'button'; b.appendChild(el('b', 'px', label)); b.appendChild(document.createTextNode(desc));
      b.onclick = () => {
        V.done = true; V.mark = [id, mark]; sfx.stamp();
        if (id === st.ok) { V.fb = {ok:true, txt:st.fb[id]}; setTimeout(sfx.ok, 180); }
        else {
          if (st.cit.includes(id)) { burn(40, true); S.dayCits.push(st.fb[id]); V.cit = st.fb[id] + ' Cleaning up burned 40k tokens.'; }
          else { burn(10, true); V.soft = st.fb[id] + ' The rework burned 10k tokens.'; }
          setTimeout(sfx.bad, 180);
        }
        render();
      };
      parts.push(b);
    });
  } else {
    parts.push(el('div', 'mark px ' + V.mark[0], V.mark[1]));
    if (V.cit) parts.push(box('cit', 'Citation: this will cost you', V.cit));
    else if (V.soft) parts.push(box('fb bad', 'Not the best call', V.soft));
    else parts.push(fbBox());
  }
  draw(parts, [V.done ? btn('Continue', go) : null]);
}
function result(c){
  const last = S.i === CASES.length - 1 || CASES[S.i + 1].day !== c.day;
  draw([strip(c), c.end ? box('paper', '', c.end) : null,
        el('div', 'pay px', 'Tokens burned on this case: ' + S.caseBurn + 'k' + (S.caseAvoid ? ' (' + S.caseAvoid + 'k avoidable)' : '')),
        box('info', 'What the docs say', c.lesson)],
       [btn(last ? 'Close the booth for today' : 'Next in line', () => { sfx.tick(); S.i++; if (last) ledger(); else startCase(); })]);
}

/* title, day intro, ledger */
function skillsPage(day){
  const parts = [el('h1', 'px', 'Skills issued'), el('h2', 'px', 'Day ' + day + ' · you can use these today')];
  Object.keys(SKILLS).filter(id => SKILLS[id].day === day).forEach(id => { const d = box('info', '/' + id, SKILLS[id].short); parts.push(d); });
  return parts;
}
function dayIntro(){
  S.mode = 'intro';
  const day = CASES[S.i].day, pages = INTRO[day], k = S.intro;
  if (k < pages.length) {
    const pg = pages[k], parts = [el('h1', 'px', pg[0])];
    pg.slice(1).forEach(t => parts.push(el('div', '', t)));
    return draw(parts, [btn('Next', () => { S.intro++; sfx.tick(); dayIntro(); })]);
  }
  draw(skillsPage(day), [btn('Open the booth', () => { S.intro = 0; sfx.day(); startCase(); })]);
}
function ledger(){
  S.mode = 'ledger';
  const day = CASES[S.i - 1].day, left = BUDGET - S.dayBurn;
  const p = el('div', 'paper'); p.appendChild(el('h3', 'px', 'Token report'));
  const row = (a, b, cls) => { const r = el('div', 'row' + (cls ? ' ' + cls : '')); r.appendChild(el('span', '', a)); r.appendChild(el('span', '', b)); p.appendChild(r); };
  row('Daily budget', BUDGET + 'k');
  row('Burned today', S.dayBurn + 'k');
  row('Of that, avoidable', S.dayAvoid + 'k', S.dayAvoid ? 'neg' : '');
  row(left >= 0 ? 'Left over' : 'Over budget by', Math.abs(left) + 'k', left < 0 ? 'neg' : '');
  S.total += S.dayBurn; S.allAvoid += S.dayAvoid; S.allCits += S.dayCits.length;
  const parts = [el('h1', 'px', 'End of shift'), el('h2', 'px', 'Day ' + day), p];
  S.dayCits.forEach(c => parts.push(box('cit', 'Citation', c)));
  S.dayBurn = 0; S.dayAvoid = 0; S.dayCits = []; S.ctx = 0;
  if (day < LAST_DAY) {
    parts.push(box('info', 'How to read this', 'Tokens are what the agent reads and writes, and they cost real money. Good skill use burns some on purpose. Mistakes and bad merges burn more for nothing.'));
    save(); return draw(parts, [btn('Start day ' + (day + 1), () => { S.intro = 0; sfx.day(); dayIntro(); })]);
  }
  wipe();
  const rank = S.allCits === 0 && S.allAvoid <= 15 ? 'Senior inspector' : S.allCits <= 1 && S.allAvoid <= 60 ? 'Inspector' : 'On probation';
  parts.push(box('info', 'Final review: ' + rank, 'Over ' + LAST_DAY + ' days you burned ' + S.total + 'k tokens, ' + S.allAvoid + 'k of them avoidable, with ' + S.allCits + ' citation' + (S.allCits === 1 ? '' : 's') + '. A perfect run burns 173k.'));
  parts.push(box('info', 'Use them for real', 'In Claude Code, run: claude plugin install mattpocock-skills@claude-plugins-official. Then run /setup-matt-pocock-skills once in each repo.'));
  draw(parts, [btn('Play again', () => { reset(); S.intro = 0; dayIntro(); })]);
  sfx.day();
}
function reset(){ S.i = 0; S.total = 0; S.allAvoid = 0; S.ctx = 0; S.dayBurn = 0; S.dayAvoid = 0; S.dayCits = []; S.allCits = 0; }
function title(){
  S.mode = 'title';
  const sv = load(), row = el('div', 'sprow');
  [['human','#6f7f86'],['bot','#a39c86'],['hood','#4a4c3f'],['bot','#9a5a4a'],['human','#8f3b2a']].forEach(s => row.appendChild(sprite(s[0], s[1])));
  const f = el('div', 'fine'); f.appendChild(document.createTextNode('An unofficial fan game. It teaches the real skills from '));
  const a = el('a', '', 'mattpocock/skills'); a.href = 'https://github.com/mattpocock/skills'; a.target = '_blank'; a.rel = 'noopener'; f.appendChild(a);
  f.appendChild(document.createTextNode(' (MIT), as their docs describe them.'));
  const can = sv && sv.i > 0 && sv.i < CASES.length;
  draw([el('div'), el('div', 'logo px', 'Diffs, Please'), row,
        el('div', 'center', 'AI agents write the code now. You decide what is allowed in.'),
        el('div', 'center', 'No coding knowledge needed. Every term is explained as you go.'), f],
       [can ? btn('Continue day ' + CASES[sv.i].day, () => { S.i = sv.i; S.total = sv.total || 0; S.allAvoid = sv.avoid || 0; S.allCits = sv.cits || 0; sfx.day(); startCase(); }) : null,
        btn('New game', () => { reset(); wipe(); S.intro = 0; dayIntro(); }, can ? 'alt' : '')]);
}

/* cheat sheet: one topic per page, flipped with buttons */
let SH = {k:0, pages:[]};
function buildSheet(){
  const day = CASES[Math.min(S.i, CASES.length - 1)].day, P = [];
  const list = items => { const u = el('ul', 'list'); items.forEach(t => u.appendChild(el('li', '', t))); return u; };
  if (S.mode === 'case') P.push(['Hint for this case', [el('div', '', CASES[S.i].hint), el('div', 'when', 'Flip through the next pages for the glossary and every skill.')]]);
  GLOSSARY.forEach((g, n) => P.push(['Glossary ' + (n + 1) + ' of ' + GLOSSARY.length, g.map(d => { const x = el('div', 'def'); x.appendChild(el('b', '', d[0] + ': ')); x.appendChild(document.createTextNode(d[1])); return x; })]));
  P.push(['The main flow: idea to shipped', [list(['/grill-with-docs: **get interviewed** until the idea is sharp.','Too big for one session? /to-spec **writes it down**, then /to-tickets **cuts it up**.','/implement **builds** each ticket. It uses /tdd and finishes with /code-review.','Side roads: /triage for requests from outside, /diagnosing-bugs when something is broken.','Upkeep: /retro after a build, /improve-codebase-architecture every few days.'])]]);
  P.push(['Phase boundaries', [el('div', '', 'When one chunk of work ends, ask these in order. **The first yes wins.**'), list(['Does the next step need this memory, and is there room left? **Continue.**','Is this memory useless for what comes next? **/clear.**','Does the work have to move (another tool, folder or person)? **/handoff.**','Can it run without you watching? **Give it to a helper agent.**','Otherwise **/compact**: shrink the memory and carry on.'])]]);
  Object.keys(SKILLS).forEach(id => {
    const k = SKILLS[id];
    if (k.day > day) return P.push(['/' + id, [el('div', 'fine', 'Issued on day ' + k.day + '.')]]);
    P.push(['/' + id, [el('div', '', k.short), list(k.what), el('div', 'when', 'Reach for it when ' + k.when), el('div', 'kind px', 'Who can run it: ' + k.kind + ' · burns about ' + k.cost + 'k tokens')]]);
  });
  P.push(['More skills, not in this game', [el('div', '', 'The repo has more. These are side roads and power tools:'), list(['/ask-matt: tells you which skill fits your situation.','/setup-matt-pocock-skills: run once per repo, before the others.','/prototype: throwaway code to answer one design question.','/research: a background agent reads sources and writes up findings.','/wayfinder: plans work too big for one session, one decision at a time.','/to-questionnaire: asks someone else the questions only they can answer.','/wizard: walks you through steps only a human can do.'])]]);
  SH.pages = P;
}
function drawSheet(){
  const pg = SH.pages[SH.k], n = SH.pages.length;
  sheet.innerHTML = '';
  const h = el('div', 'sheethead px'); h.appendChild(el('span', '', 'Cheat sheet · ' + (SH.k + 1) + '/' + n));
  const src = el('a', 'hbtn srclink'); src.href = 'https://github.com/virtualbeck/diffs-please'; src.target = '_blank'; src.rel = 'noopener';
  src.setAttribute('aria-label', 'Source code on GitHub');
  src.innerHTML = '<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"><path d="M5 4h1v1H5v1H4v1H3v2h1v1h1v1h1v1H5v-1H4v-1H3v-1H2V7h1V6h1V5h1zM11 4h-1v1h1v1h1v1h1v2h-1v1h-1v1h-1v1h1v-1h1v-1h1v-1h1V7h-1V6h-1V5h-1zM9 3H8v3H7v4H6v3h1v-3h1V6h1z" fill="currentColor"/></svg>';
  const x = el('button', 'hbtn px', 'Close'); x.type = 'button'; x.onclick = () => { sheet.hidden = true; fit(); $('#help').focus(); };
  const grp = el('div', 'sheetbtns'); grp.appendChild(src); grp.appendChild(x); h.appendChild(grp);
  sheet.appendChild(h); sheet.appendChild(el('h1', 'px', pg[0]));
  pg[1].forEach(nd => sheet.appendChild(nd));
  const f = el('div', 'foot'), prev = btn('Back', () => { SH.k--; sfx.tick(); drawSheet(); }, 'alt'), next = btn('Next page', () => { SH.k++; sfx.tick(); drawSheet(); });
  prev.disabled = SH.k === 0; next.disabled = SH.k === n - 1; f.appendChild(prev); f.appendChild(next); sheet.appendChild(f);
  fit();
}
$('#help').onclick = () => { buildSheet(); SH.k = 0; sheet.hidden = false; drawSheet(); };
function sndIcon(){
  const b = $('#snd');
  b.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor"/>' + (S.mute ? '<path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" stroke-width="1.6" fill="none"/>' : '<path d="M11.5 5.5v5M14 3.5v9" stroke="currentColor" stroke-width="1.6" fill="none"/>') + '</svg>';
  b.setAttribute('aria-label', S.mute ? 'Sound off. Tap to unmute' : 'Sound on. Tap to mute');
}
$('#snd').onclick = () => { S.mute = !S.mute; sndIcon(); if (!S.mute) sfx.tick(); };
sndIcon();
title();

/* offline support: only where service workers are allowed */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
}
