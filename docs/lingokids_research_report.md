# Lingokids Deep Research Report

Research date: 2026-04-30  
Subject: Lingokids, the kids education and entertainment app by Monkimun Inc. / Monkimun Labs S.L.

## Executive Summary

Lingokids is a child-focused education and entertainment platform for children roughly ages 2 to 8. It began as a language-learning product and has expanded into a broader "Playlearning" universe that mixes interactive games, songs, videos, lessons, podcasts, audiobooks, movement activities, and branded character experiences. The current positioning is no longer just "learn English"; it is a safe, ad-free, curriculum-backed interactive entertainment hub for early childhood learning.

The public product claims are large: Lingokids says it has surpassed 185 million downloads, operates in 190+ countries, reaches about 10 million monthly active users in its Help Center, and, in a March 2026 press release, cites Fast Company describing more than 20 million monthly users. The discrepancy likely reflects different user definitions, platforms, or reporting contexts, so use the range carefully.

The strongest technical signals come from Lingokids' own engineering and data job pages. Their published stack is:

- Backend: Ruby on Rails
- Mobile front end: React Native
- Games: Unity3D
- Data: Python and Scala
- QA automation: Jest
- Cloud: AWS
- ML/recommendations: Python, SQL, DBT, Databricks, AWS SageMaker/Lambda/ECS/Step Functions, with orchestration tools such as Airflow, Prefect, or Dagster mentioned as relevant experience

The likely architecture is a hybrid mobile app: a React Native shell for navigation, onboarding, subscriptions, parent area, profiles, media, and general UI; embedded Unity game modules for richer interactive learning; a Rails API for identity, child profiles, entitlements, content metadata, progress, recommendations, and parent reports; an AWS-hosted media/content pipeline; and a data/ML platform that drives personalization, experimentation, progress reporting, and recommendation ranking.

For anyone building a similar app, the hard parts are not only game production. The moat is the operating system around the content: educational taxonomy, level progression, recommendation logic, parental trust, offline playback, subscription entitlement, child privacy compliance, content QA, partnerships/IP licensing, analytics that are useful but child-safe, and a production process that can release new activities continuously.

## What Lingokids Does

### Core Product

Lingokids describes itself as a Playlearning platform for children aged 2 to 8. The app is intended to turn screen time into safe, interactive learning where children build academic and life skills through play. Its public Help Center says the app includes 4,000+ activities across games, songs, videos, lessons, and podcasts, in a 100% ad-free environment.

Sources:

- [What is Lingokids? - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/205124321-What-is-Lingokids)
- [Lingokids on Google Play](https://play.google.com/store/apps/details?hl=en_US&id=es.monkimun.lingokids)
- [Lingokids on the App Store](https://apps.apple.com/zm/app/lingokids-play-and-learn/id1002043426)

### Content Types

The product is organized around several forms of media and interactivity:

- Interactive games and toddler-friendly challenges
- Coloring, drawing, music, movement, and physical-activity content
- Songs and nursery rhymes
- Videos and animated series
- Books, audiobooks, podcasts, and eBooks
- Structured lessons
- Career exploration lessons
- Family Time activities
- Branded IP experiences with Disney, Blippi, Pocoyo, BBC Earth, NASA, Oxford University Press, and others

The Playlearning Sections page describes four major child-facing sections: Play, Theater, Lessons, and a family/co-play oriented area. The Play section recommends personalized interactive games; Theater is a curated video library with offline access; Lessons provide structured paths; Family Time supports shared activities.

Source:

- [Playlearning Sections - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/23532720590610-Playlearning-Sections)

### Subjects and Skill Areas

Lingokids has moved beyond language learning into a broad early-learning curriculum:

- Reading and literacy
- Phonics, vocabulary, writing, listening, speaking
- Math, counting, shapes, addition, subtraction
- Science, space, biology, weather, animals
- Engineering, technology, coding, robotics, sequencing
- Music, art, creativity
- Physical activity, yoga, stretching, dance
- Social-emotional learning: empathy, emotions, mindfulness, expression
- Practical life skills: chores, money, routines, healthy habits
- Citizenship, community, kindness, environmental awareness
- Career exploration

The educator Help Center page says Lingokids can be used in classrooms and that its lessons align with US Common Core State Standards and the CEFR framework.

Sources:

- [For educators - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/9541001909137-For-educators)
- [Lessons - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/18982608761106-Lessons)

### Parent-Facing Features

The parent side is important to the business model. Public app-store listings and Help Center pages describe:

- Parent area
- Progress reports
- Parent community
- Up to 4 child profiles
- Offline play
- Subscription management
- Progress and achievement tracking
- Child profiles with optional name/nickname, age, and learning focus
- Curriculum overviews and activity timeline in older public materials

Google Play also reveals a support response stating that the Basic version offers 10 regularly updated free games, while Lingokids Plus unlocks the broader catalog.

Sources:

- [Parents Area - Lingokids Help Center](https://help.lingokids.com/hc/en-us/sections/9519165895057-Parents-Area)
- [Lingokids on Google Play](https://play.google.com/store/apps/details?hl=en_US&id=es.monkimun.lingokids)
- [2021 Series C press release](https://lingokids.com/press/lingokids-raises-40-million-for-its-early-learning-platform)

## How Lingokids Does It

### Learning Model: Playlearning

Lingokids' central concept is "Playlearning": children learn through play, repetition, discovery, and curiosity rather than traditional instruction. The methodology page says activities are designed by an Education team and board, grounded in learning science, and mapped to an 8-pillar framework:

1. Whole child development
2. Engineered motivation
3. Personalized and adaptive learning
4. Guided stretch
5. Balanced structure and critical thinking
6. Assessment for progress, not pressure
7. Real-life application
8. Social and family integration

This is a useful product principle: the app does not only ask "what content should a kid consume?" It asks "what sequence, level, reward, character, activity type, and family context will keep the child engaged while producing measurable progress?"

Sources:

- [Lingokids Methodology and Curriculum](https://help.lingokids.com/hc/en-us/articles/208259345-Lingokids-Methodology-and-Curriculum)
- [For educators - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/9541001909137-For-educators)

### Structured Lessons and Assessment

Lessons appear to be the more curriculum-like layer inside the broader exploratory product. Lingokids says lessons guide children from a starting assessment to a final one, cover specific skills, progress from simple to complex, and are designed to be self-paced over 1-2 weeks. The company claims 90% of children who complete a lesson show measurable skill improvement.

This implies a learning-objective model behind the app:

- Each activity maps to one or more skills or objectives.
- Lessons are ordered sequences of activities.
- The system records attempts, completions, progress, and assessment outcomes.
- Parent reports summarize progress without making the child experience feel like formal testing.

Source:

- [Lessons - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/18982608761106-Lessons)

### Personalization

Lingokids publicly describes personalization in several ways:

- A personalized suggestion algorithm serves content based on age and developmental stage.
- Content is grouped into beginner, intermediate, and advanced levels.
- As children progress, difficulty gradually increases.
- Activities are suggested to practice words and concepts not yet learned.
- Play sections include personalized selections based on age and abilities.

The more technical job page for a Data Scientist in Applied ML and Recommendations confirms that Lingokids has production recommendation infrastructure serving personalized content to millions of users. It mentions advanced recommendation work such as deep learning models, contextual bandits, session-based recommendations, graph-based methods, content graphs, and learning-to-rank.

Sources:

- [How do I know what my child's level is? - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/360019924937-How-do-I-know-what-my-child-s-level-is)
- [Data Scientist, Applied ML and Recommendations - Lingokids Jobs](https://jobs.lingokids.com/jobs/7524881-data-scientist-applied-ml-recommendations)

### Content Strategy and Partnerships

Lingokids combines original characters and content with trusted external brands. Public partner pages list educational/institutional partners such as NASA, WWF, Oxford University Press, Stanford Scientists, World Literacy Foundation, and Jamf; entertainment partners include Disney, Moonbug/Blippi, Animaj/Pocoyo, BBC Earth, and American Airlines.

This is strategically important. For kids, known characters increase motivation and reduce discovery friction. For parents, institutions like Oxford University Press or NASA increase trust. For the business, licensed IP makes the app feel current and premium, but it also introduces cost, dependency, approval workflows, content restrictions, and brand-safety review.

Sources:

- [Want to partner with Lingokids? - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/9540952610833-Want-to-partner-with-Lingokids)
- [Disney content within Lingokids - Help Center](https://help.lingokids.com/hc/en-us/articles/30847746913170-Disney-content-within-Lingokids)
- [Blippi Content within Lingokids app](https://help.lingokids.com/hc/en-us/articles/23094911287442-Blippi-Content-within-Lingokids-app)

### Business Model

The product is freemium/subscription:

- Free download on app stores
- In-app purchases/subscriptions
- Lingokids Plus unlocks unlimited access, progress reports, more profiles, offline access, and full content
- Basic/free access appears limited
- Payments are handled via app-store providers or website payment providers
- Merchandising and offline products have been explored through the Ravensburger relationship and Lingokids store
- Media distribution extends beyond the app, including YouTube/YouTube Kids, podcasts, Apple TV, and in-flight entertainment

The 2021 Series C press release said Lingokids had raised $40M in that round, $65M to date at that time, and reached EBITDA positive in 2020. It also said funding would support international expansion, content, and engineering/development hiring.

Sources:

- [2021 Series C press release](https://lingokids.com/press/lingokids-raises-40-million-for-its-early-learning-platform)
- [Lingokids on Google Play](https://play.google.com/store/apps/details?hl=en_US&id=es.monkimun.lingokids)
- [Lingokids on the App Store](https://apps.apple.com/zm/app/lingokids-play-and-learn/id1002043426)

## Confirmed Technology Stack

Lingokids' engineering careers page explicitly lists:

- Backend: Ruby on Rails
- Mobile front end: React Native
- Unity Engineer / Gaming: Unity3D
- Data: Python and Scala
- QA: manual and automation testing, Jest
- Cloud service: AWS

It also describes the engineering team working on:

- An API that delivers personalized learning tailored to each child
- A user-friendly mobile app
- Data platform support for analytics and user engagement insights
- Unity games as a critical part of Playlearning

Source:

- [Engineering - Lingokids Jobs](https://jobs.lingokids.com/departments/engineering)

The Data Scientist / ML Engineering job page adds:

- Production recommendation infrastructure
- Low-latency/scalable serving goals
- DBT and Databricks
- SQL
- Python ML infrastructure
- AWS SageMaker, Lambda, ECS, Step Functions
- Batch ML training and evaluation pipelines
- Model monitoring, retraining, drift detection
- CI/CD
- Possible orchestration with Airflow, Prefect, or Dagster
- Future interest in real-time or low-latency serving with Redis, DynamoDB, or equivalent
- Experimentation frameworks and A/B tests

Source:

- [Data Scientist, Applied ML and Recommendations - Lingokids Jobs](https://jobs.lingokids.com/jobs/7524881-data-scientist-applied-ml-recommendations)

## Likely Architecture

This section is inferred from the public stack and product behavior. Lingokids has not published a complete system architecture diagram.

### Client Architecture

Likely client layers:

1. React Native app shell
   - Onboarding
   - Parent login
   - Child profile setup and switching
   - Parent area
   - Progress reports
   - Subscription screens
   - Main navigation
   - Content catalog browsing
   - Video/audio players
   - Offline downloads
   - Experiment flags and remote config

2. Unity activity runtime
   - Mini-games
   - Interactive lessons
   - Drag/drop puzzles
   - Sequencing/coding activities
   - Character-based activities
   - Local scoring and telemetry events

3. Native/mobile integrations
   - App-store subscriptions
   - Push notifications for adults
   - Local storage/cache
   - Optional microphone/camera/speech permissions
   - Device and crash diagnostics
   - Parental gates

The key architectural challenge is likely bridging React Native and Unity cleanly: launching activities, passing profile/session/content IDs, collecting results, handling downloads, managing memory on low-end tablets, and making the app feel seamless to a 3-year-old.

### Backend Architecture

Confirmed backend technology is Ruby on Rails. A likely backend domain model includes:

- Adult accounts
- Child profiles
- Subscription entitlements
- Content catalog metadata
- Activity/lesson taxonomy
- Learning objectives
- Partner/IP metadata
- Progress events
- Completion events
- Assessment results
- Favorites/recent activities
- Offline asset manifests
- Recommendation feeds
- Parent reports
- Support/billing hooks

Rails is a sensible choice here because Lingokids has a content-heavy, subscription-heavy product with many admin workflows. A Rails API plus admin/CMS tooling can support editorial operations, curriculum tagging, entitlement rules, and parent reporting without excessive custom platform work.

### Content and Asset Pipeline

The content pipeline is probably one of the most important internal systems. A Lingokids-like product needs:

- Content management for games, videos, songs, books, lessons, and podcasts
- Educational metadata: subject, skill, age range, level, objective, difficulty
- Localization metadata
- Partner approvals and rights windows
- Asset processing for video, audio, thumbnails, Unity bundles, captions, and images
- CDN publishing
- Offline-download manifests
- Versioning so old app builds can still access compatible content
- QA states: draft, review, approved, live, retired
- A/B and rollout controls

Given the weekly/frequent content-update positioning in older job pages and the large catalog, this production workflow is likely a major competitive advantage.

### Data Platform and Recommendation Architecture

Based on Lingokids' ML role, the recommender is currently or historically batch-oriented, with future interest in real-time/session-level adaptation. A plausible flow:

1. Mobile clients emit privacy-scoped events:
   - content impressions
   - starts
   - completions
   - duration
   - retries
   - difficulty outcomes
   - favorites/revisits
   - lesson milestones
   - subscription and parent-side events, separated from child events

2. Events land in an AWS data lake / warehouse pipeline.

3. DBT and Databricks transform raw events into:
   - child progress facts
   - content engagement features
   - cohort tables
   - learning objective mastery estimates
   - recommendation candidates
   - experiment metrics

4. Batch ML jobs train/rank:
   - age/development-level recommendations
   - next best activity
   - lesson suggestions
   - content diversity constraints
   - partner/brand insertion constraints
   - difficulty progression

5. A serving layer exposes precomputed recommendations to the Rails API or directly to clients.

6. Parent reports summarize progress and achievements, possibly with AI-generated narrative reports where permitted by privacy policy and product constraints.

The job page explicitly mentions monitoring model health, drift detection, retraining strategy, caching, serving-layer optimization, and A/B testing. Those are good indicators of a mature recommendation system rather than a static rule-based feed.

### Privacy and Safety Architecture

Lingokids' privacy policy is unusually instructive for architecture. It says:

- Parents create accounts and set up children.
- The app is a closed ecosystem, not designed for children to access the wider internet or share personal information beyond the parent.
- No ads are displayed in the services.
- Child and adult data are treated differently.
- Child event streams use COPPA-compliant configuration.
- Child and adult data are held in separate projects.
- Payment cards are not directly collected/stored by Lingokids for app payments.
- Optional microphone/camera/speech recognition permissions do not transmit images, videos, or speech data to Lingokids or third parties, according to the policy.
- Session tokens use HTTPOnly and Secure flags with short expiry and rotation.
- Child Profile IDs are pseudonymous in analytics systems.

For builders, this means privacy is not a legal document bolted on at the end. It drives system boundaries:

- Separate adult and child analytics projects.
- Avoid advertising SDKs in child-directed surfaces.
- Minimize persistent identifiers.
- Keep child IDs pseudonymous.
- Keep parental controls and data deletion flows real.
- Design for consent, auditability, and data retention from day one.

Source:

- [Lingokids Privacy Policy](https://lingokids.com/privacy-policy)

## Compliance Context for Building a Similar App

This is not legal advice, but these constraints are fundamental.

### COPPA

In the United States, the FTC's COPPA guidance applies to operators of commercial websites and online services, including mobile apps, directed to children under 13 that collect personal information. Covered operators generally need a clear privacy policy, direct notice to parents, and verifiable parental consent before collecting personal information from children.

Source:

- [FTC: Children's Online Privacy Protection Rule - Not Just for Kids' Sites](https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-not-just-kids-sites)

### Apple Kids Category

Apple says Kids Category apps should be age-appropriate, protect children's data, and use parental gates for certain actions. Apple's review guidelines also restrict third-party analytics and advertising in apps for kids; limited analytics may be allowed only if it does not collect or transmit sensitive child/device identifiers.

Sources:

- [Apple: Design safe and age-appropriate experiences](https://developer.apple.com/kids/)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Google Play Families

Google's Families policies require accurate target-audience and data-safety declarations, compliance with children's privacy laws such as COPPA and GDPR, and child-appropriate ads/monetization if ads are used. Lingokids avoids the ad problem by being ad-free.

Sources:

- [Google Play Families Policies](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en)
- [Google Play Console Families Program](https://play.google.com/console/about/programs/families/)

## Product Lessons for Building a Lingokids-Like App

### 1. Start with a Learning Taxonomy, Not Just Games

A catalog of games is not enough. You need a structured taxonomy:

- Age band
- Difficulty
- Skill
- Learning objective
- Subject
- Modality: game, song, book, video, movement, assessment
- Required motor skill level
- Language level
- Time to complete
- Offline eligibility
- Parent-visible learning outcome

This taxonomy powers recommendations, parent reports, search, lesson sequencing, and curriculum credibility.

### 2. Build Two Products: Kid Mode and Parent Mode

Kid Mode must be:

- Visual
- Safe
- Fast
- Forgiving
- Low-text
- Offline-tolerant
- Rewarding without manipulative dark patterns
- Navigable by children who cannot read fluently

Parent Mode must be:

- Clear about value
- Subscription-aware
- Progress-oriented
- Trust-building
- Privacy-transparent
- Helpful without being overwhelming

The parent is the buyer and compliance authority; the child is the daily user. Both need excellent UX.

### 3. Use a Hybrid Game/App Architecture

A practical build stack for a similar app:

- React Native or native Swift/Kotlin for app shell
- Unity for highly interactive games
- Rails, Node, Django, or Go for backend APIs
- Postgres for core product data
- S3/CloudFront or equivalent CDN for assets
- RevenueCat or direct StoreKit/Google Play Billing for subscriptions
- A CMS/admin app for content operations
- Data warehouse/lakehouse for analytics
- Feature flag and experimentation platform
- Privacy-safe event pipeline

If starting small, avoid overbuilding ML. Begin with rule-based personalization by age, skill, and recent progress. Add recommendations after you have enough behavioral data.

### 4. Design Offline Mode Early

Kids apps are used in cars, planes, waiting rooms, and low-connectivity homes. Offline support requires:

- Asset bundles
- Download state management
- Storage limits
- Parent controls over downloads
- Queueing progress events until online
- Version compatibility
- Entitlement checks that tolerate temporary offline use

Lingokids explicitly promotes offline use, so this is part of the expected category experience.

### 5. Treat Content Operations as a Core Engineering Problem

You need tooling for non-engineers:

- Educators define objectives and lesson sequences.
- Artists upload assets.
- Game designers configure activities.
- QA checks child safety and educational correctness.
- Legal/brand teams approve partner IP.
- Product managers roll out experiments.
- Localization teams translate and validate.

Without this, every new game or lesson becomes an engineering bottleneck.

### 6. Recommendation Systems Need Pedagogical Guardrails

Pure engagement optimization can be risky for kids. A recommender should balance:

- Child interest
- Skill growth
- Content diversity
- Difficulty progression
- Repetition for mastery
- Parent-selected focus
- Brand/IP exposure limits
- Age appropriateness
- Avoiding addictive loops

Lingokids' job post explicitly references balancing data-driven optimization with pedagogical or brand-driven constraints, which is exactly the right framing.

### 7. Privacy Must Be Designed Into Data Infrastructure

Minimum recommended practices:

- Separate adult and child data stores/projects where possible.
- Do not use child data for advertising.
- Avoid third-party SDKs in child flows unless absolutely necessary and reviewed.
- Use pseudonymous child IDs.
- Keep raw event payloads minimal.
- Provide deletion/export flows.
- Keep consent logs.
- Use parental gates before purchases, external links, or account changes.
- Maintain a data inventory for app store disclosures.
- Review every analytics event for child privacy risk.

### 8. Build Trust Signals Into the Product

Lingokids leans heavily on trust:

- Ad-free
- kidSAFE certification claim on app stores
- Educator-designed lessons
- Oxford/NASA/Disney/BBC Earth partnerships
- App-store kids/family positioning
- Progress reports
- Privacy policy with child-specific safeguards

A new entrant needs its own equivalent trust architecture: educators, research, certifications, school pilots, transparent privacy, and strong parent communication.

## Suggested MVP Architecture for a New App

### Phase 1: Narrow MVP

Goal: one polished learning loop for ages 3-5.

- React Native app
- 10-20 mini activities, built in React Native canvas or Unity
- Parent onboarding and one child profile
- Simple subscription/free gate
- Content metadata in Postgres
- Rails or Node API
- Basic progress tracking
- Offline caching for selected activities
- Privacy-safe analytics
- Manual content admin panel
- Rule-based recommendations by age and skill

Avoid:

- Large ML platform
- Too many subjects
- Complex multiplayer/social features
- External chat/community
- Ads

### Phase 2: Curriculum and Retention

- Add lesson sequences
- Add assessments
- Add parent progress reports
- Add favorites/recently played
- Add content search
- Add more activity types
- Improve offline downloads
- Add experimentation
- Add educator review workflow

### Phase 3: Scale Platform

- Data warehouse/lakehouse
- ML recommendations
- Feature store or recommendation tables
- CDN asset pipeline
- Localization
- Partner content ingestion
- Brand approval workflow
- Automated QA for content metadata and app flows
- Customer support/billing tooling

## Risks and Pitfalls

- Over-indexing on entertainment and under-delivering learning outcomes
- Building generic games without a curriculum graph
- Using analytics/ads SDKs that create child privacy exposure
- Making the parent area too weak to justify subscription renewal
- Not designing for low-end tablets
- Failing to support offline use
- High content production cost
- Licensing expensive IP before retention is proven
- App-store review problems due to kids category, purchases, links, or tracking
- Poor support around subscriptions/refunds, a recurring complaint pattern in app-store reviews
- Weak content discoverability as the catalog grows

## Competitive Implications

Lingokids competes less like a single education app and more like a children's media platform with a curriculum engine. Its advantages are:

- Large catalog
- Known characters and institutional partners
- Parent trust positioning
- Subscription monetization
- Cross-platform media presence
- Recommendation infrastructure
- Existing global audience

The opportunity for a new builder is to be narrower and deeper:

- A specific age band
- A specific learning domain
- A specific language/culture
- Better parent coaching
- Better classroom integration
- Better accessibility
- Better adaptive assessment
- A safer local-first/privacy-first promise

## Source Index

- [What is Lingokids? - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/205124321-What-is-Lingokids)
- [Playlearning Sections - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/23532720590610-Playlearning-Sections)
- [Lingokids Methodology and Curriculum](https://help.lingokids.com/hc/en-us/articles/208259345-Lingokids-Methodology-and-Curriculum)
- [Lessons - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/18982608761106-Lessons)
- [For educators - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/9541001909137-For-educators)
- [How do I know what my child's level is? - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/360019924937-How-do-I-know-what-my-child-s-level-is)
- [Want to partner with Lingokids? - Lingokids Help Center](https://help.lingokids.com/hc/en-us/articles/9540952610833-Want-to-partner-with-Lingokids)
- [Disney content within Lingokids - Help Center](https://help.lingokids.com/hc/en-us/articles/30847746913170-Disney-content-within-Lingokids)
- [Blippi Content within Lingokids app](https://help.lingokids.com/hc/en-us/articles/23094911287442-Blippi-Content-within-Lingokids-app)
- [Engineering - Lingokids Jobs](https://jobs.lingokids.com/departments/engineering)
- [Data Scientist, Applied ML and Recommendations - Lingokids Jobs](https://jobs.lingokids.com/jobs/7524881-data-scientist-applied-ml-recommendations)
- [Lingokids Privacy Policy](https://lingokids.com/privacy-policy)
- [Lingokids on Google Play](https://play.google.com/store/apps/details?hl=en_US&id=es.monkimun.lingokids)
- [Lingokids on the App Store](https://apps.apple.com/zm/app/lingokids-play-and-learn/id1002043426)
- [2021 Series C press release](https://lingokids.com/press/lingokids-raises-40-million-for-its-early-learning-platform)
- [Fast Company recognition press release, 2026](https://lingokids.com/press/fast-company-most-innovative-companies-2026-lingokids)
- [FTC COPPA guidance](https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-not-just-kids-sites)
- [Apple: Design safe and age-appropriate experiences](https://developer.apple.com/kids/)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Families Policies](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en)
- [Google Play Console Families Program](https://play.google.com/console/about/programs/families/)
