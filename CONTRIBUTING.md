# ☕ Contributing to Tip Steward

We design and build Tip Steward with Starbucks partners in mind. Contributions should
protect that calm, polished experience from the very first code change.

## Partner-ready workflow
1. **Create an issue** describing the partner need or defect.
2. **Spin a feature branch** from the latest `main` (`feature/<short-summary>`).
3. **Design first:** share mockups or copy edits in the issue before writing code.
4. **Implement & document** the change following the coding standards below.
5. **Run quality checks**
   ```bash
   npm run lint
   npm run check
   npm run build
   ```
6. **Open a pull request** with:
   - Screenshots or screen recordings for UI updates (mobile + desktop breakpoints).
   - Notes about accessibility considerations and manual testing.
   - Netlify deploy preview link (auto-generated).
7. **Partner approval:** wait for design + reviewer sign-off before merging.

## Coding standards
- **TypeScript everywhere.** Avoid `any`; lean on `zod` schemas and shared types.
- **Imports:** follow the ESLint import order. Use `@/` for app modules and
`@shared/` for shared types.
- **Styling:** compose Tailwind classes; new variants belong in the design tokens or
Tailwind config rather than ad-hoc CSS.
- **Accessibility:** include `aria-label`, semantic HTML, and maintain WCAG AA
contrast ratios.
- **Copy:** keep tone calm, professional, and partner-focused. Avoid marketing jargon.
- **Testing:** note manual test scenarios in the PR description (mobile, tablet,
desktop, keyboard navigation).

## Commit etiquette
- Use present tense, partner-focused subjects: `chore: align partner cards with new palette`.
- Group related changes into a single commit where possible.
- Reference issues in commit messages (`Fixes #123`) when relevant.

## Deployment notes
- Production lives on Netlify. Ensure `netlify.toml` covers new routes, headers, or
functions you add.
- Sensitive environment variables belong in Netlify site settings; mirror them in
`env.example` when public placeholders are safe.

Thank you for keeping Tip Steward aligned with Starbucks’ brand language and partner
experience. 🌿
