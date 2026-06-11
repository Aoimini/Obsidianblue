# Phase Notes

## Agreed Phase 1 Scope

- Mac app capture
- Chrome active URL capture
- SQLite persistence
- HTML dashboard
- Local rule-based classification
- No paid AI/API usage

## Privacy

- Do not store keystroke contents.
- Do not store idle duration.
- Store only whether input activity was observed during a sample and the sample timestamp.

## Later Phases

## Phase 2 Status

- Score items are aligned with life balance items: focus, learning, rest, exercise, and sleep.
- App usage is rendered as a horizontal percentage bar.
- Notion task sync is implemented as optional local code and requires `NOTION_TOKEN`.
- Exercise and sleep remain 0h until Health import is implemented.

### Notion

Use this database/page as the task source:

```text
94eab464284042d2b379362fb9d20af6
https://www.notion.so/94eab464284042d2b379362fb9d20af6?v=feaf0182c2cb42dfa5c2db4ba77288e6&source=copy_link
```

Task database properties:

- Date: `実行予定日時`
- Completion: `完了`
- Project relation: `プロジェクト管理_DB`

Use this database/page as the project source:

```text
7268830e0bc046508098fce302087e4d
https://www.notion.so/7268830e0bc046508098fce302087e4d?v=05dfa8c194294aa68dab5867ba1ad29e&source=copy_link
```

Project database data source:

```text
ba0c97f4-5757-4ad7-b297-76c2d1beb000
```

### iPhone Health

Prefer the least risky path first:

- Apple Health export XML import, or
- iOS Shortcuts CSV export/import

Avoid direct automatic sync until the permission and reliability tradeoffs are clear.

### AI

Keep AI classification and comments disabled for MVP Phase 1.
Add it only after explicit approval, because OpenAI API or similar services can incur usage-based costs.
