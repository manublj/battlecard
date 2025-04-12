# Battlecard v1

## Table of Contents
- [Overview](#overview)
  - [Core Purpose](#core-purpose)
  - [Key Components](#key-components)
  - [Technical Architecture](#technical-architecture)
- [Project Structure Analysis](#project-structure-analysis)
  - [Core Components](#core-components)
  - [Data Flow](#data-flow)
- [File Hierarchy](#file-hierarchy)
- [Development Environment](#development-environment)
  - [Prerequisites](#prerequisites)
  - [VS Code Extensions](#vs-code-extensions)
  - [Environment Setup](#environment-setup)
- [Setup](#setup)
- [Installation Instructions](#installation-instructions)
- [Usage Instructions](#usage-instructions)
- [Google Sheets Integration](#google-sheets-integration)
  - [Google Sheets Setup](#google-sheets-setup)
- [API Implementation](#api-implementation)
- [API Reference](#api-reference)
- [Features](#features)
- [Key Features Implementation](#key-features-implementation)
  - [PWA Functionality](#pwa-functionality)
  - [Dynamic Forms](#dynamic-forms)
  - [Data Organization](#data-organization)
  - [Content Categories](#content-categories)
- [Table Structure and Alignment](#table-structure-and-alignment)
  - [ENTITIES Sheet](#entities-sheet)
  - [THEORY Sheet](#theory-sheet)
  - [REPORTING Sheet](#reporting-sheet)
- [Data Schema](#data-schema)
  - [Entity Schema](#entity-schema)
  - [Theory Schema](#theory-schema)
  - [Reporting Schema](#reporting-schema)
- [Code Formatting Guidelines](#code-formatting-guidelines)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
  - [E2E Tests](#e2e-tests)
- [Debugging](#debugging)
  - [Common Issues](#common-issues)
  - [Debugging Tools](#debugging-tools)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
  - [Development Workflow](#development-workflow)
  - [Code Review Process](#code-review-process)
- [Contributing](#contributing)
  - [Pull Request Process](#pull-request-process)
  - [Code Style Guide](#code-style-guide)
- [License](#license)

## Overview

Battlecard v1 is a Progressive Web Application (PWA) designed to document and analyze political entities, theories, and events using a structured data approach. It leverages React for the frontend and Google Sheets as a lightweight database backend.

### Core Purpose
- Document and categorize political entities (individuals, parties, movements)
- Track theoretical frameworks and political ideologies
- Record and analyze political events and developments
- Create relationships between entities, theories, and events

### Key Components

1. **TheoryPage (Theory Table)**
   - Acts as a "read later" section where users can collect and organize theoretical items related to political and social entities.
   - Allows users to delve into theoretical frameworks and texts at their convenience.

2. **Reporting Page (News Events Table)**
   - Enhanced with TIMELINE and SPECTRUM fields for visualizing historical contexts using time.graphics.
   - Provides a structured way to track and analyze news events and their implications over time.

3. **Cards Page (Entities Table)**
   - Offers three distinct views for specific entity types (e.g., people, political parties, movements).
   - Displays cards for each entity, functioning similarly to a "pokedex," allowing users to explore and learn about different entities in a visually engaging manner.

### Technical Architecture

#### Frontend Layer
- React 18.2.0
- React Bootstrap for UI components
- Progressive Web App capabilities
- Responsive design architecture

#### Data Layer
- Google Sheets as database
- Real-time data synchronization
- Sheet-based data organization:
  - ENTITIES sheet
  - THEORY sheet
  - REPORTING sheet

#### Key Features
- Floating action buttons for data entry
- Multi-select fields with Notion-style interface
- Conditional form fields based on content type
- Auto-generated IDs and timestamps
- Spectrum-based political categorization
- Source type differentiation (post, article, book, PDF)

#### Integration Points
- Google Sheets API for data storage
- Service worker for offline capabilities
- Environment-based configuration
- Cross-sheet data relationships

## Project Structure Analysis

### Core Components

#### 1. API Layer (`/src/api`)
- `googleSheetsApi.js`: Handles all Google Sheets interactions
  - Manages 3 primary tables: ENTITIES, THEORY, REPORTING
  - Provides CRUD operations through methods like `getTableData` and `addRowToTable`

#### 2. Components (`/src/components`)
- **Article Components**
  - `ArticleCard.js`: Displays article previews
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
  ├── CardsPage.js       // Entity profiles in card format
  └── ReportingPage.js   // News events timeline
```

### Data Flow
1. **User Interaction**: User interacts with the form components on the pages.
2. **Form Submission**: User fills out the form and submits it.
3. **Validation**: Form data is validated using the `validateFormData` function.
4. **Transformation**: Validated data is transformed to match the Google Sheets schema using the `transformFormDataForSheet` function.
5. **API Call**: Transformed data is sent to the Google Sheets API using the `addRowToSheet` function.
6. **Data Storage**: Data is stored in the appropriate Google Sheets table (ENTITIES, THEORY, or REPORTING).
7. **Real-time Update**: The application fetches the updated data and reflects changes in real-time.

## File Hierarchy
```
battlecard-v1/
├── .env
├── .gitignore
├── craco.config.js
├── oldreadme.md
├── package.json
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── service-worker.js
├── README.md
├── src/
│   ├── App.css
│   ├── App.js
│   ├── api/
│   │   └── googleSheetsApi.js
│   ├── components/
│   │   ├── article/
│   │   │   ├── ArticleCard.js
│   │   │   └── CardView.js
│   │   ├── forms/
│   │   │   ├── EntitiesForm.js
│   │   │   ├── TheoryForm.js
│   │   │   └── ReportingForm.js
│   │   ├── ui/
│   │   │   ├── FloatingButton.js
│   │   │   ├── NotionMultiSelect.css
│   │   │   └── NotionMultiSelect.js
│   │   ├── Header.js
│   │   └── SearchBar.js
│   ├── global.js
│   ├── index.css
│   ├── index.js
│   ├── pages/
│   │   ├── TheoryPage.js
│   │   ├── CardsPage.js
│   │   └── ReportingPage.js
│   ├── polyfills.js
│   ├── serviceWorkerRegistration.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── readability.js
│   │   ├── sheetValidation.js
│   │   ├── TextHighlighter.js
│   │   └── validation.js
└── webpack.config.js
```

## Development Environment

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Google Cloud Platform account
- Google Sheets API enabled

### VS Code Extensions
- ESLint
- Prettier
- GitLens
- React Developer Tools

### Environment Setup
1. Clone repository
2. Install dependencies:
```bash
npm install
```
3. Create `.env` file:
```
REACT_APP_GOOGLE_SHEETS_ID=your_sheet_id
REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account
REACT_APP_GOOGLE_PRIVATE_KEY=your_private_key
```

## Setup

### Initial Configuration
1. Clone the repository:
```bash
git clone https://github.com/yourusername/battlecard-v1.git
cd battlecard-v1
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables in a `.env` file:
```
REACT_APP_GOOGLE_SHEETS_ID=your_sheet_id
REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account
REACT_APP_GOOGLE_PRIVATE_KEY=your_private_key
```

### Dependencies
- React
- React Bootstrap
- Google Sheets API
- NotionMultiSelect

### Environment Variables
- `REACT_APP_GOOGLE_SHEETS_ID`
- `REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `REACT_APP_GOOGLE_PRIVATE_KEY`

## Installation Instructions
1. Clone the repository:
```bash
git clone https://github.com/yourusername/battlecard-v1.git
cd battlecard-v1
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables in a `.env` file:
```
REACT_APP_GOOGLE_SHEETS_ID=your_sheet_id
REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account
REACT_APP_GOOGLE_PRIVATE_KEY=your_private_key
```

## Usage Instructions

### Running the Application
```bash
npm start
```

### Development Mode
```bash
npm start
```

### Production Build
```bash
npm run build
```

## Google Sheets Integration

### Google Sheets Setup
1. Enable Google Sheets API in your Google Cloud Platform account.
2. Create a service account and download the credentials JSON file.
3. Set up environment variables in a `.env` file:
```
REACT_APP_GOOGLE_SHEETS_ID=your_sheet_id
REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account
REACT_APP_GOOGLE_PRIVATE_KEY=your_private_key
```

### Authentication
- Use the service account credentials to authenticate with the Google Sheets API.

## API Implementation

### Data Models
- **Entity Model**: Represents political entities with fields like WHO, Bio, Entity Type, Ideology, Spectrum, Entity ID, Created At.
- **Theory Model**: Represents theoretical content with fields like URL, Title, Description, Source Type, Keywords, Author, Platform, Domain, WHO, Spectrum, Publication Date, Theory ID, Created At.
- **Reporting Model**: Represents news events with fields like Headline, Description, Event Date, Reporting Date, Source Type, Platform, Spectrum, WHO, Event Type Tag, Location, Source Link.

### API Endpoints
- **Add Entity**: Adds a new entity to the ENTITIES sheet.
- **Add Theory**: Adds a new theory to the THEORY sheet.
- **Add Report**: Adds a new report to the REPORTING sheet.

### Error Handling
- Implement error handling for API requests and responses.

## Features

### Entity Management
- Create and track political entities
- Auto-generated unique IDs
- Multi-select ideology fields
- Spectrum-based categorization

### Theory Documentation
- Multiple source types support
- Conditional field rendering
- Relationship mapping with entities
- Automated metadata generation

### Reporting Management
- Track and analyze news events
- Timeline and spectrum visualization
- Detailed event descriptions and metadata

## Key Features Implementation

### PWA Functionality
- `serviceWorkerRegistration.js`: Handles offline capabilities
- `manifest.json`: PWA configuration

### Dynamic Forms
- Form components adapt based on content type
- Utilize NotionMultiSelect for complex data entry

### Data Organization
- Entity-based architecture
- Political spectrum categorization
- Timeline visualization support

### Content Categories
- Theory: Political and social frameworks
- Reporting: News events with timeline
- Entities: Political actors/organizations

## Table Structure and Alignment

### ENTITIES Sheet
- WHO (multi-select)
- Bio (text)
- Entity Type (select)
- Ideology (multi-select)
- Spectrum (select)
- Entity ID (auto-generated)
- Created At (auto-generated)

### THEORY Sheet
- URL (text)
- Title (text)
- Description (text)
- Source Type (select)
- Keywords (multi-select)
- Author (multi-select)
- Platform (conditional text)
- Domain (conditional multi-select)
- WHO (multi-select)
- Spectrum (text)
- Publication Date (date)
- Theory ID (auto-generated)
- Created At (auto-generated)

### REPORTING Sheet
- Headline (text)
- Description (text)
- Event Date (date)
- Reporting Date (date)
- Source Type (select)
- Platform (conditional text)
- Spectrum (select)
- WHO (multi-select)
- Event Type Tag (select)
- Location (text)
- Source Link (text)

### Data Relationships
- Cross-sheet relationships between entities, theories, and reports.

## Data Schema

### Entity Schema
- WHO (multi-select)
- Bio (text)
- Entity Type (select)
- Ideology (multi-select)
- Spectrum (select)
- Entity ID (auto-generated)
- Created At (auto-generated)

### Theory Schema
- URL (text)
- Title (text)
- Description (text)
- Source Type (select)
- Keywords (multi-select)
- Author (multi-select)
- Platform (conditional text)
- Domain (conditional multi-select)
- WHO (multi-select)
- Spectrum (text)
- Publication Date (date)
- Theory ID (auto-generated)
- Created At (auto-generated)

### Reporting Schema
- Headline (text)
- Description (text)
- Event Date (date)
- Reporting Date (date)
- Source Type (select)
- Platform (conditional text)
- Spectrum (select)
- WHO (multi-select)
- Event Type Tag (select)
- Location (text)
- Source Link (text)

## Code Formatting Guidelines
- Follow ESLint and Prettier configurations for code formatting.

## Testing

### Unit Tests
- Implement unit tests for individual components and functions.

### Integration Tests
- Implement integration tests for API interactions and data flow.

### E2E Tests
- Implement end-to-end tests for user interactions and overall application flow.

## Debugging

### Common Issues
- List common issues and their solutions.

### Debugging Tools
- Use React Developer Tools and browser dev tools for debugging.

## Troubleshooting
- Provide troubleshooting steps for common problems.

## Development

### Development Workflow
- Follow GitFlow for branching and merging.

### Code Review Process
- Conduct code reviews for all pull requests.

## Contributing

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Submit a pull request

### Code Style Guide
- Follow the project's code style guide.

## License
MIT License - See LICENSE file for details