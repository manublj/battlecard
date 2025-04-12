# forms.md

Defines how data is entered, validated, and routed to frontend.

Each form corresponds to a core sheet and enforces schema-level recursion, conditional UI logic, and validation rules as outlined in the dialectical ontology.

---
## Global Form Behaviors

### 🛠️ Auto-Generated Fields
Some fields across forms are auto-generated or prefilled by internal logic and **do not require user input** via the frontend:
- `*_id` fields like `event_id`, `struggle_id`, `entity_id`, etc. — auto-generated as slugs or UUIDs.
- `item_category` — always fixed for Events (`event`), should be prefilled.
- `timeline_id`, `phase_id`, `timeline_grid_id` — can be derived from labels or dates.
- `current_phase` — should be toggled via UI, not input manually.
- `date_range` — can be computed from earliest and latest `linked_events` in some forms.

These should be handled programmatically within `googleSheetsApi.js` or form submission logic.

> 💡 Auto-generated fields may still appear in schemas and data rows, but are **not editable by end-users**.

---

### 🔄 Linked Field Behavior
- All linked fields use `_id` references and should support autocomplete.
- Validation must ensure linked entries exist in their respective sheets.
- Linked fields can support single or multiple selections (array of IDs), depending on schema.

---

### 🧠 UI Logic & Recursion Awareness
- Forms are schema-aware: fields can be conditionally shown/hidden.
- Dropdowns validate against hardcoded vocab lists (see `validation.js`).
- Some fields dynamically appear based on other field values (e.g., `contradiction_type = Ideological` triggers `theory_ids`).
- All recursion constraints should be enforced at validation time (e.g., no contradiction without a structure).

---

The following sections define each form in full, based on the above global rules.

## Contradictions Form

> 💡 `contradiction_id` is auto-generated — users do not need to input this field manually.

### Purpose
Captures deep structural tensions that drive historical motion. This form is foundational — every contradiction must be rooted in a structure and ripple outward to struggles, issues, events, and theory.

### Field Visibility

| Field                          | Visibility     | Input Type             |
|--------------------------------|----------------|-------------------------|
| `contradiction_id`            | ❌ Auto-generated | system slug           |
| `contradiction_name`          | ✅ Visible       | Text input              |
| `contradiction_type`          | ✅ Visible       | Dropdown                |
| `root_structure`              | ✅ Visible       | Linked dropdown         |
| `contradiction_description`   | ✅ Visible       | Long text               |
| `status`                      | ✅ Visible       | Dropdown                |
| `subtype`                     | ✅ Visible       | Dropdown (optional)     |
| `rupture_date`                | ✅ Visible       | Date picker (optional)  |
| `first_major_flashpoint_event_id` | ✅ Visible  | Linked dropdown         |
| `struggle_ids`                | ✅ Visible       | Linked multi-select     |
| `linked_issues`               | ✅ Visible       | Linked multi-select     |
| `contradiction_intensity`     | ✅ Visible       | Dropdown (optional)     |
| `contradiction_priority`      | ✅ Visible       | Dropdown (optional)     |
| `historical_motion`           | ✅ Visible       | Long text (optional)    |
| `theory_ids`                  | ✅ Visible       | Linked multi-select     |

### Required Fields
- [x] `contradiction_id` — Unique ID for internal linking
- [x] `contradiction_name` — Short name (e.g., “Merit vs Representation”)
- [x] `contradiction_type` — Choose from dropdown: Ideological / Material / Political
- [x] `root_structure` — Must link to a valid entry in the Structures sheet
- [x] `contradiction_description` — Core explanation of the contradiction
- [x] `status` — Active / Resolved / Dormant

### Optional Enhancers
- [ ] `subtype`
- [ ] `rupture_date`
- [ ] `first_major_flashpoint_event_id`
- [ ] `struggle_ids`
- [ ] `linked_issues`
- [ ] `contradiction_intensity`
- [ ] `contradiction_priority`
- [ ] `historical_motion`
- [ ] `theory_ids`

### Recursion Constraints
- Cannot be submitted without a linked `root_structure`
- If `status = Resolved`, at least one `struggle_id` or `event_id` must be linked
- If `contradiction_intensity = High`, `historical_motion` is recommended
- If `contradiction_type = Ideological`, `theory_ids` is encouraged

### UI Logic
- Show `theory_ids` and `contradiction_priority` when type is Ideological
- Show `rupture_date`, `contradiction_intensity` for Material type
- Auto-suggest `first_major_flashpoint_event_id` based on recent Events
- Tag input for all linked fields

---

## Struggles Form

> 💡 `struggle_id` is auto-generated — users do not need to input this field manually.

### Purpose
Captures organized historical efforts to resolve or escalate contradictions — protests, movements, campaigns, or legal battles that actively engage structural tension.

### Field Visibility

| Field              | Visibility     | Input Type         	  |
|--------------------|----------------|---------------------------|
| `struggle_id`      | ❌ Auto-generated | system slug            |
| `struggle_name`    | ✅ Visible       | Text input              |
| `root_contradiction` | ✅ Visible     | Linked dropdown         |
| `struggle_description` | ✅ Visible   | Long text               |
| `form`             | ✅ Visible       | Dropdown                |
| `scale`            | ✅ Visible       | Dropdown                |
| `sector`           | ✅ Visible       | Dropdown                |
| `period`           | ✅ Visible       | Date range picker       |
| `current_status`   | ✅ Visible       | Dropdown                |
| `event_ids`        | ✅ Visible       | Linked multi-select     |
| `linked_issues`    | ✅ Visible       | Linked multi-select     |
| `entity_ids`       | ✅ Visible       | Linked multi-select     |
| `historical_development` | ✅ Visible | Long text (optional)    |
| `outcome`          | ✅ Visible       | Long text (optional)    |

### Required Fields
- [x] `struggle_id`
- [x] `struggle_name`
- [x] `root_contradiction`
- [x] `struggle_description`
- [x] `form`
- [x] `scale`
- [x] `sector`
- [x] `period`
- [x] `current_status`

### Optional Enhancers
- [ ] `event_ids`
- [ ] `linked_issues`
- [ ] `entity_ids`
- [ ] `historical_development`
- [ ] `outcome`

### Recursion Constraints
- Must link to `root_contradiction`
- If `current_status = Resolved`, require either `outcome` or one `event_id`
- If `scale = Statewide+`, at least one `entity_id` recommended
- Prompt for `linked_issues` if empty

### UI Logic
- Tag input for `entity_ids`, `event_ids`, `linked_issues`
- Timeline logic for `period` based on event range
- Contextual field behavior for form = Litigation

---

## Events Form

> 💡 `event_id`, `timeline_id`, and `item_category` are auto-generated or prefilled — users do not need to input these fields manually.

### Purpose
Captures rupture moments — when contradictions surface through action or crisis. Entry point into recursion.

### Field Visibility

| Field              | Visibility     | Input Type             |
|--------------------|----------------|-------------------------|
| `event_id`         | ❌ Auto-generated | system slug           |
| `event_title`      | ✅ Visible       | Text input              |
| `date`             | ✅ Visible       | Date picker             |
| `description`      | ✅ Visible       | Long text               |
| `contradiction_id` | ✅ Visible       | Linked dropdown         |
| `multi_headline_view` | ✅ Visible    | Long text (optional)    |
| `reporting_date`   | ✅ Visible       | Date picker (optional)  |
| `location`         | ✅ Visible       | Text input (optional)   |
| `platform`         | ✅ Visible       | Text input (optional)   |
| `src_type`         | ✅ Visible       | Dropdown (optional)     |
| `source_link`      | ✅ Visible       | URL input (optional)    |
| `event_type_tag`   | ✅ Visible       | Tag selector (optional) |
| `item_category`    | ❌ Static value  | "event"                 |
| `issue_ids`        | ✅ Visible       | Linked multi-select     |
| `entity_ids`       | ✅ Visible       | Linked multi-select     |
| `struggle_id`      | ✅ Visible       | Linked dropdown         |
| `event_motion`     | ✅ Visible       | Dropdown (optional)     |
| `event_relevance`  | ✅ Visible       | Dropdown (optional)     |
| `macro_micro`      | ✅ Visible       | Dropdown (optional)     |
| `historical_flag`  | ✅ Visible       | Checkbox (optional)     |
| `timeline_id`      | ❌ Auto-suggested | based on date          |

### Required Fields
- [x] `event_id`
- [x] `event_title`
- [x] `date`
- [x] `description`
- [x] `contradiction_id` (or `struggle_id`)

### Optional Enhancers
- [ ] `multi_headline_view`
- [ ] `reporting_date`
- [ ] `location`
- [ ] `platform`
- [ ] `src_type`
- [ ] `source_link`
- [ ] `event_type_tag`
- [ ] `item_category`
- [ ] `issue_ids`
- [ ] `entity_ids`
- [ ] `struggle_id`
- [ ] `event_motion`
- [ ] `event_relevance`
- [ ] `macro_micro`
- [ ] `historical_flag`
- [ ] `timeline_id`

### Recursion Constraints
- Must have either `contradiction_id` or `struggle_id`
- `event_motion = Transformed` → prompt `issue_ids` or `entity_ids`
- `historical_flag = true` → require `src_type` + `source_link`
- Macro events recommended to link to timeline

### UI Logic
- `src_type` tooltip hints
- Markdown in `multi_headline_view`
- Auto-suggest `timeline_id` from date
- Tag input for all linkables

---

## Issues Form

> 💡 `issue_id` is auto-generated — users do not need to input this field manually.

### Purpose
Public framing space where contradictions get named and debated. Site of ideological stances.

### Field Visibility

| Field                  | Visibility     | Input Type             |
|------------------------|----------------|-------------------------|
| `issue_id`             | ❌ Auto-generated | system slug           |
| `issue_title`          | ✅ Visible       | Text input              |
| `issue_event_id`       | ✅ Visible       | Linked dropdown         |
| `contradiction_ids`    | ✅ Visible       | Linked multi-select     |
| `description`          | ✅ Visible       | Long text               |
| `issue_timeline`       | ✅ Visible       | Date range picker       |
| `issue_status`         | ✅ Visible       | Dropdown                |
| `stance_1_headlines`   | ✅ Visible       | Long text               |
| `stance_2_headlines`   | ✅ Visible       | Long text               |
| `stance_3_headlines`   | ✅ Visible       | Long text (optional)    |
| `stance_1_description` | ✅ Visible       | Long text               |
| `stance_2_description` | ✅ Visible       | Long text               |
| `stance_3_description` | ✅ Visible       | Long text (optional)    |
| `stance_1_events`      | ✅ Visible       | Linked multi-select     |
| `stance_2_events`      | ✅ Visible       | Linked multi-select     |
| `stance_3_events`      | ✅ Visible       | Linked multi-select     |

### Required Fields
- [x] `issue_id`
- [x] `issue_title`
- [x] `issue_event_id`
- [x] `contradiction_ids`
- [x] `description`

### Optional Enhancers
- [ ] `issue_timeline`
- [ ] `issue_status`
- [ ] `stance_1/2/3_headlines`
- [ ] `stance_1/2/3_description`
- [ ] `stance_1/2/3_events`

### Recursion Constraints
- Must link both `issue_event_id` and one `contradiction_id`
- `stance_description` requires `stance_headlines`
- `stance_1_events` > 2 → prompt `entity_ids`
- `issue_status = Resolving` → prompt for linked struggles

### UI Logic
- Collapsible stance blocks
- Markdown support for all text fields
- Optional stance 3 toggle

---

## Entities Form

> 💡 `entity_id` is auto-generated — users do not need to input this field manually.s

### Purpose
Actors in history: movements, parties, collectives, individuals. They move contradictions.

### Field Visibility

| Field               | Visibility     | Input Type             |
|---------------------|----------------|-------------------------|
| `entity_id`         | ❌ Auto-generated | system slug           |
| `entity_name`       | ✅ Visible       | Text input              |
| `entity_type`       | ✅ Visible       | Dropdown                |
| `bio`               | ✅ Visible       | Long text               |
| `ideological_category` | ✅ Visible   | Dropdown                |
| `political_role`    | ✅ Visible       | Long text (optional)    |
| `SPECTRUM`          | ✅ Visible       | Tag selector            |
| `entity_stance_role`| ✅ Visible       | Dropdown                |
| `struggle_ids`      | ✅ Visible       | Linked multi-select     |
| `linked_events`     | ✅ Visible       | Linked multi-select     |
| `linked_issues`     | ✅ Visible       | Linked multi-select     |
| `relationship_ids`  | ✅ Visible       | Linked multi-select     |
| `stances_history`   | ✅ Visible       | Long text (optional)    |
| `active_period`     | ✅ Visible       | Date range picker       |

### Required Fields
- [x] `entity_id`
- [x] `entity_name`
- [x] `entity_type`
- [x] `bio`
- [x] `ideological_category`

### Optional Enhancers
- [ ] `political_role`
- [ ] `SPECTRUM`
- [ ] `entity_stance_role`
- [ ] `struggle_ids`
- [ ] `linked_events`
- [ ] `linked_issues`
- [ ] `relationship_ids`
- [ ] `stances_history`
- [ ] `active_period`

### Recursion Constraints
- Must link to at least one: `linked_event`, `linked_issue`, or `struggle_id`
- `entity_stance_role = Agitator` or `Defender` → prompt for `issue_ids`
- `entity_type = Movement` → should link to `struggle_ids`

### UI Logic
- Multi-tag input for SPECTRUM, issues, events
- Markdown in `stances_history`
- If Ambedkarite, auto-suggest caste-linked contradictions

---

## Theory Object Form

> 💡 `theory_object_id` is auto-generated — users do not need to input this field manually.

### Purpose
Defines systems of ideology, identity, and thought — durable logic structures.

### Field Visibility

| Field                   | Visibility     | Input Type             |
|-------------------------|----------------|-------------------------|
| `theory_object_id`      | ❌ Auto-generated | system slug           |
| `title`                 | ✅ Visible       | Text input              |
| `abstract`              | ✅ Visible       | Long text               |
| `proposition`           | ✅ Visible       | Long text               |
| `theory_object_type`    | ✅ Visible       | Dropdown                |
| `theory_entry_type`     | ✅ Visible       | Dropdown (optional)     |
| `category_origin`       | ✅ Visible       | Dropdown                |
| `ism_origin_type`       | ✅ Visible       | Dropdown (optional)     |
| `ism_function`          | ✅ Visible       | Dropdown (optional)     |
| `ideological_motion_status` | ✅ Visible  | Dropdown (optional)     |
| `primary_domain`        | ✅ Visible       | Dropdown (optional)     |
| `tags`                  | ✅ Visible       | Tag selector            |
| `keywords`              | ✅ Visible       | Tag selector            |
| `contradiction_ids`     | ✅ Visible       | Linked multi-select     |
| `event_ids`             | ✅ Visible       | Linked multi-select     |
| `validation_status`     | ✅ Visible       | Dropdown (optional)     |
| `political_spectrum`    | ✅ Visible       | Dropdown (optional)     |
| `author`                | ✅ Visible       | Text input (optional)   |
| `publication_date`      | ✅ Visible       | Date picker (optional)  |
| `key_excerpts`          | ✅ Visible       | Long text (optional)    |
| `example_terms`         | ✅ Visible       | Tag selector (optional) |

### Required Fields
- [x] `theory_object_id`
- [x] `title`
- [x] `abstract`
- [x] `proposition`
- [x] `theory_object_type`
- [x] `category_origin`

### Optional Enhancers
- [ ] `theory_entry_type` — Dropdown: ism / identity / descriptor / category / concept
- [ ] `ism_origin_type`
- [ ] `ism_function`
- [ ] `ideological_motion_status`
- [ ] `primary_domain`
- [ ] `tags`
- [ ] `keywords`
- [ ] `contradiction_ids`
- [ ] `event_ids`
- [ ] `validation_status`
- [ ] `political_spectrum`
- [ ] `author`
- [ ] `publication_date`
- [ ] `key_excerpts`
- [ ] `example_terms`

### Recursion Constraints
- Must have at least one of: `contradiction_ids`, `event_ids`, or `keywords`
- If `validation_status = Validated`, suggest `event_ids`
- If `type = identity_frame`, require `category_origin`

### UI Logic
- Tag input for keywords, terms, tags
- Markdown for proposition and excerpts

---

## Theory Instance Form

> 💡 `theory_instance_id` is auto-generated — users do not need to input this field manually.

### Purpose
Real-world expressions of ideology — tweets, posts, speeches, videos.

### Field Visibility

| Field                    | Visibility     | Input Type             |
|--------------------------|----------------|-------------------------|
| `theory_instance_id`     | ❌ Auto-generated | system slug           |
| `title`                  | ✅ Visible       | Text input              |
| `origin_type`            | ✅ Visible       | Dropdown                |
| `author`                 | ✅ Visible       | Text input              |
| `content_object_type`    | ✅ Visible       | Dropdown                |
| `message_text`           | ✅ Visible       | Long text               |
| `origin_entity_id`       | ✅ Visible       | Linked dropdown (optional) |
| `publication_date`       | ✅ Visible       | Date picker (optional)  |
| `platform`               | ✅ Visible       | Text input (optional)   |
| `src_type`               | ✅ Visible       | Dropdown (optional)     |
| `url`                    | ✅ Visible       | URL input (optional)    |
| `linked_theory_object_ids` | ✅ Visible    | Linked multi-select     |
| `linked_contradiction_ids` | ✅ Visible   | Linked multi-select     |
| `linked_event_ids`       | ✅ Visible       | Linked multi-select     |
| `linked_stance_ids`      | ✅ Visible       | Linked multi-select     |
| `tags`                   | ✅ Visible       | Tag selector (optional) |

### Required Fields
- [x] `theory_instance_id`
- [x] `title`
- [x] `origin_type`
- [x] `author`
- [x] `content_object_type`
- [x] `message_text`

### Optional Enhancers
- [ ] `origin_entity_id`
- [ ] `publication_date`
- [ ] `platform`
- [ ] `src_type`
- [ ] `url`
- [ ] `linked_theory_object_ids`
- [ ] `linked_contradiction_ids`
- [ ] `linked_event_ids`
- [ ] `linked_stance_ids`
- [ ] `tags`

### Recursion Constraints
- `origin_type = entity_produced` → must have `origin_entity_id`
- `linked_contradiction_ids` → prompt for `linked_theory_object_ids`
- `linked_event_ids` → suggest `src_type`, `platform`

### UI Logic
- Tag input for all links
- Character count for tweets
- Collapse URL unless needed

---

## Structures Form

> 💡 `structure_id` is auto-generated — users do not need to input this field manually.

### Purpose
Enduring formations that produce contradiction: caste, state, kinship, market.

### Field Visibility

| Field                   | Visibility     | Input Type             |
|-------------------------|----------------|-------------------------|
| `structure_id`          | ❌ Auto-generated | system slug           |
| `structure_name`        | ✅ Visible       | Text input              |
| `structure_type`        | ✅ Visible       | Dropdown                |
| `description`           | ✅ Visible       | Long text               |
| `subtype`               | ✅ Visible       | Text input (optional)   |
| `historical_range`      | ✅ Visible       | Date range picker       |
| `embedded_contradictions` | ✅ Visible    | Linked multi-select     |
| `linked_struggles`      | ✅ Visible       | Linked multi-select     |
| `linked_entities`       | ✅ Visible       | Linked multi-select     |
| `structure_evolution`   | ✅ Visible       | Long text (optional)    |
| `confidence`            | ✅ Visible       | Dropdown (optional)     |

### Required Fields
- [x] `structure_id`
- [x] `structure_name`
- [x] `structure_type`
- [x] `description`

### Optional Enhancers
- [ ] `subtype`
- [ ] `historical_range`
- [ ] `embedded_contradictions`
- [ ] `linked_struggles`
- [ ] `linked_entities`
- [ ] `structure_evolution`
- [ ] `confidence`

### Recursion Constraints
- Contradictions must link to existing structures
- `structure_type = State` → prompt contradiction links
- 2+ linked struggles → suggest `structure_evolution`

### UI Logic
- Tag input for all links
- Tooltip on `confidence`
- Conditional fields based on structure_type

---

## Relationships Form

> 💡 `relationship_id` is auto-generated — users do not need to input this field manually.

### Purpose
Links between actors: alliances, co-optations, rivalries. Captures motion of actors in relation.

### Field Visibility

| Field                    | Visibility     | Input Type             |
|--------------------------|----------------|-------------------------|
| `relationship_id`        | ❌ Auto-generated | system slug           |
| `entity_1`               | ✅ Visible       | Linked dropdown         |
| `entity_2`               | ✅ Visible       | Linked dropdown         |
| `relationship_type`      | ✅ Visible       | Dropdown                |
| `relationship_timeline`  | ✅ Visible       | Date range picker       |
| `struggle_id`            | ✅ Visible       | Linked dropdown         |
| `linked_events`          | ✅ Visible       | Linked multi-select     |
| `contradiction_implication` | ✅ Visible   | Long text (optional)    |
| `historical_context`     | ✅ Visible       | Long text (optional)    |

### Required Fields
- [x] `relationship_id`
- [x] `entity_1`
- [x] `entity_2`
- [x] `relationship_type`
- [x] `relationship_timeline`

### Optional Enhancers
- [ ] `struggle_id`
- [ ] `linked_events`
- [ ] `contradiction_implication`
- [ ] `historical_context`

### Recursion Constraints
- Must link to either `struggle_id` or at least one `linked_event`
- Co-optation or Merger → contradiction implication required
- Different ideology actors → prompt contradiction check

### UI Logic
- Timeline auto-fill from events
- Collapse `contradiction_implication` unless needed

---

## Timeline Registry Form

> 💡 `phase_id` is auto-generated based on the phase label — users do not need to input this field manually.

### Purpose
Defines historical phases based on contradiction arcs.

### Field Visibility

| Field                   | Visibility     | Input Type             |
|-------------------------|----------------|-------------------------|
| `phase_id`              | ❌ Auto-generated | system slug           |
| `phase_label`           | ✅ Visible       | Text input              |
| `description`           | ✅ Visible       | Long text               |
| `anchor_contradiction`  | ✅ Visible       | Linked dropdown         |
| `date_range`            | ✅ Visible       | Date range picker       |
| `linked_struggle`       | ✅ Visible       | Linked dropdown         |
| `linked_events`         | ✅ Visible       | Linked multi-select     |
| `linked_entities`       | ✅ Visible       | Linked multi-select     |
| `current_phase`         | ✅ Visible       | Toggle (boolean)        |

### Required Fields
- [x] `phase_id`
- [x] `phase_label`
- [x] `description`
- [x] `anchor_contradiction`
- [x] `date_range`

### Optional Enhancers
- [ ] `linked_struggle`
- [ ] `linked_events`
- [ ] `linked_entities`
- [ ] `current_phase`

### Recursion Constraints
- Must link to `anchor_contradiction`
- `linked_struggle` → should appear in linked events
- Only one `current_phase = true` allowed

### UI Logic
- Autocomplete timeline from event dates
- Exclusive toggle for `current_phase`

---

## Timeline Grid Form

> 💡 `timeline_grid_id` is auto-generated — users do not need to input this field manually.

### Purpose
Zoomable UI layer. Places elements into phases and zoom levels.

### Field Visibility

| Field                   | Visibility     | Input Type             |
|-------------------------|----------------|-------------------------|
| `timeline_grid_id`      | ❌ Auto-generated | system slug           |
| `linked_phase_id`       | ✅ Visible       | Linked dropdown         |
| `zoom_level`            | ✅ Visible       | Dropdown                |
| `linked_item_id`        | ✅ Visible       | Linked dropdown         |
| `label`                 | ✅ Visible       | Text input              |
| `notes`                 | ✅ Visible       | Long text (optional)    |
| `weight`                | ✅ Visible       | Integer input (optional)|
| `color_tag`             | ✅ Visible       | Tag selector (optional) |

### Required Fields
- [x] `timeline_grid_id`
- [x] `linked_phase_id`
- [x] `zoom_level`
- [x] `linked_item_id`
- [x] `label`

### Optional Enhancers
- [ ] `notes`
- [ ] `weight`
- [ ] `color_tag`

### Recursion Constraints
- `linked_item_id` must match `zoom_level`
- Must fall inside `linked_phase_id` date range
- Flag multiple `Contradiction` entries per phase

### UI Logic
- Grid preview
- Tag selector for color
- Sortable via weight