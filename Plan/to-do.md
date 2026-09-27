# Movie Recommender — Implementation To-Do List (v1)

Last updated: September 2026  
Status: In Progress / Tracking  
Architecture Plan: [Plan/plan.md](./plan.md)  
Specification Documents: [PRD](../docs/prd.md) · [TRD](../docs/trd.md) · [Database Schema](../docs/database-schema.md) · [API Contracts](../docs/api-contracts.md) · [Forms Spec](../docs/forms-spec.md) · [UI/UX Spec](../docs/ui-ux-spec.md) · [Wireframes](../docs/wireframes.md)

---

## Progress Overview

- [x] **Phase 1:** Environment & Project Scaffolding
- [x] **Phase 2:** Database Schema & Migration
- [x] **Phase 3:** Authentication, Security & User Profile
- [ ] **Phase 4:** TMDB Integration & Local Title Caching
- [ ] **Phase 5:** Matching Engine & Misery Algorithm
- [ ] **Phase 6:** Groq LLM Concurrent Integration
- [ ] **Phase 7:** Frontend Design System & Common UI
- [ ] **Phase 8:** Frontend Flows 1–4 (Auth, Profile, Home, Session Setup)
- [ ] **Phase 9:** Frontend Flows 5–7 (Handoff, Person Form, Finding Picks)
- [ ] **Phase 10:** Frontend Flows 8–9 (Results & Title Detail)
- [ ] **Phase 11:** End-to-End Integration, Edge Cases & Verification

---

## Phase 1: Environment & Setup

### Backend (Spring Boot + Maven)
- [x] Verify Java installation (`java -version`, JDK 21+).
- [x] Verify Maven installation (`mvn -v`).
- [x] Initialize `/backend` as a Spring Boot 3.x project using Maven (`pom.xml`):
  - [x] Add `spring-boot-starter-web`
  - [x] Add `spring-boot-starter-security`
  - [x] Add `spring-boot-starter-data-jpa`
  - [x] Add `mysql-connector-j`
  - [x] Add `jjwt` / Nimbus JWT dependencies
  - [x] Add `spring-boot-starter-mail` (Brevo SMTP with local console fallback)
  - [x] Add `spring-boot-starter-validation`
  - [x] Add `spring-boot-starter-webflux` (WebClient for TMDB and Groq)
- [x] Include Maven Wrapper (`mvnw`, `mvnw.cmd`, `.mvn/`) in `/backend`.
- [x] Create `/backend/src/main/resources/application.properties` and template `application-local.properties` (gitignored).
- [x] Configure Spring Security CORS filter for frontend dev origin (`http://localhost:5173`).

### Frontend (React + Vite)
- [x] Verify Node.js (`node -v`) and npm (`npm -v`) installation.
- [x] Initialize `/frontend` using Vite + React with TypeScript (`npm create vite@latest frontend -- --template react-ts`).
- [x] Configure Google Fonts (Bebas Neue & Inter) in `/frontend/index.html`.
- [x] Implement design tokens in `/frontend/src/index.css` for **Midnight Cinema** theme (`#0E0F13` background, `#1A1C23` surface, `#E5A00D` gold accent, score badges, focus rings).

---

## Phase 2: Database Schema & Entity Modelling
- [x] Create MySQL database `movie_recommender`.
- [x] Create database initialization script (`schema.sql`) for all 10 tables:
  - [x] `users`
  - [x] `user_profiles`
  - [x] `password_reset_tokens`
  - [x] `genres`
  - [x] `keywords`
  - [x] `titles`
  - [x] `sessions`
  - [x] `session_person_answers`
  - [x] `session_results`
  - [x] `session_result_person_scores`
- [x] Implement JPA Entities and AttributeConverters for JSON column mapping:
  - [x] `User.java`
  - [x] `UserProfile.java` (languages, favorite_genres, never_want_genres, loved_title_ids)
  - [x] `PasswordResetToken.java`
  - [x] `Genre.java`
  - [x] `Keyword.java` (flags: `is_intensity_marker`)
  - [x] `Title.java` (`certification_band` indexed column, `genre_ids`, `keyword_ids`, `cast` top 5)
  - [x] `Session.java`
  - [x] `SessionPersonAnswer.java` (moods, genres_up_for, hard_no_genres, languages_ok)
  - [x] `SessionResult.java`
  - [x] `SessionResultPersonScore.java`
- [x] Seed initial lookup tables:
  - [x] Marker intensity keywords: `graphic violence`, `gore`, `sexual violence`, `torture`
  - [x] Mood proxy keywords: `horror`, `romance` for TV series
  - [x] Standard TMDB movie and TV genres

---

## Phase 3: Auth & Profile
- [x] Build stateless `JwtTokenProvider` (24-hour expiration) and `JwtAuthenticationFilter`.
- [x] Build global `RestExceptionHandler` returning standardized error envelope: `{"error": {"code": "...", "message": "..."}}`.
- [x] Implement `POST /auth/signup`:
  - [x] Hash password using BCrypt.
  - [x] Check unique email (`409 EMAIL_ALREADY_REGISTERED`).
  - [x] Return signed JWT and user object (`201 Created`).
- [x] Implement `POST /auth/login`:
  - [x] Verify credentials (`401 INVALID_CREDENTIALS`).
  - [x] Return signed JWT and user object (`200 OK`).
- [x] Implement `POST /auth/forgot-password`:
  - [x] Generate single-use secure token with 30-min expiry.
  - [x] Dispatch email via `JavaMailSender` (or log link if SMTP not configured).
  - [x] Return uniform message to prevent email enumeration.
- [x] Implement `POST /auth/reset-password`:
  - [x] Verify token and expiry (`410 RESET_TOKEN_EXPIRED`, `400 RESET_TOKEN_INVALID`).
  - [x] Update password and mark token used.
- [x] Implement `GET /profile`:
  - [x] Return user profile merged with account display name and email.
- [x] Implement `PUT /profile`:
  - [x] Validate bounds (max 5 favorite genres, max 5 loved titles, non-empty languages).
  - [x] Upsert `user_profiles` row.

---

## Phase 4: External Integrations & Local Title Caching
- [ ] Implement `TmdbClient` using WebClient with `TMDB_API_KEY`:
  - [ ] Search multi / movies / series.
  - [ ] Discover movies and series with genres, certifications, and languages.
  - [ ] Detail endpoint with `append_to_response=release_dates,content_ratings,credits,keywords`.
- [ ] Implement Indian certification hierarchy parser and US fallback:
  - [ ] Map Indian ratings (`U`, `UA 7+`, `UA 13+` / `UA`, `UA 16+`, `A`) to internal bands (`U`, `UA7`, `UA13`, `UA16`, `A`).
  - [ ] Map US fallback ratings (Movies: `G`, `PG`, `PG-13`, `R`/`NC-17`; TV: `TV-Y`, `TV-PG`, `TV-14`, `TV-MA`).
  - [ ] Assign `null` / `"Not rated"` if neither is found.
- [ ] Address Forms Spec Data Traps:
  - [ ] *Runtime Trap:* Store parsed runtime locally and filter in SQL/memory rather than trusting TMDB Discover.
  - [ ] *Series Age Trap:* Discover TV has no age filter; fetch content ratings and filter locally.
- [ ] Implement `GET /genres` endpoint (cached from TMDB).
- [ ] Implement `POST /titles/search`:
  - [ ] Query TMDB by title query and media type.
  - [ ] Immediately upsert returned titles with basic info (id, tmdbId, title, poster, year) into MySQL.
- [ ] Implement `GET /titles/{id}`:
  - [ ] Return complete title details, top 5 cast, ratings, and certifications.

---

## Phase 5: Matching Engine & Misery Algorithm
- [ ] Build hard filter candidate query:
  - [ ] Age limit: `certification_band <= youngestPersonAgeBand` (or unrated).
  - [ ] Language: `original_language` in group's common intersection of `languages_ok`.
  - [ ] Hard-no genres: title's `genre_ids` contains none of any attendee's `hard_no_genres`.
  - [ ] Q7 Intensity check:
    - If anyone selected `light`: exclude titles with any intensity marker keywords.
    - If anyone selected `intense`: require title to have at least one intensity marker keyword.
  - [ ] Runtime filter: match movie runtime bracket or series duration/status.
  - [ ] Replenish candidate pool from TMDB Discover if local cached pool < 50 items.
- [ ] Build per-person scoring function (0–100 scale):
  - [ ] Genre match (Weight 35)
  - [ ] Mood-to-genre/keyword match (Weight 25)
  - [ ] Light / intense slider alignment (Weight 15)
  - [ ] Similarity to `something_like_title_id` / profile `loved_title_ids` (Weight 15)
  - [ ] Era preference match (Weight 10)
- [ ] Implement solo mode:
  - [ ] Automatically calculate age band from `current_year - birth_year`.
  - [ ] Pre-fill answers from user profile.
- [ ] Implement "Average without Misery" algorithm:
  - [ ] Initial misery threshold = 40.
  - [ ] Filter out candidates where `min(person_score) < threshold`.
  - [ ] Calculate `group_score = avg(person_scores) + (vote_average * 0.5)`.
  - [ ] If < 5 titles survive: retry with threshold 30; if still < 5, retry with threshold 20.
  - [ ] Mark lowered-threshold titles with badge `compromise`.
  - [ ] Select top 5 surviving candidates.
- [ ] Implement Session Endpoints:
  - [ ] `POST /sessions/start`: validate S1–S4 and create `sessions` record.
  - [ ] `POST /sessions/{id}/submit`: persist all attendee Q1–Q8 answers, execute matching, trigger Groq explanations, save `session_results` & `session_result_person_scores`, return rank 1–5.
  - [ ] `POST /sessions/{id}/more`: re-run matching excluding prior `title_id`s, invoke Groq for next 5, save and return rank 6–10.
  - [ ] `GET /sessions/{id}/results`: return existing session results (for page refresh).

---

## Phase 6: Groq LLM Concurrent Integration
- [ ] Build `GroqClient` with API key and configurable model (`llama-3.3-70b-versatile`).
- [ ] Construct prompt for each title containing title, genres, overview, occasion, attendee names, and individual score highlights.
- [ ] Dispatch all 5 Groq prompts in parallel (`CompletableFuture.allOf` / WebClient async).
- [ ] Implement graceful fallback: if Groq is unreachable or times out, provide a clean programmatic one-liner reason instead of failing the request.

---

## Phase 7: Frontend Design System & Components
- [ ] Implement shared UI components in `/frontend/src/components`:
  - [ ] `Button`: primary gold `#E5A00D`, secondary outline, loading state, disabled styling.
  - [ ] `Chip`: multi-select and single-select chips with gold checkmarks and keyboard toggle.
  - [ ] `TextInput`: accessible text input with floating label / error display.
  - [ ] `Stepper`: `[ - ] count [ + ]` for group size (1 to 8).
  - [ ] `Slider3Step`: 3-stop slider for Q7 (Light, Balanced, Intense).
  - [ ] `TitleSearchPicker`: debounced search input with poster preview chips and remove button.
  - [ ] `PersonScoreCircles`: colored attendee initials (`#3DD68C` green for 70+, `#F5A524` amber for 40–69).
  - [ ] `FilmReelSpinner`: animated film-reel loading spinner.
  - [ ] `Navbar`: title, user avatar/name dropdown, Edit profile link, Log out button.
- [ ] Setup API client with token interceptor and standardized error handling.

---

## Phase 8: Frontend Screens 1 to 4
- [ ] **Screen 1: Sign up / Log in / Password Reset (`/login`, `/signup`, `/forgot-password`, `/reset-password`):**
  - [ ] Split screen layout: blurred poster backdrop on left, card on right.
  - [ ] Sign up tab with password match validation.
  - [ ] Log in tab with redirect to home/profile.
  - [ ] Forgot password flow with "Check your inbox" screen.
  - [ ] Reset password page with 30-min token parameter.
- [ ] **Screen 2: Profile Setup Wizard (`/profile/setup`):**
  - [ ] Progress bar for 3 steps.
  - [ ] Step 1 (About You): pre-filled display name, birth year dropdown (P2).
  - [ ] Step 2 (Languages): P4 languages chips + search, P5 subtitles Yes/No toggle.
  - [ ] Step 3 (Taste): P6 favorite genres (up to 5), P7 hard-no genres, P8 loved titles search picker (up to 5 optional), P9 era preference toggle.
  - [ ] State preservation on Back / Next.
- [ ] **Screen 3: Home (`/`):**
  - [ ] Greeting header ("Hi [Name]").
  - [ ] Prominent gold CTA: "Find something to watch".
  - [ ] Profile summary card with "Edit" button.
- [ ] **Screen 4: Session Setup (`/session/new`):**
  - [ ] S1: 3 cards (Movie, Series, Either).
  - [ ] S2: Stepper (1 to 8 viewers).
  - [ ] S3: Dynamic time limit chips (S3a movie runtimes vs S3b series duration).
  - [ ] S4: Occasion chips (Friends hangout, Date night, Family time, Solo chill).
  - [ ] "Start" button navigating to Handoff (group) or Person Form (solo).

---

## Phase 9: Frontend Screens 5 to 7
- [ ] **Screen 5: Handoff Screen (`/session/:id/handoff`):**
  - [ ] Centered full-screen dark privacy wall.
  - [ ] "Pass the laptop to person X of N".
  - [ ] Numbered progress dots.
  - [ ] Gold "I'm ready" button (triggers on Enter).
  - [ ] "Go back" link to allow fixing previous person's answers.
- [ ] **Screen 6: Person's Form (`/session/:id/person/:index`):**
  - [ ] Host goes first (`personIndex = 0`), pre-filled with profile answers.
  - [ ] Solo mode: skip Q1 (Name) and Q2 (Age Band).
  - [ ] Questions Q1 to Q8 with constraints (Q3 max 2 chips, Q4 max 3 chips, Q7 slider, Q8 title search picker + Skip).
  - [ ] Client validation: red outline and auto-scroll to missing required inputs.
  - [ ] Answers hidden immediately upon clicking "Done".
- [ ] **Screen 7: Finding Picks (`/session/:id/loading`):**
  - [ ] Centered message: "Matching N people's answers...".
  - [ ] Film-reel loading animation.
  - [ ] After 10s: display "Still working...".
  - [ ] Error state with Retry CTA on failure.
  - [ ] Empty state: "Nothing fits everyone tonight" identifying the most restrictive filter with loosen CTA.

---

## Phase 10: Frontend Screens 8 to 9
- [ ] **Screen 8: Results: Top 5 (`/session/:id/results`):**
  - [ ] Header with session summary and attendee names.
  - [ ] 5 recommendation cards in a single row:
    - [ ] 2:3 poster image.
    - [ ] Title, release year, runtime, certificate.
    - [ ] Gold group match percentage.
    - [ ] Colored score circle per attendee.
    - [ ] 2-line AI generated explanation.
    - [ ] Badges (`Compromise pick`, `Not rated`).
  - [ ] "Show more" button fetching and displaying rank 6–10 in a second row.
  - [ ] "Change answers" (returns to setup keeping data) and "Start over" buttons.
- [ ] **Screen 9: Title Detail (`/session/:id/title/:titleId`):**
  - [ ] Wide backdrop hero image.
  - [ ] Poster, title, year, certification, runtime/seasons, overview.
  - [ ] Top 5 cast list with headshot photos.
  - [ ] "Why this pick" block: full AI explanation + breakdown line per attendee.
  - [ ] "Back to results" button (Esc key support).

---

## Phase 11: Testing & Refinement
- [ ] **Keyboard Navigation:** Validate complete session walkthrough using Tab, Enter, Space, and Arrow keys.
- [ ] **Solo Mode Flow:** Validate profile pre-fill, Q1/Q2 bypass, and results generation.
- [ ] **Group Mode Flow:** Validate 3+ person session with conflicting tastes and minors (CBFC filtering).
- [ ] **Compromise Logic:** Test restrictive filters forcing misery threshold reduction (40 -> 30 -> 20) with compromise badge display.
- [ ] **Resilience:** Validate graceful fallback when TMDB or Groq is unreachable.
- [ ] **Production Build Check:** Execute `mvn clean package` and `npm run build` cleanly without warnings or errors.
