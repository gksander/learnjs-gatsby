// Shape of items
type Item = {
  title: string;
  items: { title: string; href: string }[];
};

// Items
const navItems: Item[] = [
  // Javascript basics
  {
    title: "Fundamentals",
    items: [
      { title: "Getting Started", href: "/getting-started" },
      { title: "What is programming?", href: "/what-is-programming" },
      { title: "What is JavaScript?", href: "/what-is-javascript" },
      { title: "Values and Expressions", href: "/values-and-expressions" },
      { title: "Variables", href: "/variables" },
      // { title: "Statements", href: "/statements" },
      // { title: "Data Types", href: "/data-types" },
    ],
  },

  // Data Types
  {
    title: "Data Types",
    items: [
      { title: "Numbers", href: "/numbers" },
      { title: "Strings", href: "/strings" },
      { title: "Booleans", href: "/booleans" },
      { title: "Arrays", href: "/arrays" },
      { title: "Functions", href: "/functions" },
      { title: "Objects", href: "/objects" },
    ],
  },

  // Control Flow
  {
    title: "Control Flow",
    items: [
      { title: "If-else Statements", href: "/if-else" },
      { title: "The Ternary Operator", href: "/ternary-operator" },
      { title: "Switch Statements", href: "/switch-statement" },
      { title: "While Loops", href: "/while-loops" },
      { title: "For Loops", href: "/for-loops" },
    ],
  },
];

export default navItems;
