# Product spec

Source of truth for what The Budget Planner should do. Implementation follows the phases below. **Now** is the first build. **Next** depends on that foundation. **Later** waits until the core loop is trustworthy.

The first client is the Next.js web app in `apps/web`. The NestJS API in `apps/api` owns accounts, transactions, budgets, and goals. A native mobile client can share that API later.

## Principles

- The app works fully with manual accounts. Bank linking is optional.
- Money moved between the user's own accounts is a transfer. Spending is recorded once, on the purchase.
- Every dollar the user wants to budget can be given a job. Unassigned money stays visible as **Ready to assign**.
- Categories, budget methods, and envelopes compose. Choosing a starting method does not lock the user out of the others.
- The user can export everything and delete the account.

## Budget methods

Onboarding asks the user to start from one method. The same budget engine supports all of them.

| Method | What it does |
| --- | --- |
| 50/30/20 | A setup template. Seeds category groups for Needs (50%), Wants (30%), and Savings and debt (20%). The user can edit the splits. |
| Zero-based budgeting | Every dollar of expected income is assigned before the period starts. **Ready to assign** reaches zero when the plan is complete. |
| Envelope system | Each category holds an available balance. Spending draws from that balance. An empty envelope warns, and can be set to block further assignment from it until the user moves money in. |
| Custom | The user builds groups and caps with no template. |

Rollover is a per-category setting: carry unspent funds forward, carry a deficit forward, or reset to the target at the start of the next period.

## Phases

- **Now** — sign-in, manual money tracking, budgets, goals, and basic reports.
- **Next** — bank connections, receipts, currency rates, debt planning, forecasts, and alerts.
- **Later** — learned categorization, shared households, native mobile unlock, anomaly models, and a SOC 2 program.

---

## 1. User onboarding and account management

### Registration and auth — Now

- Email and password signup and sign-in.
- Google and Apple OAuth.
- Passkeys for passwordless sign-in on the web.
- Optional TOTP as a second factor.
- Session list with the ability to revoke a session or sign out everywhere.

### Device unlock — Later

Face ID and fingerprint unlock a device that is already signed in. They belong to a native mobile client. They do not create an account.

### Regional setup — Now, rates in Next

- On first run, suggest a currency and locale from the user's location. The user confirms both.
- Format dates, numbers, and money with that locale.
- Store a base reporting currency on the profile.
- **Next:** a foreign-currency transaction stores the original amount, the currency, and the exchange rate used to convert it into the base currency. Reports use the base currency. Editing the rate recalculates that transaction only.

### Onboarding wizard — Now

A short setup the user can skip and finish later:

1. Starting budget method (50/30/20, zero-based, envelopes, or custom).
2. Pay cycle: weekly, bi-weekly, semi-monthly, or monthly, plus the next pay date.
3. Optional first goal (name, target amount, target date).

The pay cycle defines the budget period. A weekly paycheck produces a weekly plan. A monthly paycheck produces a calendar-month plan.

---

## 2. Income and expense management

### Accounts and transactions — Now

Manual accounts from day one: checking, savings, cash, credit card, and other asset or liability.

Each transaction has a date, amount, account, payee, category, optional note, and status:

| Status | Meaning |
| --- | --- |
| Pending | Expected or authorized, excluded from budget actuals until it posts. Shown separately so it does not spend the envelope early. |
| Posted | Counted in actuals. |
| Reconciled | Checked against a statement balance. |

A transfer between two of the user's accounts, including a credit card payment, is one transfer with two legs. It is excluded from income, expenses, and category spend.

A refund can be linked to the original charge. The category total nets the two amounts.

### Categories — Now

- Starter set: Housing, Groceries, Utilities, Transportation, Healthcare, Dining, Entertainment, Subscriptions, Income, Savings, Debt, and Transfers.
- The user can rename, hide, add, and nest categories (category, then subcategory).
- A split divides one transaction across multiple categories. The split amounts must equal the transaction amount.

### Tags and reimbursements — Now

Tags sit beside categories. A grocery transaction can also be tagged `work` or `reimbursable`. Reimbursable transactions roll up to an outstanding-reimbursement total that drops when the user marks them repaid.

### Merchant names — Now

The user can set a display name for a payee (`Amazon`) while the original bank or import string (`AMZN MKTP US*123`) stays stored. Future matches with the same original string reuse the display name.

### Categorization rules — Now

Rules the user confirms, applied in priority order:

- Payee contains text.
- Amount is within a range.
- Account is one of a set.
- Result: category, optional tags, and whether to auto-apply or leave the item in review.

### Learned categorization — Later

After the user has confirmed rules and categories, suggest a category for new payees from that history. The suggestion stays in the review queue until the user accepts it or turns on auto-apply for that payee.

### Review queue — Now

Imports and, later, bank sync land in a queue when the category is missing or the rule says to ask. The user can categorize, split, mark as transfer, or ignore. Ignored items stay in the register and stay out of budgets and reports.

### Recurring items — Now

Schedules for paychecks, bills, and subscriptions:

- Frequency: weekly, bi-weekly, semi-monthly, monthly, quarterly, or yearly.
- Next date, amount, account, and category.
- The scheduler creates a pending transaction on the due date. The user confirms it to post, or edits the amount first.

### Subscriptions — Next

A single list of recurring outflows with the next renewal date, the last amount, and a flag when the posted amount differs from the scheduled amount.

### Receipt capture — Next

The user photographs or uploads a receipt. OCR proposes date, merchant, total, and line items. The user corrects the proposal before it becomes a transaction. Line items can seed a split. The image stays attached to the transaction.

Any transaction can also hold a note and file attachments without OCR.

---

## 3. Account aggregation and synchronization

### Bank feeds — Next

Optional open-banking connections (Plaid or Salt Edge, chosen at implementation time) for checking, savings, and credit cards.

- Pull balances and posted transactions.
- Match a synced transaction to an existing manual or pending one when account, amount, and date are close, so the user does not get a duplicate.
- Provider access tokens are encrypted at rest and never written to logs.

Disconnecting a feed stops future pulls and leaves the already imported history in place.

### Manual accounts — Now

Cash, custom assets, and custom liabilities with a balance the user edits. These accounts are enough to run the whole app with no bank connection.

### Debt and credit cards — Now for balances, Next for payoff planning

**Now**

- Credit card and loan accounts store balance, APR, minimum payment, and due day.
- Purchases on a card count in the budget when they are posted. The later card payment is a transfer.

**Next**

- Snowball (smallest balance first) and avalanche (highest APR first) plans.
- A what-if for an extra monthly payment: payoff date and interest saved.
- Credit utilization for each card, with a warning as utilization crosses a threshold the user sets (default 30%).

### Net worth — Now for the chart inputs, Next for the trend

Assets minus liabilities across linked and manual accounts, including property and other custom entries. The trend chart is part of reporting in **Next** once several months of balances exist. The current total is available in **Now**.

---

## 4. Budgeting

### Period and ready to assign — Now

- The open budget follows the pay cycle from onboarding. The user can also open a calendar month view.
- **Ready to assign** is income received in the period, plus leftover from last period when rollover is on, minus what has already been assigned to categories.
- Each category shows target, actual (posted spend or income), and remaining.
- The period summary shows the same three numbers rolled up, plus ready to assign.

### Allocations — Now

- A spending cap or income plan per category for the period.
- Move money between categories during the period. Envelope balances update immediately.
- An envelope can warn at a threshold (default 80% of the cap) and when remaining hits zero.

### Rollover — Now

Per category: carry surplus, carry deficit, or reset. The choice is visible on the category so a reset is deliberate.

### Sinking funds — Next

For a known future bill (insurance, registration, gifts), the user sets the due date and amount. The budget suggests a per-period set-aside so the envelope is full on the due date. A sinking fund is a budget category, separate from a savings goal.

---

## 5. Goals and savings

### Goals — Now

- Name, target amount, optional target date, and optional linked account or category.
- Examples the wizard offers: emergency fund, vacation, down payment. The user can type any name.
- Progress is saved amount divided by target. The saved amount comes from transactions assigned to the goal, or from a balance on the linked account, whichever the user picks.
- The plan shows a projected finish date from the recent saving pace when a target date is unset, and the monthly amount needed when a target date is set.

### Automated rules — Next

- Round-up: sweep the spare change on a posted purchase into a goal.
- Percent of income: move a fixed percent of each paycheck to a goal.
- Surplus sweep: on period close, offer to move unspent category funds into a goal.

### Milestones — Next

Markers at 25%, 50%, 75%, and 100%, shown on the goal. No separate badge system beyond these markers in the first version of this feature.

---

## 6. Analytics and insights

### Charts — Now

- Spending by category for the open period (donut).
- Income versus expenses by period (bars).
- Category list sorted by remaining balance, tightest first.

### Trends — Next

- Income versus expenses over a chosen range (line).
- Net worth by month.
- Spending by payee.
- This period versus the previous period for a category.

### Forecasting — Next

A cash-flow projection for the next 30 and 90 days from scheduled income, scheduled bills, and the average of unscheduled spend over the last three periods. The projection is labeled as an estimate.

### Alerts — Next

- Upcoming bill or subscription inside a window the user sets (default 3 days).
- Category spend crosses 80% of the cap, and again at 100%.
- Account balance falls under a per-account floor.
- A posted transaction is larger than a multiple of that payee's usual amount (default 2x), or matches amount, payee, and date of another posted transaction closely enough to look like a duplicate. The user dismisses or confirms from the notification.

### Anomaly models — Later

Broader pattern detection (rapid drain across several categories, new payee plus unusual amount) once the simpler alerts have been in use. Alerts stay explainable: the copy says which rule fired.

---

## 7. Notifications, privacy, and data ownership

### Notification controls — Next

Each alert type can be in-app, email, or both. Push is added with the mobile client. The user can switch a type to a daily digest instead of immediate delivery.

### Privacy mode — Now

A control hides balances and transaction amounts on the home screen until the user reveals them. It is a display setting. It does not change what the server stores.

### Security — Now for the baseline, Later for SOC 2

**Now**

- TLS for data in transit.
- Encryption at rest for the database and for stored files.
- Bank-provider tokens encrypted with a separate key from the database volume.
- Passwords hashed with a current adaptive algorithm.
- Revocable sessions.

Server-side categorization, forecasting, and bank sync read transaction data on the server. That is required for those features.

**Later**

- A SOC 2 program (policy, access review, vendor review, audit). It is an organizational milestone, not a switch in the product UI.

### Import — Now for CSV, Next for OFX and QFX

- **Now:** CSV import of transactions with a column mapper, plus a sample template.
- **Next:** OFX and QFX import for users who download files from a bank instead of linking it.

Imported rows go through the same review queue as manual entry.

### Export and deletion — Now

- Export transactions, accounts, budgets, and goals as CSV or JSON.
- Export a period report as PDF for the user's own records.
- Delete the account and the data attached to it after a confirmation step. Export remains available until deletion finishes.

---

## 8. Household sharing — Later

One shared budget with:

- Members invited by email, roles of owner and member.
- Transactions attributed to the person who entered or synced them.
- Shared categories and goals, with an optional private flag so a member can hide a transaction's note from the rest of the household.

This waits until a single-user budget is solid.

---

## Now / Next / Later at a glance

**Now:** email and password, Google and Apple OAuth, passkeys, optional TOTP, session revocation, locale and base currency, onboarding (method, pay cycle, first goal), manual accounts, transactions with pending / posted / reconciled, transfers, refund links, splits, categories, tags, reimbursements, payee display names, categorization rules, review queue, recurring schedules, credit card and loan balances, ready to assign, caps, envelope warnings, rollover, manual goals with progress, donut and income-versus-expense charts, current net worth, privacy mode, CSV import, CSV / JSON / PDF export, account deletion, TLS, encryption at rest, encrypted provider tokens.

**Next:** exchange rates on foreign transactions, subscription list with amount-change flags, receipt OCR and attachments, bank feeds with duplicate matching, snowball and avalanche simulator, utilization warnings, net-worth trend, spending by payee, period comparison, 30- and 90-day forecast, bill / budget / balance / unusual-amount alerts, notification channels and digest, OFX and QFX import, sinking funds, round-up / percent / surplus goal rules, goal milestones.

**Later:** learned categorization, household sharing, native biometric unlock, anomaly models, SOC 2 program.
