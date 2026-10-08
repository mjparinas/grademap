# Monetization Models and Benchmarks for a Canadian Parent-Facing Elementary Curriculum App

Research date: 2026-10-08. All prices are USD unless marked otherwise. CAD conversions use an **assumed rate of 1 USD ≈ 1.37 CAD**. This rate is not sourced; check the live rate before using these numbers. Many competitor prices come from third-party aggregators because official pricing pages were often unreachable. Each such price is flagged.

---

## 1. Ads: platform rules (Google Play Families / Teacher Approved, Apple Kids Category), privacy law (COPPA, PIPEDA/OPC, Quebec Law 25 and CPA, BC), parent sentiment, kid-safe eCPMs. Is an ad model viable?

### Takeaway
An ad-funded model is not viable as the main revenue source for a Canadian elementary curriculum app. Several things stack against it:
- Apple's Kids Category discourages third-party ads and limits them to human-reviewed contextual ads.
- Google requires Families-self-certified SDKs with child-directed, G-rated treatment.
- Under the amended COPPA rule, targeted ads need separate parental consent.
- The OPC's position is that under-13s cannot consent, and Quebec requires parental consent under 14.
- Quebec bans commercial advertising directed at under-13s outright.
- Contextual kid inventory earns less than general-audience inventory.

Duolingo shows the ceiling. Even with 140M MAU, ads are only about 7% of its revenue. Prodigy, the closest Canadian comparable, markets itself as having "no third-party advertising."

### Cited Findings

**Google Play (Families policy / ads SDKs)**
- An app whose target audience is only children may use only ads SDK versions that have self-certified compliance with Google Play policies. A mixed-audience app must make sure ads shown to children come only from self-certified SDKs, for example by using neutral age screening. — [Google Play Console Help: Families ads SDKs](https://support.google.com/googleplay/android-developer/answer/9900633)
- Two arrangements are exempt from SDK self-certification: in-house cross-promotion of your own apps, and direct deals with advertisers. The developer stays responsible for ad content and data collection in both. — [Google Play Console Help](https://support.google.com/googleplay/android-developer/answer/9900633)
- A self-certified SDK must prohibit objectionable ad content, rate creatives into at least "Everyone" and "Mature," support child-directed treatment per request or per app, and self-certify every new release. — [Google Play Console Help](https://support.google.com/googleplay/android-developer/answer/9900633)
- AdMob in child-only apps: call `setTagForChildDirectedTreatment(true)` and set `max_ad_content_rating` to G on every request. In mediation, the developer is responsible for making sure third-party networks serve Families-compliant ads. — [AdMob Help](https://support.google.com/admob/answer/6223431?hl=en)
- **Teacher Approved**: only apps that comply with the Families Policies are eligible. Teachers rate apps on design, appeal, enrichment, age appropriateness, **appropriateness of ads, in-app purchases, and cross-promotion**. Every update is re-reviewed. Approved apps get a badge and may appear on the Kids tab. — [Play Console: Teacher Approved](https://play.google.com/console/about/programs/teacherapproved); [Play Console Help](https://support.google.com/googleplay/android-developer/answer/10075896?hl=en). The program launched in April 2020, US-only at first, with age bands 5 & under, 6–8 and 9–12. — [9to5Google, Apr 2020](https://9to5google.com/2020/04/15/google-play-kids-apps/)

**Apple (Guidelines 1.3 and 5.1.4, current live text)**
- Kids Category apps "must not include links out of the app, purchasing opportunities, or other distractions to kids unless reserved for a designated area behind a parental gate."
- They "may not send personally identifiable information or device information to third parties" and "should not include third-party analytics or third-party advertising."
- Third-party contextual advertising "may also be permitted in limited cases provided that the services have publicly documented practices and policies for Kids Category apps that include human review of ad creatives."
- Once in the Kids Category, an app must keep meeting these rules even if it later deselects the category.
- Source for all four points: [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Guideline 5.1.4: "Apps intended primarily for kids should not include third-party analytics or third-party advertising." The parental gate "is generally not the same as securing parental consent" under privacy laws. — [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

**COPPA (US; relevant if the app is sold in the US or has US users)**
- The amended COPPA Rule was published April 22, 2025 and took effect June 23, 2025, with a general compliance date of **April 22, 2026**. — [Federal Register](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule)
- Operators need **separate, specific opt-in parental consent** before disclosing a child's personal information for targeted advertising. That consent cannot be bundled with general consent, and a parent who refuses cannot be cut off from the service. — [Davis Polk](https://www.davispolk.com/insights/client-update/ftc-prioritizes-coppa-enforcement-new-compliance-obligations-take-effect); [Toy Association, 2026](https://www.toyassociation.org/ta/PressRoom2/News/2026-News/updated-coppa-rule-requirements-take-effect-april-22.aspx)
- COPPA requires prior parental consent for any behavioural advertising to children. Contextual advertising on child-directed apps is treated differently. — [BBB National Programs](https://bbbprograms.org/media/insights/blog/navigating-in-app-advertising-in-childrens-apps)
- Enforcement precedent: Epic Games paid $275M in COPPA penalties plus $245M in redress for dark patterns (announced Dec 2022, finalized 2023). — [FTC](https://www.ftc.gov/node/80648); [Venable](https://www.venable.com/insights/blogs/2022/12/ready-aim-fire-ftc-scores-recordbreaking-520-milli)

**Canada: federal (PIPEDA / OPC)**
- The OPC launched an exploratory consultation on a **children's privacy code** on May 12, 2025, open until Aug 5, 2025. — [OPC news release](https://www.priv.gc.ca/en/opc-news/news-and-announcements/2025/nr-c_250512/)
- The OPC's "What We Heard" report (modified 2026-05-04) restates the OPC's current position: "in all but exceptional circumstances, children under 13 cannot meaningfully consent." Consent must come from a parent or guardian. — [OPC What We Heard report](https://www.priv.gc.ca/en/about-the-opc/what-we-do/consultations/completed-consultations/consultation-children-code/report_children-code_2026/)
- Respondents called for "no-go zones," including behavioural profiling or commercial exploitation of children's data that does not serve their best interests. They also supported prohibiting deceptive design and wanted privacy-protective defaults. The OPC is now preparing the code but gave no timeline. — [OPC What We Heard report](https://www.priv.gc.ca/en/about-the-opc/what-we-do/consultations/completed-consultations/consultation-children-code/report_children-code_2026/)
- A joint federal and provincial investigation (including Quebec) found TikTok collected and used children's data for ad targeting "without demonstrating a legitimate need or bona fide interest." — [Bennett Jones, Oct 2025](https://www.bennettjones.com/Insights/Blogs/2025/10/Joint-Privacy-Commissioner-Investigation-of-TikTok-Key-Take-Aways/pdf)

**Canada: Quebec**
- **Law 25**: personal information about a child under 14 cannot be collected without consent from the parent or tutor, unless collection is clearly for the child's benefit. This took effect in the Sept 22, 2023 phase. — [CFIB](https://www.cfib-fcei.ca/en/site/qc-law-25). OneTrust reads the requirement as also covering use and disclosure, while CFIB frames it around collection only. — [OneTrust](https://www.onetrust.com/blog/quebecs-law-25-what-is-it-and-what-do-you-need-to-know/)
- **Consumer Protection Act ss. 248–249** prohibit commercial advertising directed at children under 13. The ban applies across media, including digital, and to advertisers, agencies and the media carrying the ad. Whether an ad is "directed at" children depends on the product, presentation, time and place. — [Gowling WLG, 2026](https://gowlingwlg.com/insights-resources/articles/2026/rules-for-marketers-and-advertisers-when-advertising-to-children-in-canada); [Lexpert](https://www.lexpert.ca/legal-faq/what-are-quebecs-advertising-laws/387022)
- A class action filed in Quebec Superior Court alleges TikTok's ads to children violate the CPA. These are unproven allegations. — [CTV News](https://www.ctvnews.ca/montreal/article/tiktok-targeted-quebec-children-with-illegal-ads-lawsuit-alleges/)

**Kid-safe ad supply and eCPMs**
- SuperAwesome's AwesomeAds contextual targeting is certified under COPPA Safe Harbor programs (kidSAFE, ESRB, CARU). Each ad is human-reviewed and carries a "SAFE AD" watermark. — [SuperAwesome](https://www.superawesome.com/awesome-ads/). Roblox named SuperAwesome its partner for under-13 contextual ads, with no programmatic buying and no rewarded video. — [MediaPost, 2026](https://www.mediapost.com/publications/article/415641/roblox-appoints-superawesome-as-partner-for-under.html)
- General-audience US eCPMs for 2026:

| Format | Android | iOS |
|---|---|---|
| Banner | ~$1.22 | ~$1.30 |
| Interstitial | ~$10.11 | ~$9.64 |
| Rewarded video | ~$16.49 | ~$19.63 |

  Source: [Playio 2026 benchmarks](https://blog.playio.co/mobile-game-ecpm-benchmarks-2026)
- Contextual eCPMs are "typically lower than personalized ones." — [FlexyConsent publisher guide](https://flexyconsent.com/blog/coppa-childrens-privacy-mobile-games/). Pangle's documentation says turning on its child-directed setting means "your eCPM will therefore be affected." — [Pangle](https://www.pangleglobal.com/knowledge/what-is-coppa). Unity limits child-directed titles to contextual ads for every user. — [Unity Ads docs](https://docs.unity.com/en-us/ads-android/4.20.0/privacy/developer-consent/frameworks/child-data-laws.md)
- Scale benchmark: in Q2 2026 Duolingo reported 140.6M MAU and 58.7M DAU. Advertising revenue was $21.1M (+2% YoY), about 7% of $298.5M total. Subscriptions were $258.0M (about 86%). — [Duolingo Q2 2026 shareholder letter (SEC 8-K)](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm)
- Prodigy says it earns revenue through optional parent memberships, "does not include third-party advertising," and does not sell or lease student data. — [Google Workspace Marketplace listing, ~June 2024](https://workspace.google.com/marketplace/app/prodigy/649186947820)

**Parent sentiment and evidence on ads in kids' apps**
- A Univ. of Michigan study of 135 apps marketed to or played by children 5 and under (2018) found 95% contained at least one type of advertising. Formats included interrupting videos, hidden ads and in-app purchase prompts. — [Michigan Medicine](https://michiganmedicine.org/health-lab/advertising-kids-apps-more-prevalent-parents-may-realize)
- In 2022, JAMA Network Open (Radesky et al.) studied apps used by 160 children aged 3–5. About 80% had manipulative design features, such as prolonging play, pushing purchases or forcing ad viewing. These features clustered in households with lower parental education. — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC9206186/)
- C.S. Mott poll: 69% of parents of tweens were uneasy about health apps showing ads to their tweens. This covers health apps specifically. — [Mott Poll](https://mail.mottpoll.org/node/2527)
- GameByte/Interpret (2019) surveyed parents about kids' mobile games. Half preferred in-game ads over paying, 13% preferred purchases and 37% had no preference. Disapproval was lowest for incentivized (rewarded) ads at 12%. This is game-focused and dated. — [Interpret](https://interpret.la/?p=9758)

### Inferences
- **Ad revenue math (illustrative, my calculation):** assume 10,000 DAU × 4 banner impressions/day × a $1.00 kid-contextual eCPM (below the $1.22–1.30 general-audience banner rate). That gives about $40/day, or about US$14.6k/year (≈C$20k). The same 10,000 DAU at a 5% paid rate × $60/yr gives $30k/yr, so even a modest subscription out-earns ads. Rewarded video would raise the ad figure, but rewarded formats directed at children are restricted (Roblox bans them for under-13s).
- **Positioning cost:** for a parent-facing curriculum app positioned as premium rather than cheapest, ads clash with the trust promise ("no ads, no data selling") that Prodigy and Khan Academy Kids both advertise. Ads would also likely count against Teacher Approved ratings, which explicitly score "appropriateness of ads."
- **Quebec:** commercial ads shown to under-13 users in Quebec carry real legal risk under CPA ss. 248–249. That makes an ad tier hard to run nationally without geo-segmentation.
- **Acceptable ad-like uses:** in-house cross-promotion of your own products (exempt from Google's SDK self-certification), and parent-facing marketing outside the child experience behind a parental gate.

### Gaps
- No public, current eCPM figures for kid-safe/COPPA contextual inventory (SuperAwesome, Kidoz) were found. Vendors publish no rate cards. Contact sales for quotes.
- No current (2023–2026) Canadian parent survey on attitudes to ads in kids' educational apps, or on willingness to pay to remove them, was found.
- BC PIPA and Alberta PIPA have no fixed statutory age of consent. Their specific guidance on children was not researched.
- The OPC children's privacy code has no draft or timeline yet, and the What We Heard report does not take a specific position on behavioural advertising.

---

## 2. Freemium vs free trial + subscription vs hard paywall vs one-time vs per-grade/per-subject: conversion, plan mix, churn, LTV benchmarks

### Takeaway
Education is a high-price, annual-heavy, slow-to-convert category:
- RevenueCat 2026 puts the median yearly price at $44.99, the highest of any category, and the median monthly at $9.99.
- Annual plans are 59–66% of subscriptions sold.
- Only 28.5% of paid conversions happen on Day 0, the lowest of any category.
- Hard paywalls convert about 5× better than freemium at the median (10.7% vs 2.1% download-to-paid), and one-year retention is about the same.
- Longer trials (17–32 days) convert and renew best.

For a parent-facing elementary app, a trial (about 14–30 days) into an annual-led subscription, with a light free layer for teacher/parent acquisition, fits the evidence best. Kids competitors cluster at about $60/yr per family.

### Cited Findings

**RevenueCat State of Subscription Apps 2026, Education breakout (mostly 2025 data)**

| Metric | Education | All categories |
|---|---|---|
| Median download-to-trial (D30) | 6.5% | — |
| Day-0 share of paid conversions | 28.5% (lowest category) | 50.6% |
| Trials lasting 5–9 days | 50.3% | — |
| Annual share of subscriptions sold | 59–66% | ~42% monthly / ~34% yearly overall |
| Median yearly price | $44.99 (highest category) | $34.80 |
| Median monthly price | $9.99 (tied highest) | $8 |
| Median yearly realized LTV per payer | $22.82 | $23 |
| Median D14 revenue per install | $0.30 | $0.23 |

Source: [RevenueCat SOSA 2026 – Education](https://www.revenuecat.com/state-of-subscription-apps-2026-education). The page lists "Day-0 share of trial starts" as 78.5% in one place, which conflicts with a chart elsewhere on the same page.

**Hard paywall vs freemium**
- Hard paywalls convert downloads to paid at a median of **10.7%** (floor 4.2%), versus **2.1%** for freemium. — [RevenueCat blog, Apr 29 2026](https://www.revenuecat.com/blog/growth/hard-paywall-vs-freemium)
- The 2025 edition reported 12.1% vs 2.2%. — [Subscription Insider](https://subscriptioninsider.com/article-type/news/revenuecats-state-of-subscription-apps-2025-report-ais-dominance-retention-challenges-and-the-shift-away-from-pure-subscriptions)
- Citing RevenueCat 2025: year-one LTV per payer was $49.30 for hard-gated apps vs $24.24 for freemium, and D60 revenue per install was $3.09 vs $0.38. Airbridge also claims hard-gated apps see 70% higher refund rates, which I could not verify in primary data. — [Airbridge](https://www.airbridge.io/en/blog/hard-paywall-vs-freemium-2026)
- One-year retention of yearly subscribers is about equal: 28% freemium vs 27% hard paywall. — [Airbridge summarizing RevenueCat 2026](https://www.airbridge.io/en/blog/hard-paywall-vs-freemium-2026)
- Case anecdotes: one app moving from hard paywall to freemium gained 75% LTV per user. Another lost more than 50% of subscriber conversion and reverted. — [RevenueCat blog](https://www.revenuecat.com/blog/growth/hard-paywall-vs-freemium)

**Trials**
- RevenueCat 2025, as reported by secondary coverage:
  - Trials of 17–32 days have the highest median conversion, 45.7%.
  - 3- and 7-day trials have the highest Day 0/Day 1 cancellations.
  - 30% of annual subscribers cancel within the first month.
  - Source: [i-programmer summary](https://www.i-programmer.info/news/83-mobilephone/17938-making-money-from-subscription-apps.html)
- RevenueCat data (Aug 2025–Jul 2026, via SaaStr): first renewal on monthly plans was 49.5% with no trial vs 77.5% after a 17–32 day trial. Annual plans convert 86% better with 30-day trials. — [SaaStr](https://saastr.com/what-17000-subscription-apps-tell-us-about-free-trial-length-annual-plans-convert-86-better-with-30-day-trials-monthly-tops-out-at-two-weeks-and-ai-apps-hit-a-wall-at-16-days)
- Duolingo, Q2 2026: "longer free trials" were an early win of monetization work aimed at increasing revenue "without adding friction to free users." — [Duolingo Q2 2026 letter](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm)
- An older RevenueCat report found 3.7% of downloads start a trial and 38% of trials convert. — [RevenueCat trial conversion insights](https://revenuecat.com/blog/growth/app-trial-conversion-rate-insights/)

**Adapty State of In-App Subscriptions 2026 (Education; mostly 2025 data; article dated Apr 7 2026)**
- Education average 12-month LTV is $45.10, third of all categories. Trial users have a +50.4% LTV premium over direct buyers.
- 71.3% of Education trial starts happen on Day 0, versus 86–94.5% in other categories. **23.5% of Education trial starts happen on Day 31+**, the highest late-start rate of any category.
- Global medians: weekly $7.48, monthly $12.99, annual $38.42. Global install-to-trial is 10.9% and trial-to-paid 25.6%.
- **Canada's Education weekly pricing index is 0.7× the US.** Canada's 12-month LTV across all categories is $20.90 vs $19.90 for the US.
- Education revenue mix in 2025: weekly 52%, monthly 9%, annual 22%, **one-time 17%**. The one-time share is up from 6% in 2023.
- Month-12 retention of trial subscribers: about 20% annual, about 15% monthly, about 10% weekly.
- 14.3% of Education apps offered discounts in 2025, the highest of any category.
- Source for all points above: [Adapty Education benchmarks](https://adapty.io/blog/markdown/education-app-subscription-benchmarks.md)
- Conflict: Adapty elsewhere cites a 53% average trial-to-paid across all categories, against the 25.6% global figure above. Definitions likely differ. — [Adapty SOIS 2026](https://adapty.io/state-of-in-app-subscriptions-report/)

**Kids and edtech comparables: pricing and model**

| App | Model | Price | Source |
|---|---|---|---|
| **Prodigy Math** (Toronto) | Free game; paid parent memberships | Core $9.95/mo or $58.95/yr; Plus $14.95/mo or $88.95/yr; Ultra $19.95/mo or $118.95/yr | [Prodigy membership page](https://prodigygame.com/main-en/membership/tmp-membership-math) |
| Prodigy English | Paid parent membership | Level Up $74.95/yr | [Prodigy English membership](https://prodigygame.com/main-en/membership/tmp-membership-english) |
| **IXL** (per-subject, per-child) | Subscription | 1 subject $9.95/mo or $79/yr; math+ELA ~$15.95/mo or $129/yr; core 4 subjects $19.95/mo or $159/yr; **each extra child +$4/mo or +$40/yr** | [Time4Learning](https://time4learning.com/vs/ixl/cost.html); [Nibble](https://nibble-app.com/blog/ixl-cost) (third-party) |
| **Epic** (reading) | Free for teachers during school day; paid at home | Family $13.99/mo or $84.99/yr, up to 4 child profiles, 7-day trial | [HomeschoolFox](https://homeschoolfox.com/curriculum/epic); [App Store](https://apps.apple.com/us/app/-/id719219382) |
| **ClassDojo Plus** | Add-on to free app | US App Store options $7.99/mo, $39.99/6 mo, $59.99/yr | [App Store](https://apps.apple.com/US/app/id552602056) |
| **HOMER** | Subscription | Annual $59.99; monthly $7.99–$12.99 | [AppPricingLab, May 2026 snapshot](https://apppricinglab.com/app/apple/601437586) |
| **ABCmouse** | Subscription, 30-day trial | $12.99/mo or $59.99/yr | [Subger](https://subger.com/en/service/abcmouse) (aggregator) |
| **Lingokids** | Subscription | Unlimited Annual $59.99/yr | [Subger](https://subger.com/en/service/lingokids) (aggregator) |
| **Khan Academy Kids** | Free, nonprofit | No ads, IAP or subscription; ages 2–8 | [HomeschoolFox](https://homeschoolfox.com/curriculum/khan-academy-kids) |

Notes on the table:
- Prodigy: the June 2025 Prodigy blog listed higher monthly prices for Plus ($19.95) and Ultra ($29.95). — [Prodigy blog](https://prodigygame.com/blog/ways-to-save-on-prodigy-memberships)
- Prodigy: the 2021 FTC complaint cited prices of $59.88–$107.40/yr, and Fairplay noted an "Ultimate" tier of over $180/yr in Sept 2021. — [Fairplay 2021 annual report](https://fairplayforkids.org/wp-content/uploads/2021/10/2021-Annual-report.pdf)
- No CAD prices for Prodigy were found.
- Epic: another review lists $11.99/mo or about $79.99/yr. — [iTechGuides](https://www.itechguides.com/products/epic/)
- ClassDojo: Vator (Aug 2024) cites $4.99/mo or $59.99/yr. — [Vator](https://vator.tv/2024-08-23-how-does-classdojo-make-money/)
- HOMER: lifetime pricing conflicts across sources ($99.99 vs $199.99).
- ABCmouse: the same aggregator also lists $13.99/mo.
- Khan Academy Kids: the App Store listing claims 21M+ children reached. — [App Store](https://apps.apple.com/us/app/khan-academy-kids/id1378467217)

**Freemium at scale (Duolingo)**
- Q2 2026: 12.7M paid subscribers (+17% YoY) on 140.6M MAU, about 9% paid. My calculation mixes a period-end count with an average monthly figure. — [Duolingo Q2 2026 letter](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm)

### Inferences
- **Price anchor for "premium, not cheapest":** the kids market clusters at about **US$60/yr per family** (HOMER, ABCmouse, ClassDojo Plus, Lingokids, Prodigy Core), roughly C$82.
  - Education's median annual price is US$44.99 (≈C$62).
  - Per-subject, per-child tools go much higher: IXL core is $159/yr (≈C$218), and Prodigy Ultra is $118.95/yr (≈C$163).
  - A curriculum-aligned Canadian product with parent reporting could credibly sit at **C$100–150/yr per family**, above the $60 cluster and below IXL core. Charging that requires visible curriculum alignment and parent-facing progress reporting to justify it.
- **Canadian discount risk:** Adapty's 0.7× Canada education weekly pricing index suggests many apps price Canada lower than the US. A Canadian-specific, curriculum-aligned value proposition is the lever for resisting that.
- **Model choice:**
  - Benchmarks favour a trial-gated paywall over pure freemium for conversion.
  - Education's late-converting behaviour (28.5% Day-0 paid share; 23.5% of trials starting Day 31+) argues for a **free "light" layer** plus an always-available trial. Examples of a light layer: a placement diagnostic, a limited weekly lesson count, or a teacher classroom version. Delayed triggers such as a report card or a struggle point can then convert users.
  - Use a hard paywall for the full curriculum and reporting, not for the first experience.
- **Trial length:** 14–30 days rather than 3–7. Short trials show the most early cancellations, and the strongest conversion and renewal data points to 17–32 days.
- **One-time and per-grade purchases:** Adapty shows one-time revenue rising to 17% of Education revenue. A "grade pack" one-time purchase could serve parents who dislike subscriptions, priced near or above one year of subscription. But one-time purchases fit a curriculum app (new content each grade, ongoing reporting) less well than recurring revenue does. Per-grade purchases also fragment siblings in different grades. My inference: offer a per-grade lifetime pack as a secondary SKU at most.

### Gaps
- RevenueCat's education trial-to-paid median and education renewal and churn rates are in the gated full PDF and were not publicly available.
- No benchmarks were found specific to kids' or parent-purchased education apps, as distinct from adult language and test-prep apps. Adapty's weekly-heavy education plan mix is likely skewed by adult apps.
- No public conversion, churn or LTV data was found for Prodigy, HOMER, ABCmouse, Lingokids or Epic. These companies are private. Prodigy revenue is estimated at about $30M by data vendors such as [Clodura](https://www.clodura.ai/directory/company/prodigy-education), which is low reliability.
- No CAD price points were verified for any competitor.

---

## 3. Family plans and sibling pricing; App Store and Google Play fees; Canadian alternative billing; web billing

### Takeaway
Family pricing is standard in kids' learning apps. Common structures:
- Epic includes up to 4 child profiles in one plan.
- IXL charges +$4/mo or +$40/yr per extra child.
- Duolingo's family plan was about 20% of its subscribers in 2024.

Platform fees on subscriptions are effectively 15% for a small developer:
- Apple's Small Business Program charges 15% from day one under US$1M in proceeds.
- Google charges 15% on subscriptions.

In Canada there is no alternative-billing or link-out right on either store. US-style link-outs to web checkout are US-storefront-only on Apple, and Google's user-choice billing list does not include Canada. Web billing therefore works mainly through out-of-app channels such as the website, email to parents, and school or PAC sales.

### Cited Findings

**Family and sibling structures**
- Epic Family: up to 4 child profiles plus a parent dashboard. — [HomeschoolFox](https://homeschoolfox.com/curriculum/epic)
- IXL: additional children cost "$4 more per month or $40 per year," on top of per-child base plans. — [Time4Learning](https://time4learning.com/vs/ixl/cost.html)
- Duolingo's family plan "now makes up about 20% of our subscribers" (Q2 2024 earnings call). The Q2 2026 letter gives no family breakdown, and the paid-subscriber count excludes non-paying family members. — [MarketBeat Q2 2024 transcript](https://www.marketbeat.com/earnings/reports/2024-8-7-duolingo-inc-stock); [Duolingo Q2 2026 letter](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm)
- ClassDojo sells school-wide licences that extend Plus features to every parent in a building. Pricing is quote-based. — [Vator, Aug 2024](https://vator.tv/2024-08-23-how-does-classdojo-make-money/)

**Apple fees**
- Standard subscriptions: 30% in a subscriber's first paid year, then 15%. The **Small Business Program** charges 15% from the first payment if proceeds are ≤ US$1M in the prior and current calendar year, pooled across associated accounts. You must enrol. Exceeding $1M moves you to standard rates for the rest of the year. — [Apple Small Business Program](https://developer.apple.com/app-store/small-business-program/); [RevenueCat: App Store fees](https://www.revenuecat.com/blog/engineering/app-store-fees); [Apple Canada newsroom, Nov 2020](https://www.apple.com/ca/newsroom/2020/11/apple-announces-app-store-small-business-program/)
- **Link-outs**:
  - In storefronts other than the United States, "apps and their metadata may not include buttons, external links, or other calls to action that direct customers to purchasing mechanisms other than in-app purchase," except where specific StoreKit External Purchase Link entitlements apply.
  - Developers "can send communications outside of the app to their user base about purchasing methods other than in-app purchase."
  - Kids Category apps may offer purchases only behind a parental gate.
  - Source: [Apple App Store Review Guidelines 3.1.1(a), 3.1.3, 1.3](https://developer.apple.com/app-store/review/guidelines/)
- US storefront: link-outs are allowed. Apple has proposed a 15% fee on linked-out purchases (5% for Small Business Program members), and the court has not yet approved a fee. — [eWeek](https://www.eweek.com/news/apple-external-purchase-fee-developers/)

**Google Play fees and billing**
- Subscriptions have historically paid a flat 15% service fee. User choice billing (alternative billing alongside Play billing) cuts the fee by 4 points, but eligible countries listed are the EEA, Australia, Brazil, Indonesia, Japan, South Africa and the UK. **Canada is not listed.** — [Google Play Console Help: service fees](https://support.google.com/googleplay/android-developer/answer/112622?hl=en); [User choice billing](https://support.google.com/googleplay/android-developer/answer/13821247?hl=en)
- From June 30, 2026, the US, UK and EEA moved to a 10% service fee on subscriptions plus a 5% billing fee only when Google Play Billing is used. Rollout dates were set for Australia (Sept 30, 2026) and Japan/Korea (Dec 31, 2026), with a stated global rollout by Sept 30, 2027. **No Canada date was found.** — [Adapty](https://adapty.io/blog/google-play-billing-changes-subscriptions-fees); [PhoneScoop](https://www.phonescoop.com/articles/article.php?a=23685)

**Web billing tooling**
- RevenueCat's Web Purchase Button supports US App Store link-outs (from May 2025) and Play Store link-outs (from Oct 2025). It checks out via RevenueCat Billing, Stripe or Paddle and falls back to native IAP where web purchase isn't allowed. — [RevenueCat docs](https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/web-purchase-button); [RevenueCat blog](https://www.revenuecat.com/blog/growth/introducing-web-paywall-buttons)
- Example economics: a $10 renewal nets $8.50 in-app at 15%. On the web at zero link-out commission and Stripe's 2.9% + 30¢, it nets about $9.41. — [eWeek](https://www.eweek.com/news/apple-external-purchase-fee-developers/), plus the search-summary arithmetic.

### Inferences
- **Recommended family structure (inference):** one family plan covering 1–4 children, consistent with Epic and Duolingo-style plans, as the default SKU. Optionally offer a cheaper single-child plan as a decoy or anchor.
  - Avoid IXL-style per-child add-ons for the core offer. Elementary families often have siblings in different grades, and a single family price is simpler and supports a higher headline price without seeming "cheap."
  - Example: single child C$99/yr, family C$149/yr. These are illustrative, not sourced.
- **Effective take rate:** as a new Canadian developer under US$1M, expect about 15% on both stores. Combined with ~13% GST/HST and QST complexity, which the stores handle when they are merchant of record, store billing is operationally simpler.
- **Canadian web billing play:**
  - The founder cannot steer Canadian iOS users from the app to the web.
  - The founder can sell directly on the website to parents reached through schools, PACs, email and search, with access unlocked by login.
  - This is a legitimate path for the B2B2C channel (Section 5), where parents arrive from a teacher or school link rather than the app store.
  - When the founder is merchant of record on the web, provincial auto-renewal rules apply directly (see Section 7).

### Gaps
- Whether Apple's multiplatform-service rule (3.1.3(b)) lets a web-purchased Canadian subscription unlock content in the iOS app without also offering IAP was not verified from the full text.
- No Canada-specific Google Play fee timeline under the 2026 restructuring was found. Check Play Console.
- No data was found on web vs in-app conversion rates for kids or education apps.
- Apple's Family Sharing for subscriptions and its effect on family plan design were not researched.

---

## 4. Seasonality: back-to-school, report cards, summer slide

### Takeaway
Education app demand peaks from late August to September:
- ClassDojo's September is typically its strongest revenue month.
- In 2025, ABCmouse and Splash downloads peaked in mid-to-late August.

Education users also convert late. RevenueCat finds the lowest Day-0 paid share of any category, and Adapty finds 23.5% of trials starting 31+ days after install, which rewards nurture campaigns timed to school events.

Summer slide is real in math (about 10–30% of a year's math gains on NWEA data) but small in reading. That supports a summer math product. Recent meta-research also cautions that summer-slide findings often fail to replicate.

### Cited Findings
- Appfigures estimated ClassDojo's App Store and Google Play net revenue at about $736K (Aug 2020), $1.4M (Aug 2021), $5.8M (Aug 2022) and $7.8M (Aug 2023). It notes **September is typically its strongest revenue month**. — [Appfigures, Sept 2023](https://appfigures.com/resources/insights/20230908?f=5)
- Appfigures (2024): apps "rise at the end of August and the beginning of September – back to school season – adding millions of new downloads (and dollars)." — [Appfigures, Sept 2024](https://appfigures.com/resources/insights/20240920/2-the-ai-study-helper-thats-riding-the-back-to-school-wave)
- Sensor Tower Q3 2025 (US): Splash Jr. weekly downloads spiked to about 96K in mid-August. ABCmouse 2 peaked at about 60K in late August. Lingokids stayed steady at about 50K/week, with a high of 57K in early July. — [Sensor Tower](https://sensortower.com/blog/2025-q3-unified-top-5-educational%20games-units-us-642f2824e1714cfff1ed8590)
- Education conversions skew late:
  - 28.5% of paid conversions happen on Day 0, versus 50.6% across all categories. — [RevenueCat 2026 Education](https://www.revenuecat.com/state-of-subscription-apps-2026-education)
  - 23.5% of Education trial starts come on Day 31+. — [Adapty](https://adapty.io/blog/markdown/education-app-subscription-benchmarks.md)
- **Summer slide:**
  - NWEA's 2023 spring and fall data (K–8): math loss was "significant," equal to about 10–30% of a typical school year's learning (2–7 RIT points, biggest in elementary). Reading changed by less than 1 RIT point. — [K-12 Dive](https://www.k12dive.com/news/math-summer-slide-is-significant-but-reading-loss-much-smaller-data-sho/820052/); [NWEA blog](https://www.nwea.org/blog/?p=26464)
  - The most-affected 10% of students lose more than a year's typical gains. — [NWEA blog](https://www.nwea.org/blog/?p=26464)
  - Summer programs in 8 districts closed only about 2–3% of math losses, with about 13% participation. — [FutureEd](https://www.future-ed.org/research-news-summer-learnings-impact-on-academic-recovery/)
  - Caution: Workman, von Hippel & Merry (2023) found many summer-learning findings "did not generalize beyond a single test." — [Sociological Science supplement](https://sociologicalscience.com/download/vol_10/march/supplemental_materials/SocSci_v10_251to285_supp.pdf)
- Duolingo said Q2 2026 "bookings seasonality was within our expectations" and gave no further detail. — [Duolingo Q2 2026 letter](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm)
- BC PAC gaming grants are paid in September, no later than Sept 30. — [BCCPAC](https://bccpac.bc.ca/resources/advocacy/gaming-guide/)

### Inferences
- **Annual plan timing:**
  - Push annual plans in **mid-August to September** (back-to-school, which also matches school-year budgeting).
  - A second push around **report-card or progress-report moments** captures parents reacting to grades.
  - A "**Summer Math Bridge**" offer from June to August targets math specifically, where the slide evidence is strongest. Offer a 3-month summer pass or a discounted annual plan that starts in June.
- **School-year-aligned SKUs:** a September-to-June "school year pass" could compete with a 12-month annual plan. It is an alternative to discounting.
- **Lifecycle design:** because education users convert late, the free layer should collect a parent email (with consent) and run lifecycle messaging around school-calendar triggers. Off-app email is allowed under Apple 3.1.3 even in Canada.

### Gaps
- Provincial report-card calendars were not verified in this research. Ontario's typical schedule is believed to be a fall progress report (Nov), a Term 1 report card (Feb) and a final report card (June). BC's K–9 Student Reporting Policy is believed to require five communications of learning per year. Both are unverified and need confirmation.
- No Canadian-specific seasonality data for education app downloads or revenue was found. All the data is US.
- No published conversion uplift figures for back-to-school or summer campaigns in kids' apps were found.

---

## 5. B2B2C routes: schools, districts, PACs, libraries; BC procurement and FIPPA; teacher-led adoption (Prodigy, Epic, ClassDojo)

### Takeaway
The proven Canadian and US playbook is "free for teachers, paid for parents":
- Prodigy funds itself through parent memberships with no ads.
- ClassDojo Plus reached profitability within about 4 months of its 2019 launch.
- Epic is free during the school day and paid at home.

The model drives low-CAC parent acquisition but carries the reputational risk shown by the 2021 Prodigy FTC complaint.

Selling directly to BC districts is possible since 2021. The data-residency ban is gone, but a PIA, and for sensitive data stored outside Canada a "Supplemental Review," are required. Canadian hosting makes this materially easier.

PAC gaming grants (C$20/student) **cannot** be spent on curriculum-related items, so PACs are a promotional channel rather than a paying customer. Libraries do license learning and tutoring services (Brainfuse at Toronto, Calgary, Regina and Markham), which makes them a plausible secondary B2B channel.

### Cited Findings

**Teacher-led, parent-paid models**
- **Prodigy:**
  - It "drives revenue through optional parent memberships," has no third-party ads, and does not sell student data. — [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/prodigy/649186947820)
  - A 2022 company interview said base parent features are free, while the paid tier adds progress tracking, goal setting, grade-level adjustment and worksheets. — [Prodigy blog interview](https://www.prodigygame.com/blog/alex-rohan-interview)
  - In 2021 the company said the majority of users are on free. — [Axios](https://www.axios.com/2021/02/19/prodigy-math-game-ftc-complaint)
  - Series B in Jan 2021 was reported as US$125M by CB Insights and C$159M by the University of Waterloo. — [CB Insights](https://www.cbinsights.com/company/prodigy-education/financials); [UWaterloo](https://uwaterloo.ca/news/node/3586)
- **ClassDojo:**
  - It became profitable within four months of launching its first paid product (2019). COVID helped triple revenue in 2020, with "hundreds of thousands of paying subscribers." — [TechCrunch, Jan 2021](https://techcrunch.com/2021/01/26/classdojos-second-act-comes-with-first-profits/)
  - Store revenue estimate for Aug 2023 was about $7.8M net. — [Appfigures](https://appfigures.com/resources/insights/20230908?f=5)
- **Epic:**
  - Free for educators and students during the school day. Epic School Plus, quote-based, adds 24/7 access, an admin portal and SSO.
  - The previously free teacher-invited home access is gone, so parents must pay for home use.
  - Source: [HomeschoolFox](https://homeschoolfox.com/curriculum/epic)

**BC public-sector privacy (FIPPA) and districts**
- Bill 22 (effective Nov 2021) repealed FIPPA s. 30.1, which required personal information to be stored in and accessed only from Canada. Disclosure outside Canada is now governed by s. 33.1 and its regulations. A PIA is required (s. 69), and for **sensitive** personal information stored outside Canada, additional assessment applies. — [UBC Privacy Matters](https://privacymatters.ubc.ca/resources/bill22); [Clark Wilson](https://www.cwilson.com/changes-to-privacy-law-fippa-data-residency-rules-and-privacy-impact-assessments/)
- District practice:
  - Several districts (e.g., SD68, Delta, Chilliwack) require a "Supplemental Review" when personal information will be stored outside Canada.
  - Surrey bars staff from entering a binding commitment until that review is approved by the Head. — [Surrey Schools procedure 5700.2](https://www.surreyschools.ca/procedure-5700-2-privacy-impact-assessments); [SD68 AP 534](https://www.sd68.bc.ca/wp-content/uploads/AP-534-Privacy-Impact-Assessments.pdf)
- UBC guidance: a PIA is required for all initiatives involving personal information, plus a risk-benefit analysis for storing sensitive information outside Canada. — [UBC LDDI](https://lddi.educ.ubc.ca/student-privacy-fippa/)

**PACs**
- BC Community Gaming Grants pay PACs **$20 per student per year** (minimum $2,000 for under 100 students) and DPACs $2,500. Applications run Apr 1–Jun 30, payment comes in September, and over 90% of applicants are funded. — [Gov. of BC](https://www2.gov.bc.ca/gov/content/sports-culture/gambling-fundraising/gaming-grants/pac-dpac-grants); [BCCPAC](https://bccpac.bc.ca/resources/advocacy/gaming-guide/)
- **Prohibited uses (2023 guide):**
  - Grant funds "may not be used to pay for goods or services used primarily by teachers in the classroom to deliver curriculum or by students to complete British Columbia K-12 curriculum requirements."
  - Ineligible items include "curricular activities or purposes (e.g. instructional materials, textbooks, etc.)" and "curriculum-related books for the library."
  - Eligible items include "student computers for extracurricular activities/clubs (e.g. software…)" and family engagement events.
  - Source: [BC Gaming Grants PAC Guide (archived 2023)](https://www2.gov.bc.ca/assets/gov/sports-recreation-arts-and-culture/gambling/grants/archived-2023-guide-pac.pdf). The archived guide applied to applications received before Apr 1, 2024. A Mar 2026 BCCPAC deck still lists $20/student.

**Libraries and public alternatives**
- Toronto Public Library offers Brainfuse K–12 homework help with a library card, plus a "Leading to Reading" 1:1 tutoring program for grades 1–6. — [TPL Brainfuse](https://tpl.ca/brainfuse/); [TPL kids resources](https://tpl.ca/resources/kids/)
- Calgary Public Library offers Brainfuse aligned to the Alberta curriculum (Gr 2–12), plus Solaro (Gr 3–12). — [Calgary Public Library](https://www.calgarylibrary.ca/library-news/8-resources-to-help-students-learn-from-home)
- Regina and Markham public libraries also offer Brainfuse. — [Regina PL](https://reginalibrary.ca/digitalservices/brainfuse); [Markham PL](https://markhampubliclibrary.ca/news/test-markham-public-library-launches-brainfuse-a-new-online-tutorial-service/)
- **TVO Mathify** (Ontario) gives free 1:1 online math tutoring by Ontario Certified Teachers to students in publicly funded English-language schools. It expanded to Grades 4–5, with grade-range reports varying from 4–11 to 4–12. — [TVO](https://tvo.me/?p=5083); [DCDSB](https://www.dcdsb.ca/news/posts/free-online-math-tutoring-with-tvo-mathify/)

### Inferences
- **Teacher-free, parent-paid funnel:**
  - This is the strongest low-CAC route for a parent-facing curriculum app.
  - Teachers assign or recommend it, and parents upgrade for home features such as reports, extra practice, printable worksheets and goal setting, mirroring Prodigy's paid features.
  - To avoid Prodigy's controversy, paid perks must not create in-class advantages. The 2021 complaint specifically criticized membership benefits carrying into classroom play.
- **District sales in BC:** host in Canada, pre-complete a FIPPA-ready PIA package, minimize the student personal information collected (ideally teacher-rostered pseudonymous accounts), and avoid "sensitive" data. This shortens the Supplemental Review path. Expect slow cycles. School-wide licences, as ClassDojo does, are a middle ground that funds Plus for every parent in a building.
- **PACs:** cannot use gaming money for curriculum tools. Position PACs as distribution through parent-night demos and newsletters, or as buyers using their own non-gaming fundraised money. That second use is not addressed in the guide and should be confirmed with the Branch.
- **Free provincial alternatives** (TVO Mathify, library Brainfuse, Khan Academy Kids) set a free baseline for tutoring and practice. A paid product must differentiate on curriculum-specific structured progression and parent reporting, not on "access to help."

### Gaps
- No BC Ministry of Education or provincial edtech procurement framework was found (for example, a provincial vendor of record for K–12 digital resources). No Ontario, Alberta or Quebec equivalents were found either.
- No disclosed contract values for Canadian district edtech licences were found.
- No data was found on Prodigy's teacher-to-parent conversion rate.
- Whether PACs may spend non-gaming funds on curriculum software is not addressed in the sources found.
- The status of the 2021 FTC investigation into Prodigy is unknown. Fairplay's 2021 annual report says the FTC was investigating, and no outcome was found.

---

## 6. Other routes: live tutoring upsell, printable workbooks, grants and tax credits, sponsorships, employer benefits

### Takeaway
A live-tutoring upsell is the highest-ARPU adjacent route:
- Nerdy/Varsity Tutors earns about US$350–375 per active member per month (≈C$480–510), with Learning Memberships at 80–89% of revenue.
- Nerdy lost $60.9M on $179M revenue in 2025, so tutoring is operationally heavy, and Ontario's TVO Mathify offers free 1:1 math tutoring.

Non-dilutive funding exists in BC: the Interactive Digital Media Tax Credit is 25% on eligible BC labour from Sept 2025 and reportedly covers educational software. The Canada Media Fund's Experimental Stream has funded educational interactive projects, though the data found is old and the funding is repayable.

Employer-benefit tutoring (Bright Horizons, Care.com) exists in the US, with no Canadian evidence found. Ontario's 2022–23 Catch Up Payments (C$200–250 per child, over C$1B total) show governments will put money in parents' hands for learning support.

### Cited Findings

**Live tutoring (Nerdy / Varsity Tutors)**
- FY2025 revenue was $179.0M (vs $190.2M in 2024), with a net loss of $60.9M. — [Nerdy 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1819404/000181940426000015/nrdy-20251231.htm)
- Learning Membership revenue by quarter in 2025:

| Quarter | Revenue | Share of total |
|---|---|---|
| Q1 | $37.9M | 80% |
| Q2 | $37.8M | 84% |
| Q3 | $33.0M | 89% |
| Q4 | $41.6M | 85% |

- ARPM was $335 (Q1), $348 (Q2), $374 (Q3) and $364 (Q4 2025, +21% YoY). Active members were 40.5K, 30.6K, 34.3K and 33.2K. — [Nerdy Q4 2025 release](https://www.businesswire.com/news/home/20260226513294/en); [Nerdy Q1 2025 release](https://www.businesswire.com/news/home/20250508094984/en)
  - My arithmetic: Q1 $37.9M ÷ 3 months ÷ 40.5K members ≈ $312/month. This is consistent with ARPM being a monthly per-member figure.
- ARPM growth was attributed to a shift to higher-frequency memberships and price increases for new consumer customers in Q1 2025. — [Nerdy Q1 2025 release](https://www.businesswire.com/news/home/20250508094984/en)

**Government and parent subsidies**
- Ontario Catch Up Payments paid $200 per child (K–12) or $250 for students with special education needs, for tutoring, supplies or equipment. Applications closed Mar 31, 2023. — [Ontario.ca](https://ontario.ca/page/catch-up-payments); [CTV News](https://toronto.ctvnews.ca/ontario-to-give-parents-up-to-250-per-child-as-part-of-plan-to-mitigate-learning-loss-1.6117579). CTV reported the payments to parents exceeded $1B over two years. — [CTV News](https://toronto.ctvnews.ca/ontario-gave-parents-more-than-1b-in-cash-over-2-years-here-s-where-the-money-went-1.6909148)

**Grants and tax credits**
- **BC IDMTC:** 25% for wages incurred after Aug 31, 2025 (previously 17.5%). Budget 2025 proposed making it permanent. — [Gov. of BC IDMTC](https://www2.gov.bc.ca/gov/content/taxes/income-taxes/corporate/credits/interactive-digital-media); [DigiBC, Mar 2025](https://digibc.org/2025/03/04/province-of-b-c-renews-the-interactive-digital-media-tax-credit-at-25)
- **Canada Media Fund Experimental Stream:** has funded educational interactive projects, e.g., Bot Colony in the 2010 round. Funding levels and terms come from older sources: up to 75% of costs, with caps from $15K for conceptualization to $1.5M for production and marketing. It is generally repayable from revenues. — [Mentor Works](https://mentorworks.ca/?p=36405); [Kidscreen](https://kidscreen.com/?p=1999)

**Employer benefits (US evidence only)**
- Bright Horizons back-up care can be exchanged for virtual tutoring, e.g., one use = 4 hours of tutoring for children aged 5–18 at Aon's PDS plan. CU Boulder charges a $15 copay per 4-hour block. Providers include Varsity Tutors, Sylvan and Revolution Prep. — [Aon PDS](https://mybenefits.aon.com/PDShealth/Benefits/Tutoring-Support); [CU Boulder HR](https://www.colorado.edu/hr/newsletter/hr-news/bright-horizons-benefits); [UW HR](https://hr.uw.edu/worklife/child-care-and-caregiving/benefits/tutoring-and-at-home-learning)
- Care.com's CareBenefits includes K-12 tutoring. Its vendor claim is that 69% of employees would likely use employer-subsidized tutoring. — [Care.com](https://www.care.com/business/?p=10539)

**Printable workbooks**
- Prodigy's paid parent tier includes worksheets, which suggests printables work as a membership perk. — [Prodigy blog interview](https://www.prodigygame.com/blog/alex-rohan-interview)

### Inferences
- **Tutoring upsell:**
  - The ARPU gap (about US$360/month for tutoring vs about US$5/month for an app) makes a **marketplace or referral upsell to vetted Canadian tutors** attractive. Revenue would come from a referral fee or rev-share, without running a tutoring operation.
  - Nerdy's losses and TVO Mathify's free offer argue against building in-house tutoring early.
  - The app's diagnostic data ("your child is behind on Grade 4 fractions") is the natural trigger for a tutoring upsell.
- **Printable workbooks:** a low-cost perk that justifies a premium price. A physical "grade workbook + app" bundle sold on the web would avoid store fees. Pricing evidence was not found.
- **Grants and credits:** treat BC IDMTC, SR&ED and IRAP as cost offsets, not revenue. CMF funding may be repayable. Check current CMF programs.
- **Sponsorships:** brand sponsorship of child-facing content is constrained by Quebec CPA ss. 248–249 and parent-trust positioning. Parent-facing sponsorship (e.g., a bank sponsoring free school licences) is more defensible.
- **Employer benefits:** a plausible later-stage channel through Canadian benefits platforms or EAPs. There is no Canadian evidence yet.

### Gaps
- No evidence on printable or workbook revenue (e.g., Teachers Pay Teachers, Kumon workbooks) or bundle pricing was gathered.
- Current CMF program terms (2025–2026), SR&ED/IRAP eligibility for edtech, and Ontario OIDMTC were not researched.
- No Canadian employer-benefit tutoring or education programs were found, and Canadian benefit providers were not searched.
- No examples of sponsorship deals in Canadian kids' learning apps were found.
- No Canadian live-tutoring marketplace referral-fee benchmarks were found.

---

## 7. Ethical considerations: dark patterns aimed at kids, the Prodigy FTC complaint, parent-gated purchases, auto-renewal law

### Takeaway
Regulators and advocates are converging on banning manipulative design aimed at children:
- The 2021 FTC complaint against Prodigy was led by CCFC/Fairplay and 21 other groups.
- The Epic Games settlements total US$520M.
- The OPC consultation supported prohibiting deceptive design.
- New provincial subscription rules: BC Bill 4 (in force Aug 1, 2026) and Quebec Bill 10 (in force Sept 12, 2026).

A premium, trust-based parent product should sell only to parents behind a parental gate. It should never use child-facing upsell prompts or in-class advantages for paying users, and it should make cancellation and trial-end notices explicit. This is both an ethical stance and a differentiator against Prodigy-style models.

### Cited Findings
- **Prodigy complaint (Feb 19, 2021):**
  - Filed by the Campaign for a Commercial-Free Childhood (now Fairplay) and 21 organizations.
  - Alleged that Prodigy claims to be "free" while marketing memberships to children, and that kids at home see more ads and persuasive design pushing membership.
  - Alleged that children are repeatedly teased with membership-only rewards and that membership perks carry into classroom play, worsening inequality.
  - Alleged that learning claims were unsubstantiated.
  - Sources: [Fairplay](https://fairplayforkids.org/feb-19-2021-advocates-to-ftc-prodigy-math-game-preys-on-kids-and-families/); [EdWeek](https://www.edweek.org/technology/popular-interactive-math-game-prodigy-is-target-of-complaint-to-federal-trade-commission/2021/02)
  - Prodigy "vehemently" disputed the allegations. — [Axios](https://www.axios.com/2021/02/19/prodigy-math-game-ftc-complaint)
  - Fairplay reported that the FTC was investigating and some schools removed Prodigy from approved lists. — [Fairplay 2021 annual report](https://fairplayforkids.org/wp-content/uploads/2021/10/2021-Annual-report.pdf)
- **Radesky et al. (2022):**
  - About 80% of apps used by 3–5-year-olds had manipulative features, including parasocial pressure from characters, fabricated time pressure, navigation roadblocks and purchase lures. One example: "Just ask your parents" prompts. — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9206186/)
- **Epic Games / FTC:**
  - $245M in redress for dark patterns that caused unintended purchases, including letting children buy without parental consent. Plus $275M in COPPA penalties.
  - The order bars dark patterns and charging without affirmative consent, and requires cancellation to be as easy as purchase.
  - Sources: [FTC](https://www.ftc.gov/node/80648); [Venable](https://www.venable.com/insights/blogs/2022/12/ready-aim-fire-ftc-scores-recordbreaking-520-milli)
- **Apple:** Kids Category apps may present purchases only "behind a parental gate." — [Apple Guidelines 1.3](https://developer.apple.com/app-store/review/guidelines/)
- **Google:** Teacher Approved reviewers score in-app purchases and cross-promotion. — [Play Console: Teacher Approved](https://play.google.com/console/about/programs/teacherapproved)
- **OPC consultation:** respondents supported prohibiting deceptive design, active and explicit consent "not obtained through deceptive design," and best-interests-of-the-child assessments. — [OPC What We Heard](https://www.priv.gc.ca/en/about-the-opc/what-we-do/consultations/completed-consultations/consultation-children-code/report_children-code_2026/)
- **BC Bill 4** (Business Practices and Consumer Protection Act amendments; largely in force Aug 1, 2026):
  - Terms over 60 days: auto-renewal clauses are void unless the consumer can cancel at any time without penalty and gets a refund for renewals made within 15 days. The consumer must also get notice 30–60 days before renewal.
  - Terms under 60 days: the consumer must be able to cancel at any time.
  - Suppliers cannot unilaterally reduce cancellation or refund rights.
  - Source: [Torys, Jul 2026](https://www.torys.com/en/our-latest-thinking/publications/2026/07/provincial-governments-continue-to-tighten-consumer-protection-laws)
- **Quebec Bill 10** (CPA amendments; in force Sept 12, 2026, with exceptions): clear notice when a trial period ends, an "easily identifiable" cancellation mechanism for online subscriptions, and clearer disclosure of non-recurring fees. — [Torys, Jul 2026](https://www.torys.com/en/our-latest-thinking/publications/2026/07/provincial-governments-continue-to-tighten-consumer-protection-laws)
- **Ontario Consumer Protection Act, 2023:**
  - Received royal assent Dec 6, 2023 but is not yet in force, pending proclamation and regulations.
  - It will require affirmative consent to renewals, a continuing right to cancel auto-renewing contracts, and a ban on unnecessary cancellation barriers.
  - Penalties rise to $500K for corporations.
  - Sources: [Torys, Nov 2023](https://www.torys.com/our-latest-thinking/publications/2023/11/ontarios-new-consumer-protection-act); [Churnkey guide](https://churnkey.co/guides/ontario-consumer-protection-act); [Torys, Jul 2026](https://www.torys.com/en/our-latest-thinking/publications/2026/07/provincial-governments-continue-to-tighten-consumer-protection-laws)

### Inferences
- **Design principles (inference):**
  1. All commerce happens in a **parent area** behind a parental gate. Children never see prices, locked-reward teasers or "ask your parents" prompts.
  2. No pay-to-win: paid features are parent tools (reports, extra practice, printables, multi-child), not in-class status items.
  3. Send explicit trial-end reminders, which Quebec Bill 10 now requires. Offer one-click cancellation and send renewal notices 30–60 days ahead for annual plans. This is required for web billing under BC Bill 4, and is best practice in-app.
  4. Back marketing claims about learning gains with evidence. The Prodigy complaint cited unsubstantiated learning claims.
- **Market positioning:** these principles are a credible premium differentiator ("no ads, no data selling, no nagging your kids"). They support charging above the US$60 cluster instead of competing on price.
- **Billing responsibility:** for web subscriptions the founder is the merchant and is directly bound by BC, Quebec and (future) Ontario rules. For in-app purchases, the stores handle billing and cancellation, though the developer may still be bound by advertising and representation rules. This is an inference; confirm with counsel.

### Gaps
- No public FTC outcome on the Prodigy complaint was found.
- No Canadian (Competition Bureau or provincial) enforcement against kids' education app monetization was found.
- How BC Bill 4 and Quebec Bill 10 apply to App Store and Google Play subscriptions, where the store is merchant of record, was not determined.

---

## 8. Synthesis: which monetization scheme fits a premium Canadian parent-facing curriculum app?

### Takeaway
The evidence points to a **parent-paid subscription led by annual and family plans, sold behind a parental gate, with a generous free entry layer**. The free layer should be a teacher/classroom version plus a limited parent diagnostic, and the paid plan should be offered with a 14–30 day trial. Price it above the US$60 kids-app cluster, at roughly C$100–150/yr per family (an inference), justified by curriculum alignment and parent reporting.

Secondary revenue options:
- School-wide licences, with Canadian hosting and a FIPPA PIA package.
- A live-tutor referral upsell.
- A summer math pass.
- Possibly a one-time grade pack.

Ads should be excluded.

### Cited Findings
- Education commands the **highest median annual price** of any category ($44.99) and sells mostly annual plans (59–66%). — [RevenueCat 2026 Education](https://www.revenuecat.com/state-of-subscription-apps-2026-education)
- Hard paywalls convert about 5× better than freemium (10.7% vs 2.1%) with similar retention. — [RevenueCat blog](https://www.revenuecat.com/blog/growth/hard-paywall-vs-freemium); [Airbridge](https://www.airbridge.io/en/blog/hard-paywall-vs-freemium-2026)
- Trial users have a +50.4% LTV premium in Education. — [Adapty](https://adapty.io/blog/markdown/education-app-subscription-benchmarks.md)
- 17–32 day trials show the strongest conversion and renewal. — [i-programmer](https://www.i-programmer.info/news/83-mobilephone/17938-making-money-from-subscription-apps.html); [SaaStr](https://saastr.com/what-17000-subscription-apps-tell-us-about-free-trial-length-annual-plans-convert-86-better-with-30-day-trials-monthly-tops-out-at-two-weeks-and-ai-apps-hit-a-wall-at-16-days)
- Kids competitors cluster at about $60/yr (HOMER, ABCmouse, ClassDojo Plus, Lingokids, Prodigy Core). Per-subject, per-child tools go higher: IXL core is $159/yr plus $40 per extra child. — see the Section 2 table for sources.
- Teacher-free, parent-paid models have worked: ClassDojo was profitable in 4 months, and Prodigy is membership-funded with no ads. — [TechCrunch](https://techcrunch.com/2021/01/26/classdojos-second-act-comes-with-first-profits/); [Google Workspace listing](https://workspace.google.com/marketplace/app/prodigy/649186947820)
- Ads are a minor revenue line even at Duolingo scale (about 7%). — [Duolingo Q2 2026](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm)
- Ads also face Quebec CPA, OPC, Law 25 and Apple Kids Category barriers. — see Section 1.

### Inferences
- **Ranking of monetization routes (inference, for a premium, not-cheapest positioning):**
  1. **Annual family subscription** (trial-gated, parent-gated). This is the core revenue and best fits the benchmarks.
  2. **Teacher-free, parent-paid funnel** as the acquisition engine. Avoid Prodigy-style child-facing upsells.
  3. **School or district licences** (Canadian-hosted, FIPPA-ready) as secondary B2B revenue and credibility. Expect long sales cycles.
  4. **Tutoring referral upsell** triggered by diagnostic gaps. High ARPU, but keep it asset-light.
  5. **Seasonal SKUs**: summer math pass and school-year pass. These are timing tools, not discounts.
  6. **One-time grade pack** as an option for subscription-averse parents (Adapty shows one-time at 17% of Education revenue).
  7. **Not recommended:** ads, child-directed sponsorship, and pure one-time pricing as the main model.
- **Avoiding a race to the bottom:**
  - Lead with a family annual price in CAD with clear Canadian curriculum mapping (e.g., BC and Ontario outcomes).
  - Show parent-visible progress reports tied to report-card language.
  - Offer a no-ads, no-data-selling, no-nagging guarantee.
  - Use Canadian data hosting.
  - Let the free classroom version, rather than discounting, carry acquisition.
  - Adapty's data shows education apps discount the most (14.3%), and Canada is already priced at 0.7× the US in education, so differentiation must come from value rather than price cuts.

### Gaps
- No direct evidence on Canadian parents' willingness to pay for curriculum-aligned apps (e.g., a Van Westendorp survey or conversion tests) was found. The founder should test price points (e.g., C$79 / C$119 / C$149 per year) through paywall experiments.
- No public benchmarks were found for teacher-to-parent conversion rates in free-for-teacher models.
- Not verified: Canadian App Store price tiers (CAD equivalents of USD tiers), and whether store prices include GST/HST/QST in Canada.
