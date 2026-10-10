# Privacy Impact Assessment pack

For a school or district that is completing a PIA (BC: FIPPA s. 69; Ontario boards: their own privacy review). Written from the code as of October 2026. **(confirm)** marks a fact that depends on a provider and has not been confirmed in writing.

## 1. The service

GradeMap is a web app (installable, with an Android wrapper) for practice and games matched to the BC and Ontario curricula, Kindergarten to Grade 9. In a school it is a practice aid. Its levels reflect practice, not a report-card mark; the teacher decides proficiency. There are no ads, no tracking and no sale of data.

## 2. Who uses it and how accounts work

| Role | Account | What they can do |
| --- | --- | --- |
| Teacher | Email and password. Email must be confirmed before a class can be created. | Create classes, add students, assign units, see results on assigned units. |
| Student, added by the teacher | A login code (class code plus a personal code). No email, no password. | Practise and play. No parent area, no billing, no other accounts, no free-text input. |
| Student, linked by a parent | The child's family account. The parent enters the class code. | Same play as at home. The parent can unlink at any time. |

## 3. Data inventory

| Data | About | Why | Where | Kept until |
| --- | --- | --- | --- | --- |
| First name or nickname (the teacher types it, at most 20 characters) | Student | So the child and teacher recognise the account | Database | Student removed, class closed or teacher account deleted |
| Grade and curriculum | Student | Chooses content | Database | Same |
| Avatar, cosmetics, settings | Student | Gameplay and comfort options (calm motion, quiet sounds and similar) | Database | Same |
| Practice events: unit, right or wrong on the first try, time, mode, date | Student | Progress, levels, teacher view | Database | Same |
| Login code | Student | Sign-in | Database | Replaced on request; removed with the student |
| Email and password hash (scrypt) | Teacher | Sign-in, account messages | Database | Account deleted |
| Class name, grade, province, class code, assigned units and due dates | Class | Running the class | Database | Class closed |
| Sign-in sessions (hashed token, browser type, time) | Both | Staying signed in, 90 days | Database | Expiry, sign-out or deletion |
| Request logs (IP address, browser type, time) | Both | Security and operation | Host logs | **(confirm)** host retention |
| Attempt counters per IP address and class code | Both | Blocking code guessing | Database | Minutes to an hour |

**Not collected from students:** email address, birth year (class accounts never have one), surname, photos, voice, location, free text, device identifiers, advertising identifiers.

**Not shared with other students.** There are no leaderboards, chat or any way for a student to see another student's data.

## 4. Who can see what

- **Teacher:** each student's first name, avatar, grade, last active date, and level, first-try accuracy and number of questions for the units they assigned. Not the student's play on other units, not coins, trophies or games.
- **Student:** only their own account.
- **Other teachers:** nothing. A class belongs to the teacher who created it.
- **GradeMap staff:** operational access for support and security only **(confirm access policy before signing)**.
- **Parents** (for linked children): the full family view at home, as for any family.

## 5. Data flow

```
Student's device (browser, saves on the device first)
   |  HTTPS, signed-in cookie
   v
GradeMap app servers, Montreal  --->  Database (Turso, Montreal)
   |
   +--> Resend: teacher account emails only (confirmation, password reset)
   +--> Sentry: crash reports, scrubbed of names, emails, cookies and what was tapped
   +--> Stripe: parents' payments only. No school or student data.
```

Students' devices also keep a copy of progress in the browser (IndexedDB and local storage) so the app works offline. On a **class sign-in the device is cleared first and again on sign-out**, so one child's data does not stay for the next.

## 6. Service providers (sub-processors)

| Provider | Purpose | Data it sees | Location |
| --- | --- | --- | --- |
| Vercel | App hosting, functions in Montréal (`yul1`) | Requests, logs | Canada for functions **(confirm: edge and logging may be outside Canada)** |
| Turso on Fly | Database | All account data above | Montréal **(confirm region and encryption at rest)** |
| Resend | Teacher emails | Teacher email address and message | United States |
| Sentry | Crash reports | Scrubbed errors | United States or EU |
| Stripe | Parent payments | Parent email and payment | United States. Not used for schools while classes are free. |
| Vercel Web Analytics | Anonymous page counts on public pages only | Page, country | Switched off in the student app and teacher area |

If a district requires all providers to be in Canada, Resend and Sentry are the gaps; both can be switched off for a school-only deployment. Decision for the owner.

## 7. Retention and deletion

| Event | What is deleted |
| --- | --- |
| Teacher removes a student | The student's account, profile, settings, practice history and sessions, at once |
| Teacher closes a class | Every student account in it, at once, and the assignments |
| Teacher deletes their account | Every class and student account they own, at once |
| Teacher gets a new code for a student | The old code stops working and the student is signed out everywhere |
| Parent unlinks a child | The teacher stops seeing the child at once; the family keeps its data |

Backups roll off on the database provider's cycle **(confirm)**. There is no automatic deletion of inactive classes yet; see the decisions at the end.

## 8. Security controls

- HTTPS everywhere. Content Security Policy with no `unsafe-inline` for scripts.
- Passwords hashed with scrypt; sessions stored hashed; HttpOnly, SameSite cookies; `__Host-` prefix in production; same-origin checks on changes.
- Student login codes are six characters from a 31-character alphabet. Sign-in is rate limited per device and per class, so guessing is impractical, and a teacher can issue a new code at any time.
- A student session works only for syncing the student's own play. Every teacher, parent and billing endpoint refuses it. A student cannot rename, regrade or delete their own profile or add others.
- Teacher access to a class is checked against the signed-in owner on every request.
- Error reports are scrubbed of personal data before leaving the server or device.
- Not done yet: an independent penetration test, SOC 2, a written incident-response plan. **A pen test before a first district contract is recommended.**

## 9. Breach handling

We will tell the school or district without undue delay once we confirm a breach affecting its students, with what happened, what data was involved and what we have done, so it can meet its own duties to notify under FIPPA and to the OIPC. We keep a record of every breach. **(Wording and time limit to be set by the lawyer in the data agreement.)**

## 10. Individual rights

Parents and students go through the school. We help the school find, correct, export or delete a student's data on request; deletion is available to the teacher directly. A parent with a family account also has export and delete in the Parent area.

## 11. Accessibility

See [accessibility-conformance.md](accessibility-conformance.md) and `/accessibility/`.

## 12. Decisions for the owner

1. **Retention for inactive classes.** Suggested: delete a class and its students after 12 months with no sign-in, with a warning email to the teacher at 11 months. Not built.
2. **Canadian-only providers.** Replace or switch off Resend and Sentry for school deployments?
3. **School or district plan.** Classes are free today. Say so in the agreement or set a price.
4. **Several teachers on one class** (co-teaching, a school office role). Not built; today one account owns a class.
5. **Birth year.** Already absent from class accounts. Keep it that way.
