# Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Core Purpose](#core-purpose)
- [Technical Architecture](#technical-architecture)
- [Table Structure and Alignment](#table-structure-and-alignment)
- [Key Features Implementation](#key-features-implementation)
- [Project Structure Analysis](#project-structure-analysis)
- [Google Sheets Integration](#google-sheets-integration)
- [API Implementation](#api-implementation)
- [API Reference](#api-reference)

## Overview

Wiki Ver9 is a Progressive Web Application (PWA) designed to serve as an interactive, structured wiki for documenting, categorizing, and exploring news and political content. The application is built with React for a modern user experience and leverages Google Sheets as a lightweight backend for real-time data synchronization.

The application is composed of three main components:

1. **TheoryPage (Theory Table):** 
Acts as a "read later" section where users can collect and organize theoretical items related to political and social entities. 
This feature allows users to delve into theoretical frameworks and texts at their convenience.
2. **Reporting Page (News Events Table):** 
This section is enhanced with two new fields, TIMELINE and SPECTRUM, which, when visualized using time.graphics, help users understand historical contexts and recollect events better. 
It provides a structured way to track and analyze news events and their implications over time.
3. **Cards Page (Entities Table):** 
Offers three distinct views, each dedicated to a specific entity type (e.g., people, political parties, movements).
This feature displays cards for each entity, functioning similarly to a "pokedex," allowing users to explore and learn about different entities in a visually engaging manner.

Overall, Wiki Ver9 aims to create a comprehensive platform for users to interact with and analyze political and news content, offering both depth and breadth in its exploration of theoretical and real-world events.

### Core Purpose:
- Track and analyze political/social news and events
- Categorize content across theoretical frameworks and real-world instances
- Create a structured knowledge base similar to a wiki
- Focus on documenting societal issues and political discourse

## Features
- **Article Feed:** Displays a curated feed of political and general news articles categorized as THEORY or REPORTING.
- **Reading Mode:** Offers an enhanced reading interface that parses articles using the Readability API, making text easier to digest.
- **Highlighting & Floating Icons:** Enables users to highlight sections of text; these highlights are then visually represented as floating icons both in the article view and on the TheoryPage feed.
- **Dynamic Content Addition:** A floating 'Add' button lets users input new data. The input form adapts based on the content category selected (THEORY, REPORTING).
- **Google Sheets Integration:** All data is stored and updated dynamically in Google Sheets, ensuring real-time synchronization across the application.
- **Entity-based Organization:** Articles, reports, and instances are categorized by entities (e.g., people, political parties, movements).
- **Offline Functionality:** Utilizes Progressive Web App capabilities for offline access.
- **Complete Table Views:** View complete database tables for all Google Sheets data.

### Key Components:
- **Theory Table (TheoryPage)**: For theoretical content and framework storage
- **Reporting Table**: For news events with timeline visualization
- **Entities Table (Cards Page)**: For profiling political actors/entities

### Technical Architecture:
- **Frontend**: React-based PWA
- **Backend**: Google Sheets (lightweight database)
- **Dynamic Forms** for data entry
- **Real-time synchronization**

## Table Structure and Alignment

### 1. ENTITIES Table
**Schema**
- `entity_id`: Unique identifier for each entity (auto-generated).
- `WHO`: Multi-select field for entity names.
- `bio`: Biographical information about the entity.
- `entity_type`: Type of entity (Character, Party, Movement).
- `SPECTRUM`: Political spectrum (LEFT, CENTRE, RIGHT).

**Dynamic Form Structure**
The `EntitiesForm` is designed to manage entity data, providing a dynamic interface for entity categorization:
- **entity_id** (text input): Unique identifier for the entity (auto-generated).
- **WHO** (multi-select): Allows selection of entity names using NotionMultiSelect.
- **Bio** (text input): Biographical information about the entity.
- **Entity Type** (dropdown): Categorizes the entity type.
  - Options: Character, Party, Movement
- **Spectrum** (dropdown): Political spectrum categorization.
  - Options: Left, Centre, Right

**Google Sheets API**: 
- `addRowToEntitiesTable`: Handles adding rows to the `ENTITIES` sheet.

### 2. THEORY Table
**Schema**
- `WHO`: Name of the entity.
- `title`: Title of the theory.
- `description`: Detailed theoretical text.
- `author`: Author or source of the theory.
- `abstract`: Brief summary of the theory.
- `publication_date`: Date of publication.
- `src_type`: Type of source (post, article, book, pdf).
- `platform`: Platform where the post was published (if src_type is post).
- `domain`: Domain of the article (if src_type is article).
- `keywords`: Multi-select field for keywords.
- `spectrum`: Political spectrum (LEFT, CENTRE, RIGHT).
- `url`: URL of the source.

**Dynamic Form Structure**
The `TheoryForm` dynamically adjusts its fields based on the selected `Source Type`. It supports various categories, each with specific fields:
- **Source Type** (dropdown): Determines the fields displayed in the form.
  - Options: Social Media Post, Article, Book, PDF
- **Title** (text input): Title of the entry.
- **Post Content** (text area): Visible only when `Source Type` is 'Social Media Post'.
- **Keywords** (multi-select): Allows selection of multiple keywords.
- **URL** (URL input): Required for all source types.
- **Platform** (dropdown): Visible only when `Source Type` is 'Social Media Post'.
  - Options: Facebook, Instagram, Twitter, YouTube
- **Author** (multi-select): Allows selection of multiple authors when `Source Type` is 'Social Media Post'.
- **Abstract** (text area): Visible for 'Article', 'Book', and 'PDF' source types.
- **WHO** (multi-select): Allows selection of related entities.
- **Spectrum** (dropdown): Political spectrum categorization.
  - Options: Left, Centre, Right
- **Date Published** (date input): Date when the entry was published.

**Google Sheets API**: 
- `addRowToTheoryTable`: Handles adding rows to the `THEORY` sheet.

### 3. REPORTING Table
**Schema**
- `headline`: Headline of the news event.
- `description`: Detailed description of the event.[When the source type is 'social media post', the post content is treated as the description.]
- `event_date`: Date of the event.
- `reporting_date`: Date the event was reported.
- `src_type`: Type of source (post, article).
- `platform`: Platform where the post was published (if src_type is post).
- `spectrum`: Political spectrum (LEFT, CENTRE, RIGHT).
- `WHO`: Name of the entity.
- `event_type_tag`: Type of event.
- `location`: Location of the event.
- `source_link`: URL of the source.

**Dynamic Form Structure**
The `ReportingForm` dynamically adapts based on the `Source Type` and includes fields to capture detailed reporting information:
- **Source Type** (dropdown): Determines the fields displayed in the form.
  - Options: Social Media Post, Article
- **Headline** (text input): Headline of the news event.
- **Post Content** (text area): Visible only when `Source Type` is 'Social Media Post'.
- **Region** (multi-select): Allows selection of multiple regions.
- **Spectrum** (dropdown): Political spectrum categorization.
  - Options: Left, Centre, Right
- **Author** (text input): Author of the report.
- **URL** (URL input): Source link for the report.
- **WHO** (multi-select): Allows selection of related entities.
- **Date Published** (date input): Date when the report was published.
- **Event Type Tag** (dropdown): Categorizes the type of event.

**Google Sheets API**: `addRowToReportingTable`
- `addRowToReportingTable`: Handles adding rows to the `REPORTING` sheet.

## Key Features Implementation
1. **PWA Functionality**
   - `serviceWorkerRegistration.js`: Handles offline capabilities
   - `manifest.json`: PWA configuration

2. **Dynamic Forms**
   - Form components adapt based on content type
   - Utilize NotionMultiSelect for complex data entry

3. **Data Organization**
   - Entity-based architecture
   - Political spectrum categorization
   - Timeline visualization support

4. **Content Categories**
   - Theory: Political and social frameworks
   - Reporting: News events with timeline
   - Entities: Political actors/organizations

This structure creates a comprehensive system for:
- Political content aggregation
- Event timeline tracking
- Entity relationship mapping

The application effectively combines React frontend components with Google Sheets as a backend database, creating a lightweight but powerful content management system.


## Project Structure Analysis

### Core Components

#### 1. API Layer (`/src/api`)
- `googleSheetsApi.js`: Handles all Google Sheets interactions
  - Manages 3 primary tables: ENTITIES, THEORY, REPORTING
  - Provides CRUD operations through methods like `getTableData` and `addRowToTable`

#### 2. Components (`/src/components`)
- **Article Components**
  - `ArticleCard.js`: Displays article previews
  - `ArticleReader.js`: Handles article viewing with Readability API integration
  - `CardView.js`: Entity card display component ("pokedex" style)

- **UI Components**
  - `FloatingButton.js`: Dynamic "Add" button for content creation
  - `Header.js`: Navigation and app header
  - `NotionMultiSelect.js`: Multi-select input component
  - `SearchBar.js`: Search functionality

#### 3. Forms (`/src/components/forms`)
```javascript
forms/
  ├── EntitiesForm.js    // Manages entity profiles
  ├── TheoryForm.js       // Theory content entry
  └── ReportingForm.js   // News events entry
```

#### 4. Pages (`/src/pages`)
```javascript
pages/
  ├── TheoryPage.js        // Theory table view
  ├── CardsPage.js      // Entity profiles in card format
  └── ReportingPage.js  // News events timeline
```

### Data Flow
1. User interactions on pages trigger form components
2. Forms collect and validate data
3. API layer communicates with Google Sheets
4. Data updates reflect in real-time across components

## Google Sheets Integration

### Service Account Setup
1. Place service account credentials:
```bash
# Create credentials file
copy your-downloaded-credentials.json src/service-account.json
```

2. Configure environment variables:
```env
REACT_APP_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
REACT_APP_GOOGLE_API_KEY=your_api_key
```

### Google Sheets Setup
1. Create three sheets named:
   - ENTITIES
   - THEORY
   - REPORTING
2. Share sheets with service account email
3. Configure sheet permissions

## API Implementation
Example API call:
```javascript
import { getTableData } from '../api/googleSheetsApi';

// Fetch data
const data = await getTableData();
```

## API Reference

### Google Sheets API Methods
- `getTableData()`: Fetches data from specified sheet
- `addRowToTable(values)`: Adds new row to specified sheet
- `getSheetHeaders()`: Retrieves column headers