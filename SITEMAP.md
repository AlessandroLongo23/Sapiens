# 🗺️ SAPIENS SITEMAP & GUIDELINES
**Version:** 2.0  
**Last Updated:** 8 nov 2025

---

## Overview

The Sapiens website is structured into three main sections:
1. **Public/Landing Pages** - Marketing, information, and public-facing content
2. **Content Section** - Educational content with hierarchical dynamic routing
3. **Student Area** - Authenticated user dashboard and tools

---

## 1. PUBLIC / LANDING PAGES

### 1.1 Homepage
- **Route:** `/`
- **Description:** Main landing page with hero section, features, stats, and call-to-action
- **Components:** HeroSection, FooterSection, Header
- **Features:**
  - Hero section with value proposition
  - Feature highlights
  - Statistics (students, content, hours)
  - Call-to-action buttons
  - Testimonials (optional)
- **Status:** ✅ Exists

### 1.2 About Us / Chi Siamo
- **Route:** `/chi-siamo` or `/about`
- **Description:** Information about Sapiens, mission, team, and values
- **Content:** 
  - Brand story and mission
  - Team members
  - Educational philosophy
  - Why Sapiens exists
- **Status:** ❌ Missing

### 1.3 Contacts
- **Route:** `/contacts` or `/contatti`
- **Description:** Contact form and information
- **Features:**
  - Contact form
  - Email/phone information
  - Office hours (if applicable)
- **Status:** ✅ Exists (`/contacts`)

### 1.4 Pricing / Subscriptions
- **Route:** `/pricing` or `/abbonamenti`
- **Description:** Overview of subscription plans (Free, Lite, Base, Pro)
- **Features:** 
  - Plan comparison table
  - Feature highlights per plan
  - Pricing information
  - Upgrade/downgrade options
  - FAQ about subscriptions
- **Status:** ⚠️ Partially exists (subscription page exists in student area, needs public version)

### 1.5 Privacy Policy
- **Route:** `/privacy` or `/privacy-policy`
- **Description:** Privacy policy and data handling information
- **Content:**
  - Data collection practices
  - Cookie policy
  - User rights (GDPR compliance)
  - Data retention policies
- **Status:** ❌ Missing

### 1.6 Terms of Service
- **Route:** `/terms` or `/termini`
- **Description:** Terms and conditions of service
- **Content:**
  - Service terms
  - User responsibilities
  - Subscription terms
  - Refund policy
- **Status:** ❌ Missing

### 1.7 FAQ
- **Route:** `/faq`
- **Description:** Frequently asked questions
- **Content:**
  - Common questions about the platform
  - Subscription questions
  - Technical support
  - Content access questions
- **Status:** ❌ Missing

### 1.8 Blog / Resources (Optional)
- **Route:** `/blog` or `/risorse`
- **Description:** Educational articles, tips, and resources
- **Features:**
  - Blog post listings
  - Categories/tags
  - Search functionality
  - Individual post pages
- **Status:** ❌ Missing (optional)

---

## 2. CONTENT SECTION (Dynamic Routing)

### Routing Structure
**Pattern:** `/[level_id]/[subject_id]/[chapter_id]/[topic_id]/[subtopic_id]?/[content_type]?`

**Parameters:**
- `level_id`: `middle_school`, `high_school`, `university` (Educational level - FIRST LAYER)
- `subject_id`: `math`, `physics`, `chemistry`, `computer-science`, ecc. (Subject - SECOND LAYER)
- `chapter_id`: `algebra`, `geometria`, `meccanica`, etc. (Macro topic/chapter - THIRD LAYER)
- `topic_id`: `equazioni-primo-grado`, `teorema-pitagora`, etc. (Specific topic - FOURTH LAYER)
- `subtopic_id`: specific subtopic slug (optional subtopic - FIFTH LAYER)
- `content_type`: `teoria`, `esercizi`, `formulario`, `schemi`, ecc. (type of )

### 2.1 Content Overview / Levels List
- **Route:** `/contenuti` or `/content`
- **Description:** Overview page listing all available educational levels
- **Content:** 
  - Grid/list of levels (Medie, Superiori, Università)
  - Brief description of each level
  - Subject count per level
- **Status:** ❌ Missing

### 2.2 Level Page
- **Route:** `/[level]`
  - Examples: `/medie`, `/superiori`, `/universita`
- **Description:** Level overview showing available subjects
- **Content:** 
  - Level introduction
  - Subject selection grid
  - Learning path overview
  - Statistics (topics count, chapters count)
- **Status:** ❌ Missing (needs to be created)

### 2.3 Subject Page
- **Route:** `/[level]/[subject]`
  - Examples: `/superiori/math`, `/medie/physics`, `/universita/computer-science`
- **Description:** Subject overview showing available chapters
- **Content:** 
  - Subject introduction
  - Chapter list/grid
  - Learning objectives
  - Prerequisites (if any)
  - Related subjects
- **Status:** ⚠️ Partially exists (old structure `/[subject]`)

### 2.4 Chapter Page
- **Route:** `/[level]/[subject]/[chapter]`
  - Examples: `/superiori/math/algebra`, `/superiori/math/geometria`, `/universita/physics/meccanica`
- **Description:** Chapter overview showing topics within the chapter
- **Content:** 
  - Chapter introduction
  - Topic list
  - Learning objectives for the chapter
  - Estimated study time
  - Progress indicator (if logged in)
  - Related chapters
- **Status:** ❌ Missing (needs to be created)

### 2.5 Topic Page
- **Route:** `/[level]/[subject]/[chapter]/[topic]`
  - Examples: 
    - `/superiori/math/algebra/equazioni-primo-grado`
    - `/medie/physics/meccanica/movimento-base`
    - `/universita/computer-science/algoritmi/complessita`
- **Description:** Main topic content page
- **Content:** 
  - Topic introduction
  - Links to subtopics (theory, exercises)
  - Quick navigation
  - Related topics
  - Bookmark/save button (if logged in)
  - Prerequisites and next steps
- **Status:** ❌ Missing (needs to be created)

### 2.6 Subtopic / Content Detail Page
- **Route:** `/[level]/[subject]/[chapter]/[topic]/[subtopic]`
  - Examples: 
    - `/superiori/math/algebra/equazioni-primo-grado/teoria`
    - `/superiori/math/algebra/equazioni-primo-grado/esercizi`
- **Description:** Detailed content page (theory or exercises)
- **Content Types:**
  - Theory (`/teoria`) - Markdown content, formulas, examples
  - Exercises (`/esercizi`) - Interactive exercises, practice problems
- **Features:**
  - Content rendering (markdown, LaTeX, code blocks)
  - Progress tracking
  - Bookmark functionality
  - Print/export option
  - Related content links
- **Status:** ⚠️ Partially exists (old structure in `/student/materiale`)

### Example URL Structure:
```
/medie                                    → Middle school overview
/medie/math                               → Middle school math
/medie/math/aritmetica                    → Arithmetic chapter
/medie/math/aritmetica/frazioni           → Fractions topic
/medie/math/aritmetica/frazioni/teoria    → Fractions theory
/medie/math/aritmetica/frazioni/esercizi  → Fractions exercises

/superiori                                → High school overview
/superiori/math                           → High school math
/superiori/math/algebra                   → Algebra chapter
/superiori/math/algebra/equazioni-primo   → First degree equations topic
/superiori/math/algebra/equazioni-primo/teoria    → Theory
/superiori/math/algebra/equazioni-primo/esercizi  → Exercises

/universita                                → University overview
/universita/math                           → University math
/universita/math/analisi                   → Analysis chapter
/universita/math/analisi/limiti            → Limits topic
/universita/math/analisi/limiti/teoria     → Theory
/universita/math/analisi/limiti/esercizi   → Exercises
```

---

## 3. STUDENT AREA (Authenticated)

All student routes are prefixed with `/student` and require authentication.

### 3.1 Student Dashboard
- **Route:** `/admin` or `/student/dashboard`
- **Description:** Main dashboard with overview of student's activity
- **Content:**
  - Welcome message with student name
  - Recent activity feed
  - Continue learning section (topics in progress)
  - Progress overview (completion percentage, time spent)
  - Quick access cards:
    - Zaino (backpack)
    - AI Chat
    - Calendar
    - Settings
  - Upcoming reviews (spaced repetition)
  - Recommended content
  - Learning streak
- **Status:** ⚠️ Partially exists

### 3.2 Zaino (Backpack) - Main Page
- **Route:** `/student/zaino`
- **Description:** Central hub for student's saved content and notes
- **Content:**
  - Overview statistics (bookmarks count, notes count)
  - Quick navigation to Libri and Quaderni
  - Recent bookmarks preview
  - Recent notes preview
  - Quick actions (create note, search)
- **Status:** ❌ Missing (needs to be created)

### 3.3 Libri (Books/Bookmarks)
- **Route:** `/student/zaino/libri`
- **Description:** Collection of bookmarked/saved content pages
- **Features:**
  - List/grid of saved topics/subtopics
  - Filter by:
    - Subject
    - Level
    - Chapter
    - Date saved
  - Search functionality
  - Sort options (date, subject, recently viewed)
  - Remove bookmark action
  - Quick access to content (opens in new tab/section)
  - Bulk actions (remove multiple bookmarks)
  - Empty state with CTA to explore content
- **Status:** ❌ Missing (needs to be created)

### 3.4 Quaderni (Notebooks)
- **Route:** `/student/zaino/quaderni`
- **Description:** Student's personal notes and notebooks
- **Features:**
  - List of notebooks
  - Create new notebook button
  - Filter/search notebooks
  - Organize by:
    - Subject tags
    - Custom folders/categories
    - Date created/modified
  - Notebook preview (first few lines)
  - Quick actions (edit, delete, duplicate)
  - Empty state with CTA to create first notebook
- **Status:** ❌ Missing (needs to be created)

### 3.5 Single Notebook Page
- **Route:** `/student/zaino/quaderni/[notebook_id]`
- **Description:** Individual notebook editor/viewer
- **Features:**
  - **Markdown Editor:**
    - Full markdown support
    - Syntax highlighting
    - Live preview toggle
    - Toolbar with formatting options
  - **Handwriting Support:**
    - Canvas for freehand drawing
    - Pen/pencil tools
    - Eraser
    - Color selection
    - Undo/redo
    - Export drawing as image
  - **Organization:**
    - Title editing
    - Subject/topic tags
    - Link to related content
  - **Actions:**
    - Auto-save
    - Manual save
    - Export as PDF/Markdown
    - Share (if feature enabled)
    - Delete notebook
  - **Navigation:**
    - Back to Quaderni list
    - Previous/Next notebook
- **Status:** ❌ Missing (needs to be created)

### 3.6 AI Chat
- **Route:** `/student/chat`
- **Description:** AI assistant chat interface
- **Features:**
  - Chat with Sapiens AI
  - Character selection (4 mascots for different subjects):
    - Math mascot
    - Physics mascot
    - Chemistry mascot
    - Computer Science mascot
  - Chat history
  - Context-aware responses
  - Ability to reference saved content
  - Export chat history
  - Clear chat history
- **Status:** ✅ Exists (`/student/chat`)

### 3.7 Calendar
- **Route:** `/student/calendario`
- **Description:** Student's calendar for lessons and reviews
- **Features:**
  - Calendar view (month/week/day)
  - Upcoming lessons display
  - Review schedule (spaced repetition)
  - Lesson booking interface
  - Lesson history
  - Notifications for upcoming events
- **Status:** ✅ Exists (`/student/calendario`)

### 3.8 Subscription Management
- **Route:** `/student/subscription`
- **Description:** Manage subscription and billing
- **Features:**
  - Current plan display with features
  - Plan comparison
  - Upgrade/downgrade options
  - Payment method management
  - Payment history
  - Invoice download
  - Cancel subscription (with retention flow)
  - Billing address management
- **Status:** ✅ Exists (`/student/subscription`)

### 3.9 Subscription Success
- **Route:** `/student/subscription/success`
- **Description:** Confirmation page after successful subscription
- **Content:**
  - Success message
  - Plan details
  - Next steps
  - Access to premium features
- **Status:** ✅ Exists

### 3.10 Subscription Cancel
- **Route:** `/student/subscription/cancel`
- **Description:** Subscription cancellation page
- **Content:**
  - Cancellation confirmation
  - Access until date
  - Feedback form (optional)
  - Reactivation option
- **Status:** ✅ Exists

### 3.11 Settings
- **Route:** `/student/settings` or `/student/impostazioni`
- **Description:** User settings and preferences
- **Sections:**
  - **Profile:**
    - Name, email
    - Avatar upload
    - Bio/description
  - **Preferences:**
    - Theme (light/dark/system)
    - Language
    - Notification preferences
    - Email preferences
  - **Learning:**
    - Default level preference
    - Study reminders
    - Spaced repetition settings
  - **Account:**
    - Change password
    - Two-factor authentication
    - Account deletion
  - **Privacy:**
    - Data export
    - Privacy settings
- **Status:** ❌ Missing (needs to be created)

### 3.12 Profile (Optional - could be part of Settings)
- **Route:** `/student/profile` or `/student/profilo`
- **Description:** User profile page (public-facing if needed)
- **Features:**
  - Profile information
  - Avatar
  - Learning statistics
  - Achievement badges
  - Learning streak
  - Public profile toggle (if social features added)
- **Status:** ❌ Missing (optional)

---

## 4. ADMIN AREA (Content Management)

### 4.1 Admin Dashboard
- **Route:** `/admin`
- **Description:** Admin overview with statistics and quick actions
- **Status:** ✅ Exists

### 4.2 Admin - Students Management
- **Route:** `/admin/studenti`
- **Description:** Manage students list
- **Features:**
  - Student list with filters
  - Search functionality
  - Student details
  - Assignment management
- **Status:** ✅ Exists

### 4.3 Admin - Student Detail
- **Route:** `/admin/studenti/[id]`
- **Description:** Individual student management
- **Features:**
  - Student information
  - Progress tracking
  - Assignment management
  - Communication history
- **Status:** ✅ Exists

### 4.4 Admin - Content Management
- **Route:** `/admin/materie/contenuto`
- **Description:** Content editor and management
- **Features:**
  - Content tree navigation
  - Create/edit/delete content nodes
  - Markdown editor
  - Preview functionality
  - Bulk operations
- **Status:** ✅ Exists

### 4.5 Admin - Calendar
- **Route:** `/admin/calendario`
- **Description:** Admin calendar for lessons
- **Features:**
  - Lesson scheduling
  - Student assignments
  - Calendar view
- **Status:** ✅ Exists

### 4.6 Admin - Analytics
- **Route:** `/admin/analytics`
- **Description:** Analytics and statistics
- **Features:**
  - User engagement metrics
  - Content popularity
  - Subscription statistics
  - Learning progress analytics
- **Status:** ✅ Exists

---

## 5. API ROUTES

### 5.1 Authentication
- **Route:** `/api/auth/logout`
- **Description:** Logout endpoint
- **Status:** ✅ Exists

### 5.2 Chat
- **Route:** `/api/chat`
- **Description:** AI chat API endpoint
- **Status:** ✅ Exists

### 5.3 Stripe
- **Route:** `/api/stripe/checkout`
- **Description:** Create Stripe checkout session
- **Status:** ✅ Exists

- **Route:** `/api/stripe/webhook`
- **Description:** Handle Stripe webhooks
- **Status:** ✅ Exists

- **Route:** `/api/stripe/portal`
- **Description:** Customer portal access
- **Status:** ✅ Exists

### 5.4 Students
- **Route:** `/api/students`
- **Description:** Student data API
- **Status:** ✅ Exists

### 5.5 Emails
- **Route:** `/api/emails/*`
- **Description:** Email handling endpoints
- **Status:** ✅ Exists

### 5.6 Content (Suggested - Needs Implementation)
- **Route:** `/api/content/bookmark`
  - **Method:** POST/DELETE
  - **Description:** Bookmark/unbookmark content
  - **Payload:** `{ content_path: string, action: 'add' | 'remove' }`

- **Route:** `/api/content/bookmarks`
  - **Method:** GET
  - **Description:** Get user's bookmarks
  - **Query:** `?subject=math&level=superiori`

- **Route:** `/api/content/notes`
  - **Method:** GET, POST, PUT, DELETE
  - **Description:** CRUD operations for notes
  - **Endpoints:**
    - `GET /api/content/notes` - List all notes
    - `POST /api/content/notes` - Create note
    - `GET /api/content/notes/[id]` - Get note
    - `PUT /api/content/notes/[id]` - Update note
    - `DELETE /api/content/notes/[id]` - Delete note

- **Route:** `/api/content/search`
  - **Method:** GET
  - **Description:** Search content
  - **Query:** `?q=equazioni&level=superiori&subject=math`

- **Route:** `/api/content/progress`
  - **Method:** GET, POST
  - **Description:** Track and retrieve learning progress
  - **Payload:** `{ content_path: string, progress: number, time_spent: number }`

- **Status:** ❌ Missing (needs to be created)

---

## 6. SPECIAL PAGES

### 6.1 Search Page
- **Route:** `/search` or `/cerca`
- **Description:** Global content search
- **Features:**
  - Search across all content
  - Filter by level, subject, chapter
  - Search in bookmarks (if logged in)
  - Search in notes (if logged in)
  - Recent searches
  - Popular searches
- **Status:** ❌ Missing (recommended)

### 6.2 404 Page
- **Route:** `src/app/not-found.tsx` (Next.js not-found page)
- **Description:** Custom 404 error page
- **Content:**
  - Friendly error message
  - Search functionality
  - Links to popular content
  - Back to home button
- **Status:** ⚠️ Should be customized

### 6.3 500 Page
- **Route:** `src/app/error.tsx` (server errors)
- **Description:** Custom 500 error page
- **Content:**
  - Error message
  - Report issue link
  - Back to home button
- **Status:** ⚠️ Should be customized

---

## ROUTING STRUCTURE SUMMARY

### Content Routing Pattern (Updated):
```
/[level]/[subject]/[chapter]/[topic]/[subtopic]?/[content_type]
```

### Complete Route Examples:

**Public Content:**
```
/medie                                    → Middle school overview
/medie/math                               → Middle school math
/medie/math/aritmetica                    → Arithmetic chapter
/medie/math/aritmetica/frazioni           → Fractions topic
/medie/math/aritmetica/frazioni/teoria    → Fractions theory
/medie/math/aritmetica/frazioni/esercizi  → Fractions exercises

/superiori                                → High school overview
/superiori/math                           → High school math
/superiori/math/algebra                   → Algebra chapter
/superiori/math/algebra/equazioni-primo   → First degree equations
/superiori/math/algebra/equazioni-primo/teoria    → Theory
/superiori/math/algebra/equazioni-primo/esercizi  → Exercises

/universita                                → University overview
/universita/math                           → University math
/universita/math/analisi                   → Analysis chapter
/universita/math/analisi/limiti            → Limits topic
/universita/math/analisi/limiti/teoria     → Theory
/universita/math/analisi/limiti/esercizi   → Exercises
```

**Student Area:**
```
/student                          → Dashboard
/student/zaino                    → Backpack hub
/student/zaino/libri              → Bookmarks
/student/zaino/quaderni           → Notebooks list
/student/zaino/quaderni/[id]      → Single notebook
/student/chat                     → AI Chat
/student/calendario               → Calendar
/student/subscription              → Subscription management
/student/settings                 → Settings
```

---

## DATA STRUCTURE UPDATES NEEDED

### Content Hierarchy (Updated):
```
Level (medie/superiori/universita)
  └── Subject (math/physics/chemistry/computer-science)
      └── Chapter (algebra/geometria/meccanica/etc.)
          └── Topic (equazioni-primo-grado/teorema-pitagora/etc.)
              └── Subtopic (teoria/esercizi/specific-subtopic)
```

### Database Schema Considerations:
- Update `content_nodes` table to reflect new path structure
- Path format: `[level, subject, chapter, topic, subtopic?]`
- Remove year from path structure
- Update indexes for efficient querying

### subjects-topics.ts Updates:
- Restructure data to remove year layer
- Group topics directly under chapters
- Update type definitions
- Maintain backward compatibility during migration

---

## IMPLEMENTATION PRIORITY

### Phase 1 (Critical - Foundation):
1. ✅ Update content routing structure (remove year, swap level/subject)
2. ✅ Update data model (`subjects-topics.ts`)
3. ✅ Create level overview pages (`/[level]`)
4. ✅ Create chapter pages (`/[level]/[subject]/[chapter]`)
5. ✅ Create topic pages (`/[level]/[subject]/[chapter]/[topic]`)

### Phase 2 (Important - Student Features):
1. ✅ Create Zaino section (main page, Libri, Quaderni)
2. ✅ Implement bookmark functionality
3. ✅ Create notebook system (markdown editor)
4. ✅ Create Settings page
5. ✅ Add handwriting support for notebooks

### Phase 3 (Essential - Public Pages):
1. ✅ Create About Us page
2. ✅ Create Privacy Policy page
3. ✅ Create Terms of Service page
4. ✅ Create public Pricing page
5. ✅ Create FAQ page

### Phase 4 (Enhancement):
1. ✅ Add search functionality
2. ✅ Improve progress tracking
3. ✅ Add breadcrumbs navigation
4. ✅ Add related content suggestions
5. ✅ Add recently viewed section

---

## DESIGN CONSIDERATIONS

### Navigation:
- **Breadcrumbs:** Essential for deep content pages
  - Example: `Home > Superiori > Matematica > Algebra > Equazioni di primo grado`
- **Sidebar Navigation:** For content browsing within a level/subject
- **Quick Actions:** Bookmark, share, print buttons on content pages

### Content Pages:
- **Layout:** 
  - Left sidebar: Table of contents / navigation
  - Center: Main content
  - Right sidebar: Related content, bookmarks, quick actions
- **Mobile:** Stacked layout, collapsible sidebars

### Zaino Section:
- **Libri:** Card-based layout with filters
- **Quaderni:** List view with preview, grid view option
- **Notebook Editor:** Split view (editor | preview) or tabbed view

---

## ACCESS CONTROL

### Content Access:
- **Free Plan:** Theory content only, with ads
- **Lite Plan:** Theory + Exercises + Formulary
- **Base Plan:** Everything in Lite + AI Chat
- **Pro Plan:** Everything in Base + Private lessons + Exercise solutions

### Route Protection:
- Public content routes: Accessible to all
- Student routes: Require authentication
- Admin routes: Require admin role
- Premium content: Check subscription level

---

## NOTES & RECOMMENDATIONS

1. **Migration Strategy:**
   - Plan migration from old structure to new structure
   - Create redirects for old URLs
   - Update all internal links

2. **SEO Considerations:**
   - Add meta descriptions for each content page
   - Implement structured data (Schema.org)
   - Create sitemap.xml
   - Optimize URLs for readability

3. **Performance:**
   - Implement content caching
   - Lazy load content sections
   - Optimize images and assets
   - Use CDN for static content

4. **Accessibility:**
   - Ensure keyboard navigation
   - Add ARIA labels
   - Test with screen readers
   - Ensure color contrast compliance

5. **Analytics:**
   - Track content page views
   - Track bookmark usage
   - Track note creation/usage
   - Track search queries
   - Track user progress

---

## FUTURE ENHANCEMENTS (Optional)

1. **Social Features:**
   - Share notes with other students
   - Study groups
   - Community forum

2. **Gamification:**
   - Achievement badges
   - Leaderboards
   - XP system
   - Learning streaks

3. **Advanced Features:**
   - Collaborative notes
   - Voice notes
   - Video explanations
   - Interactive simulations

4. **Mobile App:**
   - Native mobile app (complementary to web)
   - Photo upload for exercises
   - Offline content access

---

**End of Sitemap Document**

