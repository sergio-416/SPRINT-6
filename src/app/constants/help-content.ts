export const HELP_CONTENT = {
  PAGES: {
    title: 'Number of Pages',
    content:
      'Specify how many pages your website will have. Each page represents a distinct section or view in your website. More pages allow for more content organization but increase development time and cost. The base customization cost is calculated as: pages × languages × €30.',
  },
  LANGUAGES: {
    title: 'Number of Languages',
    content:
      'Add the languages your project will support. Each additional language requires translating all content and adapting the interface, which increases the project scope. Supporting multiple languages makes your website accessible to a broader audience. The customization cost per language is: pages × languages × €30.',
  },
} as const;
