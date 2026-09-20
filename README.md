# ED840 Final Paper Readiness Center

A standalone, faculty-created support site for the final ED840 assignment period. The center helps students use the waiting period productively while faculty/committee feedback is pending by focusing on final paper components, document mechanics, and submission readiness rather than rewriting doctoral content.

## Included tools

- “What can I work on while I wait?” guidance
- Abstract planning blueprint: Purpose → Methodology → Findings → Conclusions
- Abstract word counter with a visible warning about the current 300-word assignment maximum versus the 150–250 word range stated in the included paper template
- Abstract alignment and formatting self-check
- 5–7 keyword builder and search-quality self-check
- Optional acknowledgement decision and formatting check
- Table of Contents Rescue Center with automatic Word TOC and manual TOC pathways
- Final formatting scan for front matter, pagination/layout, references, and appendices
- Quick Word/document troubleshooting
- Live readiness dashboard
- Print / Save readiness summary
- Browser-only `localStorage` for checklist progress, keywords, planning notes, and choices
- Included copies of the Applied Research Project Paper Template and Chapter 1–5 Outline

## Important instructional design guardrail

This center is a self-check and planning tool. It does **not** write, rewrite, shorten, or generate a student’s abstract, keywords, acknowledgements, findings, conclusions, or other doctoral work. It also does not indicate faculty approval, committee approval, final program approval, or a grade.

## Privacy design

There is no backend database and no submission endpoint. Checklist selections, keywords, planning notes, acknowledgement choice, and TOC choice are stored only in the current browser using `localStorage`.

The abstract word counter intentionally does **not** save pasted abstract text.

Students should not enter participant names, identifiable data, confidential records, or protected research data into the site.

## Files

- `index.html` — page structure and student-facing guidance
- `styles.css` — Purdue Global–aligned visual design, responsive layout, and print styles
- `app.js` — interactive tools and browser storage
- `render.yaml` — Render static-site deployment configuration and iframe headers
- `assets/purdue-global-logo.png` — Purdue Global logo used consistently with the prior ED840 center
- `resources/Applied_Research_Project_Template_APA7_DA.docx` — current source copy used to build this package
- `resources/Outline_Chapters_1-5.docx` — current source copy used to build this package

## Suggested repository name

`ED840-Final-Paper-Readiness-Center`

## Deploy with GitHub + Render

1. Create a new GitHub repository named `ED840-Final-Paper-Readiness-Center` or similar.
2. Unzip this package.
3. Upload **all files and folders inside `ED840_Final_Paper_Readiness_Center` to the repository root**.
4. Commit the files.
5. In Render, choose **New → Blueprint**.
6. Connect the GitHub repository.
7. Render will detect `render.yaml` and create the static site.
8. When deployment shows **Live**, open the Render URL.
9. If you later update a file in GitHub and Render auto-deploy is enabled, committing the change will redeploy the site automatically.

## Embed in an LMS page

If the LMS permits iframe embedding, use your Render URL in an iframe:

```html
<iframe
  src="https://YOUR-RENDER-URL.onrender.com"
  title="ED840 Final Paper Readiness Center"
  width="100%"
  height="1200"
  style="border:0; min-height:85vh;"
  loading="lazy"
></iframe>
```

If embedding is restricted, add the Render URL as an external link and open it in a new tab.

## Updating course documents

The two files in `resources/` are snapshots of the versions used when this package was built. Replace them whenever newer official versions are released. Keep the same filenames if possible so the site links continue to work.

## Abstract word-count note

The unit directions provided when this package was built state that the abstract should be a single paragraph of no more than 300 words. The included Applied Research Project Paper Template states 150–250 words. The site intentionally displays this discrepancy rather than silently choosing one requirement. Update the wording in `index.html` and the counter logic in `app.js` after the program confirms the governing requirement.

## Supplemental-resource disclaimer

This faculty-developed resource is supplemental and does not replace Brightspace assignment directions, rubrics, the current Applied Research Project Paper Template, program requirements, or guidance from the instructor, RPC, committee, or program leadership.
